"use client";

import { studentApi } from "@/lib/api/studentApi";
import {
  TStudent,
  TStudentStatus,
  TWhatsappStatus,
} from "@/types/student.types";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { Button } from "../ui/button";
import { ArrowLeft, Edit, Eye, Plus, Trash2 } from "lucide-react";
import { Badge, BadgeProps } from "../ui/badge";
import Link from "next/link";
import { DataTable } from "../shared/DataTable";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { adminApi } from "@/lib/api/adminApi";
import { toast } from "sonner";
import { formatDOB } from "@/utills/dateFormat";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "../ui/tooltip";
import CreateStudentModal from "./CreateStudentModal";
import StatusDropdown from "./StatusDropdown";

const STUDENT_STATUSES = [
  "ACTIVE",
  "INACTIVE",
  "BLOCKED",
  "IRREGULAR",
  "FAKED",
] as const;

const WHATSAPP_STATUSES = ["ACTIVE", "INACTIVE", "DONE"] as const;

const Students = () => {
  const [students, setStudents] = useState<TStudent[]>([]);
  const [loading, setLoading] = useState(true);
  const [studentDelete, setStudentDelete] = useState<string | null>(null);
  const router = useRouter();
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 10,
    total: 0,
  });

  const fetchQuizzes = async (page = 1, search = "") => {
    setLoading(true);
    try {
      const response = await studentApi.getAllStudents({
        page,
        limit: pagination.limit,
        searchTerm: search || undefined,
      });
      if (response?.success) {
        setStudents(response?.data);
        setPagination((prev) => ({
          ...prev,
          page: response?.meta?.page || 1,
          total: response?.meta?.total || 0,
        }));
      }
    } catch (error) {
      console.error("Failed to fetch quizzes:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchQuizzes();
  }, []);

  const handlePageChange = (page: number) => {
    fetchQuizzes(page);
  };

  const handleSearch = (query: string) => {
    fetchQuizzes(1, query);
  };

  const handleDeleteClick = (id: string) => {
    setStudentDelete(id);
  };

  const confirmDelete = async () => {
    if (!studentDelete) return;

    try {
      const response = await studentApi.deleteStudent(studentDelete);
      if (response.success) {
        toast.success("student deleted successfully");
        fetchQuizzes();
      } else {
        toast.error("Failed to delete student");
      }
    } catch (error) {
      console.error("Failed to delete student:", error);
      toast.error("Failed to delete student");
    } finally {
      setStudentDelete(null);
    }
  };

  const updateStatus = async (status: TStudentStatus, id: string) => {
    const data = { studentStatus: status };
    try {
      const response = await studentApi.updateStatus(data, id);
      if (response.success) {
        toast.success("student status updated successfully");
        fetchQuizzes();
      } else {
        toast.error("Failed to update student status");
      }
    } catch (error) {
      console.error("Failed to update student status:", error);
      toast.error("Failed to update student status");
    }
  };

  const updateWhatsapp = async (status: TWhatsappStatus, id: string) => {
    const data = { whatsappStatus: status };
    try {
      const response = await studentApi.updateWhatsAppStatus(data, id);
      if (response.success) {
        toast.success("student whatsapp status updated successfully");
        fetchQuizzes();
      } else {
        toast.error("Failed to update student whatsapp status");
      }
    } catch (error) {
      console.error("Failed to update student whatsapp status:", error);
      toast.error("Failed to update student whatsapp status");
    }
  };

  type BadgeVariant = "default" | "secondary" | "destructive" | "outline";

  const studentStatusVariantMap: Record<TStudentStatus, BadgeVariant> = {
    ACTIVE: "default",
    INACTIVE: "secondary",
    BLOCKED: "destructive",
    IRREGULAR: "outline",
    FAKED: "outline",
  };

  const whatsappStatusVariantMap: Record<TWhatsappStatus, BadgeVariant> = {
    ACTIVE: "default",
    INACTIVE: "secondary",
    DONE: "outline",
  };

  const columns = [
    {
      key: "fullName",
      label: "Name",
      render: (studentData: TStudent) => (
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <span className="block max-w-50 truncate cursor-pointer">
                {studentData?.fullName}
              </span>
            </TooltipTrigger>

            <TooltipContent>
              <p>{studentData?.fullName}</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      ),
    },
    {
      key: "email",
      label: "Email",
    },
    {
      key: "gender",
      label: "Gender",
    },
    {
      key: "batchNo",
      label: "Batch",
      render: (student: TStudent) => student.whatsappStatus,
    },
    {
      key: "contactNumber",
      label: "Number",
    },
    {
      key: "profession",
      label: "Profession",
    },
    {
      key: "dateOfBirth",
      label: "DOB",
      render: (student: TStudent) => (
        <span>{formatDOB(student?.dateOfBirth)}</span>
      ),
    },
    {
      key: "studentStatus",
      label: "Status",
      render: (student: TStudent) => (
        <StatusDropdown
          value={student.studentStatus}
          options={STUDENT_STATUSES}
          variantMap={studentStatusVariantMap}
          onChange={(newStatus) => updateStatus(newStatus, student?.id)}
        />
      ),
    },
    {
      key: "whatsappStatus",
      label: "WhatsApp",
      render: (student: TStudent) => (
        <StatusDropdown
          value={student.whatsappStatus}
          options={WHATSAPP_STATUSES}
          variantMap={whatsappStatusVariantMap}
          onChange={(newStatus) => updateWhatsapp(newStatus, student?.id)}
        />
      ),
    },
    {
      key: "actions",
      label: "Actions",
      render: (student: TStudent) => (
        <div className="flex items-center space-x-2">
          <Button variant="outline" size="sm" className="cursor-pointer">
            <Link href={`/students/${student?.id}`}>
              <Eye className="h-4 w-4" />
            </Link>
          </Button>
          <CreateStudentModal student={student} from="edit" />
          <Button
            variant="outline"
            size="sm"
            onClick={() => handleDeleteClick(student?.id)}>
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
      ),
    },
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Link
            href="/analytics"
            className="p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-all">
            <ArrowLeft className="w-5 h-5" />
          </Link>
          <div>
            <h1 className="text-3xl font-bold">All Students</h1>
            <p className="text-muted-foreground">
              Manage All Students with their details
            </p>
          </div>
        </div>
        <CreateStudentModal />
      </div>

      <DataTable
        data={students}
        columns={columns}
        searchKey="student"
        pagination={{
          ...pagination,
          onPageChange: handlePageChange,
        }}
        onSearch={handleSearch}
        loading={loading}
      />

      {/* Delete Confirmation Dialog */}
      <AlertDialog
        open={!!studentDelete}
        onOpenChange={(open) => !open && setStudentDelete(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete the
              student and all associated data from our servers.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={() => setStudentDelete(null)}>
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={confirmDelete}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90">
              Delete Quiz
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default Students;
