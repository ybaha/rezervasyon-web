import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { createServerClient } from "@/lib/supabase-server";
import Link from "next/link";

export const metadata = {
  title: "Reviews",
  description: "Monitor and manage customer reviews",
};

interface ReviewsPageProps {
  searchParams: {
    rating?: string;
    page?: string;
  };
}

export default async function ReviewsPage({ searchParams }: ReviewsPageProps) {
  const supabase = await createServerClient();
  const { data: { session } } = await supabase.auth.getSession();
  
  // Get the active business
  const { data: businesses } = await supabase
    .from('businesses')
    .select('*')
    .eq('owner_id', session?.user.id)
    .order('name');
  
  const activeBusiness = businesses && businesses.length > 0 ? businesses[0] : null;
  
  if (!activeBusiness) {
    return (
      <div className="flex flex-col items-center justify-center h-full">
        <h1 className="text-2xl font-bold mb-4">No Business Found</h1>
        <p className="mb-6 text-muted-foreground">Please create a business to monitor reviews.</p>
        <Link 
          href="/dashboard/settings/business/new" 
          className="inline-flex items-center justify-center rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 bg-primary text-primary-foreground hover:bg-primary/90 h-10 px-4 py-2"
        >
          Create Business
        </Link>
      </div>
    );
  }
  
  // Pagination settings
  const page = parseInt(searchParams.page || '1');
  const limit = 10;
  const offset = (page - 1) * limit;
  
  // Build the query
  let query = supabase
    .from('reviews')
    .select(`
      *,
      user_profiles:user_id (full_name, avatar_url),
      reservations:reservation_id (
        reservation_date,
        services:service_id (name)
      )
    `, { count: 'exact' })
    .eq('business_id', activeBusiness.id)
    .eq('is_published', true);
  
  // Apply filters if present
  if (searchParams.rating) {
    query = query.eq('rating', parseInt(searchParams.rating));
  }
  
  // Get reviews with pagination
  const { data: reviews, count } = await query
    .order('created_at', { ascending: false })
    .range(offset, offset + limit - 1);
  
  // Calculate total pages
  const totalPages = count ? Math.ceil(count / limit) : 0;
  
  // Calculate average rating stats
  const totalReviews = activeBusiness.review_count || 0;
  const averageRating = activeBusiness.rating || 0;
  
  // Ratings distribution
  const { data: ratingDistribution } = await supabase
    .from('reviews')
    .select('rating, count', { count: 'exact' })
    .eq('business_id', activeBusiness.id)
    .eq('is_published', true)
    .group('rating');
  
  // Create an object with all possible ratings (1-5) initialized to zero
  const ratingsCount: Record<string, number> = {
    '1': 0,
    '2': 0,
    '3': 0,
    '4': 0,
    '5': 0,
  };
  
  // Populate the ratings count from the database
  if (ratingDistribution) {
    ratingDistribution.forEach((item) => {
      ratingsCount[item.rating.toString()] = item.count;
    });
  }
  
  // Rating filter options
  const ratingOptions = [
    { value: '', label: 'All Ratings' },
    { value: '5', label: '5 Stars' },
    { value: '4', label: '4 Stars' },
    { value: '3', label: '3 Stars' },
    { value: '2', label: '2 Stars' },
    { value: '1', label: '1 Star' },
  ];

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Customer Reviews</h1>
          <p className="text-muted-foreground">
            Monitor and manage customer feedback
          </p>
        </div>
      </div>

      {/* Rating Summary */}
      <Card>
        <CardHeader>
          <CardTitle>Rating Summary</CardTitle>
          <CardDescription>
            Overall rating of {averageRating.toFixed(1)} from {totalReviews} reviews
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col md:flex-row gap-8 md:items-center">
            {/* Average rating */}
            <div className="flex flex-col items-center justify-center">
              <div className="text-5xl font-bold">{averageRating.toFixed(1)}</div>
              <div className="flex mt-2">
                {Array.from({ length: 5 }).map((_, i) => (
                  <svg 
                    key={i}
                    className={`w-5 h-5 ${i < Math.round(averageRating) ? "text-yellow-400" : "text-gray-300"}`} 
                    fill="currentColor" 
                    viewBox="0 0 20 20"
                  >
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118l-2.8-2.034c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                  </svg>
                ))}
              </div>
              <div className="text-muted-foreground text-sm mt-1">
                {totalReviews} total reviews
              </div>
            </div>
            
            {/* Rating distribution */}
            <div className="flex-1 space-y-2">
              {ratingOptions.slice(1).reverse().map((option) => {
                const percentage = totalReviews > 0 
                  ? (ratingsCount[option.value] / totalReviews) * 100 
                  : 0;
                
                return (
                  <div key={option.value} className="flex items-center">
                    <div className="w-16 text-sm">{option.label}</div>
                    <div className="flex-1 h-4 mx-2 bg-muted rounded-full overflow-hidden">
                      <div 
                        className="h-full bg-yellow-400 rounded-full" 
                        style={{ width: `${percentage}%` }}
                      />
                    </div>
                    <div className="w-10 text-right text-sm text-muted-foreground">
                      {ratingsCount[option.value]}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Filters */}
      <div className="flex flex-wrap gap-2">
        {ratingOptions.map((option) => (
          <Link
            key={option.value}
            href={`/dashboard/reviews${option.value ? `?rating=${option.value}` : ''}`}
            className={`px-3 py-1 text-sm rounded-full ${
              searchParams.rating === option.value || (!searchParams.rating && !option.value)
                ? 'bg-primary text-primary-foreground'
                : 'bg-muted hover:bg-muted/80'
            }`}
          >
            {option.label}
          </Link>
        ))}
      </div>

      {/* Reviews List */}
      <Card>
        <CardHeader>
          <CardTitle>
            {searchParams.rating
              ? `${searchParams.rating}-Star Reviews`
              : 'All Reviews'}
          </CardTitle>
          <CardDescription>
            {count} review{count === 1 ? '' : 's'} found
          </CardDescription>
        </CardHeader>
        <CardContent>
          {reviews && reviews.length > 0 ? (
            <div className="space-y-6">
              {reviews.map((review) => (
                <div key={review.id} className="border-b pb-6 last:border-0 last:pb-0">
                  <div className="flex justify-between items-start mb-2">
                    <div className="flex items-center gap-2">
                      {review.user_profiles?.avatar_url ? (
                        <div className="w-10 h-10 rounded-full overflow-hidden bg-muted">
                          <img 
                            src={review.user_profiles.avatar_url} 
                            alt={review.user_profiles.full_name} 
                            className="w-full h-full object-cover" 
                          />
                        </div>
                      ) : (
                        <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                          <span className="text-sm font-medium">
                            {review.user_profiles?.full_name?.charAt(0) || '?'}
                          </span>
                        </div>
                      )}
                      <div>
                        <div className="font-medium">{review.user_profiles?.full_name}</div>
                        <div className="text-xs text-muted-foreground">
                          {review.reservations?.services?.name && (
                            <span className="mr-2">
                              Service: {review.reservations.services.name}
                            </span>
                          )}
                          {review.created_at && (
                            <span>
                              {new Date(review.created_at).toLocaleDateString()}
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                    <div className="flex">
                      {Array.from({ length: 5 }).map((_, i) => (
                        <svg 
                          key={i}
                          className={`w-4 h-4 ${i < review.rating ? "text-yellow-400" : "text-gray-300"}`} 
                          fill="currentColor" 
                          viewBox="0 0 20 20"
                        >
                          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118l-2.8-2.034c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                        </svg>
                      ))}
                    </div>
                  </div>
                  <p className="text-sm mt-2">
                    {review.comment}
                  </p>
                  {review.reservation_id && (
                    <div className="mt-3 flex justify-between items-center">
                      <div className="text-xs text-muted-foreground">
                        {review.reservations?.reservation_date && (
                          <>Appointment: {new Date(review.reservations.reservation_date).toLocaleDateString()}</>
                        )}
                      </div>
                      <Link 
                        href={`/dashboard/reservations/${review.reservation_id}`}
                        className="text-xs font-medium text-primary hover:underline"
                      >
                        View Reservation
                      </Link>
                    </div>
                  )}
                </div>
              ))}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center py-12">
              <p className="text-muted-foreground">No reviews found</p>
              <p className="text-sm text-muted-foreground mt-1">
                {searchParams.rating 
                  ? `Try selecting a different rating filter`
                  : `Reviews will appear here as customers provide feedback`}
              </p>
            </div>
          )}
          
          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex items-center justify-center gap-2 mt-6">
              <Button
                variant="outline"
                size="sm"
                disabled={page <= 1}
                asChild={page > 1}
              >
                {page > 1 ? (
                  <Link
                    href={`/dashboard/reviews?${
                      searchParams.rating ? `rating=${searchParams.rating}&` : ''
                    }page=${page - 1}`}
                  >
                    Previous
                  </Link>
                ) : (
                  <span>Previous</span>
                )}
              </Button>
              
              <span className="text-sm">
                Page {page} of {totalPages}
              </span>
              
              <Button
                variant="outline"
                size="sm"
                disabled={page >= totalPages}
                asChild={page < totalPages}
              >
                {page < totalPages ? (
                  <Link
                    href={`/dashboard/reviews?${
                      searchParams.rating ? `rating=${searchParams.rating}&` : ''
                    }page=${page + 1}`}
                  >
                    Next
                  </Link>
                ) : (
                  <span>Next</span>
                )}
              </Button>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
} 