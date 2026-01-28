"use client";

import { useSearchParams, usePathname, useRouter } from "next/navigation";

type FilterOption = {
  label: string;
  value: string | number;
};

type FilterProps = {
  paramName: string;
  options: FilterOption[];
  placeholder?: string;
};

export default function Filter({
  paramName,
  options,
  placeholder = "All",
}: FilterProps) {
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const { replace } = useRouter();

  const currentValue = searchParams.get(paramName) || "";

  const handleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const params = new URLSearchParams(searchParams);
    if (e.target.value) {
      params.set(paramName, e.target.value);
    } else {
      params.delete(paramName);
    }
    params.set("page", "1"); // Reset to page 1 when filtering
    replace(`${pathname}?${params.toString()}`);
  };

  return (
    <select
      value={currentValue}
      onChange={handleChange}
      className="bg-[--color-surface] rounded-lg p-1.5 border border-primary/50 text-sm text-text-primary placeholder:text-text-secondary focus:outline-2 focus:outline-primary-light/70 focus:border-transparent transition-all"
    >
      <option value="">{placeholder}</option>
      {options.map((option) => (
        <option key={option.value} value={option.value}>
          {option.label}
        </option>
      ))}
    </select>
  );
}
