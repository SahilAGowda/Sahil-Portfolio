import { diagrams } from "@/data/diagrams";
import { Diagram } from "./Diagram";

interface ProjectDiagramProps {
  slug: string;
  variant: "compact" | "full";
  className?: string;
}

/** The diagram for one project, in the layout that suits the space. */
export function ProjectDiagram({ slug, variant, className }: ProjectDiagramProps) {
  const spec = diagrams[slug];
  if (!spec) return null;
  return <Diagram layout={spec[variant]} title={spec.title} description={spec.description} className={className} flow />;
}
