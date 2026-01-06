"use client"

import z from "zod";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Edit, Plus, Spotlight, X } from "lucide-react";
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
import { Textarea } from "@/components/ui/textarea";
import { Card, CardHeader, CardTitle } from "../ui/Card";
import { studentApi } from "@/lib/api/studentApi";
import { followUpApi } from "@/lib/api/followUpApi";
import { TFollowUp } from "@/types/followUpTypes";

export const followUpSchema = z.object({
  followUpCounter: z.string().min(1, "Contact number is required"),
  followUpDate: z.string().min(1, "Date is required"),
  notes: z.string().min(1, "notes is required"),
});

export type TFollowUpData = z.infer<typeof followUpSchema>;

const CreateFollowUp = ({
  studentId,
}: {
  studentId: string;
}) => {
  const [open, setOpen] = useState(false);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<TFollowUpData>({
    resolver: zodResolver(followUpSchema),
  });

  const handleModalClose = () => {
    reset();
    setOpen(false);
  };
  // ----------------- Submit -----------------
  const onSubmit = async (data: TFollowUpData) => {

    const payload: TFollowUp = {
      ...data,
      followUpCounter: Number(data?.followUpCounter),
      studentId: studentId,
    };

    try {

      const res = await followUpApi.createFollowUp(payload);
      if (res?.success) {
        toast.success("followup created successfully!");
        handleModalClose();
      }
    } catch (err) {
      toast.error("Failed to create followup");
    }
  };

  return (
    <Dialog
      open={open}
      onOpenChange={(isOpen) => {
        if (!isOpen) handleModalClose(); // when modal closes manually
        else setOpen(true); // when user clicks trigger
      }}>
      <DialogTrigger asChild>
        <Button className="cursor-pointer">
          <Spotlight className="h-4 w-4 text-yellow-500 " />
        </Button>
      </DialogTrigger>

      <DialogContent className="max-w-2xl overflow-hidden">
        <DialogHeader>
          <DialogTitle>Create Follow Up</DialogTitle>
        </DialogHeader>

        <Card className="border-none bg-transparent">
          <CardHeader>
            <CardTitle>Create Student</CardTitle>
          </CardHeader>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            {/* BASIC INFO */}
            <div className="grid md:grid-cols-3 gap-4">
              <div>
                <Label>FollowUp Counter *</Label>
                <Input {...register("followUpCounter")} />
                {errors.followUpCounter && (
                  <p className="text-sm text-destructive">
                    {errors.followUpCounter.message}
                  </p>
                )}
              </div>
              {/* DOB */}
              <div>
                <Label>FollowUp Date *</Label>
                <Input type="date" {...register("followUpDate")} />
                {errors.followUpDate && (
                  <p className="text-sm text-destructive">
                    {errors.followUpDate.message}
                  </p>
                )}
              </div>
            </div>

            <div className="flex items-start justify-between gap-6">
              <div className="w-full">
                {/* EXTRA */}
                <Label> Notes *</Label>
                <Textarea
                  placeholder="enter address *"
                  {...register("notes")}
                />
                {errors.notes && (
                  <p className="text-sm text-destructive">
                    {errors.notes.message}
                  </p>
                )}
              </div>     
            </div>

            {/* ACTIONS */}
            <div className="flex gap-2">
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting ? "Creating" : "Create"}
              </Button>
            </div>
          </form>
        </Card>
      </DialogContent>
    </Dialog>
  );
};

export default CreateFollowUp;