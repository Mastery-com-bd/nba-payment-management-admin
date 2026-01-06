import { studnetPackageApi } from "@/lib/api/AllStudnetPacakgeApi";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import z from "zod";

// Zod Schema for validation
const formSchema = z.object({
    name: z.string().min(2, "Name must be at least 2 characters"),
    description: z.string().min(10, "Description must be at least 10 characters"),
    packageStatus: z.enum(["ACTIVE", "INACTIVE", "EXPIRED"]),
    packageType: z.enum(["BASIC", "ADVANCED", "CONSULTANCY"]),
    packagePrice: z.string().min(0, "Price must be a positive number"),
    consultancyType: z.enum(["SIXMONTHS", "ONEYEAR"]),
    durationInMonths: z.string().min(1, "Minimum duration 1 month"),
});

type PackageFormValues = z.infer<typeof formSchema>;
export default function CreateStudentPackage() {
    // 1. Initialize the form
    const form = useForm<PackageFormValues>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            name: "",
            description: "",
            packageStatus: "ACTIVE",
            packageType: "BASIC",
            packagePrice: "0",
            consultancyType: "SIXMONTHS",
            durationInMonths: "6",
        },
    });

    async function onSubmit(values: PackageFormValues) {
        try {
            const res = await studnetPackageApi.createStudentPackage({
                ...values,
                packagePrice: Number(values.packagePrice),
                durationInMonths: Number(values.durationInMonths),
            });

            if (res?.success) {
                toast.success(`${res.data?.name || "Package"} created successfully`);
                form.reset(); // Success hole form ta reset kora standard
            } else {
                // Backend theke error asle (e.g. Validation error ba Duplicate name)
                toast.error(res?.message || "Failed to create package");
            }
        } catch (error: any) {
            // Unexpected error ba Network error-er jonno
            console.error("Submit Handler Error:", error);
            toast.error("An unexpected error occurred. Please try again.");
        }
    }

    return (
        <div>
            Create Student Package Page
        </div>
    );
}