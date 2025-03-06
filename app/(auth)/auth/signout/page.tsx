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
  title: "Sign Out",
  description: "Sign out of your account",
};

export default function SignOutPage({
  searchParams,
}: {
  searchParams: { callbackUrl?: string };
}) {
  const callbackUrl = searchParams.callbackUrl || '/';

  return (
    <Card className="w-full">
      <CardHeader className="space-y-1">
        <CardTitle className="text-2xl font-bold">Sign out</CardTitle>
        <CardDescription>
          Are you sure you want to sign out of your account?
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <form action="/api/auth/signout" method="post" className="space-y-4">
          <input type="hidden" name="callbackUrl" value={callbackUrl} />
          
          <div className="flex justify-between">
            <Button variant="outline" asChild>
              <Link href={callbackUrl}>Cancel</Link>
            </Button>
            <Button type="submit" variant="destructive">
              Sign Out
            </Button>
          </div>
        </form>
      </CardContent>
      <CardFooter className="flex flex-col space-y-4">
        <div className="text-center text-sm text-muted-foreground">
          You will be redirected to the homepage after signing out
        </div>
      </CardFooter>
    </Card>
  );
} 