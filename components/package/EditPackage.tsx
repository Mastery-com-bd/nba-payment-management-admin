import { Button } from "@/components/ui/button"
import {
    Dialog,
    DialogClose,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "../ui/form"
import { Textarea } from "../ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../ui/select"
import { useEffect, useState } from "react"
import { TPackage } from "@/lib/types/pacakge.types"
import { packageApi } from "@/lib/api/pacakge"
import { Pencil } from "lucide-react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import z from "zod"
import { toast } from "sonner"
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
export function EditPackageDialog({ pack, setRefetch }: { pack: TPackage, setRefetch?: (prev: boolean) => void }) {
    type PackageFormValues = z.infer<typeof formSchema>;
    const form = useForm<PackageFormValues>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            name: pack?.name || "",
            description: pack?.description || "",
            packageStatus: pack?.packageStatus || "ACTIVE",
            packageType: pack?.packageType || "BASIC",
            packagePrice: pack?.packagePrice ? String(pack.packagePrice) : "0",
            consultancyType: pack?.consultancyType || "SIXMONTHS",
            durationInMonths: pack?.durationInMonths ? String(pack.durationInMonths) : "6",
        },
    });
    const { isDirty } = form.formState;
    // Submit handler
    async function onSubmit(values: PackageFormValues) {
        try {
            const res = await packageApi.updatePackage(pack.id, {
                ...values,
                packagePrice: Number(values.packagePrice),
                durationInMonths: Number(values.durationInMonths),
            });

            if (res?.success) {
                toast.success(`${res.data?.name || "Package"} updated successfully`);
                setRefetch && setRefetch(true);
            } else {
                toast.error(res?.message || "Failed to update package");
            }
        } catch (error: any) {
            console.error("Submit Handler Error:", error);
            toast.error("An unexpected error occurred. Please try again.");
        }
    }


    return (
        <Dialog>
            <DialogTrigger asChild>
                <Button variant="outline"><Pencil /></Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                    <DialogTitle>Edit package</DialogTitle>
                    <DialogDescription>
                        Make changes to your package here. Click save when you&apos;re
                        done.
                    </DialogDescription>
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
                                    <FormItem>
                                        <FormLabel>Consultancy Type</FormLabel>
                                        <Select onValueChange={field.onChange} defaultValue={field.value}>
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
                            <Button type="submit" className="w-full" disabled={!isDirty}>Update Package</Button>
                        </form>
                    </Form>
                </DialogHeader>
            </DialogContent>
        </Dialog>
    )
}