'use client';
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";

// UI Components
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
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
import { packageApi } from "@/lib/api/pacakge";
import { toast } from "sonner";

// Zod Schema for validation
const formSchema = z.object({
    name: z.string().min(2, "Name must be at least 2 characters"),
    description: z.string().min(10, "Description must be at least 10 characters"),
    packageStatus: z.enum(["ACTIVE", "INACTIVE", "EXPIRED"]),
    packageType: z.enum(["BASIC", "ADVANCED", "CONSULTANCY"]),
    packagePrice: z.string().min(0, "Price must be a positive number"),
    consultancyType: z.enum(["SIXMONTHS", "ONEYEAR"]).optional(),
    durationInMonths: z.string().min(1, "Minimum duration 1 month"),
});

// TypeScript type infer kora schema theke
type PackageFormValues = z.infer<typeof formSchema>;

export default function CreatePackagePage() {
    // 1. Initialize the form
    const form = useForm<PackageFormValues>({   
        resolver: zodResolver(formSchema),
        defaultValues: {
            name: "",
            description: "",
            packageStatus: "ACTIVE",
            packageType: "BASIC",
            packagePrice: "0",
            durationInMonths: "6",
            consultancyType: "SIXMONTHS",
        },
    });

    // 2. Submit handler
    async function onSubmit(values: PackageFormValues) {
        try {
            const res = await packageApi.createPackage({
                ...values,
                // Note: Zod schema-te coerce use korle eita na korle-o hoy, 
                // tobe manual convert kora extra safe.
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
    const isConsultancy = form.watch("packageType") === "CONSULTANCY";
    return (
        <div className="max-w-2xl mx-auto p-8 border rounded-xl bg-card shadow-sm mt-10">
            <div className="mb-8 text-center">
                <h1 className="text-2xl font-bold">Create New Package</h1>
                <p className="text-muted-foreground text-sm">
                    Fill in the details to launch a new course package.
                </p>
            </div>
            <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">

                    {/* Package Name */}
                    <FormField
                        control={form.control}
                        name="name"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Package Name</FormLabel>
                                <FormControl>
                                    <Input placeholder="e.g. Basic Web Development" {...field} />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    {/* Description */}
                    <FormField
                        control={form.control}
                        name="description"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Description</FormLabel>
                                <FormControl>
                                    <Textarea
                                        placeholder="Enter detailed description..."
                                        className="min-h-[100px]"
                                        {...field}
                                    />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {/* Package Type */}
                        <FormField
                            control={form.control}
                            name="packageType"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Package Type</FormLabel>
                                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                                        <FormControl>
                                            <SelectTrigger>
                                                <SelectValue placeholder="Select type" />
                                            </SelectTrigger>
                                        </FormControl>
                                        <SelectContent>
                                            <SelectItem value="BASIC">Basic</SelectItem>
                                            <SelectItem value="ADVANCED">Advanced</SelectItem>
                                            <SelectItem value="CONSULTANCY">Consultancy</SelectItem>
                                        </SelectContent>
                                    </Select>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        {/* Package Status */}
                        <FormField
                            control={form.control}
                            name="packageStatus"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Status</FormLabel>
                                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                                        <FormControl>
                                            <SelectTrigger>
                                                <SelectValue placeholder="Select status" />
                                            </SelectTrigger>
                                        </FormControl>
                                        <SelectContent>
                                            <SelectItem value="ACTIVE">Active</SelectItem>
                                            <SelectItem value="INACTIVE">Inactive</SelectItem>
                                            <SelectItem value="EXPIRED">Expired</SelectItem>
                                        </SelectContent>
                                    </Select>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {/* Package Price */}
                        <FormField
                            control={form.control}
                            name="packagePrice"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Price (BDT)</FormLabel>
                                    <FormControl>
                                        <Input type="number" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        {/* Duration */}
                        <FormField
                            control={form.control}
                            name="durationInMonths"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Duration (Months)</FormLabel>
                                    <FormControl>
                                        <Input type="number" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                    </div>

                    {/* Consultancy Type */}
                    <FormField
                        control={form.control}
                        name="consultancyType"
                        render={({ field }) => (
                            <FormItem >
                                <FormLabel>Consultancy Type</FormLabel>
                                <Select onValueChange={field.onChange} defaultValue={field.value} disabled={!isConsultancy}>
                                    <FormControl>
                                        <SelectTrigger>
                                            <SelectValue placeholder="Select consultancy" />
                                        </SelectTrigger>
                                    </FormControl>
                                    <SelectContent>
                                        <SelectItem value="SIXMONTHS">Six Months</SelectItem>
                                        <SelectItem value="ONEYEAR">One Year</SelectItem>
                                    </SelectContent>
                                </Select>
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    <Button type="submit" className="w-full">Create Package</Button>
                </form>
            </Form>

        </div>
    );
}