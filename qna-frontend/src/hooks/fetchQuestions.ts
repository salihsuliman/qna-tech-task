import { Question } from "@/lib/questions";

export const fetchQuestions = async (
  properties?: string,
  search?: string
): Promise<Question[]> => {
  const queryParams = new URLSearchParams();

  if (properties) queryParams.append("properties", properties);

  if (search) queryParams.append("query", search);

  const response = await fetch(
    `${process.env.SERVER_ENDPOINT}/questions?${queryParams.toString()}`
  );

  if (!response.ok) {
    throw new Error("Failed to fetch questions");
  }

  const data = await response.json();
  return data; 
};
