import { diagrams } from "@/data/diagrams";
import { Diagram, DiagramLegend } from "./Diagram";

interface ProjectDiagramProps {
  slug: string;
  variant: "compact" | "full";
  className?: string;
}

/** The diagram for one project, in the layout that suits the space. */
export function ProjectDiagram({ slug, variant, className }: ProjectDiagramProps) {
  const spec = diagrams[slug];
  if (!spec) return null;
  return <Diagram layout={spec[variant]} title={spec.title} description={spec.description} className={className} />;
}

/** On phones show the compact layout; from 640 px up show the full one. Includes the legend. */
export function ResponsiveProjectDiagram({ slug }: { slug: string }) {
  const spec = diagrams[slug];
  if (!spec) return null;
  return (
    <figure>
      <div className="mx-auto max-w-[22rem] sm:hidden">
        <Diagram layout={spec.compact} title={spec.title} description={spec.description} />
        <DiagramLegend layout={spec.compact} />
      </div>
      <div className="hidden sm:block">
        <Diagram layout={spec.full} title={spec.title} description={spec.description} />
        <DiagramLegend layout={spec.full} />
      </div>
    </figure>
  );
}
