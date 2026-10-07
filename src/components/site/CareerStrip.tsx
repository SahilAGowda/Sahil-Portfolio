import { education } from "@/data/credentials";
import { experience } from "@/data/experience";
import { formatRange, monthIndex } from "@/data/dates";

// One axis, in whole months: 2022 up to the end of 2026. "Present" bars end at the current month.
const AXIS_START = "2022-01";
const AXIS_MONTHS = 60;
const YEARS = [2022, 2023, 2024, 2025, 2026];

function pct(months: number) {
  return (months / AXIS_MONTHS) * 100;
}

function currentMonth() {
  const now = new Date();
  return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}`;
}

interface Span {
  label: string;
  range: string;
  left: number;
  width: number;
  tone: "study" | "work";
}

function buildSpans(): Span[] {
  const origin = monthIndex(AXIS_START);
  const make = (label: string, range: string, from: string, to: string | null, tone: Span["tone"]): Span => {
    const start = monthIndex(from) - origin;
    const end = monthIndex(to ?? currentMonth()) - origin + 1; // inclusive of the last month
    return { label, range, left: pct(start), width: pct(Math.max(end - start, 1)), tone };
  };

  const degree = education.find((entry) => entry.span);
  const spans: Span[] = [];
  if (degree?.span) {
    spans.push(make("B.E. in Computer Science and Engineering", degree.period, degree.span.from, degree.span.to, "study"));
  }
  for (const entry of [...experience].reverse()) {
    spans.push(make(entry.title, formatRange(entry.from, entry.to), entry.from, entry.to, "work"));
  }
  return spans;
}

/** Three rows on one time axis: the degree, and the two DIATOZ roles that overlap its last months. */
export function CareerStrip() {
  const spans = buildSpans();

  return (
    <div className="mt-10">
      <div aria-hidden="true" className="relative mb-2 hidden h-5 text-caption text-muted-foreground md:ml-[13rem] md:block">
        {YEARS.map((year, i) => (
          <span key={year} className="absolute tabular-nums" style={{ left: `${pct(i * 12)}%` }}>
            {year}
          </span>
        ))}
      </div>
      <ol className="space-y-5 md:space-y-3">
        {spans.map((span) => (
          <li key={span.label + span.range} className="md:grid md:grid-cols-[13rem_1fr] md:items-center">
            <div className="md:pr-4">
              <p className="font-semibold leading-snug">{span.label}</p>
              <p className="text-caption tabular-nums text-muted-foreground">{span.range}</p>
            </div>
            <div aria-hidden="true" className="relative mt-2 h-2 rounded-sm bg-muted md:mt-0">
              <span
                className={`absolute inset-y-0 rounded-sm ${span.tone === "work" ? "bg-primary" : "bg-input"}`}
                style={{ left: `${span.left}%`, width: `${span.width}%` }}
              />
            </div>
          </li>
        ))}
      </ol>
    </div>
  );
}
