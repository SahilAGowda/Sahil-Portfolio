import { useEffect, useId, useRef } from "react";
import { useReducedMotion } from "@/hooks/useMediaQuery";
import { edgeInFocus, type DEdge, type DNode, type DiagramFocus, type DiagramLayout, type NodeKind } from "@/data/diagrams";

const palette: Record<NodeKind, { stroke: string; fill: string }> = {
  flow: { stroke: "hsl(var(--flow))", fill: "hsl(var(--flow) / 0.1)" },
  store: { stroke: "hsl(var(--store))", fill: "hsl(var(--store) / 0.1)" },
  model: { stroke: "hsl(var(--model))", fill: "hsl(var(--model) / 0.1)" },
  plain: { stroke: "hsl(var(--muted-foreground))", fill: "hsl(var(--foreground) / 0.04)" },
};

const CAP = 9; // height of the cylinder's elliptical cap

function Shape({ node }: { node: DNode }) {
  const { x, y, w, h, kind } = node;
  const { stroke, fill } = palette[kind];
  const style = { stroke, fill, strokeWidth: 1.5 };

  if (kind === "store") {
    const rx = w / 2;
    const body = `M ${x} ${y + CAP} A ${rx} ${CAP} 0 0 1 ${x + w} ${y + CAP} V ${y + h - CAP} A ${rx} ${CAP} 0 0 1 ${x} ${y + h - CAP} Z`;
    const rim = `M ${x} ${y + CAP} A ${rx} ${CAP} 0 0 0 ${x + w} ${y + CAP}`;
    return (
      <g>
        <path d={body} style={style} />
        <path d={rim} style={{ stroke, fill: "none", strokeWidth: 1.5 }} />
      </g>
    );
  }
  if (kind === "model") {
    const cx = x + w / 2;
    const cy = y + h / 2;
    return <polygon points={`${cx},${y} ${x + w},${cy} ${cx},${y + h} ${x},${cy}`} style={{ ...style, strokeLinejoin: "round" }} />;
  }
  return <rect x={x} y={y} width={w} height={h} rx={6} style={style} />;
}

function NodeText({ node, size }: { node: DNode; size: number }) {
  const lines = node.label.split("\n");
  const subs = node.sub ? node.sub.split("\n") : [];
  const lineHeight = size * 1.28;
  const subSize = size * 0.88;
  const subHeight = subSize * 1.28;
  const total = lines.length * lineHeight + subs.length * subHeight;
  const cx = node.x + node.w / 2;
  // A cylinder's text sits in the body below the front of the top cap, not in the middle of its box.
  const middle = node.kind === "store" ? node.y + (node.h + 2 * CAP - 3) / 2 : node.y + node.h / 2;
  const top = middle - total / 2;

  return (
    <g textAnchor="middle">
      {lines.map((line, i) => (
        <text
          key={`l${i}`}
          x={cx}
          y={top + lineHeight * i + lineHeight * 0.5 + size * 0.32}
          fontSize={size}
          fontWeight={600}
          style={{ fill: "hsl(var(--foreground))" }}
        >
          {line}
        </text>
      ))}
      {subs.map((line, i) => (
        <text
          key={`s${i}`}
          x={cx}
          y={top + lines.length * lineHeight + subHeight * i + subHeight * 0.5 + subSize * 0.32}
          fontSize={subSize}
          style={{ fill: "hsl(var(--muted-foreground))" }}
        >
          {line}
        </text>
      ))}
    </g>
  );
}

/** What a part of the diagram looks like while a walkthrough step is selected and it is not part of that step. */
const DIMMED = 0.22;
const fade = { transition: "opacity 200ms" };

function Edge({ edge, markerId, size, dim }: { edge: DEdge; markerId: string; size: number; dim: boolean }) {
  const d = edge.points.map(([px, py], i) => `${i === 0 ? "M" : "L"} ${px} ${py}`).join(" ");
  const [lx, ly] = edge.labelAt ?? edge.points[0];
  return (
    <g style={{ ...fade, opacity: dim ? DIMMED : 1 }}>
      <path
        d={d}
        fill="none"
        strokeWidth={1.5}
        strokeDasharray={edge.dashed ? "5 4" : undefined}
        strokeLinejoin="round"
        markerEnd={`url(#${markerId})`}
        markerStart={edge.bothWays ? `url(#${markerId})` : undefined}
        style={{ stroke: "hsl(var(--muted-foreground))" }}
      />
      {edge.label && (
        <text
          x={lx}
          y={ly}
          fontSize={size * 0.88}
          textAnchor={edge.labelAnchor ?? "middle"}
          paintOrder="stroke"
          strokeWidth={4}
          strokeLinejoin="round"
          style={{ fill: "hsl(var(--muted-foreground))", stroke: "hsl(var(--background))" }}
        >
          {edge.label}
        </text>
      )}
    </g>
  );
}

/** How fast a dot travels along an arrow, in diagram units per second. */
const DOT_SPEED = 90;
const DOT_PASSES = 2;

function polylineLength(points: [number, number][]): number {
  return points.slice(1).reduce((sum, [x, y], i) => sum + Math.hypot(x - points[i][0], y - points[i][1]), 0);
}

/**
 * A dot that runs along an arrow a couple of times. It starts on request (the diagram scrolls into view), so it
 * never runs unseen, and it ends on its own: nothing keeps moving after about five seconds.
 */
function FlowDot({ edge }: { edge: DEdge }) {
  const d = edge.points.map(([px, py], i) => `${i === 0 ? "M" : "L"} ${px} ${py}`).join(" ");
  const dur = `${Math.max(0.9, polylineLength(edge.points) / DOT_SPEED).toFixed(2)}s`;
  return (
    <circle r={3.2} opacity={0} data-flow-dot style={{ fill: "hsl(var(--primary))" }}>
      <animateMotion path={d} dur={dur} repeatCount={DOT_PASSES} begin="indefinite" />
      <animate attributeName="opacity" values="0;1;1;0" keyTimes="0;0.12;0.88;1" dur={dur} repeatCount={DOT_PASSES} begin="indefinite" />
    </circle>
  );
}

