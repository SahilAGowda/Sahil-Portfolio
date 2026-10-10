import { Color, SRGBColorSpace } from "three";
import type { NodeKind } from "@/data/diagrams";

/** The site's colour tokens, read from CSS so the 3D view follows the light and dark themes. */
export interface FlowPalette {
  background: Color;
  foreground: Color;
  muted: Color;
  mutedForeground: Color;
  border: Color;
  /** Stroke colour of each node kind: the same colours the flat diagrams use. */
  kind: Record<NodeKind, Color>;
  dark: boolean;
}

function token(style: CSSStyleDeclaration, name: string, fallback: [number, number, number]): Color {
  const parts = style.getPropertyValue(name).trim().split(/\s+/).map(parseFloat);
  const [h, s, l] = parts.length === 3 && parts.every(Number.isFinite) ? parts : fallback;
  return new Color().setHSL(h / 360, s / 100, l / 100, SRGBColorSpace);
}

export function readPalette(): FlowPalette {
  const style = getComputedStyle(document.documentElement);
  return {
    background: token(style, "--background", [80, 16, 96]),
    foreground: token(style, "--foreground", [206, 14, 10]),
    muted: token(style, "--muted", [84, 13, 92]),
    mutedForeground: token(style, "--muted-foreground", [208, 10, 37]),
    border: token(style, "--border", [90, 8, 85]),
    kind: {
      flow: token(style, "--flow", [224, 76, 48]),
      store: token(style, "--store", [26, 90, 37]),
      model: token(style, "--model", [263, 70, 50]),
      plain: token(style, "--muted-foreground", [208, 10, 37]),
    },
    dark: document.documentElement.classList.contains("dark"),
  };
}
