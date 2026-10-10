import { useEffect, useId, useMemo, useRef, useState } from "react";
import type { KeyboardEvent } from "react";
import { Link, useNavigate } from "react-router-dom";
import { searchSite, type SearchHit } from "@/data/search";
import { tokenize } from "@/data/searchText";

const suggestions = ["Spring Batch", "Elasticsearch", "RAG", "WhatsApp"];

function targetFor(hit: SearchHit, query: string) {
  return {
    pathname: hit.entry.path,
    search: `?q=${encodeURIComponent(query.trim())}`,
    hash: hit.entry.hash ? `#${hit.entry.hash}` : "",
  };
}

/** A modal search over everything the site says. Mounted only while open, so it loads on demand. */
export default function SearchDialog({ onClose }: { onClose: () => void }) {
  const dialogRef = useRef<HTMLDialogElement>(null);
  const pressStartedOnBackdrop = useRef(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const listRef = useRef<HTMLUListElement>(null);
  const [query, setQuery] = useState("");
  const navigate = useNavigate();
  const titleId = useId();

  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;
    dialog.showModal();
    inputRef.current?.focus();
    const overflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = overflow;
      if (dialog.open) dialog.close();
    };
  }, []);

  const trimmed = query.trim();
  const tokens = tokenize(query);
  const { hits, total } = useMemo(() => searchSite(query), [query]);

  let status = "";
  if (trimmed && !tokens.length) status = "Type at least two letters.";
  else if (tokens.length && total === 0) status = `No mention of “${trimmed}” on this site.`;
  else if (total > 0) status = `${total} ${total === 1 ? "result" : "results"}${total > hits.length ? `, showing the best ${hits.length}` : ""}.`;

  const close = () => dialogRef.current?.close();

  const go = (hit: SearchHit) => {
    navigate(targetFor(hit, query));
    close();
  };

  const onInputKey = (event: KeyboardEvent<HTMLInputElement>) => {
    if (event.key === "Enter" && hits[0]) {
      event.preventDefault();
      go(hits[0]);
    } else if (event.key === "ArrowDown") {
      event.preventDefault();
      listRef.current?.querySelector("a")?.focus();
    }
  };

  const onListKey = (event: KeyboardEvent<HTMLUListElement>) => {
    if (event.key !== "ArrowDown" && event.key !== "ArrowUp") return;
    event.preventDefault();
    const links = [...event.currentTarget.querySelectorAll("a")];
    const at = links.indexOf(document.activeElement as HTMLAnchorElement);
    const next = event.key === "ArrowDown" ? at + 1 : at - 1;
    if (next < 0) inputRef.current?.focus();
    else links[Math.min(next, links.length - 1)]?.focus();
  };

  return (
    <dialog
      ref={dialogRef}
      aria-labelledby={titleId}
      onClose={onClose}
      onPointerDown={(event) => {
        pressStartedOnBackdrop.current = event.target === event.currentTarget;
      }}
      onClick={(event) => {
        // A drag that starts in the field and ends on the backdrop must not close the dialog.
        if (event.target === event.currentTarget && pressStartedOnBackdrop.current) close();
      }}
      className="m-0 mx-auto mt-4 max-h-[calc(100dvh-2rem)] w-[calc(100%-2rem)] max-w-xl flex-col rounded-md border border-input bg-popover p-0 text-popover-foreground backdrop:bg-background/80 open:flex sm:mt-[10vh] sm:max-h-[80vh]"
    >
      <div className="flex items-center justify-between gap-4 px-5 pt-3">
        <h2 id={titleId} className="text-lede font-semibold">
          Search this site
        </h2>
        <button type="button" onClick={close} className="link inline-flex min-h-11 items-center">
          Close
        </button>
      </div>

      <div className="px-5">
        <label htmlFor={`${titleId}-q`} className="sr-only">
          Search this site
        </label>
        <input
          ref={inputRef}
          id={`${titleId}-q`}
          type="search"
          value={query}
          onChange={(event) => setQuery(event.target.value)}
          onKeyDown={onInputKey}
          autoComplete="off"
          spellCheck={false}
          aria-describedby={`${titleId}-status`}
          className="mt-1 min-h-11 w-full rounded-md border border-input bg-background px-3 text-body"
        />
        <p id={`${titleId}-status`} role="status" className="mt-2 min-h-6 text-caption text-muted-foreground">
          {status}
        </p>
      </div>

      <div className="min-h-0 flex-1 overflow-y-auto px-5 pb-5">
        {hits.length > 0 ? (
          <ul ref={listRef} onKeyDown={onListKey} className="divide-y divide-border">
            {hits.map((hit, i) => (
              <li key={`${hit.entry.where}-${hit.entry.title}-${i}`}>
                <Link
                  to={targetFor(hit, query)}
                  onClick={close}
                  className="block min-h-11 py-3 no-underline hover:bg-accent/60"
                >
                  <span className="block text-caption text-muted-foreground">{hit.entry.where}</span>
                  {hit.entry.title && <span className="block font-semibold">{hit.entry.title}</span>}
                  <span className="block">
                    {hit.snippet.map((run, j) => (run.hit ? <mark key={j}>{run.text}</mark> : run.text))}
                  </span>
                </Link>
              </li>
            ))}
          </ul>
        ) : (
          !trimmed && (
            <p className="flex flex-wrap items-center gap-x-2">
              <span className="text-muted-foreground">Try</span>
              {suggestions.map((term) => (
                <button
                  key={term}
                  type="button"
                  onClick={() => {
                    setQuery(term);
                    inputRef.current?.focus();
                  }}
                  className="link inline-flex min-h-11 items-center px-1"
                >
                  {term}
                </button>
              ))}
            </p>
          )
        )}
      </div>
    </dialog>
  );
}
