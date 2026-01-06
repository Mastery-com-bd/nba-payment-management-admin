"use client"

import { studentApi } from "@/lib/api/studentApi";
import { TStudent } from "@/types/student.types";
import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/Card";
import Image from "next/image";
import { Badge } from "../ui/badge";
import { Separator } from "../ui/separator";
import DetailItem from "./DetailsItem";
import { formatDOB } from "@/utills/dateFormat";
import { Mail, Phone } from "lucide-react";

const FALLBACK_IMAGE = "https://via.placeholder.com/300x300?text=No+Image";

const StudentDetails = ({id}: {id:string}) => {
    const [student, setStudent] = useState<TStudent | null>(null);
     const [loading, setLoading] = useState(true);
   
     useEffect(() => {
       const fetchStudent = async () => {
         try {
           const response = await studentApi.getASingleStudent(id);
           if (response.success && response.data) {
             setStudent(response?.data);
           }
         } catch (error) {
           console.error("Failed to fetch student:", error);
         } finally {
           setLoading(false);
         }
       };

       if (id) {
         fetchStudent();
       }
     }, [id]);
   
     if (loading) {
       return <div>Loading...</div>;
     }
   
     if (!student) {
       return <div>student not found</div>;
     }


   
    
    return (
      <div className="max-w-6xl mx-auto p-4 space-y-6">
        {/* HEADER */}
        <Card>
          <CardHeader className="flex flex-col md:flex-row gap-6">
            {/* IMAGE */}
            <div className="shrink-0">
              <Image
                src={student?.studentImage || FALLBACK_IMAGE}
                alt={student?.fullName}
                width={160}
                height={160}
                className="rounded-lg object-cover border"
              />
            </div>

            {/* BASIC INFO */}
            <div className="flex-1 space-y-2">
              <CardTitle className="text-2xl">{student?.fullName}</CardTitle>

              <div className="space-y-2 flex flex-col items-start">
                <Badge variant="outline">Batch: {student?.batchNo}</Badge>

                <Badge>Student Status: {student?.studentStatus}</Badge>

                <Badge variant="secondary">
                  WhatsApp Status: {student?.whatsappStatus}
                </Badge>

                <Badge variant="outline">Gender: {student?.gender}</Badge>
              </div>

              <div className="space-y-1">
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Mail className="h-4 w-4" />
                  <span>{student?.email}</span>
                </div>

                <div className="flex items-center gap-2 text-sm">
                  <Phone className="h-4 w-4" />
                  <span>{student?.contactNumber}</span>
                </div>
              </div>
            </div>
          </CardHeader>
        </Card>

        {/* DETAILS */}
        <Card>
          <CardHeader>
            <CardTitle>Student Information</CardTitle>
          </CardHeader>

          <CardContent className="grid md:grid-cols-2 gap-6">
            <DetailItem
              label="Date of Birth"
              value={formatDOB(student?.dateOfBirth)}
            />
            <DetailItem label="Profession" value={student?.profession} />
            <DetailItem label="Address" value={student?.address} />
            <DetailItem
              label="Joined At"
              value={formatDOB(student?.createdAt)}
            />

            {student?.bio && (
              <>
                <Separator className="md:col-span-2" />
                <DetailItem
                  label="Bio"
                  value={student?.bio}
                  className="md:col-span-2"
                />
              </>
            )}
          </CardContent>
        </Card>
      </div>
    );
};

export default StudentDetails;