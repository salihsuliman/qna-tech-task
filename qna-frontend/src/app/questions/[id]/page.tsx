"use client";
import { QuestionDetails } from "@/components/question-details";
import { AnswerSection } from "@/components/answer-section";
import { getQuestionById } from "@/hooks/getQuestionById";
import { useEffect, useState } from "react";
import { Question } from "@/lib/questions";
import { Loader2 } from "lucide-react";

export default function QuestionPage({ params }: { params: { id: string } }) {
  const [question, setQuestion] = useState<Question | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const loadQuestions = async () => {
      try {
        const data = await getQuestionById(params.id);
        setQuestion(data);
      } catch {
        setError("Failed to load questions");
      } finally {
        setLoading(false);
      }
    };

    loadQuestions();
  }, [params.id]);

  if (error) return <div>{error}</div>;
  if (loading || !question)
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="flex items-center space-x-2">
          <Loader2 className="h-6 w-6 animate-spin text-gray-500" />
          <span className="text-lg font-medium text-gray-700">Loading...</span>
        </div>
      </div>
    );

  return (
    <div className="space-y-6">
      <QuestionDetails question={question} />
      <AnswerSection
        questionId={question._recordId}
        existingAnswer={question.answer}
      />
    </div>
  );
}
