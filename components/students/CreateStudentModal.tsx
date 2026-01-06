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
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/Card";
import { studentApi } from "@/lib/api/studentApi";
import { TStudent } from "@/types/student.types";

// ----------------- Schema -----------------
export const studentSchema = z.object({
  email: z.string().email("Invalid email"),
  fullName: z.string().min(2, "Name must be at least 2 characters"),
  batchNo: z.string().min(1, "Batch is required"),
  contactNumber: z.string().min(6, "Contact number is required"),
  studentStatus: z.enum(
    ["ACTIVE", "INACTIVE", "BLOCKED", "IRREGULAR", "FAKED"],
    "status is required",
  ),
  whatsappStatus: z.enum(
    ["ACTIVE", "INACTIVE", "DONE"],
    "whatsApp is required",
  ),
  gender: z.enum(["MALE", "FEMALE", "OTHERS"], "Gender is required"),
  dateOfBirth: z.string().min(1, "Date of birth is required"),
  address: z.string().min(1, "Address is required"),
  profession: z.string().min(1, "Profession is required"),
});

type StudentFormData = z.infer<typeof studentSchema>;

// ----------------- Modal Component -----------------
const CreateStudentModal = ({
  student,
  from,
}: {
  student?: TStudent;
  from?: string;
}) => {
  const [studentImage, setStudentImage] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(
    student?.studentImage || null,
  );
  const [open, setOpen] = useState(false);

  const {
    register,
    handleSubmit,
    control,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<StudentFormData>({
    resolver: zodResolver(studentSchema),
    defaultValues: {
      email: student?.email || "",
      fullName: student?.fullName || "",
      batchNo: student?.batchNo || "",
      contactNumber: student?.contactNumber || "",
      dateOfBirth: student?.dateOfBirth || "",
      address: student?.address || "",
      profession: student?.profession || "",
      studentStatus: student?.studentStatus || undefined,
      whatsappStatus: student?.whatsappStatus || undefined,
      gender: student?.gender || undefined,
    },
  });

  // ----------------- Image -----------------
  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setStudentImage(file);
    const reader = new FileReader();
    reader.onload = () => setPreview(reader.result as string);
    reader.readAsDataURL(file);
  };

  const removeImage = () => {
    setStudentImage(null);
    setPreview(null);

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
  // ----------------- Submit -----------------
  const onSubmit = async (data: StudentFormData) => {
    try {
      const formData = new FormData();

      Object.entries(data).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
          formData.append(key, value.toString());
        }
      });

      if (studentImage) {
        formData.append("studentImage", studentImage);
      }
      if (student) {
        const res = await studentApi.updateStudent(student?.id ,formData);

        if (res?.success) {
          toast.success("Student updated successfully!");
          handleModalClose();
        }
      } else {
        const res = await studentApi.createStudent(formData);
        if (res?.success) {
          toast.success("Student created successfully!");
          handleModalClose();
        }
      }
    } catch (err) {
      toast.error("Failed to create student");
    }
  };

  // ----------------- JSX -----------------
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
          <Button className="cursor-pointer">
            <Plus className="h-4 w-4 mr-2 " />
            Create Student
          </Button>
        )}
      </DialogTrigger>

      <DialogContent className="max-w-2xl overflow-hidden">
        <DialogHeader>
          <DialogTitle>Create Student</DialogTitle>
        </DialogHeader>

        <Card className="border-none bg-transparent">
          <CardHeader>
            <CardTitle>Create Student</CardTitle>
          </CardHeader>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            {/* BASIC INFO */}
            <div className="grid md:grid-cols-3 gap-4">
              <div>
                <Label>Full Name *</Label>
                <Input {...register("fullName")} />
                {errors.fullName && (
                  <p className="text-sm text-destructive">
                    {errors.fullName.message}
                  </p>
                )}
              </div>

              <div>
                <Label>Email *</Label>
                <Input {...register("email")} />
                {errors.email && (
                  <p className="text-sm text-destructive">
                    {errors.email.message}
                  </p>
                )}
              </div>

              <div>
                <Label>Batch No *</Label>
                <Input {...register("batchNo")} />
                {errors.batchNo && (
                  <p className="text-sm text-destructive">
                    {errors.batchNo.message}
                  </p>
                )}
              </div>

              <div>
                <Label>Contact Number *</Label>
                <Input {...register("contactNumber")} />
                {errors.contactNumber && (
                  <p className="text-sm text-destructive">
                    {errors.contactNumber.message}
                  </p>
                )}
              </div>
              {/* DOB */}
              <div>
                <Label>Date of Birth *</Label>
                <Input type="date" {...register("dateOfBirth")} />
                {errors.dateOfBirth && (
                  <p className="text-sm text-destructive">
                    {errors.dateOfBirth.message}
                  </p>
                )}
              </div>

              {/* IMAGE */}
              <div>
                <Label>Image (Optional)</Label>
                <div className="flex gap-4 items-center">
                  <Input
                    type="file"
                    accept="image/*"
                    onChange={handleImageChange}
                  />
                  {preview && (
                    <div className="relative">
                      <img
                        src={preview}
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
            </div>

            {/* STATUS */}
            <div className="grid md:grid-cols-3 gap-4">
              {/* Student Status */}
              <div>
                <Controller
                  name="studentStatus"
                  control={control}
                  render={({ field }) => (
                    <Select value={field.value} onValueChange={field.onChange}>
                      <SelectTrigger>
                        <SelectValue placeholder="Status" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="ACTIVE">Active</SelectItem>
                        <SelectItem value="INACTIVE">Inactive</SelectItem>
                        <SelectItem value="BLOCKED">Blocked</SelectItem>
                        <SelectItem value="IRREGULAR">Irregular</SelectItem>
                        <SelectItem value="FAKED">Faked</SelectItem>
                      </SelectContent>
                    </Select>
                  )}
                />
                {errors.studentStatus && (
                  <p className="text-sm text-destructive">
                    {errors.studentStatus.message}
                  </p>
                )}
              </div>

              {/* WhatsApp Status */}
              <div>
                <Controller
                  name="whatsappStatus"
                  control={control}
                  render={({ field }) => (
                    <Select value={field.value} onValueChange={field.onChange}>
                      <SelectTrigger>
                        <SelectValue placeholder="WhatsApp" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="ACTIVE">Active</SelectItem>
                        <SelectItem value="INACTIVE">Inactive</SelectItem>
                        <SelectItem value="DONE">Done</SelectItem>
                      </SelectContent>
                    </Select>
                  )}
                />
                {errors.whatsappStatus && (
                  <p className="text-sm text-destructive">
                    {errors.whatsappStatus.message}
                  </p>
                )}
              </div>

              <div>
                {/* Gender */}
                <Controller
                  name="gender"
                  control={control}
                  render={({ field }) => (
                    <Select value={field.value} onValueChange={field.onChange}>
                      <SelectTrigger>
                        <SelectValue placeholder="Gender" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="MALE">Male</SelectItem>
                        <SelectItem value="FEMALE">Female</SelectItem>
                        <SelectItem value="OTHERS">Other</SelectItem>
                      </SelectContent>
                    </Select>
                  )}
                />
                {errors.gender && (
                  <p className="text-sm text-destructive">
                    {errors.gender.message}
                  </p>
                )}
              </div>
            </div>

            <div className="flex items-start justify-between gap-6">
              <div className="w-full">
                {/* EXTRA */}
                <Label> Address *</Label>
                <Textarea
                  placeholder="enter address *"
                  {...register("address")}
                />
                {errors.address && (
                  <p className="text-sm text-destructive">
                    {errors.address.message}
                  </p>
                )}
              </div>

              <div className="w-full">
                <Label>Profession *</Label>
                <Textarea
                  placeholder="write profession *"
                  {...register("profession")}
                />
                {errors.profession && (
                  <p className="text-sm text-destructive">
                    {errors.profession.message}
                  </p>
                )}
              </div>
            </div>

            {/* ACTIONS */}
            <div className="flex gap-2">
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting ? (
                  <>{from ? "Updating" : "Creating"}</>
                ) : (
                  <>{from ? "Update" : " Create"}</>
                )}
              </Button>
            </div>
          </form>
        </Card>
      </DialogContent>
    </Dialog>
  );
};

export default CreateStudentModal;
