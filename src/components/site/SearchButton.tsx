import { cn } from "@/lib/utils";

/** Starts loading the dialog's code before the first click. */
const preload = () => void import("./SearchDialog");

interface SearchButtonProps {
  onClick: () => void;
  /** Show the "/" shortcut hint (desktop, top right). */
  hint?: boolean;
  className?: string;
}

export function SearchButton({ onClick, hint, className }: SearchButtonProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      onPointerEnter={preload}
      onFocus={preload}
      aria-haspopup="dialog"
      aria-keyshortcuts="/"
      className={cn(
        "inline-flex min-h-11 items-center justify-between gap-3 rounded-md border border-input px-4 text-[0.9375rem] hover:bg-accent active:translate-y-px",
        className,
      )}
    >
      Search
      {hint && (
        <kbd aria-hidden="true" className="rounded border border-input px-1.5 font-sans text-caption leading-snug text-muted-foreground">
          /
        </kbd>
      )}
    </button>
  );
}
