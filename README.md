# Sahil A Gowda: portfolio

Source for [sahil-a-gowda-portfolio.vercel.app](https://sahil-a-gowda-portfolio.vercel.app). One page, five case studies with a 3D diagram each, light and dark themes, and a search over everything on the site. Built with Vite, React 18, TypeScript, Tailwind CSS 3, react-router and three.js (on the case-study pages only). Deployed on Vercel.

## Run it

```sh
npm install
npm run dev       # http://localhost:8080
npm run build     # production build in dist/
npm run preview   # serve dist/ locally
npm run lint
```

## Edit the content

All text lives in `src/data`. Components read from there, and nothing is repeated in the JSX.

| File | What it holds |
|---|---|
| `profile.ts` | Name, role, hero line, summary, page title and description, every outbound link, the resume link |
| `experience.ts` | The DIATOZ roles and their bullets |
| `projects.ts` | The project list. Set `caseStudy: true` once a page exists |
| `caseStudies.ts` | The case-study pages: outcome, at a glance, problem, constraints, approach, the steps that walk through the diagram, blockers, results with their sources |
| `diagrams.ts` | The architecture diagrams: nodes, edges (each names the two nodes it joins) and a layout for wide and narrow screens. The flat and the 3D view are both drawn from it |
| `skills.ts`, `credentials.ts` | Skill groups; education, certifications, achievements and coding profiles |

To add a case study, add the project to `projects.ts`, write its page in `caseStudies.ts`, optionally draw a diagram in `diagrams.ts`, and set `caseStudy: true`. The page, its links, the search and the sitemap pick it up. The build fails if an edge or a walkthrough step names a node that the diagram does not have.

The rules the content follows: every number traces to the resume or a README, employer work stays at resume level, and a section without a source is left out. `docs/v2/SOURCES.md` lists where each claim comes from.

## What the build generates

A small plugin in `vite.config.ts` fills the `{{placeholders}}` in `index.html` from `src/data` (title, description, social tags, JSON-LD and the `<noscript>` text), preloads the main font, and writes `sitemap.xml` and `robots.txt`. Change the data and the static head follows.

`public/og.png` is a screenshot of `docs/v2/og-card.html` at 1200 by 630. To redo it, open that page in a browser at that size and save the screenshot over `public/og.png`.

## Notes

- The 3D diagram is `src/components/diagrams/flow3d`: a three.js scene built from the same node and edge data as the flat diagram, with the flat diagram as the fallback (no WebGL, reduced motion, data saving, a failed download). three.js sits in its own chunk that loads only on a case-study page, when the diagram is about to be seen; the home page never loads it. The constants at the top of `scene.ts` set the camera, heights and speeds.
- Fonts are self-hosted from `@fontsource-variable`, Latin subset.
- The theme follows the system setting until a visitor picks Light or Dark. An inline script in `index.html` applies it before first paint.
- `docs/v2` holds the audit, the design plan, the evidence and the before and after screenshots from the 2026 rebuild.
