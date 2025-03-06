import { Button } from "@/components/ui/button"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import { siteConfig } from "@/config/site"
import { createServerClient } from "@/lib/supabase-server"
import { Tables } from "@/types/supabase"
import { User } from "@supabase/supabase-js"
import Link from "next/link"

interface NavbarProps {
  variant?: "default" | "dashboard" | "auth"
  user?: User
  activeBusiness?: Tables<"businesses">
}

export default async function Navbar({ 
  variant = "default",
  user,
  activeBusiness
}: NavbarProps) {
  // Common navigation items
  const commonNavItems = [
    { name: "Browse", href: "/search" },
    { name: "How It Works", href: "/#how-it-works" },
    { name: "Pricing", href: "/pricing" },
  ]
  
  // Dashboard navigation items
  const dashboardNavItems = [
    { name: "Dashboard", href: "/dashboard" },
    { name: "Reservations", href: "/dashboard/reservations" },
    { name: "Calendar", href: "/dashboard/calendar" },
    { name: "Payments", href: "/dashboard/payments" },
    { name: "Reviews", href: "/dashboard/reviews" },
    { name: "Settings", href: "/dashboard/settings" },
  ]
  
  // If user is not passed as prop, try to get it from server
  if (!user && variant === "dashboard") {
    const supabase = await createServerClient()
    const { data: { session } } = await supabase.auth.getSession()
    user = session?.user || null
  }
  
  // Auth component shown when user is logged in (for default variant)
  const AuthComponent = user ? (
    <div className="flex items-center gap-2">
      <span className="text-sm hidden md:inline-block">
        {user.email}
      </span>
      <Button asChild variant="outline" size="sm">
        <Link href="/dashboard">Dashboard</Link>
      </Button>
      <form action="/api/auth/signout" method="post">
        <input type="hidden" name="callbackUrl" value="/" />
        <Button variant="ghost" size="sm" type="submit">
          Sign Out
        </Button>
      </form>
    </div>
  ) : (
    <div className="flex items-center gap-2">
      <Button asChild variant="ghost" size="sm">
        <Link href="/auth/signin">Sign In</Link>
      </Button>
      <Button asChild size="sm">
        <Link href="/auth/signup">Sign Up</Link>
      </Button>
    </div>
  )
  
  return (
    <header className={`${
      variant === "auth" ? "py-4" : ""
    } border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60`}>
      <div className="container mx-auto flex h-16 items-center justify-between px-4">
        <div className="flex items-center gap-2 md:gap-6">
          {/* Logo */}
          <Link href="/" className="font-bold text-xl">
            {siteConfig.name}
          </Link>
          
          {/* Business selector for dashboard */}
          {variant === "dashboard" && activeBusiness && (
            <div className="rounded-md border px-3 py-1 text-sm font-medium">
              {activeBusiness?.name || "No Business"}
            </div>
          )}
          
          {/* Desktop Navigation */}
          {variant !== "auth" && (
            <nav className="hidden md:flex items-center gap-6">
              {variant === "dashboard" ? (
                dashboardNavItems.map((item) => (
                  <Link
                    key={item.href}
                    href={item.href}
                    className="text-sm font-medium hover:text-primary"
                  >
                    {item.name}
                  </Link>
                ))
              ) : (
                commonNavItems.map((item) => (
                  <Link
                    key={item.href}
                    href={item.href}
                    className="text-sm font-medium hover:text-primary"
                  >
                    {item.name}
                  </Link>
                ))
              )}
            </nav>
          )}
        </div>
        
        {/* Mobile Navigation */}
        {variant !== "auth" && (
          <div className="md:hidden">
            <Sheet>
              <SheetTrigger asChild>
                <Button variant="outline" size="icon" className="h-9 w-9">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="h-5 w-5"
                  >
                    <line x1="3" y1="12" x2="21" y2="12" />
                    <line x1="3" y1="6" x2="21" y2="6" />
                    <line x1="3" y1="18" x2="21" y2="18" />
                  </svg>
                  <span className="sr-only">Toggle Menu</span>
                </Button>
              </SheetTrigger>
              <SheetContent side="left" className="pr-0">
                <div className="px-7">
                  <Link href="/" className="flex items-center">
                    <span className="font-bold">{siteConfig.name}</span>
                  </Link>
                </div>
                <nav className="flex flex-col gap-4 px-2 mt-8">
                  {variant === "dashboard" ? (
                    dashboardNavItems.map((item) => (
                      <Link
                        key={item.href}
                        href={item.href}
                        className="flex items-center gap-2 rounded-md p-2 text-sm font-medium hover:bg-accent hover:text-accent-foreground"
                      >
                        {item.name}
                      </Link>
                    ))
                  ) : (
                    commonNavItems.map((item) => (
                      <Link
                        key={item.href}
                        href={item.href}
                        className="flex items-center gap-2 rounded-md p-2 text-sm font-medium hover:bg-accent hover:text-accent-foreground"
                      >
                        {item.name}
                      </Link>
                    ))
                  )}
                  {user && variant === "default" && (
                    <Link
                      href="/dashboard"
                      className="flex items-center gap-2 rounded-md p-2 text-sm font-medium hover:bg-accent hover:text-accent-foreground"
                    >
                      Dashboard
                    </Link>
                  )}
                </nav>
              </SheetContent>
            </Sheet>
          </div>
        )}
        
        {/* Right side: auth buttons or user info */}
        {variant === "dashboard" ? (
          <div className="flex items-center gap-2">
            <Button variant="ghost" size="sm" asChild>
              <Link href="/">View Site</Link>
            </Button>
            <form action="/api/auth/signout" method="post">
              <input type="hidden" name="callbackUrl" value="/" />
              <Button variant="outline" size="sm" type="submit">
                Sign Out
              </Button>
            </form>
          </div>
        ) : variant !== "auth" ? (
          AuthComponent
        ) : null}
      </div>
    </header>
  )
} 