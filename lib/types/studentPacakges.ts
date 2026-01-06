// Student basic information interface
export interface IStudent {
  id: string;
  fullName: string;
  email: string;
  batchNo: string;
  contactNumber: string;
  studentStatus: "IRREGULAR" | "REGULAR" | "BLOCKED" | "FAKED";
  whatsappStatus: "ACTIVE" | "INACTIVE"| "DONE";
  studentImage: string | null;
  address: string;
  createdAt: string;
  updatedAt: string;
  profession: string;
  bio: string;
  gender: "MALE" | "FEMALE";
  dateOfBirth: string;
  isDeleted: boolean;
}

// Package detailed information interface
export interface IPackage {
  id: string;
  name: string;
  description: string;
  packageStatus: "ACTIVE" | "INACTIVE";
  packageType: "BASIC" | "ADVANCED" | "CONSULTANCY";
  packagePrice: number;
  consultancyType: "SIXMONTHS" | "ONEYEAR";
  durationInMonths: number;
  createdAt: string;
  updatedAt: string;
}

// Payment history interface
export interface IPayment {
  id: string;
  amount: number;
  paymentMethod: string;
  paymentStatus:
  | "PENDING"
  | "PARTIAL"
  | "COMPLETED"
  | "FAILED"
  | "REFUND";
  createdAt: string;
  paymentType: "BOOKING" | "MONTHLY" | "FINAL";
  transactionId: string;
  studentId: string;
  studentPackageId: string;
  paymentVerificationFile: string | null;
  updatedAt: string;
}
  

// Main Student-Package interface
export interface TStudentPackage {
  id: string;
  studentId: string;
  packageId: string;
  discount: number;
  dueAmount: number;
  totalPayable: number;
  enrollmentDate: string;
  status: "ACTIVE" | "INACTIVE";
  createdAt: string;
  updatedAt: string;
  student: IStudent;
  package: IPackage;
  payments: IPayment[];
  _count: {
    payments: number;
  };
  totalPaid: number;
  remainingDue: number;
}

// API Response type
export interface TStudentPackagesResponse {
  data: TStudentPackage[];
}

// ============================ Student package types end ============================
