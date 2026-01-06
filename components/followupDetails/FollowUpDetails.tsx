"use client";

import { followUpApi } from "@/lib/api/followUpApi";
import { TFollowUpALlData } from "@/types/followUpTypes";
import { useEffect, useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/Card";

type TPackage = {
  id: string;
  name: string;
  description: string;
  packageStatus: string;
  packageType: string;
  packagePrice: number;
  consultancyType: string;
  durationInMonths: number;
};

type TEnrollment = {
  id: string;
  discount: number;
  dueAmount: number;
  totalPayable: number;
  enrollmentDate: string;
  status: string;
  package: TPackage;
};

type TPayment = {
  id: string;
  amount: number;
  paymentMethod: string;
  paymentStatus: string;
  paymentType: string;
  transactionId: string;
  paymentVerificationFile: string | null;
  createdAt: string;
};

type TStudent = {
  id: string;
  fullName: string;
  email: string;
  contactNumber: string;
  batchNo: string;
  studentStatus: string;
  whatsappStatus: string;
  address: string | null;
  profession: string | null;
  bio: string | null;
  gender: string;
  dateOfBirth: string;
  enrollments: TEnrollment[];
  payments: TPayment[];
};

type TFollowUpDetails = {
  id: string;
  followUpDate: string;
  followUpCounter: number;
  notes: string;
  createdAt: string;
  updatedAt: string;
  student: TStudent;
};

const FollowUpDetails = ({id}: {id: string}) => {

    const [followUp, setFollowUp] = useState<TFollowUpALlData | null>(null);
         const [loading, setLoading] = useState(true);
       
         useEffect(() => {
           const fetchFollowUp = async () => {
             try {
               const response = await followUpApi.getASingleFollowUps(id);
               if (response.success && response.data) {
                 setFollowUp(response?.data);
               }
             } catch (error) {
               console.error("Failed to fetch follow up:", error);
             } finally {
               setLoading(false);
             }
           };

           if (id) {
             fetchFollowUp();
           }
         }, [id]);
       
         if (loading) {
           return <div>Loading...</div>;
         }
       
         if (!followUp) {
           return <div>followup not found</div>;
         }

    return (
      <ScrollArea className="h-full w-full p-4">
        <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
          {/* Left Column */}
          <div className="space-y-6">
            {/* Follow-up Info */}
            <Card>
              <CardHeader>
                <CardTitle>Follow‑Up Information</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <Info
                  label="Follow‑Up Date"
                  value={new Date(followUp?.followUpDate).toLocaleString()}
                />
                <Info
                  label="Follow‑Up Count"
                  value={followUp.followUpCounter}
                />
                <Info label="Notes" value={followUp.notes} />
              </CardContent>
            </Card>

            {/* Student Info */}
            <Card>
              <CardHeader className="flex flex-row items-center gap-3">
                <Avatar>
                  <AvatarFallback>
                    {followUp?.student?.fullName.charAt(0)}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <CardTitle>{followUp?.student?.fullName}</CardTitle>
                  <p className="text-sm text-muted-foreground">
                    {followUp?.student?.email}
                  </p>
                </div>
              </CardHeader>
              <CardContent className="space-y-2">
                <Info
                  label="Contact"
                  value={followUp?.student?.contactNumber}
                />
                <Info label="Batch" value={followUp?.student?.batchNo} />
                <Info label="Gender" value={followUp?.student?.gender} />
                <Info
                  label="DOB"
                  value={new Date(
                    followUp?.student?.dateOfBirth,
                  ).toDateString()}
                />
                <div className="flex gap-2">
                  <Badge>{followUp?.student?.studentStatus}</Badge>
                  <Badge variant="outline">
                    WhatsApp: {followUp?.student?.whatsappStatus}
                  </Badge>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Right Column */}
          <div className="xl:col-span-2 space-y-6">
            {/* Enrollments */}
            <Card>
              <CardHeader>
                <CardTitle>Enrollments</CardTitle>
              </CardHeader>
              <CardContent>
                {followUp?.student?.enrollments?.length ? (
                  (
                    followUp?.student?.enrollments as TEnrollment[] | undefined
                  )?.map((enroll: TEnrollment) => (
                    <div key={enroll.id} className="mb-6">
                      <div className="flex flex-wrap gap-2 mb-2">
                        <Badge>{enroll.status}</Badge>

                        {enroll.package && (
                          <Badge variant="outline">
                            {enroll.package.packageType}
                          </Badge>
                        )}
                      </div>

                      <Info
                        label="Package"
                        value={enroll.package?.name ?? "N/A"}
                      />
                      <Info
                        label="Price"
                        value={
                          enroll.package
                            ? `৳${enroll.package.packagePrice}`
                            : "N/A"
                        }
                      />
                      <Info label="Discount" value={`৳${enroll.discount}`} />
                      <Info
                        label="Total Payable"
                        value={`৳${enroll.totalPayable}`}
                      />
                      <Info label="Due" value={`৳${enroll.dueAmount}`} />

                      <Separator className="my-4" />
                    </div>
                  ))
                ) : (
                  <p className="text-sm text-muted-foreground">
                    No enrollments found
                  </p>
                )}
              </CardContent>
            </Card>

            {/* Payments */}
            <Card>
              <CardHeader>
                <CardTitle>Payments</CardTitle>
              </CardHeader>
              <CardContent>
                {followUp?.student?.payments.length === 0 ? (
                  <Empty text="No payments found" />
                ) : (
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Amount</TableHead>
                        <TableHead>Method</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead>Type</TableHead>
                        <TableHead>Transaction</TableHead>
                        <TableHead>Date</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {followUp?.student?.payments.map((p: any) => (
                        <TableRow key={p.id}>
                          <TableCell>৳{p.amount}</TableCell>
                          <TableCell>{p.paymentMethod}</TableCell>
                          <TableCell>
                            <Badge>{p.paymentStatus}</Badge>
                          </TableCell>
                          <TableCell>{p.paymentType}</TableCell>
                          <TableCell className="truncate max-w-35">
                            {p.transactionId}
                          </TableCell>
                          <TableCell>
                            {new Date(p.createdAt).toLocaleDateString()}
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </ScrollArea>
    );
};

export default FollowUpDetails;


function Info({ label, value }: { label: string; value: any }) {
  return (
    <div className="flex justify-between text-sm">
      <span className="text-muted-foreground">{label}</span>
      <span className="font-medium text-right max-w-[60%] wrap-break-word">
        {value ?? "—"}
      </span>
    </div>
  );
}

function Empty({ text }: { text: string }) {
  return (
    <div className="text-center text-sm text-muted-foreground py-6">{text}</div>
  );
}