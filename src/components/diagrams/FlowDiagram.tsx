import { Suspense, lazy, useCallback, useEffect, useMemo, useRef, useState, type ReactNode } from "react";
import { QuietBoundary } from "@/components/site/QuietBoundary";
import { Rich } from "@/components/site/Rich";
import type { FlowStep } from "@/data/caseStudies";
import { diagrams, type DiagramFocus } from "@/data/diagrams";
import { useMediaQuery, useReducedMotion } from "@/hooks/useMediaQuery";
import { cn } from "@/lib/utils";
import { Diagram, DiagramLegend } from "./Diagram";
import type { Flow3DHandle } from "./flow3d/Flow3D";

// three.js lives in this chunk only, and the chunk loads when the diagram is about to scroll into view.
const loadFlow3D = () =>
  import("./flow3d/Flow3D").then((module) => {
    // After a failed download Vite can hand back nothing instead of throwing; say what happened.
    if (!module?.default) throw new Error("The 3D view could not be loaded");
    return module;
  });
const Flow3D = lazy(loadFlow3D);

const button =
  "inline-flex min-h-11 items-center rounded-md border border-input bg-background px-4 text-[0.9375rem] hover:bg-accent active:translate-y-px";

function Control({ onClick, children }: { onClick: () => void; children: ReactNode }) {
  return (
    <button type="button" onClick={onClick} className={button}>
      {children}
    </button>
  );
}

/** Whether this browser can create a WebGL context. The test context is released at once. */
function webglAvailable(): boolean {
  try {
    const canvas = document.createElement("canvas");
    const gl = canvas.getContext("webgl2") || canvas.getContext("webgl");
    gl?.getExtension("WEBGL_lose_context")?.loseContext();
    return !!gl;
  } catch {
    return false;
  }
}

interface FlowDiagramProps {
  slug: string;
  steps?: FlowStep[];
}

/**
 * The case-study diagram: a 3D view where the data visibly moves along each edge, with the flat diagram as the
 * fallback and a toggle. A step list lights up one part of the flow at a time in either view.
 */
