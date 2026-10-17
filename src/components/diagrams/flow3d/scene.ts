import {
  BoxGeometry,
  BufferGeometry,
  CanvasTexture,
  Color,
  ConeGeometry,
  CurvePath,
  CylinderGeometry,
  DirectionalLight,
  EdgesGeometry,
  ExtrudeGeometry,
  Group,
  HemisphereLight,
  InstancedMesh,
  LineBasicMaterial,
  LineCurve3,
  LineLoop,
  LineSegments,
  MathUtils,
  Matrix4,
  Mesh,
  MeshBasicMaterial,
  MeshStandardMaterial,
  OctahedronGeometry,
  PerspectiveCamera,
  PlaneGeometry,
  QuadraticBezierCurve3,
  Quaternion,
  Raycaster,
  Scene,
  Shape,
  SphereGeometry,
  Spherical,
  TubeGeometry,
  Vector2,
  Vector3,
  WebGLRenderer,
  type Material,
  type Object3D,
} from "three";
import { OrbitControls } from "three/addons/controls/OrbitControls.js";
import { CSS2DObject, CSS2DRenderer } from "three/addons/renderers/CSS2DRenderer.js";
import type { DEdge, DNode, DText, DiagramFocus, DiagramLayout, NodeKind } from "@/data/diagrams";
import { edgeInFocus } from "@/data/diagrams";
import { readPalette, type FlowPalette } from "./palette";

// One diagram pixel is 1/60 of a scene unit, so a 720 px wide diagram is a 12 unit wide board.
const UNIT = 1 / 60;
const PIPE_Y = 0.2;
const PIPE_Y_DASHED = 0.13;
const PIPE_RADIUS = 0.026;
const CORNER = 0.22;
const NODE_HEIGHT: Record<NodeKind, number> = { plain: 0.36, flow: 0.52, store: 0.72, model: 0.86 };

const DEFAULT_AZIMUTH = -0.26;
const AZIMUTH_LIMIT = 0.72;
const FIT_MARGIN = 0.95;
const HEADROOM = 0.6; // room above the board, for the nodes and the diamond
const INTRO_TURN = 0.36; // how far the camera starts from its resting angle

const RIDGE_STRENGTH = 0.5; // how much of the outline colour a diamond's ridges get

const DIM_NODE = 0.2;
const DIM_EDGE = 0.16;

interface FlowSceneOptions {
  host: HTMLElement;
  layout: DiagramLayout;
  reducedMotion: boolean;
  playing: boolean;
  onNodeClick?: (id: string) => void;
  onContextLost?: () => void;
}

interface NodeItem {
  node: DNode;
  group: Group;
  body: Mesh;
  bodyMat: MeshStandardMaterial;
  lineMats: LineBasicMaterial[];
  /** The ridges of a diamond, drawn softer than its outline so they do not cut across the label. */
  ridgeMat?: LineBasicMaterial;
  base: Color;
  stroke: Color;
  label: CSS2DObject;
  dim: number;
  dimTarget: number;
  emphasis: number;
  emphasisTarget: number;
  pulse: number;
  hover: number;
  hoverTarget: number;
  index: number;
}

interface Packet {
  edge: EdgeItem;
  phase: number;
  lastPhase: number;
  dir: 1 | -1;
  slot: number;
}

interface EdgeItem {
  edge: DEdge;
  from?: NodeItem;
  to?: NodeItem;
  length: number;
  samples: Vector3[];
  pipeMat: MeshBasicMaterial;
  speed: number;
  dim: number;
  dimTarget: number;
  labels: CSS2DObject[];
}

const ease = (t: number) => 1 - Math.pow(1 - MathUtils.clamp(t, 0, 1), 3);

/** A rounded rectangle slab on the XZ plane, standing on y = 0. */
function slab(width: number, depth: number, height: number, radius: number): ExtrudeGeometry {
  const hw = width / 2;
  const hd = depth / 2;
  const r = Math.min(radius, hw, hd);
  const shape = new Shape();
  shape.moveTo(-hw + r, -hd);
  shape.lineTo(hw - r, -hd);
  shape.quadraticCurveTo(hw, -hd, hw, -hd + r);
  shape.lineTo(hw, hd - r);
  shape.quadraticCurveTo(hw, hd, hw - r, hd);
  shape.lineTo(-hw + r, hd);
  shape.quadraticCurveTo(-hw, hd, -hw, hd - r);
  shape.lineTo(-hw, -hd + r);
  shape.quadraticCurveTo(-hw, -hd, -hw + r, -hd);
  const geometry = new ExtrudeGeometry(shape, { depth: height, bevelEnabled: false, curveSegments: 6 });
  geometry.rotateX(-Math.PI / 2);
  return geometry;
}

