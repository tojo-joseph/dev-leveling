"use client";

export const dynamic = "force-dynamic";

import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { login } from "@/lib/auth";
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

const CLIENT_ID = "Ov23liRnQWed4idU6Alr";
// const codeParams = 8aa559b492ea24130201

function loginWithGithub() {
  window.location.assign(
    "https://github.com/login/oauth/authorize?client_id=" + CLIENT_ID
  );
}

export default function LoginPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const codeParams = searchParams.get("code");
    console.log("codeParams", codeParams);

    if (codeParams) {
      async function getAccessToken() {
        try {
          const response = await fetch(
            "http://localhost:5000/ghaccess?code=" + codeParams,
            {
              method: "GET",
              credentials: "include", // Important: send cookies with request
            }
          );

          const data = await response.json();
          console.log("Access Token Data:", data);

          // If successful, redirect to dashboard
          if (data?.ok) {
            router.push("/dashboard");
          } else {
            setError("GitHub login failed");
          }
        } catch (error) {
          console.error("Error:", error);
          setError("An error occurred during login");
        }
      }
      getAccessToken();
    }
  }, [searchParams, router]);

  // useEffect(() => {
  //   const user = getCurrentUser();
  //   if (user) {
  //     router.replace("/dashboard");
  //   }
  // }, [router]);

  const message = searchParams.get("message");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setLoading(true);

    const data = {
      username: username,
      password: password,
    };

    try {
      const response: any = await login("login", data);

      if (response?.ok) {
        console.log("Correct response", response.json());
        router.push("/dashboard");
      } else {
        console.log("Response is not working! Something went wrong!", response);
      }
    } catch (error) {
      console.log("Error", error);
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle>Login</CardTitle>
        </CardHeader>
        <CardContent>
          <form className="space-y-4" onSubmit={handleSubmit}>
            <div className="space-y-2">
              <Label htmlFor="username">Username</Label>
              <Input
                id="username"
                type="text"
                autoComplete="off"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
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
            <Button
              type="submit"
              className="w-full cursor-pointer"
              disabled={loading}
            >
              {loading ? "Logging in..." : "Login"}
            </Button>
          </form>
          <div className="mt-4 flex flex-col gap-2 text-sm text-muted-foreground">
            <Button
              variant="outline"
              className="w-full gap-2 border-2 py-5 text-lg font-semibold hover:bg-black hover:text-white transition-all duration-200"
              onClick={loginWithGithub}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="currentColor"
                className="h-5 w-5"
              >
                <path
                  fillRule="evenodd"
                  d="M12 1.5C6.201 1.5 1.5 6.201 1.5 12c0 4.66 3.022 8.607 
          7.22 10.002.528.097.722-.229.722-.509 
          0-.252-.009-.92-.014-1.804-2.938.638-3.563-1.416-3.563-1.416-.48-1.219-1.172-1.544-1.172-1.544-.957-.654.073-.64.073-.64 
          1.06.075 1.619 1.089 1.619 1.089.94 1.611 2.466 1.146 3.066.876.096-.681.368-1.146.668-1.41-2.346-.267-4.81-1.174-4.81-5.226 
          0-1.155.413-2.099 1.088-2.839-.109-.268-.472-1.345.102-2.804 
          0 0 .888-.284 2.91 1.084A10.16 10.16 0 0 1 12 6.844c.9.004 1.806.122 2.651.358 
          2.02-1.368 2.906-1.084 2.906-1.084.576 1.459.213 2.536.104 2.804.678.74 1.086 1.684 1.086 2.839 
          0 4.062-2.47 4.955-4.823 5.216.378.327.717.972.717 1.96 
          0 1.415-.012 2.556-.012 2.902 0 .283.19.61.726.507A10.508 10.508 0 0 0 22.5 12c0-5.799-4.701-10.5-10.5-10.5Z"
                  clipRule="evenodd"
                />
              </svg>
              Login with GitHub
            </Button>
            <button
              type="button"
              className="text-left underline underline-offset-4 cursor-pointer"
              onClick={() => router.push("/register")}
            >
              Need an account? Register
            </button>
            <button
              type="button"
              className="text-left underline underline-offset-4 cursor-pointer"
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
