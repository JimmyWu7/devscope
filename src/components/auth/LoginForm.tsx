"use client";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { authClient } from "@/lib/auth-client";
import { useState } from "react";
import { toast } from "sonner";

export function LoginForm({ callbackUrl }: { callbackUrl?: string }) {
  const [isLoading, setIsLoading] = useState(false);
  // If callbackUrl exists, use it. Otherwise default to dashboard.
  const finalCallbackUrl = callbackUrl || "/dashboard";

  const handleSocialAuth = async (provider: "github" | "google") => {
    setIsLoading(true);

    try {
      await authClient.signIn.social({
        provider: provider,
        callbackURL: finalCallbackUrl,
        errorCallbackURL: "/error",
      });
      toast.success("Logged in successfully!");
    } catch (err) {
      toast.error("Failed to login");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-center text-2xl">Welcome!</CardTitle>
        <CardDescription className="text-center">
          Sign in with your GitHub account to continue
        </CardDescription>
      </CardHeader>
      <CardContent className="flex flex-col gap-4">
        <Button
          className="flex items-center justify-center gap-2 cursor-pointer"
          onClick={() => handleSocialAuth("github")}
        >
          {isLoading ? "Logging in..." : "Continue with GitHub"}
        </Button>
      </CardContent>
      {/* <CardFooter className="text-center text-sm text-gray-500">
        By signing in, you agree to our terms and privacy policy.
      </CardFooter> */}
    </Card>
  );
}
