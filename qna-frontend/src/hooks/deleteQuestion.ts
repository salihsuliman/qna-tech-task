export const deleteQuestion = async (id: string): Promise<void> => {
  const response = await fetch(
    `${process.env.SERVER_ENDPOINT}/questions/${id}`,
    {
      method: "DELETE",
    }
  );

  if (!response.ok) {
    throw new Error("Failed to delete question");
  }
};
