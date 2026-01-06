"use client"

import { Badge } from "../ui/badge";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "../ui/dropdown-menu";

type StatusDropdownProps<T extends string> = {
  value: T;
  options: readonly T[];
  variantMap: Record<T, "default" | "secondary" | "destructive" | "outline">;
  onChange: (value: T) => void;
};

const StatusDropdown = <T extends string>({
  value,
  options,
  variantMap,
  onChange,
}: StatusDropdownProps<T>) => {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Badge
          variant={variantMap[value]}
          className="cursor-pointer hover:opacity-80">
          {value}
        </Badge>
      </DropdownMenuTrigger>

      <DropdownMenuContent align="start">
        {options.map((option) => (
          <DropdownMenuItem key={option} onClick={() => onChange(option)}>
            {option}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default StatusDropdown;