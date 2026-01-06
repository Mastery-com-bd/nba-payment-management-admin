"use client"

import { studentApi } from "@/lib/api/studentApi";
import { TStudentEnrollment } from "@/types/student.types";
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

interface TEnrolStudent {
  value: string | null;
  onChange: (studentId: string) => void;
  placeholder?: string;
  disabled?: boolean;
  studentId: string
}

const EnrollMentComboBox = ({
  value,
  onChange,
  placeholder = "Select enrollment",
  disabled = false,
  studentId
}: TEnrolStudent) => {
     const [open, setOpen] = useState(false);
      const [loading, setLoading] = useState(true);
      const [enroleMent, setEnrolement] = useState<TStudentEnrollment[]>([]);
      const [search, setSearch] = useState("");

      const selectedEnroleMent = enroleMent.find((s) => s?.id === value);

      const fetchStudents = useCallback(
        async (page = 1, searchTerm = "") => {
          setLoading(true);
          try {
            const response = await studentApi.getASTudentEnrolment(studentId);

            if (response?.success) {
              setEnrolement(response?.data);
            }
          } catch (error) {
            console.error("Failed to fetch students:", error);
          } finally {
            setLoading(false);
          }
        },
        [studentId],
      );
    
      // ✅ Initial fetch
      useEffect(() => {
        fetchStudents();
      }, [fetchStudents, studentId]);
    

 
  return (
    <div>
      {studentId && (
        <Popover open={open} onOpenChange={setOpen}>
          <PopoverTrigger asChild>
            <Button
              variant="outline"
              role="combobox"
              aria-expanded={open}
              disabled={disabled}
              className="w-70 justify-between">
              {selectedEnroleMent?.package?.name || placeholder}
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
                {enroleMent.map((enroll) => (
                  <CommandItem
                    key={enroll?.id}
                    value={enroll?.package?.name}
                    onSelect={() => {
                      onChange(enroll.id);
                      setOpen(false);
                    }}>
                    {enroll?.package?.name}
                  </CommandItem>
                ))}
              </CommandGroup>
            </Command>
          </PopoverContent>
        </Popover>
      )}
    </div>
  );
};

export default EnrollMentComboBox;