export function FlowDiagram({ slug, steps }: FlowDiagramProps) {
  const spec = diagrams[slug];
  const reduced = useReducedMotion();
  const wide = useMediaQuery("(min-width: 640px)");
  const figureRef = useRef<HTMLElement>(null);
  const handle = useRef<Flow3DHandle>(null);

  const [choice, setChoice] = useState<"3d" | "flat" | null>(null);
  const [near, setNear] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [failed, setFailed] = useState(false);
  const [supported, setSupported] = useState<boolean | null>(null);
  const [playing, setPlaying] = useState(!reduced);
  const [active, setActive] = useState<number | null>(null);
  const [announce, setAnnounce] = useState("");

  // A visitor who asked for less motion, or for less data, starts on the flat diagram and can switch.
  const saveData = (navigator as Navigator & { connection?: { saveData?: boolean } }).connection?.saveData === true;
  // WebGL is probed when the diagram is about to be needed, not on every visit to the page.
  const probe = useCallback(() => {
    const ok = webglAvailable();
    setSupported(ok);
    return ok;
  }, []);
  const wants3d = (choice ?? (reduced || saveData ? "flat" : "3d")) === "3d" && supported !== false && !failed;
  const showing3d = wants3d && mounted;
  const loading = wants3d && near && !mounted;
  const layout = wide ? spec.full : spec.compact;

  // Start loading once the browser is idle and the diagram is close: within 400 px of the viewport on a wide screen,
  // but only once it is actually in view on a phone, where the 3D code costs the most and the diagram starts below the fold.
  useEffect(() => {
    if (!wants3d || near || !figureRef.current) return;
    const observer = new IntersectionObserver(
      (entries) => {
        if (!entries.some((entry) => entry.isIntersecting)) return;
        observer.disconnect();
        const start = () => {
          if (probe()) setNear(true);
        };
        // Safari has no requestIdleCallback.
        if (typeof window.requestIdleCallback === "function") window.requestIdleCallback(start, { timeout: 1500 });
        else window.setTimeout(start, 200);
      },
      { rootMargin: window.matchMedia("(min-width: 640px)").matches ? "400px 0px" : "0px" },
    );
    observer.observe(figureRef.current);
    return () => observer.disconnect();
  }, [wants3d, near, probe]);

  const focus = useMemo<DiagramFocus | null>(() => {
    const step = active === null ? undefined : steps?.[active];
    return step ? { nodes: step.nodes, edges: step.edges } : null;
  }, [active, steps]);

  const select = useCallback(
    (index: number | null) => {
      setActive(index);
      const step = index === null ? undefined : steps?.[index];
      setAnnounce(step ? `Step ${index! + 1} of ${steps!.length}: ${step.title}` : "Showing the whole flow");
    },
    [steps],
  );

  const onNodeClick = useCallback(
    (id: string) => {
      if (!steps) return;
      const current = active === null ? undefined : steps[active];
      if (current?.nodes.includes(id)) return;
      const index = steps.findIndex((step) => step.nodes.includes(id));
      if (index !== -1) select(index);
    },
    [steps, active, select],
  );

  const onFail = useCallback(() => {
    setFailed(true);
    setMounted(false);
    setAnnounce("The 3D view is not available here, so the flat diagram is shown.");
  }, []);

  const toggleView = () => {
    if (showing3d) {
      setChoice("flat");
      setMounted(false);
    } else {
      setChoice("3d");
      // Asking for the 3D view loads it now, without waiting for the diagram to scroll near.
      if (supported ?? probe()) setNear(true);
    }
  };

  const onReady = useCallback(() => {
    setMounted(true);
    setAnnounce("3D view ready.");
  }, []);

  return (
    <figure ref={figureRef} onPointerEnter={() => wants3d && void loadFlow3D()} className="m-0">
      <div
        role={showing3d ? "img" : undefined}
        aria-label={showing3d ? `${spec.title}. ${spec.description}` : undefined}
        data-diagram-view={showing3d ? "3d" : "flat"}
        className="relative aspect-[7/10] overflow-hidden rounded-md border border-border bg-background sm:aspect-[2/1]"
      >
        <div className={cn("absolute inset-0 flex items-center justify-center p-3 sm:p-6", showing3d && "invisible")}>
          <Diagram layout={layout} title={spec.title} description={spec.description} focus={focus} flow={!showing3d} className="h-full w-full" />
        </div>

        {wants3d && near && (
          <QuietBoundary onError={onFail}>
            <Suspense fallback={null}>
              <Flow3D
                ref={handle}
                layout={layout}
                focus={focus}
                playing={playing}
                reducedMotion={reduced}
                onNodeClick={onNodeClick}
                onFail={onFail}
                onReady={onReady}
              />
            </Suspense>
          </QuietBoundary>
        )}

        {loading && <p className="absolute bottom-2 right-3 text-caption text-muted-foreground">Loading the 3D view…</p>}
      </div>

      <div role="group" aria-label="Diagram controls" className="mt-3 flex flex-wrap items-center gap-2">
        {showing3d && (
          <>
            <Control onClick={() => setPlaying((value) => !value)}>{playing ? "Pause the flow" : "Play the flow"}</Control>
            <Control onClick={() => handle.current?.rotate(-1)}>Turn left</Control>
            <Control onClick={() => handle.current?.rotate(1)}>Turn right</Control>
            <Control onClick={() => handle.current?.reset()}>Reset view</Control>
          </>
        )}
        {supported !== false && !failed && <Control onClick={toggleView}>{showing3d ? "Show the flat diagram" : "Show the 3D view"}</Control>}
      </div>

      {showing3d && (
        <p className="mt-2 max-w-[64ch] text-caption text-muted-foreground">
          Drag the diagram to turn it{steps?.length ? ", and select a block to jump to its step." : "."}
        </p>
      )}
      {supported === false && (
        <p className="mt-2 max-w-[64ch] text-caption text-muted-foreground">This browser cannot draw the 3D view, so the flat diagram is shown.</p>
      )}
      {failed && supported !== false && (
        <p className="mt-2 max-w-[64ch] text-caption text-muted-foreground">The 3D view could not start, so the flat diagram is shown.</p>
      )}

      <DiagramLegend layout={layout} />

      {steps && steps.length > 0 && (
        <div className="mt-10">
          <h3 className="text-lede font-semibold">Follow the data</h3>
          <p className="mt-1 max-w-[64ch] text-muted-foreground">
            Select a step to light it up in the diagram. Select it again to show everything.
          </p>
          <ol className="mt-4 grid gap-x-8 gap-y-1 md:grid-cols-2">
            {steps.map((step, index) => (
              <li key={step.title}>
                <button
                  type="button"
                  aria-pressed={active === index}
                  onClick={() => select(active === index ? null : index)}
                  className={cn(
                    "flex w-full gap-4 border-l-2 py-3 pl-4 pr-3 text-left hover:bg-accent/60 active:translate-y-px",
                    active === index ? "border-primary bg-accent/60" : "border-border",
                  )}
                >
                  <span aria-hidden="true" className="w-5 shrink-0 text-caption font-semibold tabular-nums text-muted-foreground">
                    {index + 1}
                  </span>
                  <span>
                    <span className="block font-semibold">{step.title}</span>
                    <span className="block text-muted-foreground">
                      <Rich text={step.body} />
                    </span>
                  </span>
                </button>
              </li>
            ))}
          </ol>
        </div>
      )}

      <p role="status" className="sr-only">
        {announce}
      </p>
    </figure>
  );
}
