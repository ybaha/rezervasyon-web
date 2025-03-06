import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { siteConfig } from "@/config/site";
import { texts } from "@/config/texts/en";
import { createServerClient } from "@/lib/supabase-server";
import { redirect } from "next/navigation";
import Image from "next/image";
import Link from "next/link";

// Make this a server component
export default async function HomePage({ searchParams }: { searchParams: { code?: string } }) {
  // Check if there's an auth code in the URL and redirect to the callback handler
  if (searchParams.code) {
    redirect(`/auth/callback?code=${searchParams.code}`);
  }
  
  // Fetch popular businesses from Supabase
  const supabase = await createServerClient();
  const { data: popularBusinesses } = await supabase
    .from("businesses")
    .select("*")
    .eq("is_active", true)
    .eq("industry", siteConfig.industry)
    .order("rating", { ascending: false })
    .limit(4);

  return (
    <>
      {/* Hero Section */}
      <section className="bg-muted/40 py-20 md:py-28">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-4xl md:text-5xl font-bold mb-6">{texts.homepage.hero.title}</h1>
            <p className="text-xl mb-10 text-muted-foreground">
              {texts.homepage.hero.subtitle}
            </p>

            {/* Search Box */}
            <div className="bg-background border rounded-lg shadow-sm p-4 md:p-8 mb-8">
              <form className="grid gap-4 md:grid-cols-3">
                <div className="space-y-2">
                  <label htmlFor="location" className="text-sm font-medium">
                    Location
                  </label>
                  <Input
                    id="location"
                    name="location"
                    placeholder="City or Zip Code"
                  />
                </div>
                <div className="space-y-2">
                  <label htmlFor="date" className="text-sm font-medium">
                    Date
                  </label>
                  <Input
                    id="date"
                    name="date"
                    type="date"
                    defaultValue={new Date().toISOString().split("T")[0]}
                  />
                </div>
                <div className="flex items-end">
                  <Button className="w-full" type="submit" formAction="/search">
                    Search
                  </Button>
                </div>
              </form>
            </div>

            <div className="flex flex-wrap justify-center gap-4">
              <Link
                href="/search"
                className="rounded-full bg-muted px-4 py-2 text-sm font-medium hover:bg-muted/80"
              >
                Find {siteConfig.industry} Services
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Popular Services Section */}
      <section className="py-16" id="popular-services">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold mb-10 text-center">
            Popular {siteConfig.industry} Services
          </h2>
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
            {popularBusinesses?.map((business) => (
              <Card key={business.id} className="overflow-hidden">
                <div className="aspect-video relative">
                  <Image
                    src={business.image_url || "/placeholder.svg"}
                    alt={business.name}
                    fill
                    className="object-cover"
                  />
                </div>
                <CardContent className="p-4">
                  <div className="flex justify-between items-start mb-2">
                    <h3 className="font-bold text-lg mb-1">{business.name}</h3>
                    <div className="flex items-center text-orange-500">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 24 24"
                        fill="currentColor"
                        className="w-5 h-5"
                      >
                        <path
                          fillRule="evenodd"
                          d="M10.788 3.21c.448-1.077 1.976-1.077 2.424 0l2.082 5.007 5.404.433c1.164.093 1.636 1.545.749 2.305l-4.117 3.527 1.257 5.273c.271 1.136-.964 2.033-1.96 1.425L12 18.354 7.373 21.18c-.996.608-2.231-.29-1.96-1.425l1.257-5.273-4.117-3.527c-.887-.76-.415-2.212.749-2.305l5.404-.433 2.082-5.006z"
                          clipRule="evenodd"
                        />
                      </svg>
                      <span className="text-sm ml-1">{business.rating.toFixed(1)}</span>
                    </div>
                  </div>
                  <p className="text-sm text-muted-foreground mb-4 line-clamp-2">
                    {business.description}
                  </p>
                  <Link
                    href={`/${business.id}`}
                    className="text-sm font-medium text-primary hover:underline"
                  >
                    View Details
                  </Link>
                </CardContent>
              </Card>
            ))}
          </div>
          <div className="text-center mt-10">
            <Button asChild variant="outline">
              <Link href="/search">View All {siteConfig.industry} Services</Link>
            </Button>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="py-16 bg-muted/30" id="how-it-works">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold mb-12 text-center">
            How It Works
          </h2>
          <div className="grid gap-8 md:grid-cols-3">
            <div className="flex flex-col items-center text-center">
              <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mb-4">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={1.5}
                  stroke="currentColor"
                  className="w-8 h-8 text-primary"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z"
                  />
                </svg>
              </div>
              <h3 className="text-xl font-semibold mb-3">
                Find Services
              </h3>
              <p className="text-muted-foreground">
                Search for services by location and type
              </p>
            </div>
            <div className="flex flex-col items-center text-center">
              <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mb-4">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={1.5}
                  stroke="currentColor"
                  className="w-8 h-8 text-primary"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 012.25-2.25h13.5A2.25 2.25 0 0121 7.5v11.25m-18 0A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75m-18 0v-7.5A2.25 2.25 0 015.25 9h13.5A2.25 2.25 0 0121 11.25v7.5m-9-6h.008v.008H12v-.008zM12 15h.008v.008H12V15zm0 2.25h.008v.008H12v-.008zM9.75 15h.008v.008H9.75V15zm0 2.25h.008v.008H9.75v-.008zM7.5 15h.008v.008H7.5V15zm0 2.25h.008v.008H7.5v-.008zm6.75-4.5h.008v.008h-.008v-.008zm0 2.25h.008v.008h-.008V15zm0 2.25h.008v.008h-.008v-.008zm2.25-4.5h.008v.008H16.5v-.008zm0 2.25h.008v.008H16.5V15z"
                  />
                </svg>
              </div>
              <h3 className="text-xl font-semibold mb-3">
                Book Appointments
              </h3>
              <p className="text-muted-foreground">
                Choose available times and book in seconds
              </p>
            </div>
            <div className="flex flex-col items-center text-center">
              <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mb-4">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={1.5}
                  stroke="currentColor"
                  className="w-8 h-8 text-primary"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
              </div>
              <h3 className="text-xl font-semibold mb-3">
                Enjoy Your Service
              </h3>
              <p className="text-muted-foreground">
                Get reminders and manage your bookings
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="grid gap-8 md:grid-cols-2 items-center">
            <div>
              <h2 className="text-3xl font-bold mb-6">
                {texts.homepage.features.title}
              </h2>
              <p className="text-muted-foreground mb-8">
                Everything you need to book services with confidence
              </p>
              <ul className="space-y-4">
                <li className="flex items-start gap-3">
                  <div className="w-6 h-6 rounded-full bg-primary/10 flex items-center justify-center shrink-0 mt-0.5">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 20 20"
                      fill="currentColor"
                      className="w-4 h-4 text-primary"
                    >
                      <path
                        fillRule="evenodd"
                        d="M16.704 4.153a.75.75 0 01.143 1.052l-8 10.5a.75.75 0 01-1.127.075l-4.5-4.5a.75.75 0 011.06-1.06l3.894 3.893 7.48-9.817a.75.75 0 011.05-.143z"
                        clipRule="evenodd"
                      />
                    </svg>
                  </div>
                  <div>
                    <h3 className="font-medium">
                      {texts.homepage.features.feature1.title}
                    </h3>
                    <p className="text-sm text-muted-foreground">
                      {texts.homepage.features.feature1.description}
                    </p>
                  </div>
                </li>
                <li className="flex items-start gap-3">
                  <div className="w-6 h-6 rounded-full bg-primary/10 flex items-center justify-center shrink-0 mt-0.5">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 20 20"
                      fill="currentColor"
                      className="w-4 h-4 text-primary"
                    >
                      <path
                        fillRule="evenodd"
                        d="M16.704 4.153a.75.75 0 01.143 1.052l-8 10.5a.75.75 0 01-1.127.075l-4.5-4.5a.75.75 0 011.06-1.06l3.894 3.893 7.48-9.817a.75.75 0 011.05-.143z"
                        clipRule="evenodd"
                      />
                    </svg>
                  </div>
                  <div>
                    <h3 className="font-medium">
                      {texts.homepage.features.feature2.title}
                    </h3>
                    <p className="text-sm text-muted-foreground">
                      {texts.homepage.features.feature2.description}
                    </p>
                  </div>
                </li>
                <li className="flex items-start gap-3">
                  <div className="w-6 h-6 rounded-full bg-primary/10 flex items-center justify-center shrink-0 mt-0.5">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 20 20"
                      fill="currentColor"
                      className="w-4 h-4 text-primary"
                    >
                      <path
                        fillRule="evenodd"
                        d="M16.704 4.153a.75.75 0 01.143 1.052l-8 10.5a.75.75 0 01-1.127.075l-4.5-4.5a.75.75 0 011.06-1.06l3.894 3.893 7.48-9.817a.75.75 0 011.05-.143z"
                        clipRule="evenodd"
                      />
                    </svg>
                  </div>
                  <div>
                    <h3 className="font-medium">
                      {texts.homepage.features.feature3.title}
                    </h3>
                    <p className="text-sm text-muted-foreground">
                      {texts.homepage.features.feature3.description}
                    </p>
                  </div>
                </li>
              </ul>
            </div>
            <div className="rounded-lg overflow-hidden border shadow-sm">
              <Image
                src="/features-image.jpg"
                alt="Features"
                width={600}
                height={400}
                className="w-full object-cover"
              />
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-primary text-primary-foreground">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-6">Get Started Today</h2>
          <p className="text-lg opacity-90 mb-8 max-w-2xl mx-auto">
            Join thousands of people who use our platform every day
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button asChild size="lg" variant="secondary">
              <Link href="/search">Browse Services</Link>
            </Button>
            <Button asChild size="lg" variant="outline">
              <Link href="/auth/signup">Sign Up Free</Link>
            </Button>
          </div>
        </div>
      </section>
    </>
  );
} 