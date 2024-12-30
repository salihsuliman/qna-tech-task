"use client";

import { useAuth } from "@/components/auth-provider";
import { QuestionsTable } from "@/components/questions-table";
import { Button } from "@/components/ui/button";
import { LogOut } from "lucide-react";

export default function Home() {
  const { user, logout } = useAuth();

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-3xl font-bold tracking-tight">QnA</h2>
        {user && (
          <Button
            variant="outline"
            size="icon"
            className="text-black hover:text-black-100 w-24"
            onClick={logout}
          >
            Logout
            <LogOut className="h-5 w-5" />
          </Button>
        )}
      </div>
      <QuestionsTable />
    </div>
  );
}
