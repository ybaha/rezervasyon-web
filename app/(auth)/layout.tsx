import { siteConfig } from "@/config/site";
import Link from "next/link";

export const metadata = {
  title: "Authentication",
  description: "Sign in or sign up to your account",
};

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen flex flex-col">
      {/* Simple header with logo */}
      <header className="border-b py-4">
        <div className="container mx-auto px-4">
          <Link href="/" className="font-bold text-xl">
            {siteConfig.name}
          </Link>
        </div>
      </header>

      {/* Content area */}
      <div className="flex-1 flex items-center justify-center p-4">
        <div className="w-full max-w-md">
          {children}
        </div>
      </div>

      {/* Simple footer */}
      <footer className="border-t py-4 text-center text-sm text-muted-foreground">
        <div className="container mx-auto px-4">
          <p>&copy; {new Date().getFullYear()} {siteConfig.name}. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
} 