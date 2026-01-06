export type TStudentStatus =  | "ACTIVE"
    | "INACTIVE"
    | "BLOCKED"
    | "IRREGULAR"
    | "FAKED"

export type TWhatsappStatus = "ACTIVE" |
"INACTIVE" |
"DONE" 

export type TGender = "MALE" |
"FEMALE" |
"OTHERS" 



export type TStudent = {
  id: string;
  email: string;
  fullName: string;
  batchNo: string;
  contactNumber: string;
  studentStatus: TStudentStatus;
  whatsappStatus: TWhatsappStatus;
  studentImage: string | null;
  address: string;
  profession: string;
  bio: string;
  gender: TGender;
  dateOfBirth: string;
  isDeleted: boolean;
  createdAt: string;
  updatedAt: string;
  enrollments: unknown[];
  payments: unknown[];
  _count: {
    enrollments: number;
    payments: number;
    followUps: number;
  };
};
type TPackageStatus = "ACTIVE" | "INACTIVE" | "EXPIRED";
type TPackageType = "BASIC" | "ADVANCED" | "CONSULTANCY";

export type TStudentEnrollment = {
  id: string;
  studentId: string;
  packageId: string;
  discount: number;
  dueAmount: number;
  totalPayable: number;
  enrollmentDate: string;
  status: TPackageStatus;
  createdAt: string;
  updatedAt: string;
  package: {
    id: string;
    name: string;
    description: string;
    packageStatus: TPackageStatus;
    packageType: TPackageType;
    packagePrice: number;
    consultancyType: "SIXMONTHS" | "ONEYEAR"; // extend if needed
    durationInMonths: number;
    createdAt: string;
    updatedAt: string;
  };
};
