import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import Link from "next/link";

export const metadata = {
  title: "Forgot Password",
  description: "Reset your password",
};

export default function ForgotPasswordPage({
  searchParams,
}: {
  searchParams: { error?: string; success?: string };
}) {
  const error = searchParams.error;
  const success = searchParams.success;

  return (
    <Card className="w-full">
      <CardHeader className="space-y-1">
        <CardTitle className="text-2xl font-bold">Forgot password</CardTitle>
        <CardDescription>
          Enter your email address and we&apos;ll send you a link to reset your password
        </CardDescription>
        {error && (
          <div className="rounded bg-destructive/15 p-3 text-sm text-destructive">
            {error === "EmailNotFound" && "No account found with that email address"}
            {error !== "EmailNotFound" && error}
          </div>
        )}
        {success && (
          <div className="rounded bg-green-100 p-3 text-sm text-green-800">
            {success === "EmailSent" && "Check your email for a reset link"}
            {success !== "EmailSent" && success}
          </div>
        )}
      </CardHeader>
      <CardContent className="space-y-4">
        <form action="/api/auth/reset-password" method="post" className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              name="email"
              type="email"
              placeholder="your.email@example.com"
              required
              autoComplete="email"
            />
          </div>
          
          <Button type="submit" className="w-full">
            Send Reset Link
          </Button>
        </form>
      </CardContent>
      <CardFooter className="flex flex-col space-y-4">
        <div className="text-center text-sm">
          <span className="text-muted-foreground">Remember your password? </span>
          <Link href="/auth/signin" className="text-primary hover:underline">
            Back to sign in
          </Link>
        </div>
      </CardFooter>
    </Card>
  );
} 