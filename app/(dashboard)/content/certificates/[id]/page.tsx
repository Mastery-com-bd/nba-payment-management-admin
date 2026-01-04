"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card";
import { Skeleton } from "@/components/ui/skeleton";
import { adminApi, Certificate } from "@/lib/api/adminApi";
import { Edit, FileText } from "lucide-react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import { toast } from "sonner";

export default function CertificateDetailPage() {
  const params = useParams();
  const [certificate, setCertificate] = useState<Certificate | null>(null);
  const [loading, setLoading] = useState(true);

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

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <Skeleton className="h-8 w-64" />
          <Skeleton className="h-10 w-32" />
        </div>
        <Card>
          <CardHeader>
            <Skeleton className="h-6 w-48" />
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {[...Array(6)].map((_, i) => (
                <div key={i} className="flex justify-between">
                  <Skeleton className="h-4 w-32" />
                  <Skeleton className="h-4 w-48" />
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (!certificate) {
    return <div>Certificate not found</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Certificate Details</h1>
        <Link href={`/content/certificates/${certificate.id}/edit`}>
          <Button>
            <Edit className="h-4 w-4 mr-2" />
            Edit Certificate
          </Button>
        </Link>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Certificate Information</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            <div>
              <h3 className="font-semibold text-sm text-muted-foreground">
                Certificate ID
              </h3>
              <p>{certificate.id}</p>
            </div>
            <div>
              <h3 className="font-semibold text-sm text-muted-foreground">
                User
              </h3>
              <p>{certificate.user?.name || certificate.user_id}</p>
            </div>
            <div>
              <h3 className="font-semibold text-sm text-muted-foreground">
                Quiz
              </h3>
              <p>{certificate.quiz?.title || certificate.quiz_id}</p>
            </div>
            <div>
              <h3 className="font-semibold text-sm text-muted-foreground">
                Score Achieved
              </h3>
              <Badge variant="secondary">{certificate.score_achieved}%</Badge>
            </div>
            <div>
              <h3 className="font-semibold text-sm text-muted-foreground">
                Issued Date
              </h3>
              <p>{new Date(certificate.issued_at).toLocaleString()}</p>
            </div>
            <div>
              <h3 className="font-semibold text-sm text-muted-foreground">
                Certificate File
              </h3>
              {certificate.certificate_url ? (
                <a
                  href={certificate.certificate_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 text-blue-500 hover:underline"
                >
                  <FileText className="h-4 w-4" />
                  View Certificate
                </a>
              ) : (
                <p className="text-muted-foreground">No certificate file</p>
              )}
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}