interface DiagramProps {
  layout: DiagramLayout;
  title: string;
  description: string;
  className?: string;
  /** While set, everything outside it is dimmed. Used by the walkthrough on case-study pages. */
  focus?: DiagramFocus | null;
  /** Send a dot along each arrow, twice, when the diagram first scrolls into view. Skipped under reduced motion. */
  flow?: boolean;
}

/** Renders one diagram layout as inline SVG. Colours come from CSS variables, so both themes work. */
export function Diagram({ layout, title, description, className, focus, flow }: DiagramProps) {
  const id = useId().replace(/:/g, "");
  const svgRef = useRef<SVGSVGElement>(null);
  const reduced = useReducedMotion();
  const showFlow = !!flow && !reduced;

  useEffect(() => {
    const svg = svgRef.current;
    if (!showFlow || !svg || typeof IntersectionObserver === "undefined") return;
    const observer = new IntersectionObserver(
      (entries) => {
        if (!entries.some((entry) => entry.isIntersecting)) return;
        observer.disconnect();
        // Stagger the arrows, so the flow reads as one thing moving through, not everything at once.
        svg.querySelectorAll("[data-flow-dot]").forEach((dot, index) => {
          dot.querySelectorAll<SVGAnimationElement>("animateMotion, animate").forEach((animation) => animation.beginElementAt(index * 0.25));
        });
      },
      { threshold: 0.6 },
    );
    observer.observe(svg);
    return () => observer.disconnect();
  }, [showFlow, layout]);
  const markerId = `${id}-arrow`;
  const { width, height, fontSize, nodes, edges, texts } = layout;
  const focusNodes = focus ? new Set(focus.nodes) : null;

  return (
    <svg
      ref={svgRef}
      viewBox={`-1 -1 ${width + 2} ${height + 2}`}
      role="img"
      aria-labelledby={`${id}-title ${id}-desc`}
      className={className ?? "h-auto w-full"}
    >
      <title id={`${id}-title`}>{title}</title>
      <desc id={`${id}-desc`}>{description}</desc>
      <defs>
        <marker
          id={markerId}
          viewBox="0 0 10 10"
          refX="9"
          refY="5"
          markerWidth="7"
          markerHeight="7"
          orient="auto-start-reverse"
        >
          <path d="M 0 0 L 10 5 L 0 10 z" style={{ fill: "hsl(var(--muted-foreground))" }} />
        </marker>
      </defs>
      {texts?.map((t) => (
        <text
          key={t.text}
          x={t.x}
          y={t.y}
          fontSize={fontSize * 0.88}
          textAnchor={t.anchor ?? "start"}
          style={{ fill: "hsl(var(--muted-foreground))" }}
        >
          {t.text}
        </text>
      ))}
      {edges.map((edge, i) => (
        <Edge key={i} edge={edge} markerId={markerId} size={fontSize} dim={!!focus && !edgeInFocus(edge, focus)} />
      ))}
      {nodes.map((n) => (
        <g key={n.id} style={{ ...fade, opacity: focusNodes && !focusNodes.has(n.id) ? DIMMED : 1 }}>
          <Shape node={n} />
          <NodeText node={n} size={fontSize} />
        </g>
      ))}
      {showFlow && edges.map((edge, i) => <FlowDot key={`dot${i}`} edge={edge} />)}
    </svg>
  );
}

const legendText: Record<NodeKind, string> = {
  flow: "Job or service",
  store: "Data store",
  model: "Model call",
  plain: "Input or output",
};

function LegendIcon({ kind }: { kind: NodeKind }) {
  const { stroke, fill } = palette[kind];
  const style = { stroke, fill, strokeWidth: 1.5 };
  return (
    <svg width="22" height="16" viewBox="0 0 22 16" aria-hidden="true">
      {kind === "store" ? (
        <>
          <path d="M 2 4 A 9 3 0 0 1 20 4 V 12 A 9 3 0 0 1 2 12 Z" style={style} />
          <path d="M 2 4 A 9 3 0 0 0 20 4" style={{ stroke, fill: "none", strokeWidth: 1.5 }} />
        </>
      ) : kind === "model" ? (
        <polygon points="11,1 21,8 11,15 1,8" style={{ ...style, strokeLinejoin: "round" }} />
      ) : (
        <rect x="2" y="2" width="18" height="12" rx="3" style={style} />
      )}
    </svg>
  );
}

/** Says what each shape means, for the kinds a diagram actually uses. */
export function DiagramLegend({ layout }: { layout: DiagramLayout }) {
  const order: NodeKind[] = ["flow", "store", "model", "plain"];
  const used = order.filter((kind) => layout.nodes.some((n) => n.kind === kind));
  return (
    <ul className="mt-3 flex flex-wrap gap-x-6 gap-y-2 text-caption text-muted-foreground">
      {used.map((kind) => (
        <li key={kind} className="flex items-center gap-2">
          <LegendIcon kind={kind} />
          {legendText[kind]}
        </li>
      ))}
      {layout.edges.some((edge) => edge.dashed) && (
        <li className="flex items-center gap-2">
          <svg width="22" height="16" viewBox="0 0 22 16" aria-hidden="true">
            <path d="M 1 8 H 21" strokeWidth="1.5" strokeDasharray="4 3" style={{ stroke: "hsl(var(--muted-foreground))" }} />
          </svg>
          Dashed means asynchronous or a check
        </li>
      )}
    </ul>
  );
}
