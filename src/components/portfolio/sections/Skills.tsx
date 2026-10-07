import { Card } from "@/components/ui/card";
import { skillGroups } from "@/data/skills";

export function Skills() {
  return (
    <section className="portfolio-section">
      <div className="max-w-4xl mx-auto">
        <h2 className="section-title">Skills</h2>

        <div className="space-y-6">
          {skillGroups.map((group) => (
            <Card key={group.title} className="bg-card border-border p-6">
              <h3 className="text-lg font-bold text-foreground mb-4">{group.title}</h3>
              <ul className="flex flex-wrap gap-2">
                {group.items.map((item) => (
                  <li key={item} className="skill-badge">
                    {item}
                  </li>
                ))}
              </ul>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}
