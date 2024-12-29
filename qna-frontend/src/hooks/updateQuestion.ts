import { Question } from "@/lib/questions";

type UpdatedQuestionData = {
  companyName?: string;
  question?: string;
  questionDescription?: string;
  answer?: string;
  _companyId?: number;
  properties?: string;
  updatedBy?: string;
  assignedTo?: string;
};

export const updateQuestion = async (
  id: string,
  updateData: UpdatedQuestionData
): Promise<Question> => {
  const response = await fetch(
    `${process.env.SERVER_ENDPOINT}/questions/${id}`,
    {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(updateData),
    }
  );

  if (!response.ok) {
    throw new Error("Failed to update question");
  }

  const data = await response.json();
  return data;
};
