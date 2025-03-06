import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import Link from "next/link";

export const metadata = {
  title: "Verify Email",
  description: "Verify your email address",
};

export default function VerifyEmailPage({
  searchParams,
}: {
  searchParams: { email?: string };
}) {
  const email = searchParams.email || "";

  return (
    <Card className="w-full">
      <CardHeader className="space-y-1">
        <CardTitle className="text-2xl font-bold">Check your email</CardTitle>
        <CardDescription>
          We&apos;ve sent a verification link to your email address
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="rounded bg-muted p-6 text-center">
          <div className="mb-4 text-6xl">✉️</div>
          <p className="mb-2 text-lg font-semibold">Verification email sent</p>
          <p className="text-sm text-muted-foreground mb-4">
            {email ? (
              <>
                We&apos;ve sent a verification link to <strong>{email}</strong>
              </>
            ) : (
              <>We&apos;ve sent a verification link to your email address</>
            )}
          </p>
          <p className="text-xs text-muted-foreground">
            Please check your email and click the verification link to complete your registration.
            If you don&apos;t see the email, check your spam folder.
          </p>
        </div>
      </CardContent>
      <CardFooter className="flex flex-col space-y-4">
        <Button asChild variant="outline" className="w-full">
          <Link href="/auth/signin">
            Back to Sign In
          </Link>
        </Button>
        <div className="text-center text-sm">
          <span className="text-muted-foreground">Didn&apos;t receive an email? </span>
          <Link href="/auth/resend-verification" className="text-primary hover:underline">
            Resend verification email
          </Link>
        </div>
      </CardFooter>
    </Card>
  );
} 