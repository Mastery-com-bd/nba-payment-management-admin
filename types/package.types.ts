export type TPackageStatus = "ACTIVE" | "INACTIVE" | "EXPIRED"
export type TPackageType = "BASIC" | "ADVANCED" | "CONSULTANCY"
export type TConsultencyType = "SIXMONTHS" | "ONEYEAR"


export type TPackage = {
  id: string;
  name: string;
  description: string;
  packageStatus: TPackageStatus;
  packageType: TPackageType;
  packagePrice: number;
  consultancyType: TConsultencyType;
  durationInMonths: number;
  createdAt: string;
  updatedAt: string;
};

export type TEnrollment = {
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
  package: TPackage;
};