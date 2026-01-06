"use client";

import { paymentApi } from "@/lib/api/paymentApi";
import {
  TPayment,
  TPaymentMethod,
  TPaymentStatus,
  TPaymentType,
} from "@/types/payment.types";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { Button } from "../ui/button";
import Link from "next/link";
import { ArrowLeft, Check, ChevronDown, Eye, Trash2 } from "lucide-react";
import { toast } from "sonner";
import CreateStudentModal from "../students/CreateStudentModal";
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
} from "../ui/alert-dialog";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "../ui/tooltip";
import { formatDOB } from "@/utills/dateFormat";
import CreatePaymentModal from "./CreatePaymentModal";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";
import { Label } from "../ui/label";


type TPagination = {
  page: number;
  limit: number;
  total: number;
  paymentMethod?: TPaymentMethod;
  paymentType?:TPaymentType
};

const Payment = () => {
  const [payments, setPayments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [paymentDelete, setPaymentDelete] = useState<string | null>(null);
  const [statusFilter, setStatusFilter] = useState<TPaymentStatus | "">("");
  const [methodFilter, setMethodFilter] = useState<TPaymentMethod | "">("");
  const [typeFilter, setTypeFilter] = useState<TPaymentType | "">("");
  const [pagination, setPagination] = useState<TPagination>({
    page: 1,
    limit: 10,
    total: 0,
  });

  const fetchQuizzes = async (page = 1, paymentStatus = "") => {
    setLoading(true);
    try {
      const response = await paymentApi.getAllPayment({
        page,
        limit: pagination.limit,
        paymentStatus: paymentStatus || undefined,
      });
      if (response?.success) {
        setPayments(response?.data);
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

  const handleStatusChange = (query: string) => {
    fetchQuizzes(1, query);
  };

  const handleDeleteClick = (id: string) => {
    setPaymentDelete(id);
  };

  const confirmDelete = async () => {
    if (!paymentDelete) return;

    try {
      const response = await paymentApi.deletePayment(paymentDelete);
      if (response.success) {
        toast.success("payment deleted successfully");
        fetchQuizzes();
      } else {
        toast.error("Failed to delete payment");
      }
    } catch (error) {
      console.error("Failed to delete payment:", error);
      toast.error("Failed to delete payment");
    } finally {
      setPaymentDelete(null);
    }
  };

  const columns = [
    {
      key: "name",
      label: "Student",
      render: (payment: TPayment) => (
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <span className="block max-w-50 truncate cursor-pointer">
                {<span>{payment?.student?.fullName}</span>}
              </span>
            </TooltipTrigger>
            <TooltipContent>
              <p>{payment?.student?.fullName}</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      ),
    },
    {
      key: "package",
      label: "Package",
      render: (payment: TPayment) => (
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <span className="block max-w-50 truncate cursor-pointer">
                {payment?.studentPackage?.package?.name}
              </span>
            </TooltipTrigger>
            <TooltipContent>
              <p>{payment?.studentPackage?.package?.name}</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      ),
    },
    {
      key: "paymentMethod",
      label: "Payment Method",
    },
    {
      key: "paymentStatus",
      label: "Payment Status",
    },
    {
      key: "paymentType",
      label: "Payment Type",
    },
    {
      key: "transactionId",
      label: "Transaction ID",
    },
    {
      key: "createdAt",
      label: "Created",
      render: (payment: TPayment) => (
        <p className="flex items-center space-x-2">
          {formatDOB(payment?.createdAt)}
        </p>
      ),
    },

    {
      key: "actions",
      label: "Actions",
      render: (payment: TPayment) => (
        <div className="flex items-center space-x-2">
          <Button variant="outline" size="sm" className="cursor-pointer">
            <Link href={`/payment/${payment?.id}`}>
              <Eye className="h-4 w-4" />
            </Link>
          </Button>
          <CreatePaymentModal from="edit" />
          <Button
            variant="outline"
            size="sm"
            onClick={() => handleDeleteClick(payment?.id)}>
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
            <h1 className="text-3xl font-bold">All Payments</h1>
            <p className="text-muted-foreground">
              Manage All payments with their details
            </p>
          </div>
        </div>
        <CreatePaymentModal />
      </div>
      <div className="flex items-end gap-6">
        {/* payment status */}
        <div className="flex flex-col gap-2">
          <Label>Filter by Status</Label>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" className="w-40 justify-between">
                {statusFilter || "Select Status"}
                <ChevronDown className="ml-2 h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>

            <DropdownMenuContent>
              {/* Option to reset filter */}
              <DropdownMenuItem onClick={() => setStatusFilter("")}>
                {!statusFilter && <Check className="mr-2 h-4 w-4" />}
                All
              </DropdownMenuItem>

              {["PENDING", "PARTIAL", "COMPLETED", "FAILED", "REFUND"].map(
                (status) => (
                  <DropdownMenuItem
                    key={status}
                    onClick={() => {
                      setStatusFilter(status as TPaymentStatus);
                      handleStatusChange(status);
                    }}>
                    {statusFilter === status && (
                      <Check className="mr-2 h-4 w-4" />
                    )}
                    {status}
                  </DropdownMenuItem>
                ),
              )}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
        {/* payment method */}
        {/* <div className="flex flex-col gap-2">
          <Label>Filter by Method</Label>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" className="w-40 justify-between">
                {methodFilter || "Select method"}
                <ChevronDown className="ml-2 h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>

            <DropdownMenuContent>
              <DropdownMenuItem
                onClick={() => {
                  setMethodFilter("");
                }}>
                {!methodFilter && <Check className="mr-2 h-4 w-4" />}
                All
              </DropdownMenuItem>

              {[
                "CREDIT_CARD",
                "DEBIT_CARD",
                "BKASH",
                "NAGAD",
                "ROCKET",
                "UPAY",
                "BANK_TRANSFER",
                "COD",
              ].map((method) => (
                <DropdownMenuItem
                  key={method}
                  onClick={() => {
                    setPagination((prev) => ({
                      ...prev,
                      page: 1, // optional: reset page when filter changes
                      paymentMethod: method as TPaymentMethod,
                    }));
                    setMethodFilter(method as TPaymentMethod);
                    handleStatusChange(method);
                  }}>
                  {methodFilter === method && (
                    <Check className="mr-2 h-4 w-4" />
                  )}
                  {method}
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>
        </div> */}
        {/* payment type */}
        {/* <div className="flex flex-col gap-2">
          <Label>Filter by type</Label>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" className="w-40 justify-between">
                {typeFilter || "Select Type"}
                <ChevronDown className="ml-2 h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>

            <DropdownMenuContent>
              <DropdownMenuItem onClick={() => setTypeFilter("")}>
                {!typeFilter && <Check className="mr-2 h-4 w-4" />}
                All
              </DropdownMenuItem>

              {["FULLPAYMENT", "INSTALLMENT", "SUBSCRIPTION", "BOOKING"].map(
                (type) => (
                  <DropdownMenuItem
                    key={type}
                    onClick={() => {
                      setPagination((prev) => ({
                        ...prev,
                        page: 1, // optional: reset page when filter changes
                        paymentType: type as TPaymentType,
                      }));
                      setTypeFilter(type as TPaymentType);
                      handleStatusChange(type);
                    }}>
                    {typeFilter === type && <Check className="mr-2 h-4 w-4" />}
                    {type}
                  </DropdownMenuItem>
                ),
              )}
            </DropdownMenuContent>
          </DropdownMenu>
        </div> */}
        {/* <div>
          <Button
            variant="ghost"
            className="w-40 justify-between"
            onClick={() =>
              setPagination({
                page: 1,
                limit: 10,
                total: 0,
              })
            }>
            Reset
          </Button>
        </div> */}
      </div>
      <DataTable
        data={payments}
        columns={columns}
        searchKey="student"
        pagination={{
          ...pagination,
          onPageChange: handlePageChange,
        }}
        onSearch={handleStatusChange}
        loading={loading}
      />
      ''
      {/* Delete Confirmation Dialog */}
      <AlertDialog
        open={!!paymentDelete}
        onOpenChange={(open) => !open && setPaymentDelete(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete the
              payment and all associated data from our servers.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={() => setPaymentDelete(null)}>
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

export default Payment;
