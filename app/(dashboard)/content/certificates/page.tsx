"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { adminApi, Certificate } from "@/lib/api/adminApi";
import {
  ArrowLeft,
  ChevronLeft,
  ChevronRight,
  Eye,
  FileText,
  Plus,
  Search,
  Trash2,
} from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";
import { toast } from "sonner";

export default function CertificatesPage() {
  const [certificates, setCertificates] = useState<Certificate[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [certificateToDelete, setCertificateToDelete] = useState<string | null>(null);
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 10,
    total: 0,
    totalPages: 0,
  });

  const fetchCertificates = async (page = 1, search = "") => {
    setLoading(true);
    try {
      const response = await adminApi.getAllCertificates({
        page,
        limit: pagination.limit,
        searchTerm: search || undefined,
      });
      if (response.success && response.data) {
        setCertificates(response.data);
        setPagination({
          page: response.meta?.page || 1,
          limit: response.meta?.limit || 10,
          total: response.meta?.total || 0,
          totalPages:
            response.meta?.totalPages ||
            Math.ceil(
              (response.meta?.total || 0) / (response.meta?.limit || 10)
            ),
        });
      }
    } catch (error) {
      toast.error("Failed to fetch certificates");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCertificates();
  }, []);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    fetchCertificates(1, searchTerm);
  };

  const handlePageChange = (page: number) => {
    fetchCertificates(page, searchTerm);
  };

  const handleDeleteClick = (id: string) => {
    setCertificateToDelete(id);
  };

  const confirmDelete = async () => {
    if (!certificateToDelete) return;

    try {
      const response = await adminApi.deleteCertificate(certificateToDelete);
      if (response.success) {
        toast.success("Certificate deleted successfully");
        fetchCertificates(pagination.page, searchTerm);
      } else {
        toast.error("Failed to delete certificate");
      }
    } catch (error) {
      toast.error("Failed to delete certificate");
    } finally {
      setCertificateToDelete(null);
    }
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <Skeleton className="h-8 w-48" />
          <Skeleton className="h-10 w-32" />
        </div>
        <Card>
          <CardHeader>
            <Skeleton className="h-6 w-32" />
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {[...Array(5)].map((_, i) => (
                <Skeleton key={i} className="h-12 w-full" />
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center gap-4">
        <div className="flex items-center gap-4">
          <Link
            href="/content"
            className="p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-all"
          >
            <ArrowLeft className="w-5 h-5" />
          </Link>
          <div>
            <h1 className="text-3xl font-bold">Certificates</h1>
            <p className="text-muted-foreground">Manage user certificates</p>
          </div>
        </div>
        <Link href="/content/certificates/create">
          <Button>
            <Plus className="h-4 w-4 mr-2" />
            Create Certificate
          </Button>
        </Link>
      </div>

      <Card>
        <CardHeader>
          <div className="flex justify-between items-center">
            <CardTitle>All Certificates</CardTitle>
            <form onSubmit={handleSearch} className="flex gap-2">
              <Input
                placeholder="Search certificates..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-64"
              />
              <Button type="submit" variant="outline" size="icon">
                <Search className="h-4 w-4" />
              </Button>
            </form>
          </div>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>User</TableHead>
                <TableHead>Quiz</TableHead>
                <TableHead>Score</TableHead>
                <TableHead>Issued Date</TableHead>
                <TableHead>Certificate</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {certificates.map((certificate) => (
                <TableRow key={certificate.id}>
                  <TableCell>
                    {certificate.user?.full_name ||
                      `User ${certificate.user_id.slice(0, 8)}`}
                  </TableCell>
                  <TableCell>
                    {certificate.quiz?.title ||
                      `Quiz ${certificate.quiz_id.slice(0, 8)}`}
                  </TableCell>
                  <TableCell>
                    <Badge variant="secondary">
                      {certificate.score_achieved}%
                    </Badge>
                  </TableCell>
                  <TableCell>
                    {new Date(certificate.issued_at).toLocaleDateString()}
                  </TableCell>
                  <TableCell>
                    {certificate.certificate_url ? (
                      <a
                        href={certificate.certificate_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-500 hover:underline"
                      >
                        <FileText className="h-4 w-4" />
                      </a>
                    ) : (
                      "No certificate"
                    )}
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <Link href={`/content/certificates/${certificate.id}`}>
                        <Button variant="outline" size="sm">
                          <Eye className="h-4 w-4" />
                        </Button>
                      </Link>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleDeleteClick(certificate.id)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Pagination */}
      {/* {pagination.total > pagination.limit && (
        <div className="flex justify-between items-center">
          <p className="text-sm text-muted-foreground">
            Showing {((pagination.page - 1) * pagination.limit) + 1} to {Math.min(pagination.page * pagination.limit, pagination.total)} of {pagination.total} results
          </p>
          <div className="flex gap-2">
            <Button
              variant="outline"
              onClick={() => handlePageChange(pagination.page - 1)}
              disabled={pagination.page === 1 || loading}
            >
              Previous
            </Button>
            <span className="flex items-center px-4">
              Page {pagination.page} of {pagination.totalPages}
            </span>
            <Button
              variant="outline"
              onClick={() => handlePageChange(pagination.page + 1)}
              disabled={pagination.page === pagination.totalPages || loading}
            >
              Next
            </Button>
          </div>
        </div>
      )} */}

      {/* Pagination */}
      {pagination && (
        <div className="flex items-center justify-between space-x-2 py-4">
          <div className="text-sm text-muted-foreground">
            Showing {(pagination.page - 1) * pagination.limit + 1} to{" "}
            {Math.min(pagination.page * pagination.limit, pagination.total)} of{" "}
            {pagination.total} entries
          </div>
          <div className="flex items-center space-x-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => handlePageChange(pagination.page - 1)}
              disabled={pagination.page <= 1}
            >
              <ChevronLeft className="h-4 w-4" />
              Previous
            </Button>
            <div className="flex items-center space-x-1">
              {Array.from(
                { length: Math.min(5, pagination.totalPages) },
                (_, i) => {
                  const pageNum = i + 1;
                  return (
                    <Button
                      key={pageNum}
                      variant={
                        pagination.page === pageNum ? "default" : "outline"
                      }
                      size="sm"
                      onClick={() => handlePageChange(pageNum)}
                    >
                      {pageNum}
                    </Button>
                  );
                }
              )}
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={() => handlePageChange(pagination.page + 1)}
              disabled={pagination.page >= pagination.totalPages}
            >
              Next
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        </div>
      )}

      {/* Delete Confirmation Dialog */}
      <AlertDialog
        open={!!certificateToDelete}
        onOpenChange={(open) => !open && setCertificateToDelete(null)}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete the
              certificate and remove all associated data from our servers.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={() => setCertificateToDelete(null)}>
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={confirmDelete}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              Delete Certificate
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
