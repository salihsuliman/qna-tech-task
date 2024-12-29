"use client";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Plus, Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import Link from "next/link";
import { useEffect, useState } from "react";
import { fetchQuestions } from "@/hooks/fetchQuestions";
import { Question } from "@/lib/questions";
import { QuestionModal } from "./question-modal";

function TableSkeleton() {
  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Question</TableHead>
          <TableHead>Created by</TableHead>
          <TableHead>Created on</TableHead>
          <TableHead>Updated on</TableHead>
          <TableHead>Answers</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {[...Array(5)].map((_, index) => (
          <TableRow key={index}>
            <TableCell className="w-1/2">
              <div className="space-y-2">
                <div className="h-4 bg-gray-200 rounded w-3/4 animate-pulse"></div>
                <div className="h-4 bg-gray-200 rounded w-1/2 animate-pulse"></div>
              </div>
            </TableCell>
            <TableCell className="w-40">
              <div className="flex items-center space-x-2">
                <div className="h-6 w-6 rounded-full bg-gray-200 animate-pulse"></div>
                <div className="h-4 bg-gray-200 rounded w-20 animate-pulse"></div>
              </div>
            </TableCell>
            <TableCell>
              <div className="h-4 bg-gray-200 rounded w-24 animate-pulse"></div>
            </TableCell>
            <TableCell>
              <div className="h-4 bg-gray-200 rounded w-24 animate-pulse"></div>
            </TableCell>
            <TableCell>
              <div className="h-4 bg-gray-200 rounded w-8 animate-pulse"></div>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}

export function QuestionsTable() {
  const [questions, setQuestions] = useState<Question[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [createQuestion, setCreateQuestion] = useState<boolean>(false);

  const [search, setSearch] = useState<string>("");

  useEffect(() => {
    const loadQuestions = async () => {
      try {
        const data = await fetchQuestions(undefined, search);
        setQuestions(data);
      } catch {
        setError("Failed to load questions");
      } finally {
        setLoading(false);
      }
    };

    loadQuestions();
  }, [search]);

  return (
    <>
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="relative">
            <Search className="absolute left-2 top-2.5 h-4 w-4 text-gray-500" />
            <Input
              placeholder="Search questions..."
              className="pl-8"
              onChange={(e) => setTimeout(() => setSearch(e.target.value), 500)}
            />
          </div>
          <Button size="sm" onClick={() => setCreateQuestion(true)}>
            <Plus className="mr-2 h-4 w-4" />
            Add Questions
          </Button>
        </div>

        {loading ? (
          <TableSkeleton />
        ) : error ? (
          <div className="text-center text-red-500">{error}</div>
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Question</TableHead>
                <TableHead>Created by</TableHead>
                <TableHead>Last update by</TableHead>
                <TableHead>Assigned to</TableHead>

                <TableHead>Updated on</TableHead>
                <TableHead>Answers</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {questions.map((question) => (
                <TableRow key={question._recordId}>
                  <TableCell className="w-1/2">
                    <div className="space-y-1">
                      <Link
                        href={`/questions/${question._recordId}`}
                        className="hover:underline line-clamp-2"
                      >
                        {question.question}
                      </Link>
                    </div>
                  </TableCell>
                  <TableCell className="w-40">
                    <div className="flex items-center space-x-2 max-w-[160px]">
                      <Avatar className="h-6 w-6 flex-shrink-0">
                        <AvatarImage src={"/placeholder.svg"} />
                        <AvatarFallback></AvatarFallback>
                      </Avatar>
                      <span className="truncate">{question.createdBy}</span>
                    </div>
                  </TableCell>

                  <TableCell className="w-40">
                    <div className="flex items-center space-x-2 max-w-[160px]">
                      <Avatar className="h-6 w-6 flex-shrink-0">
                        <AvatarImage src={"/placeholder.svg"} />
                        <AvatarFallback></AvatarFallback>
                      </Avatar>
                      <span className="truncate">{question.updatedBy}</span>
                    </div>
                  </TableCell>
                  {question.answer && question.answer.length > 0 ? (
                    <TableCell className="w-40">
                      <div className="flex items-center space-x-2 max-w-[160px]">
                        <Avatar className="h-6 w-6 flex-shrink-0">
                          <AvatarImage src={"/placeholder.svg"} />
                          <AvatarFallback></AvatarFallback>
                        </Avatar>
                        <span className="truncate">{question.updatedBy}</span>
                      </div>
                    </TableCell>
                  ) : (
                    <TableCell className="w-40">-</TableCell>
                  )}

                  <TableCell>{question.createdAt}</TableCell>
                  <TableCell>{question.updatedAt}</TableCell>
                  <TableCell>
                    {question.answer && question.answer.length > 0 ? 1 : 0}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </div>
      {createQuestion && (
        <QuestionModal
          isOpen={createQuestion}
          onClose={() => setCreateQuestion(false)}
        />
      )}
    </>
  );
}
