"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Question } from "@/lib/questions";
import { useState } from "react";
import { useAuth } from "./auth-provider";
import { ArrowLeft, CalendarDays, Clock, Trash2 } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import Link from "next/link";
import { deleteQuestion } from "@/hooks/deleteQuestion";
import { QuestionModal } from "./question-modal";

export function QuestionDetails({ question }: { question: Question }) {
  const [isDeleting, setIsDeleting] = useState(false);
  const [editQuestion, setEditQuestion] = useState(false);

  const { user } = useAuth();

  const handleDelete = async () => {
    setIsDeleting(true);

    try {
      await deleteQuestion(question._recordId);
    } catch (error) {
      console.error("Failed to delete question", error);
    } finally {
      setIsDeleting(false);
      return window.location.replace("/");
    }
  };

  return (
    <>
      <div className="space-y-4">
        <Link href="/" passHref>
          <Button variant="outline" className="mb-4">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Questions
          </Button>
        </Link>

        <Card className="overflow-hidden">
          <CardHeader className="bg-gray-50 dark:bg-gray-800">
            <CardTitle className="text-xl font-semibold leading-tight">
              {question.question}
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-6">
            <div className="space-y-4">
              <div className="flex items-center space-x-2 text-sm text-gray-500 dark:text-gray-400">
                <CalendarDays className="h-4 w-4" />
                <span>
                  Created on {new Date(question.createdAt).toLocaleDateString()}
                </span>
              </div>
              <div className="flex items-center space-x-2 text-sm text-gray-500 dark:text-gray-400">
                <Clock className="h-4 w-4" />
                <span>
                  Last updated on{" "}
                  {new Date(question.updatedAt).toLocaleDateString()}
                </span>
              </div>
              <div className="flex items-center space-x-2">
                <Avatar className="h-8 w-8">
                  <AvatarImage
                    src="/placeholder.svg"
                    alt={question.createdBy}
                  />
                  <AvatarFallback>
                    {question.createdBy.charAt(0).toUpperCase()}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <p className="text-sm font-medium">{question.createdBy}</p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    Question Owner
                  </p>
                </div>
              </div>
              {user === question.createdBy && (
                <div className="pt-4 space-x-4">
                  <Button
                    variant="destructive"
                    onClick={handleDelete}
                    disabled={isDeleting}
                    className="w-full sm:w-auto"
                  >
                    <Trash2 className="mr-2 h-4 w-4" />
                    {isDeleting ? "Deleting..." : "Delete Question"}
                  </Button>

                  <Button
                    variant="default"
                    onClick={() => setEditQuestion(true)}
                    className="w-full sm:w-auto"
                  >
                    <Trash2 className="mr-2 h-4 w-4" />
                    {isDeleting ? "Updating..." : "Update Question"}
                  </Button>
                </div>
              )}
            </div>

            {question.questionDescription && (
              <div className="mt-6">
                <h3 className="text-lg font-semibold">Question Description</h3>
                <p className="mt-2 text-gray-600 dark:text-gray-300">
                  {question.questionDescription}
                </p>
              </div>
            )}

            {question.properties && (
              <div className="mt-6">
                <h3 className="text-lg font-semibold">Properties</h3>
                <div className="mt-2 flex flex-wrap gap-2">
                  {question.properties.split(",").map((property, index) => (
                    <span
                      key={index}
                      className="inline-flex items-center rounded-full bg-gray-200 px-3 py-1 text-sm font-medium text-gray-800 dark:bg-gray-700 dark:text-gray-200"
                    >
                      {property}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {editQuestion && (
        <QuestionModal
          isOpen={editQuestion}
          isUpdate
          questionDetails={question}
          onClose={() => setEditQuestion(false)}
        />
      )}
    </>
  );
}
