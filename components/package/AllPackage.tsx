'use client';
import { packageApi } from "@/lib/api/pacakge";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "../ui/alert-dialog";
import Link from "next/link";
import { ArrowLeft, Eye, Plus, Trash } from "lucide-react";
import { Button } from "../ui/button";
import { DataTable } from "../shared/DataTable";
import { EditPackageDialog } from "./EditPackage";
import { TPackage } from "@/types/pacakge.types";

export default function AllPackage() {
  const [packages, setPackages] = useState<TPackage[]>([]);
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
      const response = await packageApi.getAllPacakges({
        page,
        limit: pagination.limit,
        searchTerm: search || undefined,
      });
      if (response?.success) {
        setPackages(response?.data)
        setPagination((prev) => ({
          ...prev,
          page: response.meta?.page || 1,
          total: response.meta?.total || 0,
        }));
      }
    } catch (error) {
      console.error("Failed to fetch quizzes:", error);
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    fetchPackages();
  }, [refetch]);

  const handlePageChange = (page: number) => {
    fetchPackages(page);
  };

  const handleSearch = (query: string) => {
    fetchPackages(1, query);
  };

  const handleDeleteClick = (id: string) => {
    setPackageToDelete(id);
  };

  const confirmDelete = async () => {
    if (!packageToDelete) return;

    try {
      const response = await packageApi.deletePackage(packageToDelete);
      if (response.success) {
        toast.success("Package deleted successfully");
        fetchPackages();
      } else {
        toast.error("Failed to delete quiz");
      }
    } catch (error) {
      console.error("Failed to delete quiz:", error);
      toast.error("Failed to delete quiz");
    } finally {
      setPackageToDelete(null);
    }
  };

  const columns = [
  {
    key: "name",
    label: "Package Name",
  },
  {
    key: "packageType",
    label: "Type",
  },
  {
    key: "packagePrice",
    label: "Price",
    render: (pkg: TPackage) => `৳ ${pkg.packagePrice}`,
  },
  {
    key: "consultancyType",
    label: "Consultancy",
  },
  {
    key: "durationInMonths",
    label: "Duration",
    render: (pkg: TPackage) => `${pkg.durationInMonths} months`,
  },
  {
    key: "enrollments",
    label: "Enrollments",
    render: (pkg: TPackage) => (
      <span className="font-medium">
        {pkg._count?.enrollments ?? 0}
      </span>
    ),
  },
  {
    key: "packageStatus",
    label: "Status",
    render: (pkg: TPackage) => (
      <span
        className={`px-2 py-1 rounded text-xs font-medium ${
          pkg.packageStatus === "ACTIVE"
            ? "bg-green-100 text-green-700"
            : "bg-red-100 text-red-700"
        }`}
      >
        {pkg.packageStatus}
      </span>
    ),
  },
  {
    key: "actions",
    label: "Actions",
    render: (pkg: TPackage) => (
      <div className="flex items-center space-x-2">
        <Link href={`/package/${pkg.id}`}>
          <Button variant="outline" size="sm">
           <Eye/>
          </Button>
        </Link>
        <EditPackageDialog pack={pkg} setRefetch={setRefetch} />
        <Button
          variant="outline"
          size="sm"
          onClick={() => handleDeleteClick(pkg.id)}
        >
          <Trash className="text-red-600 cursor-pointer"/>
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
            <h1 className="text-3xl font-bold">Packages</h1>
            <p className="text-muted-foreground">
              Manage package content and settings
            </p>
          </div>
        </div>
        <Button asChild>
          <Link href="/package/create">
            <Plus className="h-4 w-4 mr-2" />
            Create Package
          </Link>
        </Button>
      </div>

      <DataTable
        data={packages}
        columns={columns}
        searchKey="quizzes"
        pagination={{
          ...pagination,
          onPageChange: handlePageChange,
        }}
        onSearch={handleSearch}
        loading={loading}
      />

      {/* Delete Confirmation Dialog */}
      <AlertDialog
        open={!!packageToDelete}
        onOpenChange={(open) => !open && setPackageToDelete(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete the
              quiz and all associated questions and data from our servers.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={() => setPackageToDelete(null)}>
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
  )
}