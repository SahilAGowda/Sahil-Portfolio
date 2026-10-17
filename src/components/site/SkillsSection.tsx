import { skillGroups } from "@/data/skills";
import { Section } from "./Section";

export function SkillsSection() {
  return (
    <Section id="skills" title="Skills">
      <dl className="mt-10 space-y-6">
        {skillGroups.map((group) => (
          <div key={group.title} className="md:grid md:grid-cols-[13rem_1fr]">
            <dt className="text-muted-foreground">{group.title}</dt>
            <dd className="max-w-[64ch]">{group.items.join(", ")}</dd>
          </div>
        ))}
      </dl>
    </Section>
  );
}
