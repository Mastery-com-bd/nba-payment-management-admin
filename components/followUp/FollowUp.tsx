"use client"

import { followUpApi } from "@/lib/api/followUpApi";
import { TFollowUpALlData } from "@/types/followUpTypes";
import { useEffect, useState } from "react";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "../ui/tooltip";
import { toast } from "sonner";
import { Button } from "../ui/button";
import Link from "next/link";
import { ArrowLeft, Eye, Trash2 } from "lucide-react";
import CreateFollowUp from "../students/CreateFollowUp";
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
import { formatDOB } from "@/utills/dateFormat";

const FollowUp = () => {
      const [followUps, setFollowUps] = useState<TFollowUpALlData[]>([]);
      const [loading, setLoading] = useState(true);
      const [followUpDelete, setFollowUpDelete] = useState<string | null>(null);
      const [pagination, setPagination] = useState({
        page: 1,
        limit: 10,
        total: 0,
      });

      const fetchFollowUp = async (page = 1, search = "") => {
        setLoading(true);
        try {
          const response = await followUpApi.getAllFollowUps({
            page,
            limit: pagination.limit,
            searchTerm: search || undefined,
          });
          if (response?.success) {
            setFollowUps(response?.data);
            setPagination((prev) => ({
              ...prev,
              page: response?.meta?.page || 1,
              total: response?.meta?.total || 0,
            }));
          }
        } catch (error) {
          console.error("Failed to fetch followups:", error);
        } finally {
          setLoading(false);
        }
      };

      useEffect(() => {
        fetchFollowUp();
      }, []);

      const handlePageChange = (page: number) => {
        fetchFollowUp(page);
      };

      const handleSearch = (query: string) => {
        fetchFollowUp(1, query);
      };

      const handleDeleteClick = (id: string) => {
        setFollowUpDelete(id);
      };

      const confirmDelete = async () => {
        if (!followUpDelete) return;

        try {
          const response = await followUpApi.deleteFollowUp(followUpDelete);
          if (response.success) {
            toast.success("followUp deleted successfully");
            fetchFollowUp();
          } else {
            toast.error("Failed to delete follow up");
          }
        } catch (error) {
          console.error("Failed to delete follow up:", error);
          toast.error("Failed to delete follow up");
        } finally {
          setFollowUpDelete(null);
        }
      };


      const columns = [
        {
          key: "fullName",
          label: "Student Name",
          render: (followUpData: TFollowUpALlData) => (
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <span className="block max-w-50 truncate cursor-pointer">
                    {followUpData?.student?.fullName}
                  </span>
                </TooltipTrigger>

                <TooltipContent>
                  <p>{followUpData?.student?.fullName}</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          ),
        },
        {
          key: "email",
          label: "Email",
          render: (followUpData: TFollowUpALlData) => (
            <p>{followUpData?.student?.email}</p>
          ),
        },

        {
          key: "batchNo",
          label: "Batch",
          render: (followUpData: TFollowUpALlData) => (
            <p>{followUpData?.student?.batchNo}</p>
          ),
        },
        {
          key: "contactNumber",
          label: "Number",
          render: (followUpData: TFollowUpALlData) => (
            <p>{followUpData?.student?.contactNumber}</p>
          ),
        },
        {
          key: "studentStatus",
          label: "Status",
          render: (followUpData: TFollowUpALlData) => (
            <p>{followUpData?.student?.studentStatus}</p>
          ),
        },
        {
          key: "whatsappStatus",
          label: "WhatsApp",
          render: (followUpData: TFollowUpALlData) => (
            <p>{followUpData?.student?.whatsappStatus}</p>
          ),
        },
        {
          key: "count",
          label: "Count",
          render: (followUpData: TFollowUpALlData) => (
            <p>{followUpData?.followUpCounter}</p>
          ),
        },
        {
          key: "Date",
          label: "FollowUp Date",
          render: (followUpData: TFollowUpALlData) => (
            <p>{formatDOB(followUpData?.followUpDate)}</p>
          ),
        },
        {
          key: "actions",
          label: "Actions",
          render: (followUp: TFollowUpALlData) => (
            <div className="flex items-center space-x-2">
              <Button variant="outline" size="sm" className="cursor-pointer">
                <Link href={`/Follow-up/${followUp?.id}`}>
                  <Eye className="h-4 w-4" />
                </Link>
              </Button>

              <CreateFollowUp studentId={followUp?.student?.id} />
              <Button
                variant="outline"
                size="sm"
                className="cursor-pointer"
                onClick={() => handleDeleteClick(followUp?.student?.id)}>
                <Trash2 className="h-4 w-4 text-red-700" />
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
              <h1 className="text-3xl font-bold">All Follow up</h1>
              <p className="text-muted-foreground">
                Manage All follow ups with their details
              </p>
            </div>
          </div>
          {/* <CreateStudentModal /> */}
        </div>

        <DataTable
          data={followUps}
          columns={columns}
          searchKey="followup"
          pagination={{
            ...pagination,
            onPageChange: handlePageChange,
          }}
          onSearch={handleSearch}
          loading={loading}
        />

        {/* Delete Confirmation Dialog */}
        <AlertDialog
          open={!!followUpDelete}
          onOpenChange={(open) => !open && setFollowUpDelete(null)}>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
              <AlertDialogDescription>
                This action cannot be undone. This will permanently delete the
                student and all associated data from our servers.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel onClick={() => setFollowUpDelete(null)}>
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

export default FollowUp;