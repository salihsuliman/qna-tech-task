import { Question } from "@/lib/questions";

type NewQuestionData = {
  question: string;
  questionDescription?: string;
  createdBy: string;
  properties?: string;
  answer?: string;
  updatedBy?: string;
  assignedTo?: string;
};

export const createQuestion = async (
  newQuestionData: NewQuestionData
): Promise<Question> => {
  const response = await fetch(`${process.env.SERVER_ENDPOINT}/questions`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(newQuestionData),
  });

  if (!response.ok) {
    throw new Error("Failed to create question");
  }

  const data = await response.json();
  return data; // Returns the Question
};
