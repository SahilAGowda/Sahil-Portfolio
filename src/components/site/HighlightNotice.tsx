/** Shown while a search term is highlighted on the page, docked to the bottom so it is in view wherever the hit is. */
export function HighlightNotice({ query, onClear }: { query: string; onClear: () => void }) {
  return (
    <div
      role="status"
      data-search-skip
      className="fixed inset-x-4 bottom-4 z-40 mx-auto flex max-w-lg items-center justify-between gap-4 rounded-md border border-input bg-popover py-1 pl-4 pr-2 text-caption text-popover-foreground"
    >
      <span className="min-w-0 break-words">Highlighting “{query}”</span>
      <button type="button" onClick={onClear} className="link inline-flex min-h-11 shrink-0 items-center whitespace-nowrap px-2">
        Clear highlights
      </button>
    </div>
  );
}
