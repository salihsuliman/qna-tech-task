export interface Question {
  id: string;
  _recordId: string;
  companyName: string;
  question: string;
  questionDescription?: string;
  answer: string;
  assignedTo?: {
    email: string;
    status: string;
  };
  _companyId: number;
  properties: string;
  createdAt: string;
  updatedAt: string;
  updatedBy: string;
  createdBy: string;
}
