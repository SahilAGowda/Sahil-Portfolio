import { defineConfig, type Plugin } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";
import { caseStudyMeta, getCaseStudy } from "./src/data/caseStudies";
import { education } from "./src/data/credentials";
import { experience } from "./src/data/experience";
import { SITE_URL, links, profile, themeColors } from "./src/data/profile";
import { caseStudyProjects } from "./src/data/projects";
import { skillGroups } from "./src/data/skills";

const esc = (value: string) =>
  value.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");

/**
 * Fills index.html from src/data, so the static head, the JSON-LD and the <noscript> text can never drift
 * from the page; preloads the main font; writes sitemap.xml and robots.txt from the same data; and writes
 * one copy of index.html per case study with that page's own title, description, canonical URL and
 * <noscript> text, so link previews and crawlers that do not run JavaScript see the right page.
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
    themeLight: themeColors.light,
    themeDark: themeColors.dark,
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

  /** The built index.html with one case study's head tags and <noscript> text swapped in. */
  const caseStudyHtml = (html: string, slug: string): string => {
    const meta = caseStudyMeta(slug);
    const project = caseStudyProjects.find((entry) => entry.slug === slug);
    const study = getCaseStudy(slug);
    if (!meta || !project || !study) throw new Error(`No case study for ${slug}`);
    const url = `${SITE_URL}${meta.path}`;
    const swap = (from: string, to: string) => {
      if (!html.includes(from)) throw new Error(`index.html is missing "${from}", so ${slug} cannot get its own head`);
      html = html.replace(from, to);
    };
    const [homeTitle, homeDescription, title, description] = [profile.title, profile.description, meta.title, meta.description].map(esc);
    swap(`<title>${homeTitle}</title>`, `<title>${title}</title>`);
    swap(`<meta name="description" content="${homeDescription}" />`, `<meta name="description" content="${description}" />`);
    swap(`<link rel="canonical" href="${SITE_URL}/" />`, `<link rel="canonical" href="${url}" />`);
    swap(`<meta property="og:title" content="${homeTitle}" />`, `<meta property="og:title" content="${title}" />`);
    swap(`<meta property="og:description" content="${homeDescription}" />`, `<meta property="og:description" content="${description}" />`);
    swap(`<meta property="og:url" content="${SITE_URL}/" />`, `<meta property="og:url" content="${url}" />`);
    swap(`<meta name="twitter:title" content="${homeTitle}" />`, `<meta name="twitter:title" content="${title}" />`);
    swap(`<meta name="twitter:description" content="${homeDescription}" />`, `<meta name="twitter:description" content="${description}" />`);
    const noscript = html.match(/<noscript>[\s\S]*?<\/noscript>/);
    if (!noscript) throw new Error("index.html has no <noscript> block");
    return html.replace(
      noscript[0],
      `<noscript>
      <div style="max-width: 40rem; margin: 2rem auto; padding: 0 1rem; font: 1.0625rem/1.6 system-ui, sans-serif">
        <p><a href="/">${esc(profile.name)}</a></p>
        <h1>${esc(project.title)}</h1>
        <p>${esc(meta.description)}</p>
        <p><a href="/#work">Back to work</a></p>
        <p>Turn on JavaScript to read the rest of this case study.</p>
      </div>
    </noscript>`,
    );
  };

  return {
    name: "site-files",
    enforce: "post", // after Vite's own HTML plugin, so the built index.html exists in generateBundle
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
    generateBundle(_options, bundle) {
      this.emitFile({ type: "asset", fileName: "sitemap.xml", source: sitemap });
      this.emitFile({ type: "asset", fileName: "robots.txt", source: robots });

      const index = bundle["index.html"];
      if (!index || index.type !== "asset" || typeof index.source !== "string") throw new Error("The built index.html was not found");
      for (const project of caseStudyProjects) {
        this.emitFile({ type: "asset", fileName: `projects/${project.slug}.html`, source: caseStudyHtml(index.source, project.slug) });
      }
    },
  };
}

// https://vitejs.dev/config/
export default defineConfig({
  server: {
    host: "::",
    port: 8080,
  },
  plugins: [react(), siteFiles()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
});
