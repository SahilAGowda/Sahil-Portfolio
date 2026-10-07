import { useEffect } from "react";
import { tokenize } from "@/data/searchText";

const HIGHLIGHT_NAME = "search";

/**
 * Highlights every match of `query` inside the page's main area with the CSS Custom Highlight API,
 * which paints over text without changing the DOM (so React is never fighting a wrapped text node).
 * Browsers without the API still get the search results and the jump to the section.
 */
export function useSearchHighlight(query: string | null) {
  useEffect(() => {
    const registry = typeof CSS !== "undefined" && "highlights" in CSS ? CSS.highlights : undefined;
    if (!registry || typeof Highlight === "undefined") return;

    const tokens = query ? tokenize(query) : [];
    const root = document.getElementById("content");
    if (!tokens.length || !root) {
      registry.delete(HIGHLIGHT_NAME);
      return;
    }

    let frame = 0;
    const paint = () => {
      frame = 0;
      const ranges: Range[] = [];
      const walker = document.createTreeWalker(root, NodeFilter.SHOW_TEXT);
      for (let node = walker.nextNode(); node; node = walker.nextNode()) {
        if (node.parentElement?.closest("svg, script, style, .sr-only, [data-search-skip]")) continue;
        const lower = (node as Text).data.toLowerCase();
        for (const token of tokens) {
          for (let at = lower.indexOf(token); at !== -1; at = lower.indexOf(token, at + token.length)) {
            const range = new Range();
            range.setStart(node, at);
            range.setEnd(node, at + token.length);
            ranges.push(range);
          }
        }
      }
      registry.set(HIGHLIGHT_NAME, new Highlight(...ranges));
    };
    const schedule = () => {
      if (!frame) frame = window.requestAnimationFrame(paint);
    };

    paint();
    // The route's content can arrive after this effect runs (lazy pages), so repaint when it changes.
    const observer = new MutationObserver(schedule);
    observer.observe(root, { childList: true, subtree: true, characterData: true });

    return () => {
      observer.disconnect();
      if (frame) window.cancelAnimationFrame(frame);
      registry.delete(HIGHLIGHT_NAME);
    };
  }, [query]);
}
