'use client';

import { packageApi } from "@/lib/api/pacakge";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import {  
  CheckCircle2, 
  Clock, 
  DollarSign, 
  Users, 
  ArrowLeft, 
  ShieldCheck
} from "lucide-react";
import Link from "next/link";
import { TPackage } from "@/types/pacakge.types";

export default function PackageDetailsPage() {
  const [pkg, setPkg] = useState<TPackage | null>(null);
  const [loading, setLoading] = useState(true);

  const params = useParams();
  const id = params?.id as string;

  const fetchPackage = async (packageId: string) => {
    setLoading(true);
    try {
      const response = await packageApi.getPackageById(packageId);
      if (response?.success) {
        setPkg(response.data);
      }
    } catch (error) {
      console.error("Failed to fetch package:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (id) {
      fetchPackage(id);
    }
  }, [id]);

  if (loading) {
    return (
      <div className="flex h-[60vh] items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent"></div>
      </div>
    );
  }

  if (!pkg) {
    return (
      <div className="flex h-[60vh] flex-col items-center justify-center space-y-4">
        <h2 className="text-xl font-semibold">Package not found</h2>
        <Link href="/packages" className="text-blue-600 hover:underline flex items-center gap-2">
          <ArrowLeft size={16} /> Back to Packages
        </Link>
      </div>
    );
  }

  return (
    <div className="container mx-auto max-w-6xl p-6 space-y-8">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b pb-6">
        <div>
          <Link href="/package" className="text-sm text-muted-foreground hover:text-primary flex items-center gap-1 mb-2">
            <ArrowLeft size={14} /> Back to Packages
          </Link>
          <h1 className="text-3xl font-bold tracking-tight">{pkg.name}</h1>
          <p className="text-muted-foreground mt-1 max-w-2xl">{pkg.description}</p>
        </div>
        <div className="flex gap-3">
          <span className={`px-3 py-1 rounded-full text-xs font-medium ${
            pkg.packageStatus === 'ACTIVE' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
          }`}>
            {pkg.packageStatus}
          </span>
          <span className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-xs font-medium">
            {pkg.packageType}
          </span>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-4 rounded-xl border bg-card shadow-sm flex items-center gap-4">
          <div className="p-2 bg-green-50 rounded-lg text-green-600">
            <DollarSign size={24} />
          </div>
          <div>
            <p className="text-sm text-muted-foreground">Price</p>
            <p className="text-lg font-bold">৳{pkg.packagePrice.toLocaleString()}</p>
          </div>
        </div>

        <div className="p-4 rounded-xl border bg-card shadow-sm flex items-center gap-4">
          <div className="p-2 bg-blue-50 rounded-lg text-blue-600">
            <Clock size={24} />
          </div>
          <div>
            <p className="text-sm text-muted-foreground">Duration</p>
            <p className="text-lg font-bold">{pkg.durationInMonths} Months</p>
          </div>
        </div>

        <div className="p-4 rounded-xl border bg-card shadow-sm flex items-center gap-4">
          <div className="p-2 bg-purple-50 rounded-lg text-purple-600">
            <ShieldCheck size={24} />
          </div>
          <div>
            <p className="text-sm text-muted-foreground">Consultancy</p>
            <p className="text-lg font-bold">{pkg.consultancyType}</p>
          </div>
        </div>

        <div className="p-4 rounded-xl border bg-card shadow-sm flex items-center gap-4">
          <div className="p-2 bg-orange-50 rounded-lg text-orange-600">
            <Users size={24} />
          </div>
          <div>
            <p className="text-sm text-muted-foreground">Total Enrolled</p>
            <p className="text-lg font-bold">{pkg._count?.enrollments ?? 0}</p>
          </div>
        </div>
      </div>

      {/* Enrolled Students Table */}
      <div className="space-y-4">
        <h2 className="text-xl font-semibold flex items-center gap-2">
          <CheckCircle2 className="text-primary" size={20} />
          Recent Enrollments
        </h2>
        
        <div className="rounded-md border overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-muted/50 border-b">
              <tr className="text-left font-medium">
                <th className="p-4">Student Name</th>
                <th className="p-4">Enrollment Date</th>
                <th className="p-4">Total Payable</th>
                <th className="p-4">Due</th>
                <th className="p-4">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y">
              {pkg.enrollments?.length > 0 ? (
                pkg.enrollments.map((enrol) => (
                  <tr key={enrol.id} className="hover:bg-muted/50 transition-colors">
                    <td className="p-4 font-medium">
                      <div>
                        <p>{enrol.student.fullName}</p>
                        <p className="text-xs text-muted-foreground">{enrol.student.email}</p>
                      </div>
                    </td>
                    <td className="p-4 text-muted-foreground">
                      {new Date(enrol.enrollmentDate).toLocaleDateString()}
                    </td>
                    <td className="p-4">৳{enrol.totalPayable}</td>
                    <td className="p-4">
                      <span className={enrol.dueAmount > 0 ? "text-red-500 font-semibold" : "text-green-600"}>
                        ৳{enrol.dueAmount}
                      </span>
                    </td>
                    <td className="p-4">
                      <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                        enrol.status === 'ACTIVE' ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-700'
                      }`}>
                        {enrol.status}
                      </span>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={5} className="p-8 text-center text-muted-foreground">
                    No enrollments found for this package.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}