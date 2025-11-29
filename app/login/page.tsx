"use client";

import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";

import { login, getCurrentUser } from "@/lib/auth";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export default function LoginPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const user = getCurrentUser();
    if (user) {
      router.replace("/dashboard");
    }
  }, [router]);

  const message = searchParams.get("message");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setLoading(true);

    const user = login(email, password);
    setLoading(false);

    if (!user) {
      setError("Invalid credentials. Try test@example.com / password123.");
      return;
    }

    router.replace("/dashboard");
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle>Login</CardTitle>
          <CardDescription>
            Use the dummy credentials to access the dashboard.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form className="space-y-4" onSubmit={handleSubmit}>
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                autoComplete="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                type="password"
                autoComplete="current-password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
            {message && !error && (
              <p className="text-sm text-muted-foreground">{message}</p>
            )}
            {error && <p className="text-sm text-destructive">{error}</p>}
            <Button type="submit" className="w-full" disabled={loading}>
              {loading ? "Logging in..." : "Login"}
            </Button>
          </form>
          <div className="mt-4 flex flex-col gap-2 text-sm text-muted-foreground">
            <button
              type="button"
              className="text-left underline underline-offset-4"
              onClick={() => router.push("/register")}
            >
              Need an account? Register
            </button>
            <button
              type="button"
              className="text-left underline underline-offset-4"
              onClick={() => router.push("/forgot-password")}
            >
              Forgot your password?
            </button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
