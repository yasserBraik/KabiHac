import { useId, useRef, type KeyboardEvent, type ReactNode } from "react";
import { controls } from "./controls";

export interface TabItem<T extends string> {
  readonly id: T;
  readonly label: string;
  readonly count?: number | undefined;
  readonly content: ReactNode;
}

interface Props<T extends string> {
  readonly label: string;
  readonly items: readonly TabItem<T>[];
  readonly selected: T;
  readonly onSelect: (id: T) => void;
  readonly listClassName?: string | undefined;
  readonly panelClassName?: string | undefined;
}

/** WAI-ARIA tabs with automatic activation, roving tabindex, arrow keys, Home and End. */
export function Tabs<T extends string>({
  label,
  items,
  selected,
  onSelect,
  listClassName,
  panelClassName,
}: Props<T>) {
  const base = useId();
  const refs = useRef(new Map<T, HTMLButtonElement>());
  const tabId = (id: T) => `${base}-tab-${id}`;
  const panelId = (id: T) => `${base}-panel-${id}`;

  const onKeyDown = (event: KeyboardEvent, index: number) => {
    const last = items.length - 1;
    const next = { ArrowRight: index + 1, ArrowLeft: index - 1, Home: 0, End: last }[event.key];
    if (next === undefined) return;
    event.preventDefault();
    const target = items[(next + items.length) % items.length];
    if (!target) return;
    onSelect(target.id);
    refs.current.get(target.id)?.focus();
  };

  return (
    <>
      <div role="tablist" aria-label={label} className={listClassName}>
        {items.map((item, index) => {
          const isSelected = item.id === selected;
          return (
            <button
              key={item.id}
              ref={(node) => {
                if (node) refs.current.set(item.id, node);
                else refs.current.delete(item.id);
              }}
              type="button"
              role="tab"
              id={tabId(item.id)}
              aria-selected={isSelected}
              aria-controls={panelId(item.id)}
              tabIndex={isSelected ? 0 : -1}
              className={controls.chip}
              onClick={() => onSelect(item.id)}
              onKeyDown={(event) => onKeyDown(event, index)}
            >
              {item.label}
              {item.count !== undefined && <span className={controls.count}>{item.count}</span>}
            </button>
          );
        })}
      </div>
      {items.map((item) => (
        <div
          key={item.id}
          role="tabpanel"
          id={panelId(item.id)}
          aria-labelledby={tabId(item.id)}
          hidden={item.id !== selected}
          className={panelClassName}
        >
          {item.id === selected && item.content}
        </div>
      ))}
    </>
  );
}
