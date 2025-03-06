import { Button } from "@/components/ui/button";
import Link from "next/link";

export default function ShopNotFound() {
  return (
    <div className="container mx-auto px-4 py-24 flex flex-col items-center justify-center text-center">
      <h1 className="text-4xl font-bold mb-4">Business Not Found</h1>
      <p className="text-muted-foreground max-w-lg mb-8">
        We couldn&apos;t find the business you&apos;re looking for. It may have been removed or you might have mistyped the address.
      </p>
      <div className="flex flex-col sm:flex-row gap-4">
        <Button asChild>
          <Link href="/">Return to Homepage</Link>
        </Button>
        <Button variant="outline" asChild>
          <Link href="/search">Browse Businesses</Link>
        </Button>
      </div>
    </div>
  );
} 