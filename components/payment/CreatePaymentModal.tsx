"use client";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Edit, Plus, X } from "lucide-react";
import z from "zod";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import { toast } from "sonner";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/Card";
import { TPayment } from "@/types/payment.types";
import { paymentApi } from "@/lib/api/paymentApi";

// ----------------- Schema -----------------
export const paymentSchema = z.object({
  amount: z.number().min(1, "Amount must be greater than 0"),
  paymentMethod: z.enum(
    [
      "CREDIT_CARD",
      "DEBIT_CARD",
      "BKASH",
      "NAGAD",
      "ROCKET",
      "UPAY",
      "BANK_TRANSFER",
      "COD",
    ],
    "payment method is required",
  ),
  paymentStatus: z.enum(
    ["PENDING", "PARTIAL", "COMPLETED", "FAILED", "REFUND"],
    "payment status required",
  ),
  paymentType: z.enum(
    ["FULLPAYMENT", "INSTALLMENT", "SUBSCRIPTION", "BOOKING"],
    "payment type is required",
  ),
  transactionId: z.string().min(1, "Transaction ID is required"),
});

export type PaymentFormData = z.infer<typeof paymentSchema>;

type TPaymentFormData = {
  payment?: TPayment;
  from?: string;
  selectedStudentId?: string;
  selectedEnrolment?: string;
};

