import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { createServerClient } from "@/lib/supabase-server";
import { Tables } from "@/types/supabase";
import Link from "next/link";

// export const metadata = {
//   title: "Calendar",
//   description: "Appointment calendar for your business",
// };

interface CalendarPageProps {
  searchParams: {
    view?: string;
    date?: string;
  };
}

export default async function CalendarPage({ searchParams }: CalendarPageProps) {
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
        <p className="mb-6 text-muted-foreground">Please create a business to view the calendar.</p>
        <Link 
          href="/dashboard/settings/business/new" 
          className="inline-flex items-center justify-center rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 bg-primary text-primary-foreground hover:bg-primary/90 h-10 px-4 py-2"
        >
          Create Business
        </Link>
      </div>
    );
  }
  
  // Determine the view (month, week, day)
  const view = searchParams.view || 'month';
  
  // Determine the current date
  const currentDate = searchParams.date
    ? new Date(searchParams.date)
    : new Date();
    
  const selectedMonth = currentDate.getMonth();
  const selectedYear = currentDate.getFullYear();
  
  // Get reservations for the month
  const startOfMonth = new Date(selectedYear, selectedMonth, 1);
  const endOfMonth = new Date(selectedYear, selectedMonth + 1, 0);
  
  const { data: reservations,error: reservationsError } = await supabase
    .from('reservations')
    .select(`*, user_profiles(*)`)
    .eq('business_id', activeBusiness.id)
    .gte('reservation_date', startOfMonth.toISOString().split('T')[0])
    .lte('reservation_date', endOfMonth.toISOString().split('T')[0])
    .order('reservation_date')
    .order('reservation_time');
      
    console.log({reservations, reservationsError});
  
  // Group reservations by date
  const reservationsByDate: Record<string, Tables<"reservations">[]> = {};
  
  reservations?.forEach(reservation => {
    const date = reservation.reservation_date;
    if (!reservationsByDate[date]) {
      reservationsByDate[date] = [];
    }
    reservationsByDate[date].push(reservation);
  });
  
  // Calendar generation
  const monthNames = [
    "January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"
  ];
  
  const dayNames = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
  
  // Create calendar grid
  const firstDay = new Date(selectedYear, selectedMonth, 1).getDay();
  const daysInMonth = new Date(selectedYear, selectedMonth + 1, 0).getDate();
  
  // Get previous and next month dates
  const prevMonth = new Date(selectedYear, selectedMonth - 1, 1);
  const nextMonth = new Date(selectedYear, selectedMonth + 1, 1);
  
  // Calendar days array
  const calendarDays = [];
  
  // Previous month's days
  for (let i = 0; i < firstDay; i++) {
    const day = new Date(selectedYear, selectedMonth, 0 - (firstDay - i - 1));
    calendarDays.push({
      date: day.toISOString().split('T')[0],
      day: day.getDate(),
      isCurrentMonth: false,
    });
  }
  
  // Current month's days
  for (let i = 1; i <= daysInMonth; i++) {
    const day = new Date(selectedYear, selectedMonth, i);
    calendarDays.push({
      date: day.toISOString().split('T')[0],
      day: i,
      isCurrentMonth: true,
      isToday: day.toDateString() === new Date().toDateString(),
      hasEvents: !!reservationsByDate[day.toISOString().split('T')[0]],
      events: reservationsByDate[day.toISOString().split('T')[0]] || [],
    });
  }
  
  // Next month's days to fill out the grid
  const remainingDays = 42 - calendarDays.length; // 6 rows of 7 days
  for (let i = 1; i <= remainingDays; i++) {
    const day = new Date(selectedYear, selectedMonth + 1, i);
    calendarDays.push({
      date: day.toISOString().split('T')[0],
      day: i,
      isCurrentMonth: false,
    });
  }
  
  // Split into weeks
  const weeks = [];
  for (let i = 0; i < calendarDays.length; i += 7) {
    weeks.push(calendarDays.slice(i, i + 7));
  }
  
  // Get today's appointments
  const todayDate = new Date().toISOString().split('T')[0];
  const todayEvents = reservationsByDate[todayDate] || [];

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Calendar</h1>
          <p className="text-muted-foreground">
            View and manage your appointments
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" asChild>
            <Link href={`/dashboard/calendar?date=${prevMonth.toISOString().split('T')[0]}`}>
              Previous
            </Link>
          </Button>
          <Button variant="outline" size="sm" asChild>
            <Link href={`/dashboard/calendar?date=${new Date().toISOString().split('T')[0]}`}>
              Today
            </Link>
          </Button>
          <Button variant="outline" size="sm" asChild>
            <Link href={`/dashboard/calendar?date=${nextMonth.toISOString().split('T')[0]}`}>
              Next
            </Link>
          </Button>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-center">
            {monthNames[selectedMonth]} {selectedYear}
          </CardTitle>
        </CardHeader>
        <CardContent>
          {/* Calendar */}
          <div className="grid grid-cols-7 gap-1">
            {/* Day headers */}
            {dayNames.map((day) => (
              <div key={day} className="text-center p-2 font-semibold text-xs text-muted-foreground">
                {day}
              </div>
            ))}
            
            {/* Calendar days */}
            {weeks.map((week, weekIndex) => (
              week.map((day, dayIndex) => (
                <div 
                  key={`${weekIndex}-${dayIndex}`} 
                  className={`min-h-28 border rounded-md overflow-hidden ${
                    day.isCurrentMonth ? 'bg-card' : 'bg-muted/30 text-muted-foreground'
                  } ${day.isToday ? 'border-primary' : 'border-border'}`}
                >
                  <div className="flex flex-col h-full">
                    <div className="p-1 text-right">
                      <span className={`text-xs font-medium ${
                        day.isToday ? 'bg-primary text-primary-foreground rounded-full w-5 h-5 inline-flex items-center justify-center' : ''
                      }`}>
                        {day.day}
                      </span>
                    </div>
                    <div className="flex-1 p-1">
                      {day.hasEvents && (
                        <div className="space-y-1">
                          {day.events.slice(0, 3).map((event) => (
                            <Link
                              key={event.id}
                              href={`/dashboard/reservations/${event.id}`}
                              className={`block text-xs truncate p-1 rounded ${
                                event.status === 'confirmed' ? 'bg-green-100 text-green-800' :
                                event.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                                event.status === 'cancelled' ? 'bg-red-100 text-red-800' :
                                event.status === 'completed' ? 'bg-blue-100 text-blue-800' :
                                'bg-gray-100 text-gray-800'
                              }`}
                            >
                              {event.reservation_time} - {event.user_profiles?.full_name}
                            </Link>
                          ))}
                          {day.events.length > 3 && (
                            <div className="text-xs text-center text-muted-foreground">
                              + {day.events.length - 3} more
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              ))
            ))}
          </div>
        </CardContent>
      </Card>
      
      {/* Today's Appointments */}
      <Card>
        <CardHeader>
          <CardTitle>Today&apos;s Appointments</CardTitle>
        </CardHeader>
        <CardContent>
          {todayEvents.length > 0 ? (
            <div className="space-y-4">
              {todayEvents.map((event: Tables<"reservations">) => (
                <div key={event.id} className="flex items-center border-b pb-4 last:border-none last:pb-0">
                  <div className="flex-1">
                    <div className="font-medium">{event.user_profiles?.full_name}</div>
                    <div className="text-sm text-muted-foreground">
                      {event.reservation_time} ({event.services?.duration} min) - {event.services?.name}
                    </div>
                  </div>
                  <div className={`px-2 py-1 rounded-full text-xs font-medium ${
                    event.status === 'confirmed' ? 'bg-green-100 text-green-800' :
                    event.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                    event.status === 'cancelled' ? 'bg-red-100 text-red-800' :
                    event.status === 'completed' ? 'bg-blue-100 text-blue-800' :
                    'bg-gray-100 text-gray-800'
                  }`}>
                    {event.status.charAt(0).toUpperCase() + event.status.slice(1)}
                  </div>
                  <Link
                    href={`/dashboard/reservations/${event.id}`}
                    className="ml-4 text-sm font-medium text-primary hover:underline"
                  >
                    View
                  </Link>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8 text-muted-foreground">
              No appointments scheduled for today
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
} 