interface CheckboxGroupProps {
  options: { id: string; name: string }[];
  selected: string[];
  onChange: (ids: string[]) => void;
}

export const CheckboxGroup = ({
  options,
  selected,
  onChange,
}: CheckboxGroupProps) => {
  const toggle = (id: string) => {
    const updated = selected.includes(id)
      ? selected.filter((i) => i !== id)
      : [...selected, id];
    onChange(updated);
  };

  return (
    <div className="flex flex-col gap-1">
      {options.map((opt) => (
        <label key={opt.id} className="flex items-center gap-2 text-sm">
          <input
            type="checkbox"
            checked={selected.includes(opt.id)}
            onChange={() => toggle(opt.id)}
          />
          {opt.name}
        </label>
      ))}
    </div>
  );
};
