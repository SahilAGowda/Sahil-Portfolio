import { education } from "@/data/credentials";
import { experience } from "@/data/experience";
import { formatRange, monthIndex } from "@/data/dates";

function currentMonth() {
  const now = new Date();
  return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}`;
}

interface Span {
  label: string;
  range: string;
  /** First month and last month, inclusive, counted from year 0. */
  start: number;
  end: number;
  tone: "study" | "work";
}

function buildSpans(): Span[] {
  const make = (label: string, range: string, from: string, to: string | null, tone: Span["tone"]): Span => ({
    label,
    range,
    start: monthIndex(from),
    end: monthIndex(to ?? currentMonth()),
    tone,
  });

  const degree = education.find((entry) => entry.span);
  const spans: Span[] = [];
  if (degree?.span) spans.push(make(degree.degree, degree.period, degree.span.from, degree.span.to, "study"));
  for (const entry of [...experience].reverse()) {
    spans.push(make(entry.title, formatRange(entry.from, entry.to), entry.from, entry.to, "work"));
  }
  return spans;
}

/**
 * Rows on one time axis: the degree, and the two DIATOZ roles that overlap its last months.
 * The axis runs from January of the first year to the end of the last one, so it follows the data
 * (and the current month, for a role that is still going) instead of a fixed range.
 */
export function CareerStrip() {
  const spans = buildSpans();
  const axisStart = Math.floor(Math.min(...spans.map((span) => span.start)) / 12) * 12;
  const axisEnd = Math.ceil((Math.max(...spans.map((span) => span.end)) + 1) / 12) * 12;
  const axisMonths = axisEnd - axisStart;
  const years = Array.from({ length: (axisEnd - axisStart) / 12 }, (_, i) => axisStart / 12 + i);
  const pct = (months: number) => (months / axisMonths) * 100;

  return (
    <div className="mt-10">
      <div aria-hidden="true" className="relative mb-2 hidden h-5 text-caption text-muted-foreground md:ml-[13rem] md:block">
        {years.map((year) => (
          <span key={year} className="absolute tabular-nums" style={{ left: `${pct(year * 12 - axisStart)}%` }}>
            {year}
          </span>
        ))}
      </div>
      <ol className="space-y-5 md:space-y-3">
        {spans.map((span) => {
          const left = pct(span.start - axisStart);
          const width = Math.min(100 - left, pct(span.end - span.start + 1)); // the last month is included
          return (
            <li key={span.label + span.range} className="md:grid md:grid-cols-[13rem_1fr] md:items-center">
              <div className="md:pr-4">
                <p className="font-semibold leading-snug">{span.label}</p>
                <p className="text-caption tabular-nums text-muted-foreground">{span.range}</p>
              </div>
              <div aria-hidden="true" className="relative mt-2 h-2 rounded-sm bg-muted md:mt-0">
                <span
                  className={`absolute inset-y-0 rounded-sm ${span.tone === "work" ? "bg-primary" : "bg-input"}`}
                  style={{ left: `${left}%`, width: `${width}%` }}
                />
              </div>
            </li>
          );
        })}
      </ol>
    </div>
  );
}
