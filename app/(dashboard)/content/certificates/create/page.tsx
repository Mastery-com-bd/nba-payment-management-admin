"use client";

import { CertificateForm } from "@/components/forms/CertificateForm";
import { adminApi } from "@/lib/api/adminApi";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";

export default function CreateCertificatePage() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (data: FormData) => {
    setIsLoading(true);
    try {
      const response = await adminApi.createCertificate(data);
      if (response.success) {
        toast.success("Certificate created successfully");
        router.push("/content/certificates");
      } else {
        toast.error("Failed to create certificate");
      }
    } catch (error) {
      toast.error("Failed to create certificate");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Link
          href="/content"
          className="p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-all"
        >
          <ArrowLeft className="w-5 h-5" />
        </Link>
        <div>
          <h1 className="text-3xl font-bold">Certificates</h1>
          <p className="text-muted-foreground">Manage your certificates</p>
        </div>
      </div>
      <CertificateForm onSubmit={handleSubmit} isLoading={isLoading} />
    </div>
  );
}
