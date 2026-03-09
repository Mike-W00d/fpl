"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Plus, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { FplTeamForm } from "@/components/fpl-team-form";

export function ConnectAccountSection() {
  const [isOpen, setIsOpen] = useState(false);
  const router = useRouter();

  return (
    <div>
      {!isOpen ? (
        <Button variant="outline" onClick={() => setIsOpen(true)}>
          <Plus size={16} className="mr-2" />
          Connect Another Account
        </Button>
      ) : (
        <Card className="max-w-lg">
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle>Connect FPL Account</CardTitle>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setIsOpen(false)}
            >
              <X size={16} />
            </Button>
          </CardHeader>
          <CardContent>
            <FplTeamForm
              compact
              onSuccess={() => {
                setIsOpen(false);
                router.refresh();
              }}
            />
          </CardContent>
        </Card>
      )}
    </div>
  );
}
