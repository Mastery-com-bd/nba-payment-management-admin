// Student basic information interface
export interface IStudent {
  id: string;
  fullName: string;
  email: string;
  batchNo: string;
  contactNumber: string;
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
  paymentStatus:   
  | "PENDING"
  | "PARTIAL"
  | "COMPLETED"
  | "FAILED"
  | "REFUND"
  paymentMethod: string;
  createdAt: string;
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