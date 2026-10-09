import { SearchButton } from "./SearchButton";

/**
 * Desktop (1024 px and up): the Search button sits at the top right of the page, on the content's right edge, in a
 * strip that stays at the top while the page scrolls. The strip has the page's own colour, so text slides under it
 * instead of running behind the button, and its negative margin cancels its height, so it moves nothing.
 * The strip is 4rem tall, like the line the name sits on in the rail, so Search and the name share one centre line.
 * Phones keep Search in the top bar.
 */
export function TopSearch({ onSearch }: { onSearch: () => void }) {
  return (
    <div data-top-search className="sticky top-0 z-30 -mb-16 hidden h-16 items-center justify-end bg-background lg:flex">
      <SearchButton onClick={onSearch} hint />
    </div>
  );
}
