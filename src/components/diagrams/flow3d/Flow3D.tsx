import { forwardRef, useEffect, useImperativeHandle, useRef } from "react";
import type { DiagramFocus, DiagramLayout } from "@/data/diagrams";
import { FlowScene } from "./scene";

export interface Flow3DHandle {
  rotate: (direction: -1 | 1) => void;
  reset: () => void;
}

interface Flow3DProps {
  layout: DiagramLayout;
  focus: DiagramFocus | null;
  playing: boolean;
  reducedMotion: boolean;
  onNodeClick: (id: string) => void;
  /** The scene could not be created, or the browser lost the WebGL context. */
  onFail: () => void;
  onReady: () => void;
}

/** Mounts the three.js scene for one diagram layout. Loaded on demand, so none of three.js is in the main bundle. */
const Flow3D = forwardRef<Flow3DHandle, Flow3DProps>(function Flow3D(
  { layout, focus, playing, reducedMotion, onNodeClick, onFail, onReady },
  ref,
) {
  const hostRef = useRef<HTMLDivElement>(null);
  const sceneRef = useRef<FlowScene | null>(null);
  // The latest values, read when the scene is created without re-creating it on every change.
  const latest = useRef({ focus, playing, onNodeClick, onFail, onReady });
  latest.current = { focus, playing, onNodeClick, onFail, onReady };

  useImperativeHandle(ref, () => ({
    rotate: (direction) => sceneRef.current?.rotateBy(direction * 0.28),
    reset: () => sceneRef.current?.resetView(),
  }));

  useEffect(() => {
    const host = hostRef.current;
    if (!host) return;
    let scene: FlowScene;
    try {
      scene = new FlowScene({
        host,
        layout,
        reducedMotion,
        playing: latest.current.playing,
        onNodeClick: (id) => latest.current.onNodeClick(id),
        onContextLost: () => latest.current.onFail(),
      });
    } catch {
      latest.current.onFail();
      return;
    }
    sceneRef.current = scene;
    scene.setFocus(latest.current.focus);
    latest.current.onReady();
    return () => {
      scene.dispose();
      sceneRef.current = null;
      delete host.dataset.flow3d;
    };
  }, [layout, reducedMotion]);

  useEffect(() => sceneRef.current?.setFocus(focus), [focus]);
  useEffect(() => sceneRef.current?.setPlaying(playing), [playing]);

  return <div ref={hostRef} className="absolute inset-0" />;
});

export default Flow3D;
