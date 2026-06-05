import { ArrowDownIcon, ArrowUpIcon } from "./Icons";

interface IncrementableValueProps {
  label?: string;
  value: number;
  setValue: (value: number, key?: any) => void;
  min: number;
  max: number;
  disabled?: boolean;
  mapKey?: any;
  btnColor?: string;
}

export function IncrementableValue({
  label,
  value,
  setValue,
  min,
  max,
  disabled = false,
  mapKey,
  btnColor = "var(--accent)",
}: IncrementableValueProps) {
  function handleIncrement(newValue: number) {
    if (isNaN(newValue)) return;

    // Allow the value to equal max or min, but not cross them
    if (newValue > max || newValue < min) return;

    setValue(newValue, mapKey);
  }

  return (
    <div className="flex h-[30px] max-w-[95px] items-center justify-between">
      <span className="max-w-[85px] text-left text-sm text-[var(--text-secondary)]">
        {value} {label}
      </span>
      <div className="ml-2 flex cursor-default flex-col">
        <button
          type="button"
          className="my-0.5 flex h-[12px] w-[12px] cursor-pointer items-center justify-center rounded disabled:cursor-default disabled:opacity-50"
          style={{ backgroundColor: btnColor }}
          onClick={(e) => {
            e.stopPropagation();
            handleIncrement(value + 1);
          }}
          disabled={disabled || value >= max}
          aria-label={`Increment ${label}`}
        >
          <ArrowUpIcon color="black" />
        </button>
        <button
          type="button"
          className="my-0.5 flex h-[12px] w-[12px] cursor-pointer items-center justify-center rounded disabled:cursor-default disabled:opacity-50"
          style={{ backgroundColor: btnColor }}
          onClick={(e) => {
            e.stopPropagation();
            handleIncrement(value - 1);
          }}
          disabled={disabled || value <= min}
          aria-label={`Decrement ${label}`}
        >
          <ArrowDownIcon color="black" />
        </button>
      </div>
    </div>
  );
}
