"use client"

import { paymentApi } from "@/lib/api/paymentApi";
import { TPayment } from "@/types/payment.types";
import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/Card";
import { Separator } from "../ui/separator";
import { Calendar, CreditCard, DollarSign, Package, User } from "lucide-react";
import { Badge } from "../ui/badge";
import { ScrollArea } from "../ui/scroll-area";
import Image from "next/image";
import { Button } from "../ui/button";

const PaymentDetails = ({ id }: { id: string }) => {
  const [payment, setPayemnt] = useState<TPayment | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPayment = async () => {
      try {
        const response = await paymentApi.getASinglePayment(id);
        if (response.success && response.data) {
          setPayemnt(response?.data);
        }
      } catch (error) {
        console.error("Failed to fetch payment:", error);
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchPayment();
    }
  }, [id]);

  const formatDate = (date: string) =>
    new Date(date).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });

  const formatCurrency = (amt: number) => `$${amt.toFixed(2)}`;

  if (loading) {
    return <div>Loading...</div>;
  }

  if (!payment) {
    return <div>Payment not found</div>;
  }

  return (
    <div className="max-w-7xl mx-auto p-4 space-y-6">
      {/* ================= PAYMENT SUMMARY ================= */}
      <Card>
        <CardHeader>
          <CardTitle className="text-xl">Payment Details</CardTitle>
        </CardHeader>

        <CardContent className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <p className="text-sm text-muted-foreground">Amount</p>
            <p className="text-lg font-semibold">৳ {payment.amount}</p>
          </div>

          <div>
            <p className="text-sm text-muted-foreground">Transaction ID</p>
            <p className="font-medium break-all">{payment.transactionId}</p>
          </div>

          <div className="flex flex-wrap gap-2 items-center">
            <Badge>{payment.paymentStatus}</Badge>
            <Badge variant="outline">{payment.paymentMethod}</Badge>
            <Badge variant="secondary">{payment.paymentType}</Badge>
          </div>
        </CardContent>
      </Card>

      {/* ================= STUDENT INFO ================= */}
      {payment.student && (
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Student Information</CardTitle>
          </CardHeader>

          <CardContent className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="md:col-span-1">
              {payment?.student?.studentImage ? (
                <Image
                  src={payment.student.studentImage}
                  alt="Student"
                  width={150}
                  height={150}
                  className="rounded-lg object-cover"
                />
              ) : (
                <div className="w-37.5 h-37.5 bg-muted rounded-lg flex items-center justify-center text-sm">
                  No Image
                </div>
              )}
            </div>

            <div className="md:col-span-3 grid grid-cols-1 sm:grid-cols-2 gap-4">
              <p>
                <strong>Name:</strong> {payment.student.fullName}
              </p>
              <p>
                <strong>Email:</strong> {payment.student.email}
              </p>
              <p>
                <strong>Contact:</strong> {payment.student.contactNumber}
              </p>
              <p>
                <strong>Batch:</strong> {payment.student.batchNo}
              </p>
              <p>
                <strong>Status:</strong> {payment.student.studentStatus}
              </p>
              <p>
                <strong>WhatsApp:</strong> {payment.student.whatsappStatus}
              </p>
              <p>
                <strong>Gender:</strong> {payment.student.gender}
              </p>
              <p>
                <strong>DOB:</strong>{" "}
                {new Date(payment.student.dateOfBirth).toDateString()}
              </p>
              <p className="sm:col-span-2">
                <strong>Address:</strong> {payment.student.address}
              </p>
              <p className="sm:col-span-2">
                <strong>Profession:</strong> {payment.student.profession}
              </p>
            </div>
          </CardContent>
        </Card>
      )}

      {/* ================= ENROLLMENT & PACKAGE ================= */}
      {payment.studentPackage && (
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Enrollment & Package</CardTitle>
          </CardHeader>

          <CardContent className="space-y-4">
            <div className="flex flex-wrap gap-2">
              <Badge>{payment.studentPackage.status}</Badge>
              <Badge variant="outline">
                {payment.studentPackage.package.packageType}
              </Badge>
            </div>

            <Separator />

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
              <p>
                <strong>Package:</strong> {payment.studentPackage.package.name}
              </p>
              <p>
                <strong>Price:</strong> ৳{" "}
                {payment.studentPackage.package.packagePrice}
              </p>
              <p>
                <strong>Discount:</strong> ৳ {payment.studentPackage.discount}
              </p>
              <p>
                <strong>Total Payable:</strong> ৳{" "}
                {payment.studentPackage.totalPayable}
              </p>
              <p>
                <strong>Due:</strong> ৳ {payment.studentPackage.dueAmount}
              </p>
              <p>
                <strong>Duration:</strong>{" "}
                {payment.studentPackage.package.durationInMonths} months
              </p>
              <p className="sm:col-span-2 md:col-span-3">
                <strong>Description:</strong>{" "}
                {payment.studentPackage.package.description}
              </p>
            </div>
          </CardContent>
        </Card>
      )}

      {/* ================= VERIFICATION FILE ================= */}
      {payment.paymentVerificationFile && (
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Payment Verification</CardTitle>
          </CardHeader>

          <CardContent>
            <Button asChild>
              <a
                href={payment.paymentVerificationFile}
                target="_blank"
                rel="noopener noreferrer">
                View Verification File
              </a>
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default PaymentDetails;
