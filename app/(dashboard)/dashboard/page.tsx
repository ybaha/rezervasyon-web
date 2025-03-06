'use server'

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { createServerClient } from "@/lib/supabase-server";
import Link from "next/link";

// export const metadata = {
//   title: "Dashboard",
//   description: "Business owner dashboard with overview of reservations, revenue, and reviews",
// };

export default async function DashboardPage() {
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
        <p className="mb-6 text-muted-foreground">Please create a business to continue using the dashboard.</p>
        <Link 
          href="/dashboard/settings/business/new" 
          className="inline-flex items-center justify-center rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 bg-primary text-primary-foreground hover:bg-primary/90 h-10 px-4 py-2"
        >
          Create Business
        </Link>
      </div>
    );
  }
  
  // Get business statistics
  
  // Recent Reservations
  const { data: recentReservations, error: reservationsError } = await supabase
    .from('reservations')
    .select(`
      *
    `)
    .eq('business_id', activeBusiness.id)
    .order('created_at', { ascending: false })

    console.log({recentReservations, activeBusiness, reservationsError});
  
  // Today's Appointments
  const today = new Date().toISOString().split('T')[0];
  const { data: todaysAppointments, error: appointmentsError } = await supabase
    .from('reservations')
    .select(`
      *,
      services:service_id (name),
      user_profiles:user_id (full_name, phone)
    `)
    .eq('business_id', activeBusiness.id)
    .eq('reservation_date', today)
    .order('reservation_time');
  
  // Recent Reviews
  const { data: recentReviews, error: reviewsError } = await supabase
    .from('reviews')
    .select(`
      *,
      user_profiles:user_id (full_name)
    `)
    .eq('business_id', activeBusiness.id)
    .order('created_at', { ascending: false })
    .limit(3);
  
  // Revenue Statistics
  const { data: revenueStats, error: revenueError } = await supabase
    .from('payments')
    .select('amount, created_at')
    .eq('business_id', activeBusiness.id)
    .eq('payment_status', 'succeeded');
  
  // Calculate summary data
  const totalReservations = recentReservations?.length || 0;
  const totalRevenue = revenueStats?.reduce((sum, payment) => sum + parseFloat(payment.amount), 0) || 0;
  const averageRating = activeBusiness.rating || 0;
  const totalReviews = activeBusiness.review_count || 0;
  
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
        <p className="text-sm text-muted-foreground">
          Welcome back, {session?.user.email}
        </p>
      </div>

      {/* Summary Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Total Reservations
            </CardTitle>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              className="h-4 w-4 text-muted-foreground"
            >
              <path d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalReservations}</div>
            <p className="text-xs text-muted-foreground">
              {todaysAppointments?.length || 0} today
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              className="h-4 w-4 text-muted-foreground"
            >
              <path d="M12 2v20M17 5H9.5a3.5 3.5 0 000 7h5a3.5 3.5 0 010 7H6" />
            </svg>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">${totalRevenue.toFixed(2)}</div>
            <p className="text-xs text-muted-foreground">
              +10.1% from last month
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Rating</CardTitle>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              className="h-4 w-4 text-muted-foreground"
            >
              <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
            </svg>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{averageRating.toFixed(1)}</div>
            <div className="flex items-center">
              {Array.from({ length: 5 }).map((_, i) => (
                <svg 
                  key={i}
                  className={`w-4 h-4 ${i < Math.round(averageRating) ? "text-yellow-400" : "text-gray-300"}`} 
                  fill="currentColor" 
                  viewBox="0 0 20 20"
                >
                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118l-2.8-2.034c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                </svg>
              ))}
              <span className="text-xs text-muted-foreground ml-1">
                ({totalReviews} reviews)
              </span>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Services</CardTitle>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              className="h-4 w-4 text-muted-foreground"
            >
              <path d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2 2-2 2 2 2-2 2 2 2-2 2 2 2-2 2M14 5l2 2-2 2 2 2-2 2 2 2-2 2 2 2-2 2" />
            </svg>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {activeBusiness.serviceCount || "0"}
            </div>
            <p className="text-xs text-muted-foreground">
              Manage your services
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Today's Appointments */}
      <div className="grid gap-4 md:grid-cols-2">
        <Card className="col-span-1">
          <CardHeader>
            <CardTitle>Today's Appointments</CardTitle>
            <CardDescription>
              You have {todaysAppointments?.length || 0} appointments today
            </CardDescription>
          </CardHeader>
          <CardContent>
            {todaysAppointments && todaysAppointments.length > 0 ? (
              <div className="space-y-4">
                {todaysAppointments.map((appointment) => (
                  <div key={appointment.id} className="flex items-center border-b pb-4 last:border-none last:pb-0">
                    <div className="flex flex-col flex-1">
                      <div className="font-semibold">{appointment.user_profiles?.full_name}</div>
                      <div className="text-sm text-muted-foreground">{appointment.reservation_time} - {appointment.services?.name}</div>
                    </div>
                    <div className={`px-2 py-1 rounded-full text-xs ${
                      appointment.status === 'confirmed' ? 'bg-green-100 text-green-800' :
                      appointment.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                      appointment.status === 'cancelled' ? 'bg-red-100 text-red-800' :
                      'bg-gray-100 text-gray-800'
                    }`}>
                      {appointment.status.charAt(0).toUpperCase() + appointment.status.slice(1)}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center py-8 text-center">
                <p className="text-muted-foreground">No appointments scheduled for today</p>
              </div>
            )}
            <div className="mt-4">
              <Link
                href="/dashboard/reservations"
                className="text-sm text-primary hover:underline"
              >
                View all reservations
              </Link>
            </div>
          </CardContent>
        </Card>

        {/* Recent Reviews */}
        <Card className="col-span-1">
          <CardHeader>
            <CardTitle>Recent Reviews</CardTitle>
            <CardDescription>
              What your customers are saying
            </CardDescription>
          </CardHeader>
          <CardContent>
            {recentReviews && recentReviews.length > 0 ? (
              <div className="space-y-4">
                {recentReviews.map((review) => (
                  <div key={review.id} className="border-b pb-4 last:border-none last:pb-0">
                    <div className="flex items-center justify-between mb-1">
                      <div className="font-semibold">{review.user_profiles?.full_name}</div>
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
                    <p className="text-sm text-muted-foreground line-clamp-2">
                      {review.comment}
                    </p>
                    <p className="text-xs text-muted-foreground mt-1">
                      {new Date(review.created_at).toLocaleDateString()}
                    </p>
                  </div>
                ))}
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center py-8 text-center">
                <p className="text-muted-foreground">No reviews yet</p>
              </div>
            )}
            <div className="mt-4">
              <Link
                href="/dashboard/reviews"
                className="text-sm text-primary hover:underline"
              >
                View all reviews
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
} 