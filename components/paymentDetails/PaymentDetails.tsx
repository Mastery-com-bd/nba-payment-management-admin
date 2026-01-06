"use client"

import { paymentApi } from "@/lib/api/paymentApi";
import { TPayment } from "@/types/payment.types";
import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/Card";
import { Separator } from "../ui/separator";
import { Calendar, CreditCard, DollarSign, Package, User } from "lucide-react";
import { Badge } from "../ui/badge";
import { ScrollArea } from "../ui/scroll-area";

const PaymentDetails = ({id}: {id:string}) => {

     const [payment, setPayemnt] = useState<TPayment | null>(null);
         const [loading, setLoading] = useState(true);
       
         useEffect(() => {
           const fetchQuiz = async () => {
             try {
               const response = await paymentApi.getASinglePayment(id);
               if (response.success && response.data) {
                 setPayemnt(response?.data);
               }
             } catch (error) {
               console.error("Failed to fetch quiz:", error);
             } finally {
               setLoading(false);
             }
           };
       
           if (id) {
             fetchQuiz();
           }
         }, [id]);

          const formatDate = (date: string) =>
            new Date(date).toLocaleDateString("en-US", {
              year: "numeric",
              month: "long",
              day: "numeric",
            });

          const formatCurrency = (amt: number) => `$${amt.toFixed(2)}`;

       console.log(payment)
         if (loading) {
           return <div>Loading...</div>;
         }
       
         if (!payment) {
           return <div>Payment not found</div>;
         }

    return (
      <Card className="w-full md:max-w-4xl mx-auto">
        <CardHeader>
          <CardTitle>Payment Details</CardTitle>
        </CardHeader>
        <CardContent>
          <ScrollArea className="space-y-6 max-h-150">
            {/* Student Info */}
            <div className="space-y-2">
              <h3 className="text-lg font-semibold">Student Info</h3>
              <Separator />
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="flex items-center gap-2">
                  <User className="w-5 h-5 text-muted-foreground" />
                  <span>{payment?.student?.fullName}</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-sm text-muted-foreground">Email:</span>
                  <span>{payment?.student?.email}</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-sm text-muted-foreground">
                    Contact:
                  </span>
                  <span>{payment?.student?.contactNumber}</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-sm text-muted-foreground">Batch:</span>
                  <Badge variant="outline">{payment?.student?.batchNo}</Badge>
                </div>
              </div>
            </div>

            {/* Package Info */}
            <div className="space-y-2">
              <h3 className="text-lg font-semibold">Package Info</h3>
              <Separator />
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="flex items-center gap-2">
                  <Package className="w-5 h-5 text-muted-foreground" />
                  <span>{payment?.studentPackage?.package?.name}</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-sm text-muted-foreground">
                    Total Payable:
                  </span>
                  <span>
                    {formatCurrency(payment?.studentPackage.totalPayable)}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-sm text-muted-foreground">
                    Due Amount:
                  </span>
                  <span>
                    {formatCurrency(payment?.studentPackage?.dueAmount)}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-sm text-muted-foreground">
                    Discount:
                  </span>
                  <span>
                    {formatCurrency(payment?.studentPackage?.discount)}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <Calendar className="w-5 h-5 text-muted-foreground" />
                  <span>
                    Enrollment Date:{" "}
                    {formatDate(payment?.studentPackage?.enrollmentDate)}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <Badge
                    variant={
                      payment?.studentPackage?.status === "ACTIVE"
                        ? "success"
                        : "destructive"
                    }>
                    {payment?.studentPackage?.status}
                  </Badge>
                </div>
              </div>
            </div>

            {/* Payment Info */}
            <div className="space-y-2">
              <h3 className="text-lg font-semibold">Payment Info</h3>
              <Separator />
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="flex items-center gap-2">
                  <DollarSign className="w-5 h-5 text-muted-foreground" />
                  <span>Amount Paid: {formatCurrency(payment?.amount)}</span>
                </div>
                <div className="flex items-center gap-2">
                  <CreditCard className="w-5 h-5 text-muted-foreground" />
                  <span>Method: {payment?.paymentMethod}</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-sm text-muted-foreground">Status:</span>
                  <Badge
                    variant={
                      payment?.paymentStatus === "COMPLETED"
                        ? "success"
                        : payment?.paymentStatus === "REFUND"
                        ? "destructive"
                        : payment?.paymentStatus === "FAILED"
                        ? "destructive"
                        : "default"
                    }>
                    {payment?.paymentStatus}
                  </Badge>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-sm text-muted-foreground">Type:</span>
                  <Badge variant="secondary">{payment?.paymentType}</Badge>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-sm text-muted-foreground">
                    Transaction ID:
                  </span>
                  <span>{payment?.transactionId}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Calendar className="w-5 h-5 text-muted-foreground" />
                  <span>Created At: {formatDate(payment?.createdAt)}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Calendar className="w-5 h-5 text-muted-foreground" />
                  <span>Updated At: {formatDate(payment?.updatedAt)}</span>
                </div>
                {payment?.paymentVerificationFile && (
                  <div className="flex items-center gap-2">
                    <a
                      href={payment?.paymentVerificationFile}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-600 underline">
                      View Verification File
                    </a>
                  </div>
                )}
              </div>
            </div>
          </ScrollArea>
        </CardContent>
      </Card>
    );
};

export default PaymentDetails;