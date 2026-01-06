// Student type
export interface Student {
  id: string;
  fullName: string;
  email: string;
}

// Enrollment type
export interface Enrollment {
  id: string;
  studentId: string;
  packageId: string;
  discount: number;
  dueAmount: number;
  totalPayable: number;
  enrollmentDate: string; // ISO date string
  status: "ACTIVE" | "EXPIRED" | "CANCELLED"; // future-proof
  createdAt: string;
  updatedAt: string;
  student: Student;
}

// Enrollment count type
export interface EnrollmentCount {
  enrollments: number;
}

// Main Package type
export interface Package {
  id: string;
  name: string;
  description: string;
  packageStatus: "ACTIVE" | "INACTIVE";
  packageType: "BASIC" | "ADVANCED" | "CONSULTANCY";
  packagePrice: number;
  consultancyType: "ONEYEAR" | "SIXMONTHS";
  durationInMonths: number;
  createdAt: string;
  updatedAt: string;
  enrollments: Enrollment[];
  _count: EnrollmentCount;
}
export type TPackage = Package;