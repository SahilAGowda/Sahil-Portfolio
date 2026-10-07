import { experience } from "@/data/experience";
import { formatRange } from "@/lib/dates";
import { CareerStrip } from "./CareerStrip";
import { Rich } from "./Rich";
import { Section } from "./Section";

export function ExperienceSection() {
  return (
    <Section id="experience" title="Experience">
      <CareerStrip />
      <ol className="mt-14 space-y-16">
        {experience.map((entry) => (
          <li key={entry.title} className="md:grid md:grid-cols-[13rem_1fr] md:gap-x-0">
            <p className="tabular-nums text-muted-foreground md:pr-4">{formatRange(entry.from, entry.to)}</p>
            <article className="mt-3 md:mt-0">
              <h3 className="text-lede font-semibold">{entry.title}</h3>
              <p className="text-muted-foreground">
                {entry.companyUrl ? (
                  <a href={entry.companyUrl} className="link">
                    {entry.company}
                  </a>
                ) : (
                  entry.company
                )}
                , {entry.location}
              </p>
              <ul className="mt-5 max-w-[64ch] list-disc space-y-3 pl-5 marker:text-muted-foreground">
                {entry.bullets.map((bullet) => (
                  <li key={bullet}>
                    <Rich text={bullet} />
                  </li>
                ))}
              </ul>
              <p className="mt-5 max-w-[64ch] text-caption text-muted-foreground">
                <span className="font-semibold">Stack: </span>
                {entry.stack.join(", ")}
              </p>
            </article>
          </li>
        ))}
      </ol>
    </Section>
  );
}
