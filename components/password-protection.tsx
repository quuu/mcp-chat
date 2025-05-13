"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { authenticate } from "@/app/actions";
import { useRouter } from "next/navigation";

export function PasswordProtection() {
  const [password, setPassword] = useState("");
  const [error, setError] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(false);

    const success = await authenticate(password);
    if (success) {
      router.refresh();
    } else {
      setError(true);
      setPassword("");
    }
    setIsLoading(false);
  };

  return (
    <div className="fixed inset-0 bg-background z-[9999] flex items-center justify-center">
      <Card className="w-[350px]">
        <CardHeader>
          <CardTitle>Password Protected</CardTitle>
          <CardDescription>
            Please enter the password to access this application
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Input
                type="password"
                placeholder="Enter password"
                value={password}
                onChange={(e) => {
                  setPassword(e.target.value);
                  setError(false);
                }}
                className={error ? "border-destructive" : ""}
                autoFocus
                disabled={isLoading}
              />
              {error && (
                <p className="text-sm text-destructive">Incorrect password</p>
              )}
            </div>
            <Button type="submit" className="w-full" disabled={isLoading}>
              {isLoading ? "Verifying..." : "Access"}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
