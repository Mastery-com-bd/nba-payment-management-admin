"use client";

import { TStudent } from "@/types/student.types";
import { useCallback, useEffect, useState } from "react";
import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover";
import { Button } from "../ui/button";
import { ChevronsUpDown } from "lucide-react";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
} from "../ui/command";
import { studentApi } from "@/lib/api/studentApi";

interface StudentComboboxProps {
  value: string | null;
  onChange: (studentId: string) => void;
  placeholder?: string;
  disabled?: boolean;
}

const STudenTComboBoxProps = ({
  value,
  onChange,
  placeholder = "Select student",
  disabled = false,
}: StudentComboboxProps) => {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [students, setStudents] = useState<TStudent[]>([]);
  const [search, setSearch] = useState("");
  const selectedStudent = students.find((s) => s?.id === value);

  const fetchStudents = useCallback(async (page = 1, searchTerm = "") => {
    setLoading(true);
    try {
      const response = await studentApi.getAllStudents({
        page,
        limit: 20,
        searchTerm: searchTerm || undefined,
      });

      if (response?.success) {
        setStudents(response.data);
      }
    } catch (error) {
      console.error("Failed to fetch students:", error);
    } finally {
      setLoading(false);
    }
  }, []);

  // ✅ Initial fetch
  useEffect(() => {
    fetchStudents();
  }, [fetchStudents]);

  // ✅ Debounced search
  useEffect(() => {
    if (!open) return; // prevent searching when dropdown is closed

    const delay = setTimeout(() => {
      fetchStudents(1, search);
    }, 400);

    return () => clearTimeout(delay);
  }, [search, fetchStudents, open]);

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          disabled={disabled}
          className="w-70 justify-between">
          {selectedStudent?.fullName || placeholder}
          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>

      <PopoverContent className="w-70 p-0">
        <Command shouldFilter={false}>
          <CommandInput
            placeholder="Search student..."
            value={search}
            onValueChange={setSearch}
          />

          <CommandEmpty>
            {loading ? "Searching..." : "No student found"}
          </CommandEmpty>

          <CommandGroup>
            {students.map((student) => (
              <CommandItem
                key={student.id}
                value={student.fullName}
                onSelect={() => {
                  onChange(student.id);
                  setOpen(false);
                }}>
                {student.fullName}
              </CommandItem>
            ))}
          </CommandGroup>
        </Command>
      </PopoverContent>
    </Popover>
  );
};

export default STudenTComboBoxProps;
