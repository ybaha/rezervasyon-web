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
  title: "Reset Password",
  description: "Set a new password for your account",
};

export default function ResetPasswordPage({
  searchParams,
}: {
  searchParams: { token?: string; error?: string; success?: string };
}) {
  const token = searchParams.token;
  const error = searchParams.error;
  const success = searchParams.success;

  if (!token) {
    return (
      <Card className="w-full">
        <CardHeader className="space-y-1">
          <CardTitle className="text-2xl font-bold">Invalid Request</CardTitle>
          <CardDescription>
            The password reset link is invalid or has expired
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-sm text-muted-foreground">
            Please request a new password reset link from the forgot password page.
          </p>
        </CardContent>
        <CardFooter>
          <Button asChild className="w-full">
            <Link href="/auth/forgot-password">
              Back to Forgot Password
            </Link>
          </Button>
        </CardFooter>
      </Card>
    );
  }

  return (
    <Card className="w-full">
      <CardHeader className="space-y-1">
        <CardTitle className="text-2xl font-bold">Reset Password</CardTitle>
        <CardDescription>
          Create a new password for your account
        </CardDescription>
        {error && (
          <div className="rounded bg-destructive/15 p-3 text-sm text-destructive">
            {error === "PasswordMismatch" && "Passwords do not match"}
            {error === "TokenInvalid" && "The reset token is invalid or has expired"}
            {error === "PasswordComplexity" && "Password does not meet the minimum requirements"}
            {error !== "PasswordMismatch" && 
              error !== "TokenInvalid" && 
              error !== "PasswordComplexity" && 
              error}
          </div>
        )}
        {success && (
          <div className="rounded bg-green-100 p-3 text-sm text-green-800">
            {success === "PasswordReset" && "Your password has been reset successfully"}
            {success !== "PasswordReset" && success}
          </div>
        )}
      </CardHeader>
      <CardContent className="space-y-4">
        <form action="/api/auth/update-password" method="post" className="space-y-4">
          <input type="hidden" name="token" value={token} />
          
          <div className="space-y-2">
            <Label htmlFor="password">New Password</Label>
            <Input
              id="password"
              name="password"
              type="password"
              required
              autoComplete="new-password"
            />
            <p className="text-xs text-muted-foreground">
              Password must be at least 8 characters long
            </p>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="confirmPassword">Confirm New Password</Label>
            <Input
              id="confirmPassword"
              name="confirmPassword"
              type="password"
              required
              autoComplete="new-password"
            />
          </div>
          
          <Button type="submit" className="w-full">
            Reset Password
          </Button>
        </form>
      </CardContent>
      <CardFooter className="flex flex-col space-y-4">
        <div className="text-center text-sm">
          <span className="text-muted-foreground">Remember your password? </span>
          <Link href="/auth/signin" className="text-primary hover:underline">
            Sign in
          </Link>
        </div>
      </CardFooter>
    </Card>
  );
} 