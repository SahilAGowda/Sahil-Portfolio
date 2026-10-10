const monthYear = new Intl.DateTimeFormat("en", { month: "short", year: "numeric" });

/** "2025-10" becomes "Oct 2025". A bare year stays a year. */
function formatMonth(iso: string): string {
  const [year, month] = iso.split("-").map(Number);
  if (!month) return String(year);
  return monthYear.format(new Date(year, month - 1, 1));
}

/** Months since year 0, so two ISO dates can be compared on one axis. */
export function monthIndex(iso: string): number {
  const [year, month] = iso.split("-").map(Number);
  return year * 12 + ((month ?? 1) - 1);
}

/** "Oct 2025 to May 2026", or "May 2026 to present" when `to` is null. */
export function formatRange(from: string, to: string | null): string {
  return `${formatMonth(from)} to ${to ? formatMonth(to) : "present"}`;
}
