import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { createServerClient } from "@/lib/supabase-server";
import Link from "next/link";

export const metadata = {
  title: "Payment History",
  description: "Track your business revenue and payment history",
};

interface PaymentsPageProps {
  searchParams: {
    status?: string;
    period?: string;
    page?: string;
  };
}

export default async function PaymentsPage({ searchParams }: PaymentsPageProps) {
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
        <p className="mb-6 text-muted-foreground">Please create a business to view payment history.</p>
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
  
  // Default to last 30 days if no period specified
  const startDate = new Date();
  const endDate = new Date();
  
  if (searchParams.period === 'week') {
    startDate.setDate(startDate.getDate() - 7);
  } else if (searchParams.period === 'month') {
    startDate.setMonth(startDate.getMonth() - 1);
  } else if (searchParams.period === 'year') {
    startDate.setFullYear(startDate.getFullYear() - 1);
  } else {
    // Default to 30 days
    startDate.setDate(startDate.getDate() - 30);
  }
  
  // Build the query
  let query = supabase
    .from('payments')
    .select(`
      *,
      reservations!inner (
        id,
        reservation_date,
        booking_reference,
        user_id
      ),
      user_profiles:reservations.user_id (
        full_name
      )
    `, { count: 'exact' })
    .eq('business_id', activeBusiness.id)
    .gte('created_at', startDate.toISOString())
    .lte('created_at', endDate.toISOString());
  
  // Apply filters if present
  if (searchParams.status) {
    query = query.eq('payment_status', searchParams.status);
  }
  
  // Get payments with pagination
  const { data: payments, count, error } = await query
    .order('created_at', { ascending: false })
    .range(offset, offset + limit - 1);
  
  // Calculate total pages
  const totalPages = count ? Math.ceil(count / limit) : 0;
  
  // Calculate summary statistics
  const totalAmount = payments
    ?.filter((payment) => payment.payment_status === 'succeeded')
    .reduce((sum, payment) => sum + parseFloat(payment.amount), 0) || 0;
  
  const pendingAmount = payments
    ?.filter((payment) => payment.payment_status === 'pending')
    .reduce((sum, payment) => sum + parseFloat(payment.amount), 0) || 0;
  
  const refundedAmount = payments
    ?.filter((payment) => payment.payment_status === 'refunded')
    .reduce((sum, payment) => sum + parseFloat(payment.amount), 0) || 0;
  
  // Status filter options
  const statusOptions = [
    { value: '', label: 'All Payments' },
    { value: 'pending', label: 'Pending' },
    { value: 'succeeded', label: 'Succeeded' },
    { value: 'failed', label: 'Failed' },
    { value: 'refunded', label: 'Refunded' },
  ];
  
  // Period filter options
  const periodOptions = [
    { value: 'week', label: 'Last 7 Days' },
    { value: 'month', label: 'Last 30 Days' },
    { value: 'year', label: 'Last Year' },
  ];

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Payment History</h1>
          <p className="text-muted-foreground">
            Track your business revenue and payment history
          </p>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">
              Total Revenue
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">${totalAmount.toFixed(2)}</div>
            <p className="text-xs text-muted-foreground">
              From successful payments
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">
              Pending
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">${pendingAmount.toFixed(2)}</div>
            <p className="text-xs text-muted-foreground">
              Payments awaiting completion
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">
              Refunded
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">${refundedAmount.toFixed(2)}</div>
            <p className="text-xs text-muted-foreground">
              Total amount refunded
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Filters and Actions */}
      <div className="flex flex-col sm:flex-row justify-between gap-4">
        <div className="flex flex-wrap gap-2">
          {statusOptions.map((option) => (
            <Link
              key={option.value}
              href={`/dashboard/payments?${option.value ? `status=${option.value}&` : ''}${searchParams.period ? `period=${searchParams.period}` : ''}`}
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
        
        <div className="flex flex-wrap gap-2">
          {periodOptions.map((option) => (
            <Link
              key={option.value}
              href={`/dashboard/payments?${searchParams.status ? `status=${searchParams.status}&` : ''}period=${option.value}`}
              className={`px-3 py-1 text-sm rounded-full ${
                searchParams.period === option.value || (!searchParams.period && option.value === 'month')
                  ? 'bg-primary text-primary-foreground'
                  : 'bg-muted hover:bg-muted/80'
              }`}
            >
              {option.label}
            </Link>
          ))}
        </div>
      </div>

      {/* Payments Table */}
      <Card>
        <CardHeader>
          <CardTitle>
            Payment History
          </CardTitle>
          <CardDescription>
            {count} payment{count === 1 ? '' : 's'} found
          </CardDescription>
        </CardHeader>
        <CardContent>
          {payments && payments.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b">
                    <th className="py-3 px-2 text-left font-medium">Date</th>
                    <th className="py-3 px-2 text-left font-medium">Customer</th>
                    <th className="py-3 px-2 text-left font-medium">Reference</th>
                    <th className="py-3 px-2 text-left font-medium">Amount</th>
                    <th className="py-3 px-2 text-left font-medium">Status</th>
                    <th className="py-3 px-2 text-right font-medium">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {payments.map((payment) => (
                    <tr key={payment.id} className="border-b hover:bg-muted/50">
                      <td className="py-3 px-2">
                        {new Date(payment.created_at).toLocaleDateString()}
                      </td>
                      <td className="py-3 px-2">
                        {payment.user_profiles?.full_name || 'Unknown'}
                      </td>
                      <td className="py-3 px-2">
                        {payment.reservations.booking_reference}
                      </td>
                      <td className="py-3 px-2">
                        ${parseFloat(payment.amount).toFixed(2)}
                      </td>
                      <td className="py-3 px-2">
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                          payment.payment_status === 'succeeded' ? 'bg-green-100 text-green-800' :
                          payment.payment_status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                          payment.payment_status === 'failed' ? 'bg-red-100 text-red-800' :
                          payment.payment_status === 'refunded' ? 'bg-blue-100 text-blue-800' :
                          'bg-gray-100 text-gray-800'
                        }`}>
                          {payment.payment_status.charAt(0).toUpperCase() + payment.payment_status.slice(1)}
                        </span>
                      </td>
                      <td className="py-3 px-2 text-right">
                        <Link 
                          href={`/dashboard/reservations/${payment.reservations.id}`}
                          className="text-sm font-medium text-primary hover:underline"
                        >
                          View Reservation
                        </Link>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center py-12">
              <p className="text-muted-foreground">No payments found</p>
              <p className="text-sm text-muted-foreground mt-1">
                {searchParams.status 
                  ? `Try selecting a different status filter`
                  : `Payments will appear here as customers make reservations`}
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
                    href={`/dashboard/payments?${
                      searchParams.status ? `status=${searchParams.status}&` : ''
                    }${
                      searchParams.period ? `period=${searchParams.period}&` : ''
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
                    href={`/dashboard/payments?${
                      searchParams.status ? `status=${searchParams.status}&` : ''
                    }${
                      searchParams.period ? `period=${searchParams.period}&` : ''
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