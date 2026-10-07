import { defineConfig, type Plugin } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";
import { componentTagger } from "lovable-tagger";
import { education } from "./src/data/credentials";
import { experience } from "./src/data/experience";
import { SITE_URL, links, profile } from "./src/data/profile";
import { caseStudyProjects } from "./src/data/projects";
import { skillGroups } from "./src/data/skills";

const esc = (value: string) =>
  value.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");

/**
 * Fills index.html from src/data, so the static head, the JSON-LD and the <noscript> text can never drift
 * from the page; preloads the main font; and writes sitemap.xml and robots.txt from the same data.
 * `{{name}}` is HTML-escaped, `{{{name}}}` is inserted as is.
 */
function siteFiles(): Plugin {
  const current = experience[0];
  const knowsAbout = skillGroups
    .filter((group) => ["Backend", "Data and search", "AI and agents", "Languages"].includes(group.title))
    .flatMap((group) => group.items)
    // Items the resume qualifies, such as "Redis (basics)", are left out of the structured data.
    .filter((item) => !item.includes("("));

  const person = {
    "@context": "https://schema.org",
    "@type": "Person",
    name: profile.name,
    url: SITE_URL,
    image: `${SITE_URL}${profile.photo.base}.jpg`,
    jobTitle: current.title,
    worksFor: { "@type": "Organization", name: current.company },
    address: { "@type": "PostalAddress", addressLocality: "Bengaluru", addressCountry: "IN" },
    alumniOf: { "@type": "CollegeOrUniversity", name: education[0].institution },
    sameAs: [links.linkedin.href, links.github.href],
    knowsAbout,
  };

  const noscriptLinks = [
    [`mailto:${profile.contact.email}`, "Email"],
    [profile.resume.href, profile.resume.label],
    [links.linkedin.href, links.linkedin.label],
    [links.github.href, links.github.label],
  ]
    .map(([href, label]) => `<li><a href="${esc(href)}">${esc(label)}</a></li>`)
    .join("");

  const text: Record<string, string> = {
    siteUrl: SITE_URL,
    title: profile.title,
    description: profile.description,
    headline: profile.headline,
    name: profile.name,
    role: profile.role,
    summary: profile.summary,
    location: profile.contact.location,
  };
  const raw: Record<string, string> = {
    // "<" is escaped so the JSON can never close the script element early.
    jsonLd: JSON.stringify(person).replace(/</g, "\\u003c"),
    noscriptLinks,
  };

  const urls = ["/", ...caseStudyProjects.map((project) => `/projects/${project.slug}`)];
  const sitemap =
    `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n` +
    urls.map((url) => `  <url><loc>${SITE_URL}${url === "/" ? "/" : url}</loc></url>\n`).join("") +
    `</urlset>\n`;
  const robots = `User-agent: *\nAllow: /\n\nSitemap: ${SITE_URL}/sitemap.xml\n`;

  return {
    name: "site-files",
    transformIndexHtml(html, ctx) {
      const filled = html.replace(/\{\{\{(\w+)\}\}\}|\{\{(\w+)\}\}/g, (_match, rawKey: string, textKey: string) => {
        const value = rawKey ? raw[rawKey] : text[textKey];
        if (value === undefined) throw new Error(`index.html uses an unknown token: ${rawKey ?? textKey}`);
        return rawKey ? value : esc(value);
      });

      // Preload the main font once its hashed file name is known (production build only).
      const font = ctx.bundle && Object.keys(ctx.bundle).find((file) => /atkinson-hyperlegible-next-latin-wght-normal-.*\.woff2$/.test(file));
      if (!font) return filled;
      return {
        html: filled,
        tags: [{ tag: "link", attrs: { rel: "preload", as: "font", type: "font/woff2", href: `/${font}`, crossorigin: "" }, injectTo: "head" }],
      };
    },
    generateBundle() {
      this.emitFile({ type: "asset", fileName: "sitemap.xml", source: sitemap });
      this.emitFile({ type: "asset", fileName: "robots.txt", source: robots });
    },
  };
}

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => ({
  server: {
    host: "::",
    port: 8080,
  },
  plugins: [
    react(),
    siteFiles(),
    mode === 'development' &&
    componentTagger(),
  ].filter(Boolean),
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
}));
