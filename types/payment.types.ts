import { TEnrollment } from "./package.types";
import { TStudent } from "./student.types";

export type TPaymentMethod =
  | "CREDIT_CARD"
  | "DEBIT_CARD"
  | "BKASH"
  | "NAGAD"
  | "ROCKET"
  | "UPAY"
  | "BANK_TRANSFER"
  | "COD";

export type TPaymentStatus =
  | "PENDING"
  | "PARTIAL"
  | "COMPLETED"
  | "FAILED"
  | "REFUND";

export type TPaymentType =
  | "FULLPAYMENT"
  | "INSTALLMENT"
  | "SUBSCRIPTION"
  | "BOOKING";

export type TPaymentStudent = {
  id: string;
  fullName: string;
  email: string;
  batchNo: string;
  contactNumber: string;
};

export type TPackage = {
  id: string;
  name: string;
  packagePrice: number;
};

export type TStudentPackage = {
  id: string;
  studentId: string;
  packageId: string;
  discount: number;
  dueAmount: number;
  totalPayable: number;
  enrollmentDate: string;
  status: "ACTIVE" | "EXPIRED" | "CANCELLED";
  createdAt: string;
  updatedAt: string;
  package: TPackage;
};

export type TPayment = {
  id: string;
  amount: number;
  paymentMethod: TPaymentMethod;
  paymentStatus: TPaymentStatus;
  paymentType: TPaymentType;
  transactionId: string;
  studentId: string;
  studentPackageId: string;
  paymentVerificationFile: string | null;
  createdAt: string;
  updatedAt: string;
  student: TStudent;
  studentPackage: TEnrollment;
};
