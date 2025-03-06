import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { siteConfig } from "@/config/site";
import Link from "next/link";
import { Toaster } from "@/components/ui/sonner";
import { createServerClient } from "@/lib/supabase-server";
import { redirect } from "next/navigation";

// Dashboard navigation items
const navItems = [
  { name: "Dashboard", href: "/dashboard" },
  { name: "Reservations", href: "/dashboard/reservations" },
  { name: "Calendar", href: "/dashboard/calendar" },
  { name: "Payments", href: "/dashboard/payments" },
  { name: "Reviews", href: "/dashboard/reviews" },
  { name: "Settings", href: "/dashboard/settings" },
];

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // Server component to get the current user and verify they are a business owner
  const supabase = await createServerClient();
  const { data: { session } } = await supabase.auth.getSession();
  
  if (!session) {
    redirect('/auth/signin?callbackUrl=/dashboard');
  }
  
  // Check if user is a business owner
  const { data: userProfile } = await supabase
    .from('user_profiles')
    .select('*')
    .eq('id', session.user.id)
    .single();
    
  if (!userProfile?.is_business_owner) {
    redirect('/');
  }
  
  // Get business info for the current user
  const { data: businesses } = await supabase
    .from('businesses')
    .select('*')
    .eq('owner_id', session.user.id)
    .order('name');
  
  const activeBusiness = businesses && businesses.length > 0 ? businesses[0] : null;

  return (
    <div className="flex min-h-screen flex-col">
      {/* Header */}
      <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="mx-auto container flex h-16 items-center justify-between">
          <div className="flex items-center gap-2 md:gap-4">
            {/* Mobile Navigation */}
            <Sheet>
              <SheetTrigger asChild>
                <Button variant="outline" size="icon" className="md:hidden">
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
                  {navItems.map((item) => (
                    <Link
                      key={item.href}
                      href={item.href}
                      className="flex items-center gap-2 rounded-md p-2 text-sm font-medium hover:bg-accent hover:text-accent-foreground"
                    >
                      {item.name}
                    </Link>
                  ))}
                </nav>
              </SheetContent>
            </Sheet>
            
            <Link href="/" className="hidden md:block font-bold">
              {siteConfig.name}
            </Link>
            
            {/* Business Selector */}
            <div className="rounded-md border px-3 py-1 text-sm font-medium">
              {activeBusiness?.name || "No Business"}
            </div>
          </div>
          
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
        </div>
      </header>
      
      {/* Content */}
      <div className="flex flex-1">
        {/* Sidebar (Desktop) */}
        <div className="hidden border-r bg-muted/40 md:block md:w-64 lg:w-72">
          <div className="flex h-full flex-col gap-2 p-4">
            <nav className="grid gap-1 px-2 text-sm font-medium">
              {navItems.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className="flex items-center gap-3 rounded-md px-3 py-2 hover:bg-accent hover:text-accent-foreground"
                >
                  {item.name}
                </Link>
              ))}
            </nav>
          </div>
        </div>
        
        {/* Main Content */}
        <main className="flex-1 overflow-auto p-4 md:p-6">{children}</main>
      </div>
      
      <Toaster />
    </div>
  );
} 