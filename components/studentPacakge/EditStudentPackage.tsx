import { Button } from "@/components/ui/button"
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "../ui/form"
import { Textarea } from "../ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../ui/select"
import { packageApi } from "@/lib/api/pacakge"
import { Pencil } from "lucide-react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import z from "zod"
import { toast } from "sonner"
import { useEffect, useState } from "react"
import { TStudent } from "@/types/student.types"
import { IPackage } from "@/types/studentPacakges"
import { studnetPackageApi } from "@/lib/api/AllStudnetPacakgeApi"
import { studentApi } from "@/lib/api/studentApi"
// Zod Schema for validation
const formSchema = z.object({
    studentId: z.string().min(1, "Please select a student"),
    packageId: z.string().min(1, "Please select a package"),
    discount: z.string().min(0, "Discount cannot be negative"),
    totalPayable: z.string().min(0, "Total payable must be positive"),
    status: z.enum(["ACTIVE", "INACTIVE"]),
});
type IpackProps = {
    pack: {
        id: string;
        studentId: string;
        packageId: string;
        discount: number;
        totalPayable: number;
        status: "ACTIVE" | "INACTIVE";
    },
    setRefetch: (prev: boolean) => void;
}
export function EditStudentPackageDialog({ pack, setRefetch }: IpackProps) {
    const [students, setStudents] = useState<TStudent[]>([]);
    const [studentSearch, setStudentSearch] = useState("");

    const [packages, setPackages] = useState<IPackage[]>([]);
    const [packageSearch, setPackageSearch] = useState("");
    type PackageFormValues = z.infer<typeof formSchema>;
    const form = useForm<PackageFormValues>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            studentId: pack.studentId,
            packageId: pack.packageId,
            discount: pack.discount.toString(),
            totalPayable: pack.totalPayable.toString(),
            status: pack.status,
        },
    });
    const { isDirty } = form.formState;

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
    // Submit handler
    async function onSubmit(values: PackageFormValues) {
        try {
            const res = await studnetPackageApi.updateStudentPackage(pack.id, {
                ...values,
                discount: Number(values.discount),
                totalPayable: Number(values.totalPayable),
            });
            if (res?.success) {
                toast.success("Enrollment updated successfully");
                setRefetch(true);
            } else {
                toast.error(res?.message || "Failed to update");
            }
        } catch (error: any) {
            toast.error("An unexpected error occurred.");
        }
    }
    return (
        <Dialog>
            <DialogTrigger asChild>
                <Button variant={"outline"} size="sm"><Pencil /> </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                    <DialogTitle>Edit Student Package</DialogTitle>
                    <DialogDescription>
                        Make changes to your package here. Click save when you&apos;re
                        done.
                    </DialogDescription>
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

                            <Button type="submit" className="w-full" disabled={form.formState.isSubmitting || !isDirty}>
                                {form.formState.isSubmitting ? "Updating..." : "Update Enrollment"}
                            </Button>
                        </form>
                    </Form>
                </DialogHeader>
            </DialogContent>
        </Dialog>
    )
}