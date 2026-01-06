'use client';

import { studnetPackageApi } from "@/lib/api/AllStudnetPacakgeApi";
import { TStudentPackage } from "@/lib/types/studentPacakges";
import {
    ArrowLeft,
    Calendar,
    CreditCard,
    User,
    Package,
    MapPin,
    Phone,
    Mail,
    History,
    AlertCircle,
    BadgeCheck,
    Smartphone
} from "lucide-react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card";

export default function StudentPackagesDetails() {
    const [data, setData] = useState<TStudentPackage | null>(null);
    const [loading, setLoading] = useState(true);

    const params = useParams();
    const id = params?.id as string;

    const fetchPackageDetails = async (packageId: string) => {
        setLoading(true);
        try {
            const response = await studnetPackageApi.getStudentPackageById(packageId);
            if (response?.success) {
                setData(response.data);
            }
        } catch (error) {
            console.error("Failed to fetch details:", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (id) fetchPackageDetails(id);
    }, [id]);

    if (loading) {
        return (
            <div className="flex h-[60vh] items-center justify-center">
                <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent"></div>
            </div>
        );
    }

    if (!data) return <div className="text-center p-10">No data found!</div>;

    return (
        <div className="container mx-auto max-w-6xl p-4 md:p-6 space-y-6">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div className="space-y-1">
                    <Link href="/student-package" className="text-sm text-muted-foreground hover:text-primary flex items-center gap-1">
                        <ArrowLeft size={14} /> Back to List
                    </Link>
                    <h1 className="text-2xl font-bold tracking-tight">Enrollment Details</h1>
                </div>
                <Badge className={data.status === 'ACTIVE' ? 'bg-green-500' : 'bg-red-500'}>
                    {data.status}
                </Badge>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

                {/* Left Side: Student & Package Info */}
                <div className="lg:col-span-2 space-y-6">

                    {/* Student Profile Card */}
                    <Card>
                        <CardHeader className="flex flex-row items-center gap-4">
                            <div className="h-16 w-16 rounded-full bg-primary/10 flex items-center justify-center text-primary overflow-hidden">
                                {data.student.studentImage ? (
                                    <img src={data.student.studentImage} alt="Profile" className="h-full w-full object-cover" />
                                ) : (
                                    <User size={32} />
                                )}
                            </div>
                            <div>
                                <CardTitle>{data.student.fullName}</CardTitle>
                                <p className="text-sm text-muted-foreground">ID: {data.student.id}</p>
                                <div className="flex gap-2 mt-1">
                                    <Badge variant="outline" className="text-[10px]">{data.student.studentStatus}</Badge>
                                    <Badge variant="outline" className="text-[10px] bg-blue-50 text-black font-semibold">Batch: {data.student.batchNo}</Badge>
                                </div>
                            </div>
                        </CardHeader>
                        <CardContent className="grid md:grid-cols-2 gap-4 border-t pt-6">
                            <div className="space-y-3">
                                <div className="flex items-center gap-2 text-sm">
                                    <Mail size={16} className="text-muted-foreground" />
                                    <span>{data.student.email}</span>
                                </div>
                                <div className="flex items-center gap-2 text-sm">
                                    <Phone size={16} className="text-muted-foreground" />
                                    <span>{data.student.contactNumber}</span>
                                </div>
                                <div className="flex items-center gap-2 text-sm">
                                    <Smartphone size={16} className="text-muted-foreground" />
                                    <span className="text-green-600 font-medium">WhatsApp: {data.student.whatsappStatus}</span>
                                </div>
                            </div>
                            <div className="space-y-3">
                                <div className="flex items-center gap-2 text-sm">
                                    <MapPin size={16} className="text-muted-foreground" />
                                    <span>{data.student.address}</span>
                                </div>
                                <div className="flex items-center gap-2 text-sm">
                                    <BadgeCheck size={16} className="text-muted-foreground" />
                                    <span>Profession: {data.student.profession}</span>
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Package Info Card */}
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <Package className="text-primary" size={20} />
                                Enrolled Package: {data.package.name}
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <p className="text-sm text-muted-foreground italic">"{data.package.description}"</p>
                            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 pt-2">
                                <div>
                                    <p className="text-xs text-muted-foreground">Type</p>
                                    <p className="font-semibold">{data.package.packageType}</p>
                                </div>
                                <div>
                                    <p className="text-xs text-muted-foreground">Consultancy</p>
                                    <p className="font-semibold">{data.package.consultancyType}</p>
                                </div>
                                <div>
                                    <p className="text-xs text-muted-foreground">Duration</p>
                                    <p className="font-semibold">{data.package.durationInMonths} Months</p>
                                </div>
                                <div>
                                    <p className="text-xs text-muted-foreground">Enrolled Date</p>
                                    <p className="font-semibold">{new Date(data.enrollmentDate).toLocaleDateString()}</p>
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Payment History Table */}
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2 text-lg">
                                <History size={20} /> Payment History
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="rounded-md border">
                                <table className="w-full text-sm">
                                    <thead className="bg-muted/50 border-b">
                                        <tr className="text-left">
                                            <th className="p-3">Date</th>
                                            <th className="p-3">Method</th>
                                            <th className="p-3">Type</th>
                                            <th className="p-3">Status</th>
                                            <th className="p-3 text-right">Amount</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y">
                                        {data.payments?.map((payment) => (
                                            <tr key={payment.id}>
                                                <td className="p-3 text-xs">{new Date(payment.createdAt).toLocaleDateString()}</td>
                                                <td className="p-3 font-medium uppercase text-xs">{payment.paymentMethod}</td>
                                                <td className="p-3"><Badge variant="secondary" className="text-[10px]">{payment.paymentType}</Badge></td>
                                                <td className="p-3">
                                                    <span className={`text-[10px] font-bold ${payment.paymentStatus === 'COMPLETED' ? 'text-green-600' : 'text-orange-500'}`}>
                                                        {payment.paymentStatus}
                                                    </span>
                                                </td>
                                                <td className="p-3 text-right font-bold">৳{payment.amount}</td>
                                            </tr>
                                        ))}
                                        {data.payments?.length === 0 && (
                                            <tr><td colSpan={5} className="p-4 text-center text-muted-foreground">No payments found.</td></tr>
                                        )}
                                    </tbody>
                                </table>
                            </div>
                        </CardContent>
                    </Card>
                </div>

                {/* Right Side: Billing Summary */}
                <div className="space-y-6">
                    <Card className="bg-primary text-primary-foreground">
                        <CardHeader>
                            <CardTitle className="text-lg">Billing Summary</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="flex justify-between border-b border-primary-foreground/20 pb-2">
                                <span>Package Price</span>
                                <span className="font-bold">৳{data.package.packagePrice}</span>
                            </div>
                            <div className="flex justify-between border-b border-primary-foreground/20 pb-2 text-red-200">
                                <span>Discount</span>
                                <span className="font-bold">- ৳{data.discount}</span>
                            </div>
                            <div className="flex justify-between text-xl pt-2">
                                <span>Total Payable</span>
                                <span className="font-extrabold underline">৳{data.totalPayable}</span>
                            </div>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader>
                            <CardTitle className="text-lg flex items-center gap-2">
                                <CreditCard size={18} /> Payment Status
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-6">
                            <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
                                <div>
                                    <p className="text-xs text-green-700">Total Paid</p>
                                    <p className="text-xl font-bold text-green-700">৳{data.totalPaid}</p>
                                </div>
                                <BadgeCheck className="text-green-500" size={30} />
                            </div>

                            <div className="flex items-center justify-between p-3 bg-red-50 rounded-lg border border-red-100">
                                <div>
                                    <p className="text-xs text-red-700">Remaining Due</p>
                                    <p className="text-xl font-bold text-red-700">৳{data.remainingDue}</p>
                                </div>
                                <AlertCircle className="text-red-500" size={30} />
                            </div>

                            <div className="pt-2">
                                <div className="flex justify-between text-xs mb-1">
                                    <span>Payment Progress</span>
                                    <span>{Math.round((data.totalPaid / data.totalPayable) * 100)}%</span>
                                </div>
                                <div className="w-full bg-gray-200 rounded-full h-2">
                                    <div
                                        className="bg-primary h-2 rounded-full transition-all"
                                        style={{ width: `${(data.totalPaid / data.totalPayable) * 100}%` }}
                                    ></div>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </div>

            </div>
        </div>
    );
}