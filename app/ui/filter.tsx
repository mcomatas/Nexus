"use client";

import { useState } from "react";
import { useSearchParams, usePathname, useRouter } from "next/navigation";
import { IoIosArrowDown } from "react-icons/io";

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
  const currentLabel =
    options.find((opt) => String(opt.value) === currentValue)?.label ||
    placeholder;

  const handleSelect = (value: string) => {
    const params = new URLSearchParams(searchParams);
    if (value) {
      params.set(paramName, value);
    } else {
      params.delete(paramName);
    }
    params.set("page", "1");
    params.set("query", "");
    replace(`${pathname}?${params.toString()}`);
  };

  return (
    <div className="relative inline-block group text-sm">
      <p className="flex items-center px-1.5 py-2 text-left w-full">
        {currentLabel}
        <IoIosArrowDown className="ml-0.5 group-hover:-rotate-180 duration-200 transition-transform" />
      </p>
      <div className="hidden group-hover:flex flex-col absolute pt-1 pb-1 bg-surface rounded-sm whitespace-nowrap">
        <span
          onClick={() => handleSelect("")}
          className="px-4 py-2 text-sm text-text-primary hover:bg-primary/70 cursor-pointer"
        >
          All
        </span>
        {options.map((option) => (
          <span
            key={option.value}
            onClick={() => handleSelect(String(option.value))}
            className="px-4 py-2 text-sm text-text-primary hover:bg-primary/70 cursor-pointer"
          >
            {option.label}
          </span>
        ))}
      </div>
    </div>
  );
}
