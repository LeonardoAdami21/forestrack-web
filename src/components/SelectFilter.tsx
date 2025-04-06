interface SelectFilterProps {
  options: { id: string; name: string }[];
  value: string;
  onChange: (value: string) => void;
}

export const SelectFilter = ({
  options,
  value,
  onChange,
}: SelectFilterProps) => {
  return (
    <select
      value={value}
      onChange={(e) => onChange(e.target.value)}
      className="border p-2 rounded w-full"
    >
      <option value="">Todos os modelos</option>
      {options.map((opt) => (
        <option key={opt.id} value={opt.id}>
          {opt.name}
        </option>
      ))}
    </select>
  );
};