/** A soft round shadow, drawn once and shared by every node. */
function shadowTexture(): CanvasTexture {
  const size = 128;
  const canvas = document.createElement("canvas");
  canvas.width = canvas.height = size;
  const ctx = canvas.getContext("2d")!;
  const gradient = ctx.createRadialGradient(size / 2, size / 2, size * 0.12, size / 2, size / 2, size / 2);
  gradient.addColorStop(0, "rgba(0,0,0,0.85)");
  gradient.addColorStop(1, "rgba(0,0,0,0)");
  ctx.fillStyle = gradient;
  ctx.fillRect(0, 0, size, size);
  return new CanvasTexture(canvas);
}

function labelElement(className: string, text: string): HTMLElement {
  const el = document.createElement("div");
  el.className = className;
  el.textContent = text;
  return el;
}

/**
 * The 3D view of one diagram layout: nodes stand on a board, pipes carry small packets along each edge, and the
 * camera turns within limits. Everything comes from the same data as the flat diagram, so the two cannot disagree.
 * Frames are drawn only while something moves.
 */
export class FlowScene {
  private readonly host: HTMLElement;
  private readonly layout: DiagramLayout;
  private readonly reduced: boolean;
  private readonly opts: FlowSceneOptions;

  private readonly renderer: WebGLRenderer;
  private readonly labels: CSS2DRenderer;
  private readonly scene = new Scene();
  private readonly camera = new PerspectiveCamera(32, 2, 0.1, 100);
  private readonly controls: OrbitControls;
  private readonly raycaster = new Raycaster();
  private readonly target = new Vector3(0, 0.15, 0);

  private readonly plateColor = new Color();
  private readonly pipeColor = new Color();

  private readonly nodes: NodeItem[] = [];
  private readonly edges: EdgeItem[] = [];
  private readonly packets: Packet[] = [];
  private packetMesh!: InstancedMesh;
  private glowMesh!: InstancedMesh;
  private plateMat = new MeshStandardMaterial({ roughness: 0.95 });
  private plateLine = new LineBasicMaterial();
  private gridMat = new LineBasicMaterial();
  private shadowMat!: MeshBasicMaterial;
  private hemi = new HemisphereLight(0xffffff, 0xffffff, 1);
  private sun = new DirectionalLight(0xffffff, 1);
  private boardWidth = 0;
  private boardDepth = 0;
  private boardZ = 0;
  private readonly W: number;
  private readonly H: number;
  private readonly zStretch: number;
  private readonly nodeDepth: number;
  private readonly defaultPolar: number;
  private readonly polarMin: number;
  private readonly polarMax: number;

  private playing: boolean;
  private intro: number;
  private introCamera: boolean;
  private distance = 10;
  private hasPlaced = false;
  private tween: { theta: number; phi: number; toTheta: number; toPhi: number; t: number } | null = null;

  private frame = 0;
  private last = 0;
  private visible = true;
  private disposed = false;
  private contextLost = false;
  private pointer = new Vector2();
  private pointerInside = false;
  private pointerDirty = false;
  private hovered: NodeItem | null = null;
  private downAt: { x: number; y: number; time: number } | null = null;

  private readonly resizeObserver: ResizeObserver;
  private readonly visibilityObserver: IntersectionObserver;
  private readonly themeObserver: MutationObserver;

  private readonly scratchMatrix = new Matrix4();
  private readonly scratchPos = new Vector3();
  private readonly scratchScale = new Vector3();
  private readonly identity = new Quaternion();

