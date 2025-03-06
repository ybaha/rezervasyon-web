import { Toaster } from "@/components/ui/sonner";
import { siteConfig } from "@/config/site";
import { texts } from "@/config/texts/en";
import Link from "next/link";

export const metadata = {
  title: {
    default: siteConfig.name,
    template: `%s | ${siteConfig.name}`,
  },
  description: siteConfig.description,
};

export default function MarketingLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-screen flex-col">
      <header className="border-b">
        <div className="container mx-auto flex h-16 items-center justify-between px-4">
          <div className="flex items-center gap-6">
            <Link href="/" className="font-bold text-xl">
              {siteConfig.name}
            </Link>
          </div>
          <nav className="flex items-center gap-4">
            <Link
              href="/search"
              className="text-sm font-medium hover:underline"
            >
              {texts.common.search}
            </Link>
            <Link
              href="/auth/signin"
              className="text-sm font-medium hover:underline"
            >
              {texts.common.signIn}
            </Link>
            <Link
              href="/auth/signup"
              className="text-sm font-medium hover:underline"
            >
              {texts.common.signUp}
            </Link>
          </nav>
        </div>
      </header>
      <main className="flex-1">{children}</main>
      <Toaster />
    </div>
  );
} 