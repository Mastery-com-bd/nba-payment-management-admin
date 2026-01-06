'use client';

import { studnetPackageApi } from "@/lib/api/AllStudnetPacakgeApi";
import { packageApi } from "@/lib/api/pacakge";
import { ArrowLeft, Eye, Plus, Trash } from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { EditPackageDialog } from "../package/EditPackage";
import { DataTable } from "../shared/DataTable";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "../ui/alert-dialog";
import { Button } from "../ui/button";
import { TStudentPackage } from "@/lib/types/studentPacakges";

export default function AllStudentPackage() {
  const [packages, setPackages] = useState<TStudentPackage[]>([]);
  const [loading, setLoading] = useState(true);
  const [refetch, setRefetch] = useState(false);
  const [packageToDelete, setPackageToDelete] = useState<string | null>(null);

  const [pagination, setPagination] = useState({
    page: 1,
    limit: 10,
    total: 0,
  });

  const fetchPackages = async (page = 1, search = "") => {
    setLoading(true);
    try {
      const response = await studnetPackageApi.getAllStudentPackages({
        page,
        limit: pagination.limit,
        searchTerm: search || undefined,
      });
      if (response?.success) {
        setPackages(response?.data);
        setPagination((prev) => ({
          ...prev,
          page: response.meta?.page || 1,
          total: response.meta?.total || 0,
        }));
      }
    } catch (error) {
      console.error("Failed to fetch packages:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPackages();
  }, [refetch]);

  const handlePageChange = (page: number) => fetchPackages(page);
  const handleSearch = (query: string) => fetchPackages(1, query);

  const confirmDelete = async () => {
    if (!packageToDelete) return;
    try {
      const response = await packageApi.deletePackage(packageToDelete);
      if (response.success) {
        toast.success("Enrollment deleted successfully");
        fetchPackages();
      } else {
        toast.error("Failed to delete");
      }
    } catch (error) {
      toast.error("An error occurred");
    } finally {
      setPackageToDelete(null);
    }
  };


  const columns = [
    {
      key: "studentInfo",
      label: "Student Info",
      render: (row: TStudentPackage) => (
        <div className="flex flex-col">
          <span className="font-bold text-sm ">{row.student?.fullName}</span>
          <span className="text-xs text-muted-foreground">{row.student?.email}</span>
          <span className="text-[10px] text-black bg-gray-100 w-fit px-1 rounded mt-1 font-medium">Batch: {row.student?.batchNo}</span>
        </div>
      ),
    },
    {
      key: "packageName",
      label: "Package",
      render: (row: TStudentPackage) => (
        <div className="flex flex-col">
          <span className="font-medium">{row.package?.name}</span>
          <span className="text-[10px] text-blue-600 font-semibold">{row.package?.packageType}</span>
        </div>
      ),
    },
    {
      key: "discount",
      label: "Discount (৳)",
      render: (row: TStudentPackage) => (
        <span>
          {row.discount}
        </span>
      ),
    },
    {
      key: "financials",
      label: "Financials (৳)",
      render: (row: TStudentPackage) => (
        <div className="text-xs space-y-1">
          <div className="flex justify-between gap-2">
            <span>Payable:</span>
            <span className="font-medium">{row.totalPayable}</span>
          </div>
          <div className="flex justify-between gap-2 text-green-600">
            <span>Paid:</span>
            <span>{row.totalPaid}</span>
          </div>
          <div className="flex justify-between gap-2 text-red-600 font-bold border-t pt-1">
            <span>Due:</span>
            <span>{row.remainingDue}</span>
          </div>
        </div>
      ),
    },
    {
      key: "totalPayments",
      label: "Total Payments",
      render: (row: TStudentPackage) => (
        <div className="text-xs space-y-1 text-center">
          {row._count.payments}
        </div>
      ),
    },
    {
      key: "enrollmentStatus",
      label: "Status",
      render: (row: TStudentPackage) => (
        <span
          className={`px-2 py-1 rounded-full text-[10px] font-bold ${row.status === "ACTIVE"
              ? "bg-green-100 text-green-700"
              : row.status === "EXPIRED"
                ? "bg-orange-100 text-orange-700"
                : "bg-red-100 text-red-700"
            }`}
        >
          {row.status}
        </span>
      ),
    },
    {
      key: "enrollmentDate",
      label: "Enrolled On",
      render: (row: TStudentPackage) => (
        <span className="text-sm">
          {new Date(row.enrollmentDate).toLocaleDateString('en-GB')}
        </span>
      ),
    },
    {
      key: "actions",
      label: "Actions",
      render: (row: TStudentPackage) => (
        <div className="flex items-center space-x-2">
          <Link href={`/student-package/${row.id}`}>
            <Button variant="outline" size="sm" className="h-8 w-8 p-0">
              <Eye className="h-4 w-4" />
            </Button>
          </Link>
          {/* EditPackageDialog এ row pass করা হচ্ছে */}
          <EditPackageDialog pack={row as any} setRefetch={setRefetch} />
          <Button
            variant="outline"
            size="sm"
            className="hover:bg-red-50"
            onClick={() => setPackageToDelete(row.id)}
          >
            <Trash className="h-4 w-4 text-red-600" />
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
            className="p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-all"
          >
            <ArrowLeft className="w-5 h-5" />
          </Link>
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Student Packages</h1>
            <p className="text-muted-foreground text-sm">
              Manage student enrollments, payments, and due amounts.
            </p>
          </div>
        </div>
        <Button asChild>
          <Link href="/package/create">
            <Plus className="h-4 w-4 mr-2" />
            New Enrollment
          </Link>
        </Button>
      </div>

      <DataTable
        data={packages}
        columns={columns}
        searchKey="studentName"
        pagination={{
          ...pagination,
          onPageChange: handlePageChange,
        }}
        onSearch={handleSearch}
        loading={loading}
      />

      {/* Delete Confirmation */}
      <AlertDialog
        open={!!packageToDelete}
        onOpenChange={(open) => !open && setPackageToDelete(null)}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This will permanently delete the student's enrollment and payment records.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={confirmDelete}
              className="bg-red-600 hover:bg-red-700"
            >
              Confirm Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}