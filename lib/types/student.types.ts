export type TStudentStatus =  | "ACTIVE"
    | "INACTIVE"
    | "BLOCKED"
    | "IRREGULAR"
    | "FAKED"

export type TWhatsappStatus = "ACTIVE" |
"INACTIVE" |
"DONE" 

export type TGender = "ACTIVE" |
"INACTIVE" |
"DONE" 



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