  constructor(opts: FlowSceneOptions) {
    this.opts = opts;
    this.host = opts.host;
    this.layout = opts.layout;
    this.reduced = opts.reducedMotion;
    this.playing = opts.playing;
    this.intro = this.reduced ? 1 : 0;
    this.introCamera = !this.reduced;
    this.W = this.layout.width;
    this.H = this.layout.height;
    // The compact (phone) layouts are tall and tight, so they are seen from higher up, with rows pushed further apart.
    const compact = this.W <= 500;
    this.zStretch = compact ? 1.5 : 1.35;
    // The footprint is a little deeper than the flat node, so a two-line label fits on the foreshortened top face.
    this.nodeDepth = compact ? 1 : 1.12;
    this.defaultPolar = compact ? 0.5 : 0.82;
    this.polarMin = compact ? 0.22 : 0.38;
    this.polarMax = compact ? 0.95 : 1.2;

    // Throws when the browser cannot create a WebGL context; the caller falls back to the flat diagram.
    this.renderer = new WebGLRenderer({ antialias: true, alpha: true });
    this.renderer.setClearColor(0x000000, 0);
    const coarse = window.matchMedia("(pointer: coarse)").matches;
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, coarse ? 1.75 : 2));
    const canvas = this.renderer.domElement;
    canvas.style.cssText = "position:absolute;inset:0;width:100%;height:100%;display:block;touch-action:pan-y;";
    this.host.appendChild(canvas);

    this.labels = new CSS2DRenderer();
    const labelLayer = this.labels.domElement;
    labelLayer.style.cssText = "position:absolute;inset:0;overflow:hidden;pointer-events:none;";
    labelLayer.setAttribute("aria-hidden", "true");
    this.host.appendChild(labelLayer);

    try {
      this.build();
    } catch (error) {
      // Nothing else owns these yet, so release them before the failure goes on to the caller.
      this.renderer.dispose();
      this.renderer.forceContextLoss();
      canvas.remove();
      labelLayer.remove();
      throw error;
    }
    this.scene.add(this.hemi, this.sun);
    this.sun.position.set(-5, 9, 6);

    this.controls = new OrbitControls(this.camera, canvas);
    this.controls.enablePan = false;
    this.controls.enableZoom = false;
    this.controls.enableDamping = !this.reduced;
    this.controls.dampingFactor = 0.09;
    this.controls.rotateSpeed = 0.55;
    this.controls.minPolarAngle = this.polarMin;
    this.controls.maxPolarAngle = this.polarMax;
    this.controls.minAzimuthAngle = -AZIMUTH_LIMIT;
    this.controls.maxAzimuthAngle = AZIMUTH_LIMIT;
    this.controls.target.copy(this.target);
    this.controls.addEventListener("change", this.requestRender);
    this.controls.addEventListener("start", this.onControlsStart);
    // OrbitControls sets touch-action: none on connect; vertical swipes must keep scrolling the page.
    canvas.style.touchAction = "pan-y";

    canvas.addEventListener("pointermove", this.onPointerMove);
    canvas.addEventListener("pointerleave", this.onPointerLeave);
    canvas.addEventListener("pointerdown", this.onPointerDown);
    canvas.addEventListener("pointerup", this.onPointerUp);
    canvas.addEventListener("webglcontextlost", this.onContextLost);

    this.applyPalette(readPalette());
    this.resize();
    this.placeCamera(this.introCamera ? DEFAULT_AZIMUTH - INTRO_TURN : DEFAULT_AZIMUTH, this.defaultPolar);

    this.resizeObserver = new ResizeObserver(() => this.resize());
    this.resizeObserver.observe(this.host);
    this.visibilityObserver = new IntersectionObserver((entries) => {
      this.visible = entries.some((entry) => entry.isIntersecting);
      if (this.visible) this.requestRender();
    });
    this.visibilityObserver.observe(this.host);
    this.themeObserver = new MutationObserver(() => {
      this.applyPalette(readPalette());
      this.requestRender();
    });
    this.themeObserver.observe(document.documentElement, { attributes: true, attributeFilter: ["class"] });

    this.requestRender();
  }

  // ---------------------------------------------------------------- building

  private px(x: number) {
    return (x - this.W / 2) * UNIT;
  }

  /** Depth is stretched a little, so rows stand further apart than on the flat page: standing nodes hide the ground behind them. */
  private pz(y: number) {
    return (y - this.H / 2) * UNIT * this.zStretch;
  }

  private build() {
    const { nodes, edges, texts } = this.layout;

    // The board holds the nodes with a small margin, and grows to hold the captions: lane titles sit just behind
    // the first node of their lane, notes sit in front of the nodes.
    const margin = 20 * UNIT;
    let zMin = this.pz(0) - margin;
    let zMax = this.pz(this.H) + margin;
    for (const text of texts ?? []) {
      const z = this.captionZ(text);
      zMin = Math.min(zMin, z - 0.35);
      zMax = Math.max(zMax, z + 0.35);
    }
    this.boardWidth = this.W * UNIT + 2 * margin;
    this.boardDepth = zMax - zMin;
    this.boardZ = (zMax + zMin) / 2;
    this.target.z = this.boardZ;
    const plateGeometry = slab(this.boardWidth, this.boardDepth, 0.14, 0.28);
    const plate = new Mesh(plateGeometry, this.plateMat);
    plate.position.set(0, -0.14, this.boardZ);
    plate.add(new LineSegments(new EdgesGeometry(plateGeometry, 35), this.plateLine));
    this.scene.add(plate);

    // Faint grid, one line per unit.
    const gridPoints: Vector3[] = [];
    const hw = this.boardWidth / 2 - 0.2;
    const hd = this.boardDepth / 2 - 0.2;
    for (let x = Math.ceil(-hw); x <= hw; x += 1) gridPoints.push(new Vector3(x, 0.002, this.boardZ - hd), new Vector3(x, 0.002, this.boardZ + hd));
    for (let z = Math.ceil(-hd); z <= hd; z += 1) gridPoints.push(new Vector3(-hw, 0.002, this.boardZ + z), new Vector3(hw, 0.002, this.boardZ + z));
    this.scene.add(new LineSegments(new BufferGeometry().setFromPoints(gridPoints), this.gridMat));

    const shadow = shadowTexture();
    this.shadowMat = new MeshBasicMaterial({ map: shadow, transparent: true, depthWrite: false, color: 0x000000 });

    nodes.forEach((node, index) => this.nodes.push(this.addNode(node, index)));
    const byId = new Map(this.nodes.map((item) => [item.node.id, item]));
    edges.forEach((edge) => this.edges.push(this.addEdge(edge, byId)));
    texts?.forEach((text) => {
      const el = labelElement("flow3d-label flow3d-caption", text.text);
      const caption = new CSS2DObject(el);
      caption.center.set(text.anchor === "end" ? 1 : text.anchor === "middle" ? 0.5 : 0, 0.5);
      caption.position.set(this.px(text.x), 0.02, this.captionZ(text));
      this.scene.add(caption);
    });

    this.buildPackets();
  }

  /** Where a caption stands, in scene units. A lane title sits clear behind the first node it heads; a note sits in front. */
  private captionZ(text: DText): number {
    const head = this.layout.nodes.find((n) => n.y - text.y > -4 && n.y - text.y < 44 && text.x < n.x + n.w && text.x + 150 > n.x);
    return head ? this.pz(head.y) - 0.75 : this.pz(text.y) + 0.3;
  }

  private addNode(node: DNode, index: number): NodeItem {
    const w = node.w * UNIT;
    const d = node.h * UNIT * this.nodeDepth;
    const height = NODE_HEIGHT[node.kind];
    const group = new Group();
    group.position.set(this.px(node.x + node.w / 2), 0, this.pz(node.y + node.h / 2));

    const bodyMat = new MeshStandardMaterial({ roughness: 0.6, metalness: 0 });
    const lineMat = new LineBasicMaterial();
    let ridgeMat: LineBasicMaterial | undefined;
    let body: Mesh;
    let top = height;

    if (node.kind === "store") {
      const geometry = new CylinderGeometry(0.5, 0.5, height, 56);
      body = new Mesh(geometry, bodyMat);
      body.scale.set(w, 1, d);
      body.position.y = height / 2;
      body.add(new LineSegments(new EdgesGeometry(geometry, 30), lineMat));
      // Two rings round the drum, so it reads as stacked disks.
      const ring = new BufferGeometry().setFromPoints(
        Array.from({ length: 56 }, (_, i) => new Vector3(Math.cos((i / 56) * Math.PI * 2) * 0.5, 0, Math.sin((i / 56) * Math.PI * 2) * 0.5)),
      );
      for (const fraction of [-height / 6, height / 6]) {
        const loop = new LineLoop(ring, lineMat);
        loop.position.y = fraction;
        body.add(loop);
      }
    } else if (node.kind === "model") {
      const geometry = new OctahedronGeometry(0.5);
      body = new Mesh(geometry, bodyMat);
      body.scale.set(w, height, d);
      body.position.y = height / 2 + 0.05;
      top = height + 0.05;
      // The rim round the middle keeps the full outline colour; the eight ridges to the tips are softer.
      const edges = new EdgesGeometry(geometry).getAttribute("position");
      const rim: Vector3[] = [];
      const ridges: Vector3[] = [];
      for (let i = 0; i < edges.count; i += 2) {
        const a = new Vector3().fromBufferAttribute(edges, i);
        const b = new Vector3().fromBufferAttribute(edges, i + 1);
        (Math.abs(a.y) < 1e-4 && Math.abs(b.y) < 1e-4 ? rim : ridges).push(a, b);
      }
      ridgeMat = new LineBasicMaterial();
      body.add(
        new LineSegments(new BufferGeometry().setFromPoints(rim), lineMat),
        new LineSegments(new BufferGeometry().setFromPoints(ridges), ridgeMat),
      );
    } else {
      const geometry = slab(w, d, height, 0.09);
      body = new Mesh(geometry, bodyMat);
      body.add(new LineSegments(new EdgesGeometry(geometry, 35), lineMat));
    }
    group.add(body);

    // Contact shadow under the node.
    const shadow = new Mesh(new PlaneGeometry(w + 0.55, d + 0.55), this.shadowMat);
    shadow.rotation.x = -Math.PI / 2;
    shadow.position.y = 0.004;
    group.add(shadow);

    const el = labelElement("flow3d-label flow3d-node", "");
    const title = document.createElement("span");
    title.className = "flow3d-node-title";
    title.textContent = node.label;
    el.appendChild(title);
    if (node.sub) {
      const sub = document.createElement("span");
      sub.className = "flow3d-node-sub";
      sub.textContent = node.sub;
      el.appendChild(sub);
    }
    const label = new CSS2DObject(el);
    label.center.set(0.5, 0.5);
    label.position.set(0, node.kind === "model" ? height / 2 + 0.05 : top + 0.01, 0);
    group.add(label);

    this.scene.add(group);
    return {
      node,
      group,
      body,
      bodyMat,
      lineMats: [lineMat],
      ridgeMat,
      base: new Color(),
      stroke: new Color(),
      label,
      dim: 1,
      dimTarget: 1,
      emphasis: 0,
      emphasisTarget: 0,
      pulse: 0,
      hover: 0,
      hoverTarget: 0,
      index,
    };
  }

  /** The edge's polyline as a smooth path: straight runs with rounded corners, at the given height. */
  private edgePath(edge: DEdge, y: number): CurvePath<Vector3> {
    const points = edge.points.map(([x, z]) => new Vector3(this.px(x), y, this.pz(z)));
    const path = new CurvePath<Vector3>();
    let cursor = points[0].clone();
    for (let i = 1; i < points.length; i++) {
      const prev = points[i - 1];
      const here = points[i];
      const next = points[i + 1];
      if (next) {
        const a = here.clone().sub(prev);
        const b = next.clone().sub(here);
        const radius = Math.min(CORNER, a.length() / 2, b.length() / 2);
        const enter = here.clone().addScaledVector(a.normalize(), -radius);
        const exit = here.clone().addScaledVector(b.normalize(), radius);
        if (cursor.distanceTo(enter) > 1e-4) path.add(new LineCurve3(cursor.clone(), enter));
        path.add(new QuadraticBezierCurve3(enter, here.clone(), exit));
        cursor = exit;
      } else if (cursor.distanceTo(here) > 1e-4) {
        path.add(new LineCurve3(cursor.clone(), here.clone()));
      }
    }
    return path;
  }

  private addEdge(edge: DEdge, byId: Map<string, NodeItem>): EdgeItem {
    const dashed = !!edge.dashed;
    const path = this.edgePath(edge, dashed ? PIPE_Y_DASHED : PIPE_Y);
    const length = path.getLength();
    const pipeMat = new MeshBasicMaterial();
    const samples = path.getSpacedPoints(Math.max(24, Math.round(length * 24)));

    if (dashed) {
      const period = 0.3;
      const count = Math.max(1, Math.floor(length / period));
      const dashes = new InstancedMesh(new BoxGeometry(0.16, PIPE_RADIUS * 1.8, PIPE_RADIUS * 1.8), pipeMat, count);
      const axis = new Vector3(1, 0, 0);
      const quaternion = new Quaternion();
      for (let i = 0; i < count; i++) {
        const u = Math.min(1, (i * period + period / 2) / length);
        const a = path.getPointAt(Math.max(0, u - 0.004));
        const b = path.getPointAt(Math.min(1, u + 0.004));
        quaternion.setFromUnitVectors(axis, b.sub(a).normalize());
        this.scratchMatrix.compose(path.getPointAt(u), quaternion, new Vector3(1, 1, 1));
        dashes.setMatrixAt(i, this.scratchMatrix);
      }
      dashes.instanceMatrix.needsUpdate = true;
      this.scene.add(dashes);
    } else {
      this.scene.add(new Mesh(new TubeGeometry(path, Math.max(8, Math.ceil(length * 14)), PIPE_RADIUS, 6, false), pipeMat));
    }

    // Arrowheads: at the end of the edge, and at the start when it runs both ways.
    const addArrow = (at: Vector3, direction: Vector3) => {
      const cone = new Mesh(new ConeGeometry(0.085, 0.22, 14), pipeMat);
      cone.quaternion.setFromUnitVectors(new Vector3(0, 1, 0), direction);
      cone.position.copy(at).addScaledVector(direction, -0.11);
      this.scene.add(cone);
    };
    const tail = path.getPointAt(1);
    addArrow(tail, tail.clone().sub(path.getPointAt(1 - 0.01 / Math.max(length, 0.1))).normalize());
    if (edge.bothWays) {
      const head = path.getPointAt(0);
      addArrow(head, head.clone().sub(path.getPointAt(0.01 / Math.max(length, 0.1))).normalize());
    }

    const labels: CSS2DObject[] = [];
    if (edge.label) {
      const [lx, ly] = edge.labelAt ?? edge.points[0];
      const label = new CSS2DObject(labelElement("flow3d-label flow3d-edge", edge.label));
      label.center.set(edge.labelAnchor === "end" ? 1 : edge.labelAnchor === "start" ? 0 : 0.5, 1);
      label.position.set(this.px(lx), PIPE_Y + 0.06, this.pz(ly + 2));
      this.scene.add(label);
      labels.push(label);
    }

    return {
      edge,
      from: byId.get(edge.from),
      to: byId.get(edge.to),
      length,
      samples,
      pipeMat,
      speed: dashed ? 0.9 : 1.5,
      dim: 1,
      dimTarget: 1,
      labels,
    };
  }

  private buildPackets() {
    this.edges.forEach((item, edgeIndex) => {
      const count = MathUtils.clamp(Math.round(item.length / 3), 1, 4);
      for (let i = 0; i < count; i++) {
        const phase = (i + ((edgeIndex * 0.37) % 1)) / count;
        const dir: 1 | -1 = item.edge.bothWays && i % 2 === 1 ? -1 : 1;
        this.packets.push({ edge: item, phase, lastPhase: phase, dir, slot: this.packets.length });
      }
    });
    const total = Math.max(1, this.packets.length);
    this.packetMesh = new InstancedMesh(new SphereGeometry(0.07, 12, 12), new MeshBasicMaterial(), total);
    this.glowMesh = new InstancedMesh(
      new SphereGeometry(0.15, 12, 12),
      new MeshBasicMaterial({ transparent: true, opacity: 0.18, depthWrite: false }),
      total,
    );
    this.packetMesh.frustumCulled = false;
    this.glowMesh.frustumCulled = false;
    this.scene.add(this.packetMesh, this.glowMesh);
  }

  // ----------------------------------------------------------------- palette

  private applyPalette(p: FlowPalette) {
    this.plateColor.copy(p.muted);
    this.plateMat.color.copy(p.muted);
    this.plateLine.color.copy(p.border);
    this.gridMat.color.copy(p.muted).lerp(p.border, 0.75);
    this.pipeColor.copy(p.mutedForeground);
    this.shadowMat.opacity = p.dark ? 0.6 : 0.3;
    this.hemi.color.set(0xffffff);
    this.hemi.groundColor.copy(p.muted);
    this.hemi.intensity = p.dark ? 1.15 : 1.35;
    this.sun.intensity = p.dark ? 1.5 : 1.9;

    const tint = p.dark ? 0.22 : 0.17;
    for (const item of this.nodes) {
      const kind = p.kind[item.node.kind];
      item.stroke.copy(kind);
      item.base.copy(p.background).lerp(item.node.kind === "plain" ? p.foreground : kind, item.node.kind === "plain" ? 0.08 : tint);
    }

    const colors = new Color();
    this.packets.forEach((packet) => {
      const from = packet.dir > 0 ? packet.edge.from : packet.edge.to;
      colors.copy(from ? p.kind[from.node.kind] : p.foreground);
      if (from?.node.kind === "plain") colors.copy(p.foreground);
      this.packetMesh.setColorAt(packet.slot, colors);
      this.glowMesh.setColorAt(packet.slot, colors);
    });
    if (this.packetMesh.instanceColor) this.packetMesh.instanceColor.needsUpdate = true;
    if (this.glowMesh.instanceColor) this.glowMesh.instanceColor.needsUpdate = true;
  }

  // ------------------------------------------------------------------ camera

  private resize() {
    // Keep whatever angle the visitor has turned to.
    const pose = this.hasPlaced ? this.currentAngles() : { theta: DEFAULT_AZIMUTH, phi: this.defaultPolar };
    const width = Math.max(1, this.host.clientWidth);
    const height = Math.max(1, this.host.clientHeight);
    this.renderer.setSize(width, height, false);
    this.labels.setSize(width, height);
    this.camera.aspect = width / height;
    this.camera.clearViewOffset();
    this.camera.updateProjectionMatrix();

    // Frame the board, and a little headroom above it, in the middle of the canvas at the resting angle: find the
    // distance that fills it, then slide the view so the board is centred (the near edge is bigger than the far one).
    const corners: Vector3[] = [];
    for (const sx of [-1, 1]) {
      for (const sz of [-1, 1]) {
        for (const y of [-0.14, HEADROOM]) corners.push(new Vector3((sx * this.boardWidth) / 2, y, this.boardZ + (sz * this.boardDepth) / 2));
      }
    }
    const ndc = new Vector3();
    const bounds = () => {
      this.camera.position.setFromSphericalCoords(this.distance, this.defaultPolar, DEFAULT_AZIMUTH).add(this.target);
      this.camera.lookAt(this.target);
      this.camera.updateMatrixWorld();
      let minX = Infinity, maxX = -Infinity, minY = Infinity, maxY = -Infinity;
      for (const corner of corners) {
        ndc.copy(corner).project(this.camera);
        minX = Math.min(minX, ndc.x);
        maxX = Math.max(maxX, ndc.x);
        minY = Math.min(minY, ndc.y);
        maxY = Math.max(maxY, ndc.y);
      }
      return { minX, maxX, minY, maxY };
    };
    this.distance = 12;
    for (let i = 0; i < 6; i++) {
      const b = bounds();
      this.distance *= Math.max((b.maxX - b.minX) / 2, (b.maxY - b.minY) / 2) / FIT_MARGIN;
    }
    const b = bounds();
    const shiftY = ((b.minY + b.maxY) / 2) * (height / 2);
    const shiftX = ((b.minX + b.maxX) / 2) * (width / 2);
    this.camera.setViewOffset(width, height, shiftX, -shiftY, width, height);

    this.placeCamera(pose.theta, pose.phi);
    this.requestRender();
  }

  private placeCamera(theta: number, phi: number) {
    this.camera.position.setFromSphericalCoords(this.distance, phi, theta).add(this.target);
    this.camera.lookAt(this.target);
    this.hasPlaced = true;
  }

  private currentAngles() {
    const s = new Spherical().setFromVector3(this.camera.position.clone().sub(this.target));
    return { theta: s.theta, phi: s.phi };
  }

  private goTo(toTheta: number, toPhi: number) {
    const { theta, phi } = this.currentAngles();
    this.introCamera = false;
    this.tween = {
      theta,
      phi,
      toTheta: MathUtils.clamp(toTheta, -AZIMUTH_LIMIT, AZIMUTH_LIMIT),
      toPhi: MathUtils.clamp(toPhi, this.polarMin, this.polarMax),
      t: this.reduced ? 1 : 0,
    };
    this.requestRender();
  }

  rotateBy(delta: number) {
    this.goTo(this.currentAngles().theta + delta, this.currentAngles().phi);
  }

  resetView() {
    this.goTo(DEFAULT_AZIMUTH, this.defaultPolar);
  }

  private onControlsStart = () => {
    this.introCamera = false;
    this.tween = null;
  };

  // ------------------------------------------------------------- interaction

  setFocus(focus: DiagramFocus | null) {
    const nodeIds = focus ? new Set(focus.nodes) : null;
    for (const item of this.nodes) {
      const inFocus = !nodeIds || nodeIds.has(item.node.id);
      item.dimTarget = inFocus ? 1 : DIM_NODE;
      item.emphasisTarget = focus && inFocus ? 1 : 0;
    }
    for (const item of this.edges) item.dimTarget = !focus || edgeInFocus(item.edge, focus) ? 1 : DIM_EDGE;
    this.requestRender();
  }

  setPlaying(playing: boolean) {
    this.playing = playing;
    this.requestRender();
  }

  private pointerFrom(event: PointerEvent) {
    const rect = this.renderer.domElement.getBoundingClientRect();
    this.pointer.set(((event.clientX - rect.left) / rect.width) * 2 - 1, -(((event.clientY - rect.top) / rect.height) * 2 - 1));
  }

  private onPointerMove = (event: PointerEvent) => {
    if (event.pointerType === "touch") return;
    this.pointerFrom(event);
    this.pointerInside = true;
    this.pointerDirty = true;
    this.requestRender();
  };

  private onPointerLeave = () => {
    this.pointerInside = false;
    this.pointerDirty = true;
    this.requestRender();
  };

  private onPointerDown = (event: PointerEvent) => {
    this.downAt = { x: event.clientX, y: event.clientY, time: performance.now() };
  };

  private onPointerUp = (event: PointerEvent) => {
    const down = this.downAt;
    this.downAt = null;
    if (!down || Math.hypot(event.clientX - down.x, event.clientY - down.y) > 6 || performance.now() - down.time > 600) return;
    this.pointerFrom(event);
    const hit = this.pick();
    if (hit) this.opts.onNodeClick?.(hit.node.id);
  };

  private onContextLost = (event: Event) => {
    event.preventDefault();
    this.contextLost = true;
    this.opts.onContextLost?.();
  };

  private pick(): NodeItem | null {
    this.raycaster.setFromCamera(this.pointer, this.camera);
    const hits = this.raycaster.intersectObjects(
      this.nodes.map((item) => item.body),
      false,
    );
    if (!hits.length) return null;
    return this.nodes.find((item) => item.body === hits[0].object) ?? null;
  }

  // ----------------------------------------------------------------- loop

  private requestRender = () => {
    if (this.disposed || this.frame) return;
    this.frame = requestAnimationFrame(this.tick);
  };

  private tick = (now: number) => {
    this.frame = 0;
    if (this.disposed) return;
    if (!this.visible) return;
    const dt = this.last ? Math.min(0.05, (now - this.last) / 1000) : 0.016;
    this.last = now;
    let busy = false;

    if (this.intro < 1) {
      this.intro = Math.min(1, this.intro + dt / 1.5);
      busy = true;
      if (this.introCamera) {
        const t = ease(this.intro);
        this.placeCamera(MathUtils.lerp(DEFAULT_AZIMUTH - INTRO_TURN, DEFAULT_AZIMUTH, t), this.defaultPolar);
      }
    }

    if (this.tween) {
      const tw = this.tween;
      tw.t = Math.min(1, tw.t + dt / 0.55);
      const k = ease(tw.t);
      this.placeCamera(MathUtils.lerp(tw.theta, tw.toTheta, k), MathUtils.lerp(tw.phi, tw.toPhi, k));
      if (tw.t >= 1) this.tween = null;
      busy = true;
    }

    if (this.playing) busy = true;

    if (this.pointerDirty) {
      this.pointerDirty = false;
      const hit = this.pointerInside && !this.downAt ? this.pick() : null;
      if (hit !== this.hovered) {
        this.hovered = hit;
        this.renderer.domElement.style.cursor = hit ? "pointer" : "";
      }
    }

    busy = this.animate(dt) || busy;
    if (this.controls.update(dt)) busy = true;

    this.renderer.render(this.scene, this.camera);
    this.labels.render(this.scene, this.camera);
    if (!this.host.dataset.flow3d) this.host.dataset.flow3d = "ready";
    if (this.intro >= 1) this.host.dataset.flow3d = "settled";

    if (busy) this.requestRender();
  };

  /** Eases dimming, hover and pulses, moves the packets, and writes colours. Returns true while anything is still changing. */
  private animate(dt: number): boolean {
    let busy = false;
    const approach = (value: number, target: number, rate: number) => {
      const next = value + (target - value) * Math.min(1, dt * rate);
      return Math.abs(next - target) < 0.004 ? target : next;
    };
    const intro = this.intro;
    const plate = this.plateColor;

    for (const item of this.nodes) {
      const appear = ease((intro - (item.index / Math.max(1, this.nodes.length - 1)) * 0.5) / 0.5);
      item.dim = approach(item.dim, item.dimTarget, 9);
      item.emphasis = approach(item.emphasis, item.emphasisTarget, 9);
      item.hoverTarget = this.hovered === item ? 1 : 0;
      item.hover = approach(item.hover, item.hoverTarget, 14);
      item.pulse = item.pulse > 0.005 ? item.pulse * Math.exp(-dt * 4.5) : 0;
      if (item.dim !== item.dimTarget || item.emphasis !== item.emphasisTarget || item.hover !== item.hoverTarget || item.pulse > 0) busy = true;

      const strength = item.dim * appear;
      item.bodyMat.color.copy(plate).lerp(item.base, strength);
      for (const line of item.lineMats) line.color.copy(plate).lerp(item.stroke, strength);
      item.ridgeMat?.color.copy(plate).lerp(item.stroke, strength * RIDGE_STRENGTH);
      item.bodyMat.emissive.copy(item.stroke);
      item.bodyMat.emissiveIntensity = Math.max(item.pulse * 0.45, item.hover * 0.3, item.emphasis * 0.14) * appear;
      item.group.position.y = -(1 - appear) * 0.6 + item.hover * 0.05;
      const grow = 1 + item.pulse * 0.035 + item.hover * 0.02;
      item.group.scale.set(grow, 1, grow);
      item.group.visible = appear > 0.001;
      (item.label.element as HTMLElement).style.opacity = String(Math.min(1, (0.28 + 0.72 * item.dim) * appear));
    }

    for (const item of this.edges) {
      item.dim = approach(item.dim, item.dimTarget, 9);
      if (item.dim !== item.dimTarget) busy = true;
      const appear = ease((intro - 0.35) / 0.5);
      item.pipeMat.color.copy(plate).lerp(this.pipeColor, item.dim * appear);
      for (const label of item.labels) (label.element as HTMLElement).style.opacity = String(Math.min(1, (0.2 + 0.8 * item.dim) * appear));
    }

    const edgeAppear = ease((intro - 0.55) / 0.45);
    const matrix = this.scratchMatrix;
    const position = this.scratchPos;
    const scale = this.scratchScale;
    for (const packet of this.packets) {
      const edge = packet.edge;
      if (this.playing && intro >= 0.4) {
        packet.lastPhase = packet.phase;
        packet.phase = (packet.phase + (dt * edge.speed) / Math.max(edge.length, 0.5)) % 1;
        if (packet.phase < packet.lastPhase) {
          const arrived = packet.dir > 0 ? edge.to : edge.from;
          if (arrived && edge.dim > 0.5) arrived.pulse = 1;
        }
      }
      const u = packet.dir > 0 ? packet.phase : 1 - packet.phase;
      const f = u * (edge.samples.length - 1);
      const i = Math.min(edge.samples.length - 2, Math.floor(f));
      position.lerpVectors(edge.samples[i], edge.samples[i + 1], f - i);
      // Fade in and out near the ends, and hide packets on edges that are out of focus.
      const edgeFade = Math.min(1, Math.min(u, 1 - u) * 6 + 0.25);
      const visible = edge.dim > 0.5 ? edgeAppear * edgeFade : 0;
      scale.setScalar(Math.max(0.0001, visible));
      matrix.compose(position, this.identity, scale);
      this.packetMesh.setMatrixAt(packet.slot, matrix);
      this.glowMesh.setMatrixAt(packet.slot, matrix);
    }
    this.packetMesh.instanceMatrix.needsUpdate = true;
    this.glowMesh.instanceMatrix.needsUpdate = true;
    return busy;
  }

  // --------------------------------------------------------------- teardown

  dispose() {
    this.disposed = true;
    if (this.frame) cancelAnimationFrame(this.frame);
    this.resizeObserver.disconnect();
    this.visibilityObserver.disconnect();
    this.themeObserver.disconnect();
    const canvas = this.renderer.domElement;
    canvas.removeEventListener("pointermove", this.onPointerMove);
    canvas.removeEventListener("pointerleave", this.onPointerLeave);
    canvas.removeEventListener("pointerdown", this.onPointerDown);
    canvas.removeEventListener("pointerup", this.onPointerUp);
    canvas.removeEventListener("webglcontextlost", this.onContextLost);
    this.controls.removeEventListener("change", this.requestRender);
    this.controls.removeEventListener("start", this.onControlsStart);
    this.controls.dispose();

    const materials = new Set<Material>();
    this.scene.traverse((object: Object3D) => {
      const mesh = object as Mesh;
      mesh.geometry?.dispose();
      const material = mesh.material as Material | Material[] | undefined;
      if (Array.isArray(material)) material.forEach((m) => materials.add(m));
      else if (material) materials.add(material);
    });
    materials.forEach((material) => {
      (material as MeshBasicMaterial).map?.dispose();
      material.dispose();
    });
    this.packetMesh.dispose();
    this.glowMesh.dispose();
    this.renderer.dispose();
    // Releasing a context that is already lost would only log a warning.
    if (!this.contextLost) this.renderer.forceContextLoss();
    canvas.remove();
    this.labels.domElement.remove();
  }
}
