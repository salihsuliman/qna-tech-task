import React, { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { useAuth } from "./auth-provider";
import { createQuestion } from "@/hooks/createQuestion";
import { updateQuestion } from "@/hooks/updateQuestion";
import { Question } from "@/lib/questions";

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  isUpdate?: boolean;
  questionDetails?: Question;
}

export const QuestionModal = ({
  isOpen,
  onClose,
  isUpdate = false,
  questionDetails,
}: ModalProps) => {
  const { user } = useAuth();
  const [formData, setFormData] = useState({
    question: "",
    questionDescription: "",
    createdBy: user!,
    properties: "",
    answer: "",
    assignedTo: "",
  });

  useEffect(() => {
    if (isUpdate && questionDetails) {
      setFormData({
        question: questionDetails.question,
        questionDescription: questionDetails.questionDescription || "",
        createdBy: questionDetails.createdBy,
        properties: questionDetails.properties || "",
        answer: questionDetails.answer || "",
        assignedTo: questionDetails.assignedTo?.email || "",
      });
    }
  }, [isUpdate, questionDetails]);

  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [validationErrors, setValidationErrors] = useState<
    Record<string, string>
  >({});

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const validateForm = () => {
    const errors: Record<string, string> = {};
    if (!formData.question.trim()) errors.question = "Question is required.";
    if (
      !formData.createdBy.trim() ||
      !/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(formData.createdBy)
    ) {
      errors.createdBy = "A valid email is required for Created By.";
    }
    return errors;
  };

  const handleSubmit = async () => {
    const errors = validateForm();
    if (Object.keys(errors).length > 0) {
      setValidationErrors(errors);
      return;
    }

    setIsLoading(true);
    setError(null);
    setValidationErrors({});

    try {
      if (isUpdate && questionDetails) {
        await updateQuestion(questionDetails.id, {
          question: formData.question,
          questionDescription: formData.questionDescription,
          properties: formData.properties,
          answer: formData.answer,
          assignedTo: formData.assignedTo,
          updatedBy: user!,
        });
      } else {
        await createQuestion({
          question: formData.question,
          questionDescription: formData.questionDescription,
          createdBy: formData.createdBy,
          properties: formData.properties,
          answer: formData.answer,
          assignedTo: formData.assignedTo,
        });
      }

      // Close modal and reset form
      onClose();
      setFormData({
        question: "",
        questionDescription: "",
        createdBy: user!,
        properties: "",
        answer: "",
        assignedTo: "",
      });

      return window.location.reload();
    } catch (err) {
      if (err instanceof Error) {
        setError(err.message);
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>
            {isUpdate ? "Update Question" : "Submit a New Question"}
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          <div>
            <Label htmlFor="question">Question</Label>
            <Input
              id="question"
              name="question"
              value={formData.question}
              onChange={handleChange}
              placeholder="Enter the question"
            />
            {validationErrors.question && (
              <p className="text-red-500 text-sm">
                {validationErrors.question}
              </p>
            )}
          </div>
          <div>
            <Label htmlFor="questionDescription">Question Description</Label>
            <Input
              id="questionDescription"
              name="questionDescription"
              value={formData.questionDescription}
              onChange={handleChange}
              placeholder="Enter the question description"
            />
          </div>

          <div>
            <Label htmlFor="properties">Properties</Label>
            <Input
              id="properties"
              name="properties"
              value={formData.properties}
              onChange={handleChange}
              placeholder="Enter properties (comma-separated)"
            />
          </div>
          <div>
            <Label htmlFor="answer">Answer</Label>
            <Input
              id="answer"
              name="answer"
              value={formData.answer}
              onChange={handleChange}
              placeholder="Enter the answer"
            />
          </div>

          <div>
            <Label htmlFor="assignedTo">Assigned To</Label>
            <Input
              id="assignedTo"
              name="assignedTo"
              value={formData.assignedTo}
              onChange={handleChange}
              placeholder="Enter assignee's email"
            />
          </div>
        </div>

        {error && <p className="text-red-500 mt-2">{error}</p>}

        <DialogFooter>
          <Button onClick={onClose} variant="outline" disabled={isLoading}>
            Cancel
          </Button>
          <Button onClick={handleSubmit} disabled={isLoading}>
            {isLoading ? "Submitting..." : "Submit"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
