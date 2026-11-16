import { controls } from "./controls";

export interface FilterOption<T extends string> {
  readonly value: T;
  readonly label: string;
  readonly count?: number | undefined;
}

interface Props<T extends string> {
  readonly label: string;
  readonly options: readonly FilterOption<T>[];
  readonly value: T;
  readonly onChange: (value: T) => void;
  readonly prefix?: string | undefined;
  readonly className?: string | undefined;
}

/** A row of mutually exclusive toggle buttons (aria-pressed), used for filtering lists. */
export function FilterGroup<T extends string>({
  label,
  options,
  value,
  onChange,
  prefix,
  className,
}: Props<T>) {
  return (
    <div role="group" aria-label={label} className={className}>
      {prefix && <span aria-hidden="true">{prefix}</span>}
      {options.map((option) => (
        <button
          key={option.value}
          type="button"
          className={controls.chip}
          aria-pressed={option.value === value}
          onClick={() => onChange(option.value)}
        >
          {option.label}
          {option.count !== undefined && <span className={controls.count}>{option.count}</span>}
        </button>
      ))}
    </div>
  );
}
