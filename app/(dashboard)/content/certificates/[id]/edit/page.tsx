"use client";

import { CertificateForm } from "@/components/forms/CertificateForm";
import { Skeleton } from "@/components/ui/skeleton";
import { adminApi, Certificate } from "@/lib/api/adminApi";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { toast } from "sonner";

export default function EditCertificatePage() {
  const params = useParams();
  const router = useRouter();
  const [certificate, setCertificate] = useState<Certificate | null>(null);
  const [loading, setLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    const fetchCertificate = async () => {
      try {
        const response = await adminApi.getCertificateById(params.id as string);
        if (response.success && response.data) {
          setCertificate(response.data);
        }
      } catch (error) {
        toast.error("Failed to fetch certificate");
      } finally {
        setLoading(false);
      }
    };

    if (params.id) {
      fetchCertificate();
    }
  }, [params.id]);

  const handleSubmit = async (data: FormData) => {
    setIsSubmitting(true);
    try {
      const response = await adminApi.updateCertificate(params.id as string, data);
      if (response.success) {
        toast.success("Certificate updated successfully");
        router.push(`/content/certificates/${params.id}`);
      } else {
        toast.error("Failed to update certificate");
      }
    } catch (error) {
      toast.error("Failed to update certificate");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <Skeleton className="h-8 w-64" />
        <div className="space-y-4">
          <Skeleton className="h-32 w-full" />
          <Skeleton className="h-32 w-full" />
        </div>
      </div>
    );
  }

  if (!certificate) {
    return <div>Certificate not found</div>;
  }

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">Edit Certificate</h1>
      <CertificateForm
        certificate={certificate}
        onSubmit={handleSubmit}
        isLoading={isSubmitting}
      />
    </div>
  );
}