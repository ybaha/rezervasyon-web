import { Button } from "@/components/ui/button";
import { siteConfig } from "@/config/site";
import Link from "next/link";

export default function HomeLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-screen flex-col">
      {/* Header */}
      <header className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container mx-auto flex h-16 items-center justify-between px-4">
          <div className="flex items-center gap-6">
            <Link href="/" className="font-bold text-xl">
              {siteConfig.name}
            </Link>
            <nav className="hidden md:flex items-center gap-6">
              <Link href="/search" className="text-sm font-medium hover:text-primary">
                Browse
              </Link>
              <Link href="/#how-it-works" className="text-sm font-medium hover:text-primary">
                How It Works
              </Link>
              <Link href="/pricing" className="text-sm font-medium hover:text-primary">
                Pricing
              </Link>
            </nav>
          </div>
          <nav className="flex items-center gap-2">
            <Button asChild variant="ghost" size="sm">
              <Link href="/auth/signin">Sign In</Link>
            </Button>
            <Button asChild size="sm">
              <Link href="/auth/signup">Sign Up</Link>
            </Button>
          </nav>
        </div>
      </header>

      {/* Main Content */}
      <div className="flex-1">
        {children}
      </div>

      {/* Footer */}
      <footer className="border-t py-8 bg-muted/40">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <div className="font-bold text-xl mb-4">{siteConfig.name}</div>
              <p className="text-muted-foreground text-sm mb-4">
                {siteConfig.description}
              </p>
              <div className="flex gap-3">
                <Link href={siteConfig.links.twitter} className="text-muted-foreground hover:text-primary">
                  <svg
                    className="w-5 h-5"
                    fill="currentColor"
                    viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path d="M23.643 4.937c-.835.37-1.732.62-2.675.733.962-.576 1.7-1.49 2.048-2.578-.9.534-1.897.922-2.958 1.13-.85-.904-2.06-1.47-3.4-1.47-2.572 0-4.658 2.086-4.658 4.66 0 .364.042.718.12 1.06-3.873-.195-7.304-2.05-9.602-4.868-.4.69-.63 1.49-.63 2.342 0 1.616.823 3.043 2.072 3.878-.764-.025-1.482-.234-2.11-.583v.06c0 2.257 1.605 4.14 3.737 4.568-.392.106-.803.162-1.227.162-.3 0-.593-.028-.877-.082.593 1.85 2.313 3.198 4.352 3.234-1.595 1.25-3.604 1.995-5.786 1.995-.376 0-.747-.022-1.112-.065 2.062 1.323 4.51 2.093 7.14 2.093 8.57 0 13.255-7.098 13.255-13.254 0-.2-.005-.402-.014-.602.91-.658 1.7-1.477 2.323-2.41z" />
                  </svg>
                </Link>
                <Link href={siteConfig.links.github} className="text-muted-foreground hover:text-primary">
                  <svg
                    className="w-5 h-5"
                    fill="currentColor"
                    viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" />
                  </svg>
                </Link>
              </div>
            </div>
            <div>
              <h3 className="font-medium mb-3">For Customers</h3>
              <ul className="space-y-2">
                <li>
                  <Link href="/search" className="text-sm text-muted-foreground hover:text-foreground">
                    Find Services
                  </Link>
                </li>
                <li>
                  <Link href="/dashboard/reservations" className="text-sm text-muted-foreground hover:text-foreground">
                    My Reservations
                  </Link>
                </li>
                <li>
                  <Link href="/help" className="text-sm text-muted-foreground hover:text-foreground">
                    Help Center
                  </Link>
                </li>
              </ul>
            </div>
            <div>
              <h3 className="font-medium mb-3">For Businesses</h3>
              <ul className="space-y-2">
                <li>
                  <Link href="/for-business" className="text-sm text-muted-foreground hover:text-foreground">
                    Join as a Business
                  </Link>
                </li>
                <li>
                  <Link href="/dashboard" className="text-sm text-muted-foreground hover:text-foreground">
                    Business Dashboard
                  </Link>
                </li>
                <li>
                  <Link href="/pricing" className="text-sm text-muted-foreground hover:text-foreground">
                    Pricing & Plans
                  </Link>
                </li>
              </ul>
            </div>
            <div>
              <h3 className="font-medium mb-3">Company</h3>
              <ul className="space-y-2">
                <li>
                  <Link href="/about" className="text-sm text-muted-foreground hover:text-foreground">
                    About Us
                  </Link>
                </li>
                <li>
                  <Link href="/contact" className="text-sm text-muted-foreground hover:text-foreground">
                    Contact
                  </Link>
                </li>
                <li>
                  <Link href="/terms" className="text-sm text-muted-foreground hover:text-foreground">
                    Terms of Service
                  </Link>
                </li>
                <li>
                  <Link href="/privacy" className="text-sm text-muted-foreground hover:text-foreground">
                    Privacy Policy
                  </Link>
                </li>
              </ul>
            </div>
          </div>
          <div className="mt-8 pt-8 border-t text-center text-sm text-muted-foreground">
            <p>&copy; {new Date().getFullYear()} {siteConfig.name}. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
} 