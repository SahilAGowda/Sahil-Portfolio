import { useEffect, useState } from "react";
import { useTheme } from "next-themes";
import { cn } from "@/lib/utils";

/** Two labelled buttons, so the choice never depends on colour or an icon alone. */
export function ThemeToggle() {
  const { resolvedTheme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);
  const current = mounted ? resolvedTheme : undefined;

  const option = (value: "light" | "dark", label: string) => (
    <button
      type="button"
      onClick={() => setTheme(value)}
      aria-pressed={current === value}
      className={cn(
        "min-h-11 px-4 text-[0.9375rem] active:translate-y-px",
        current === value
          ? "bg-accent font-semibold text-foreground"
          : "text-muted-foreground hover:bg-accent/60 hover:text-foreground",
      )}
    >
      {label}
    </button>
  );

  return (
    <div role="group" aria-label="Theme" className="inline-flex overflow-hidden rounded-md border border-input">
      {option("light", "Light")}
      {option("dark", "Dark")}
    </div>
  );
}
