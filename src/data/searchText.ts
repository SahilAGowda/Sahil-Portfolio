// Text helpers shared by the search dialog and the on-page highlighter. Pure functions, no React.

/** Lowercase and drop accents, so "cafe" matches "café". Text with precomposed letters keeps its length. */
export function fold(text: string): string {
  return text.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase();
}

/** Folded, de-duplicated words of a query. Words shorter than two characters are ignored. */
export function tokenize(query: string): string[] {
  const words = fold(query)
    .split(/\s+/)
    .filter((word) => word.length >= 2);
  return [...new Set(words)];
}

export interface Segment {
  text: string;
  hit: boolean;
}

/** Splits text into runs, marking every occurrence of any token (case-insensitive). */
export function segment(text: string, tokens: string[]): Segment[] {
  if (!text) return [];
  const lower = fold(text);
  if (!tokens.length || lower.length !== text.length) return [{ text, hit: false }];

  const marked = new Array<boolean>(text.length).fill(false);
  for (const token of tokens) {
    for (let at = lower.indexOf(token); at !== -1; at = lower.indexOf(token, at + token.length)) {
      marked.fill(true, at, at + token.length);
    }
  }

  const runs: Segment[] = [];
  let start = 0;
  for (let i = 1; i <= text.length; i++) {
    if (i === text.length || marked[i] !== marked[start]) {
      runs.push({ text: text.slice(start, i), hit: marked[start] });
      start = i;
    }
  }
  return runs;
}
