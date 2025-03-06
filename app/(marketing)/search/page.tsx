import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { siteConfig } from "@/config/site";
import { getBusinesses } from "@/lib/db";
import Link from "next/link";

interface SearchPageProps {
  searchParams: {
    location?: string;
    rating?: string;
    price?: string;
    page?: string;
  };
}

export default async function SearchPage({ searchParams }: SearchPageProps) {
  const page = Number(searchParams.page) || 1;
  const limit = 12;
  const offset = (page - 1) * limit;
  
  // Convert params to format expected by the database query
  const { businesses, count } = await getBusinesses({
    limit,
    offset,
    location: searchParams.location || null,
    industry: siteConfig.industry,
    search: searchParams.location || null, // Also search by location text
  });
  
  const totalPages = Math.ceil(count / limit);
  
  if (searchParams.location) {
    // Implement the location filter logic here
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">{siteConfig.industry} Services</h1>
      
      {/* Search & Filter Form */}
      <div className="bg-card border rounded-lg p-6 mb-8">
        <form className="grid gap-4 grid-cols-1 md:grid-cols-3">
          <div>
            <label className="text-sm font-medium mb-1 block">Location</label>
            <Input 
              name="location" 
              defaultValue={searchParams.location || ""} 
              placeholder="Enter location..."
            />
          </div>
          
          <div className="space-y-2">
            <label htmlFor="rating" className="text-sm font-medium">Rating</label>
            <Select name="rating" defaultValue={searchParams.rating || "all"}>
              <SelectTrigger id="rating">
                <SelectValue placeholder="Any Rating" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Any Rating</SelectItem>
                <SelectItem value="4">4+ Stars</SelectItem>
                <SelectItem value="3">3+ Stars</SelectItem>
                <SelectItem value="2">2+ Stars</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          <div className="space-y-2">
            <label htmlFor="price" className="text-sm font-medium">Price Range</label>
            <Select name="price" defaultValue={searchParams.price || "all"}>
              <SelectTrigger id="price">
                <SelectValue placeholder="Any Price" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Any Price</SelectItem>
                <SelectItem value="1">$</SelectItem>
                <SelectItem value="2">$$</SelectItem>
                <SelectItem value="3">$$$</SelectItem>
                <SelectItem value="4">$$$$</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          <div className="md:col-span-3 mt-2">
            <Button type="submit" className="w-full md:w-auto">
              Apply Filters
            </Button>
          </div>
        </form>
      </div>
      
      {/* Results Count */}
      <div className="mb-6">
        <p className="text-muted-foreground">
          {count} {count === 1 ? 'result' : 'results'} for {siteConfig.industry} services
          {searchParams.location ? ` in "${searchParams.location}"` : ''}
        </p>
      </div>
      
      {/* Results Grid */}
      {businesses.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          {businesses.map((business) => (
            <Link key={business.id} href={`/${business.id}`}>
              <Card className="h-full hover:shadow-md transition-shadow">
                <CardHeader className="pb-2">
                  <CardTitle className="text-xl">{business.name}</CardTitle>
                  <p className="text-sm text-muted-foreground">{business.location}</p>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center space-x-1 mb-2">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <svg 
                        key={i}
                        className={`w-4 h-4 ${i < (business.rating || 0) ? "text-yellow-400" : "text-gray-300"}`} 
                        fill="currentColor" 
                        viewBox="0 0 20 20"
                      >
                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118l-2.8-2.034c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                      </svg>
                    ))}
                    <span className="text-sm ml-1">({business.review_count || 0})</span>
                  </div>
                  <p className="line-clamp-2 text-sm">{business.description}</p>
                  
                  {/* Price indicator */}
                  <div className="mt-4 flex justify-between items-center">
                    <span className="text-sm font-medium">
                      {Array(business.price_level || 1).fill('$').join('')}
                    </span>
                    <Button variant="outline" size="sm">View</Button>
                  </div>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center py-12 text-center">
          <h3 className="text-xl font-medium mb-2">No results found</h3>
          <p className="text-muted-foreground mb-6">
            Try adjusting your search or filter criteria
          </p>
          <Button asChild>
            <Link href="/">Back to Homepage</Link>
          </Button>
        </div>
      )}
      
      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex justify-center mt-8">
          <div className="flex space-x-2">
            {page > 1 && (
              <Button variant="outline" asChild>
                <Link
                  href={{
                    pathname: '/search',
                    query: {
                      ...searchParams,
                      page: page - 1,
                    },
                  }}
                >
                  Previous
                </Link>
              </Button>
            )}
            
            <div className="flex items-center px-4">
              Page {page} of {totalPages}
            </div>
            
            {page < totalPages && (
              <Button variant="outline" asChild>
                <Link
                  href={{
                    pathname: '/search',
                    query: {
                      ...searchParams,
                      page: page + 1,
                    },
                  }}
                >
                  Next
                </Link>
              </Button>
            )}
          </div>
        </div>
      )}
    </div>
  );
} 