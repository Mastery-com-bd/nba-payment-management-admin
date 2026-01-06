'use client';
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";

// UI Components
import { Input } from "@/components/ui/input";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage
} from "@/components/ui/form";
import { toast } from "sonner";
import { studnetPackageApi } from "@/lib/api/AllStudnetPacakgeApi";
import { useEffect, useState } from "react";
import { studentApi } from "@/lib/api/studentApi";
import { packageApi } from "@/lib/api/pacakge";
import { TStudent } from "@/types/student.types";
import { IPackage } from "@/types/studentPacakges";

// Zod Schema updated to match your required structure
const formSchema = z.object({
    studentId: z.string().min(1, "Please select a student"),
    packageId: z.string().min(1, "Please select a package"),
    discount: z.string().min(0, "Discount cannot be negative"),
    totalPayable: z.string().min(0, "Total payable must be positive"),
    status: z.enum(["ACTIVE", "INACTIVE"]),
});

type PackageFormValues = z.infer<typeof formSchema>;

export default function CreatePackagePage() {
    const [students, setStudents] = useState<TStudent[]>([]);
    const [studentSearch, setStudentSearch] = useState("");

    const [packages, setPackages] = useState<IPackage[]>([]);
    const [packageSearch, setPackageSearch] = useState("");

    const form = useForm<PackageFormValues>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            studentId: "",
            packageId: "",
            discount: "0",
            totalPayable: "0",
            status: "ACTIVE",
        },
    });

    // Watch values for auto-calculation
    const watchPackageId = form.watch("packageId");
    const watchDiscount = form.watch("discount");

    // Fetch Students
    useEffect(() => {
        const fetchStudents = async () => {
            const response = await studentApi.getAllStudents({
                searchTerm: studentSearch || undefined,
                limit: 10
            });
            if (response?.success) setStudents(response.data);
        };
        fetchStudents();
    }, [studentSearch]);

    // Fetch Packages
    useEffect(() => {
        const fetchPackages = async () => {
            const response = await packageApi.getAllPacakges({
                searchTerm: packageSearch || undefined,
                limit: 10
            });
            if (response?.success) setPackages(response.data);
        };
        fetchPackages();
    }, [packageSearch]);

    // Auto calculate Total Payable when package or discount changes
    useEffect(() => {
        const selectedPkg = packages.find(p => p.id === watchPackageId);
        if (selectedPkg) {
            const price = selectedPkg.packagePrice || 0;
            const finalAmount = Math.max(0, price - (Number(watchDiscount) || 0));
            form.setValue("totalPayable", (finalAmount).toString());
        }
    }, [watchPackageId, watchDiscount, packages]);

    async function onSubmit(values: PackageFormValues) {
        try {
            const res = await studnetPackageApi.createStudentPackage({
                ...values,
                discount: Number(values.discount),
                totalPayable: Number(values.totalPayable),
            });
            if (res?.success) {
                toast.success("Enrollment created successfully");
                form.reset();
            } else {
                toast.error(res?.message || "Failed to create");
            }
        } catch (error: any) {
            toast.error("An unexpected error occurred.");
        }
    }

    return (
        <div className="max-w-2xl mx-auto p-8 border rounded-xl bg-card shadow-sm mt-10">
            <div className="mb-8 text-center">
                <h1 className="text-2xl font-bold">New Student Enrollment</h1>
                <p className="text-muted-foreground text-sm">Select student and package to enroll</p>
            </div>

            <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">

                    {/* Student Selection with Search */}
                    <FormField
                        control={form.control}
                        name="studentId"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Student</FormLabel>
                                <Select onValueChange={field.onChange} value={field.value}>
                                    <FormControl>
                                        <SelectTrigger>
                                            <SelectValue placeholder="Select Student" />
                                        </SelectTrigger>
                                    </FormControl>
                                    <SelectContent>
                                        <div className="p-2">
                                            <Input
                                                placeholder="Search student..."
                                                onChange={(e) => setStudentSearch(e.target.value)}
                                                className="h-8"
                                            />
                                        </div>
                                        {students.map(s => (
                                            <SelectItem key={s.id} value={s.id}>
                                                {s.fullName} ({s.batchNo})
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    {/* Package Selection with Search */}
                    <FormField
                        control={form.control}
                        name="packageId"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Package</FormLabel>
                                <Select onValueChange={field.onChange} value={field.value}>
                                    <FormControl>
                                        <SelectTrigger>
                                            <SelectValue placeholder="Select Package" />
                                        </SelectTrigger>
                                    </FormControl>
                                    <SelectContent>
                                        <div className="p-2">
                                            <Input
                                                placeholder="Search package..."
                                                onChange={(e) => setPackageSearch(e.target.value)}
                                                className="h-8"
                                            />
                                        </div>
                                        {packages.map(p => (
                                            <SelectItem key={p.id} value={p.id}>
                                                {p.name} — ৳{p.packagePrice}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    <div className="grid grid-cols-2 gap-4">
                        <FormField
                            control={form.control}
                            name="discount"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Discount (BDT)</FormLabel>
                                    <FormControl>
                                        <Input type="number" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <FormField
                            control={form.control}
                            name="totalPayable"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Total Payable (Auto)</FormLabel>
                                    <FormControl>
                                        <Input type="number" {...field} readOnly className="bg-muted" />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                    </div>

                    <FormField
                        control={form.control}
                        name="status"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Enrollment Status</FormLabel>
                                <Select onValueChange={field.onChange} defaultValue={field.value}>
                                    <FormControl>
                                        <SelectTrigger>
                                            <SelectValue />
                                        </SelectTrigger>
                                    </FormControl>
                                    <SelectContent>
                                        <SelectItem value="ACTIVE">Active</SelectItem>
                                        <SelectItem value="INACTIVE">Inactive</SelectItem>
                                    </SelectContent>
                                </Select>
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    <Button type="submit" className="w-full" disabled={form.formState.isSubmitting}>
                        {form.formState.isSubmitting ? "Creating..." : "Confirm Enrollment"}
                    </Button>
                </form>
            </Form>
        </div>
    );
}