import { TStudent } from "./student.types";

export type TFollowUp = {
  notes: string;
  followUpCounter: number;
  followUpDate: string;
  studentId: string
};

export interface TFollowUpALlData extends TFollowUp {
  id: string;
  createdAt: string
  student: TStudent
}