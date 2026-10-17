import { useEffect } from "react";
import { SITE_URL } from "@/data/profile";

interface PageMeta {
  title: string;
  description: string;
  /** Path of the page, for example "/" or "/projects/report-search". */
  path: string;
  /** For pages that must stay out of search results, such as the not-found page. */
  noindex?: boolean;
}

function setTag(selector: string, create: () => HTMLElement, attr: string, value: string) {
  let el = document.head.querySelector<HTMLElement>(selector);
  if (!el) {
    el = create();
    document.head.appendChild(el);
  }
  el.setAttribute(attr, value);
}

function meta(attrName: "name" | "property", key: string, value: string) {
  setTag(
    `meta[${attrName}="${key}"]`,
    () => {
      const el = document.createElement("meta");
      el.setAttribute(attrName, key);
      return el;
    },
    "content",
    value,
  );
}

/** Sets the title and the matching meta tags for the current route, by hand (no head library). */
export function usePageMeta({ title, description, path, noindex = false }: PageMeta) {
  useEffect(() => {
    const url = SITE_URL + path;
    document.title = title;
    meta("name", "description", description);
    meta("property", "og:title", title);
    meta("property", "og:description", description);
    meta("property", "og:url", url);
    meta("name", "twitter:title", title);
    meta("name", "twitter:description", description);
    setTag(
      'link[rel="canonical"]',
      () => {
        const el = document.createElement("link");
        el.setAttribute("rel", "canonical");
        return el;
      },
      "href",
      url,
    );
    if (noindex) meta("name", "robots", "noindex");
    else document.head.querySelector('meta[name="robots"]')?.remove();
  }, [title, description, path, noindex]);
}
