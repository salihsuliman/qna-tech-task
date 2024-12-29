
import { Question } from "@/lib/questions";

export const getQuestionById = async (id: string): Promise<Question> => {
  const response = await fetch(
    `${process.env.SERVER_ENDPOINT}/questions/${id}`
  );

  if (!response.ok) {
    throw new Error("Failed to fetch questions");
  }

  const data = await response.json();
  return data; 
};
