"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useAuth } from "./auth-provider";
import { updateQuestion } from "@/hooks/updateQuestion";

export function AnswerSection({
  questionId,
  existingAnswer,
}: {
  questionId: string;
  existingAnswer?: string;
}) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [answer, setAnswer] = useState("");
  const { user } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    if (!user) {
      setIsSubmitting(false);
      return;
    }

    try {
      await updateQuestion(questionId, { answer, updatedBy: user });
    } catch (error) {
      console.error(error);
    }

    return window.location.reload();
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Answer</CardTitle>
        </CardHeader>
        <CardContent>
          {existingAnswer ? (
            <div>
              <p>{existingAnswer}</p>
            </div>
          ) : (
            <p>No answer yet.</p>
          )}
        </CardContent>
      </Card>

      {!existingAnswer && user && (
        <form onSubmit={handleSubmit} className="space-y-4">
          <Textarea
            value={answer}
            onChange={(e) => setAnswer(e.target.value)}
            placeholder="Write your answer here..."
            required
          />
          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting ? "Submitting..." : "Submit Answer"}
          </Button>
        </form>
      )}
    </div>
  );
}
