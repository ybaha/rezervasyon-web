'use server'

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { createServerClient } from "@/lib/supabase-server";
import Link from "next/link";

// export const metadata = {
//   title: "Reservations",
//   description: "Manage all your business reservations",
// };

interface ReservationsPageProps {
  searchParams: {
    status?: string;
    page?: string;
  };
}

export default async function ReservationsPage({ searchParams }: ReservationsPageProps) {
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
        <p className="mb-6 text-muted-foreground">Please create a business to manage reservations.</p>
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
    .from('reservations')
    .select(`
      *, user_profiles(*)
    `, { count: 'exact' })
    .eq('business_id', activeBusiness.id);
  
  // Apply filters if present
  if (searchParams.status) {
    query = query.eq('status', searchParams.status);
  }
  
  // Get reservations with pagination
  const { data: reservations, count, error } = await query
    .order('reservation_date', { ascending: false })
    .order('reservation_time', { ascending: false })
    .range(offset, offset + limit - 1);

    console.log({reservations, count, error});
  
  // Calculate total pages
  const totalPages = count ? Math.ceil(count / limit) : 0;
  
  // Status filter options
  const statusOptions = [
    { value: '', label: 'All Reservations' },
    { value: 'pending', label: 'Pending' },
    { value: 'confirmed', label: 'Confirmed' },
    { value: 'completed', label: 'Completed' },
    { value: 'cancelled', label: 'Cancelled' },
    { value: 'no-show', label: 'No-Show' },
  ];

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Reservations</h1>
          <p className="text-muted-foreground">
            Manage your business reservations
          </p>
        </div>
      </div>

      {/* Filters and Actions */}
      <div className="flex flex-col sm:flex-row justify-between gap-4">
        <div className="flex flex-wrap gap-2">
          {statusOptions.map((option) => (
            <Link
              key={option.value}
              href={`/dashboard/reservations${option.value ? `?status=${option.value}` : ''}`}
              className={`px-3 py-1 text-sm rounded-full ${
                searchParams.status === option.value || (!searchParams.status && !option.value)
                  ? 'bg-primary text-primary-foreground'
                  : 'bg-muted hover:bg-muted/80'
              }`}
            >
              {option.label}
            </Link>
          ))}
        </div>
      </div>

      {/* Reservations Table */}
      <Card>
        <CardHeader>
          <CardTitle>
            {searchParams.status
              ? `${searchParams.status.charAt(0).toUpperCase() + searchParams.status.slice(1)} Reservations`
              : 'All Reservations'}
          </CardTitle>
          <CardDescription>
            {count} reservation{count === 1 ? '' : 's'} found
          </CardDescription>
        </CardHeader>
        <CardContent>
          {reservations && reservations.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b">
                    <th className="py-3 px-2 text-left font-medium">Customer</th>
                    <th className="py-3 px-2 text-left font-medium">Date & Time</th>
                    <th className="py-3 px-2 text-left font-medium">Service</th>
                    <th className="py-3 px-2 text-left font-medium">Amount</th>
                    <th className="py-3 px-2 text-left font-medium">Status</th>
                    <th className="py-3 px-2 text-right font-medium">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {reservations.map((reservation) => (
                    <tr key={reservation.id} className="border-b hover:bg-muted/50">
                      <td className="py-3 px-2">
                        <div className="flex items-center gap-2">
                          {reservation.user_profiles?.avatar_url ? (
                            <div className="w-8 h-8 rounded-full overflow-hidden bg-muted">
                              <img 
                                src={reservation.user_profiles.avatar_url} 
                                alt={reservation.user_profiles.full_name} 
                                className="w-full h-full object-cover" 
                              />
                            </div>
                          ) : (
                            <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
                              <span className="text-xs font-medium">
                                {reservation.user_profiles?.full_name?.charAt(0) || '?'}
                              </span>
                            </div>
                          )}
                          <div>
                            <div className="font-medium">{reservation.user_profiles?.full_name}</div>
                            <div className="text-xs text-muted-foreground">{reservation.user_profiles?.phone}</div>
                          </div>
                        </div>
                      </td>
                      <td className="py-3 px-2">
                        <div>{new Date(reservation.reservation_date).toLocaleDateString()}</div>
                        <div className="text-xs text-muted-foreground">{reservation.reservation_time}</div>
                      </td>
                      <td className="py-3 px-2">
                        <div>{reservation.services?.name}</div>
                        <div className="text-xs text-muted-foreground">{reservation.services?.duration} min</div>
                      </td>
                      <td className="py-3 px-2">
                        ${parseFloat(reservation.total_amount).toFixed(2)}
                      </td>
                      <td className="py-3 px-2">
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                          reservation.status === 'confirmed' ? 'bg-green-100 text-green-800' :
                          reservation.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                          reservation.status === 'cancelled' ? 'bg-red-100 text-red-800' :
                          reservation.status === 'completed' ? 'bg-blue-100 text-blue-800' :
                          reservation.status === 'no-show' ? 'bg-gray-100 text-gray-800' :
                          'bg-gray-100 text-gray-800'
                        }`}>
                          {reservation.status.charAt(0).toUpperCase() + reservation.status.slice(1)}
                        </span>
                      </td>
                      <td className="py-3 px-2 text-right">
                        <Link 
                          href={`/dashboard/reservations/${reservation.id}`}
                          className="text-sm font-medium text-primary hover:underline"
                        >
                          View
                        </Link>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center py-12">
              <p className="text-muted-foreground">No reservations found</p>
              <p className="text-sm text-muted-foreground mt-1">
                {searchParams.status 
                  ? `Try selecting a different status filter`
                  : `Reservations will appear here when customers book appointments`}
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
                    href={`/dashboard/reservations?${
                      searchParams.status ? `status=${searchParams.status}&` : ''
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
                    href={`/dashboard/reservations?${
                      searchParams.status ? `status=${searchParams.status}&` : ''
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