// ----------------- Modal Component -----------------
const CreatePaymentModal = ({
  payment,
  from,
  selectedStudentId,
  selectedEnrolment,
}: TPaymentFormData) => {
  const [open, setOpen] = useState(false);
  const [paymentFile, setPaymentFile] = useState<File | null>(null);
  const [filePreview, setFilePreview] = useState<string | null>(
    payment?.paymentVerificationFile || null,
  );

  const {
    register,
    handleSubmit,
    control,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<PaymentFormData>({
    resolver: zodResolver(paymentSchema),
    defaultValues: {
      amount: payment?.amount ?? undefined,
      paymentMethod: payment?.paymentMethod ?? undefined,
      paymentStatus: payment?.paymentStatus ?? undefined,
      paymentType: payment?.paymentType ?? undefined,
      transactionId: payment?.transactionId ?? "",
    },
  });

  // ----------------- File Handling -----------------
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setPaymentFile(file);

    const reader = new FileReader();
    reader.onload = () => setFilePreview(reader.result as string);
    reader.readAsDataURL(file);
  };

  // ----------------- Submit -----------------
  const onSubmit = async (data: PaymentFormData) => {
    const payload = {
      ...data,
      amount: Number(data.amount),
      studentId: selectedStudentId,
      studentPackageId: selectedEnrolment,
    };

    console.log(typeof payload.amount);
    try {
      const formData = new FormData();

      Object.entries(payload).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
          formData.append(key, value.toString());
        }
      });

      if (paymentFile) {
        formData.append("paymentVerificationFile", paymentFile);
      }
      if (payment) {
        const res = await paymentApi.updatePayment(payment?.id, formData);

        if (res?.success) {
          toast.success("Student updated successfully!");
          handleModalClose();
        }
      } else {
        const res = await paymentApi.createPayment(formData);
        if (res?.success) {
          toast.success("Student created successfully!");
          handleModalClose();
        }
      }
    } catch (err) {
      toast.error("Failed to create student");
    }
  };

  const removeImage = () => {
    setFilePreview(null);
    setFilePreview(null);

    // Clear the input element manually
    const input = document.getElementById(
      "studentImageInput",
    ) as HTMLInputElement;
    if (input) input.value = "";
  };

  const handleModalClose = () => {
    reset();
    removeImage();
    setOpen(false);
  };

  return (
    <Dialog
      open={open}
      onOpenChange={(isOpen) => {
        if (!isOpen) handleModalClose(); // when modal closes manually
        else setOpen(true); // when user clicks trigger
      }}>
      <DialogTrigger asChild>
        {from ? (
          <Button variant="outline" size="sm">
            <Edit className="h-4 w-4" />
          </Button>
        ) : (
          <Button disabled={!selectedStudentId || !selectedEnrolment}>
            <Plus className="h-4 w-4 mr-2" />
            Create Payment
          </Button>
        )}
      </DialogTrigger>

      <DialogContent className="max-w-2xl overflow-hidden">
        <DialogHeader>
          <DialogTitle>{from ? "Edit Payment" : "Create Payment"}</DialogTitle>
        </DialogHeader>

        <Card className="border-none bg-transparent">
          <CardHeader>
            <CardTitle>Payment Details</CardTitle>
          </CardHeader>

          <CardContent>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
              {/* Amount */}
              <div>
                <Label>Amount *</Label>
                <Input
                  type="number"
                  {...register("amount", { valueAsNumber: true })}
                />
                {errors.amount && (
                  <p className="text-sm text-destructive">
                    {errors.amount.message}
                  </p>
                )}
              </div>

              {/* Payment Method */}
              <div>
                <Label>Payment Method *</Label>
                <Controller
                  name="paymentMethod"
                  control={control}
                  render={({ field }) => (
                    <Select value={field.value} onValueChange={field.onChange}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select method" />
                      </SelectTrigger>
                      <SelectContent>
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
                          <SelectItem key={method} value={method}>
                            {method}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  )}
                />
                {errors.paymentMethod && (
                  <p className="text-sm text-destructive">
                    {errors.paymentMethod.message}
                  </p>
                )}
              </div>

              {/* Payment Status */}
              <div>
                <Label>Payment Status *</Label>
                <Controller
                  name="paymentStatus"
                  control={control}
                  render={({ field }) => (
                    <Select value={field.value} onValueChange={field.onChange}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select status" />
                      </SelectTrigger>
                      <SelectContent>
                        {[
                          "PENDING",
                          "PARTIAL",
                          "COMPLETED",
                          "FAILED",
                          "REFUND",
                        ].map((status) => (
                          <SelectItem key={status} value={status}>
                            {status}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  )}
                />
                {errors.paymentStatus && (
                  <p className="text-sm text-destructive">
                    {errors.paymentStatus.message}
                  </p>
                )}
              </div>

              {/* Payment Type */}
              <div>
                <Label>Payment Type *</Label>
                <Controller
                  name="paymentType"
                  control={control}
                  render={({ field }) => (
                    <Select value={field.value} onValueChange={field.onChange}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select type" />
                      </SelectTrigger>
                      <SelectContent>
                        {[
                          "FULLPAYMENT",
                          "INSTALLMENT",
                          "SUBSCRIPTION",
                          "BOOKING",
                        ].map((type) => (
                          <SelectItem key={type} value={type}>
                            {type}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  )}
                />
                {errors.paymentType && (
                  <p className="text-sm text-destructive">
                    {errors.paymentType.message}
                  </p>
                )}
              </div>

              {/* Transaction ID */}
              <div>
                <Label>Transaction ID *</Label>
                <Input
                  {...register("transactionId")}
                  placeholder="Enter transaction ID"
                />
                {errors.transactionId && (
                  <p className="text-sm text-destructive">
                    {errors.transactionId.message}
                  </p>
                )}
              </div>

              {/* Payment File */}
              <div>
                <Label>Payment Verification File (Optional)</Label>
                <div className="flex gap-4 items-center">
                  <Input
                    type="file"
                    accept="image/*,application/pdf"
                    onChange={handleFileChange}
                  />
                  {filePreview && (
                    <div className="relative">
                      <img
                        src={filePreview}
                        className="w-20 h-20 rounded object-cover border"
                      />
                      <Button
                        type="button"
                        size="icon"
                        variant="destructive"
                        className="absolute -top-2 -right-2 h-6 w-6"
                        onClick={removeImage}>
                        <X className="h-3 w-3" />
                      </Button>
                    </div>
                  )}
                </div>
              </div>

              {/* Submit */}
              <div className="flex gap-2">
                <Button type="submit" disabled={isSubmitting}>
                  {isSubmitting
                    ? "Submitting..."
                    : from
                    ? "Update Payment"
                    : "Create Payment"}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </DialogContent>
    </Dialog>
  );
};

export default CreatePaymentModal;
