import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { getBusinessById } from "@/lib/db";
import { format } from "date-fns";
import Link from "next/link";
import { notFound } from "next/navigation";

interface ConfirmationPageProps {
  params: {
    shopId: string;
  };
  searchParams: {
    date?: string;
    time?: string;
    service?: string;
  };
}

export default async function ConfirmationPage({ params, searchParams }: ConfirmationPageProps) {
  const business = await getBusinessById(params.shopId);
  
  if (!business) {
    notFound();
  }
  
  // In a real application, we would fetch the booking details from the database
  // using a booking reference or confirmation ID
  
  // Mock service data
  const services = [
    { id: 1, name: "Basic Service", price: 25, duration: 30 },
    { id: 2, name: "Premium Service", price: 45, duration: 60 },
    { id: 3, name: "Deluxe Package", price: 75, duration: 90 },
  ];
  
  const selectedService = services.find(s => s.id.toString() === searchParams.service);
  
  // Generate a mock confirmation number
  const confirmationNumber = `BK-${Math.floor(100000 + Math.random() * 900000)}`;

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-2xl mx-auto">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-green-100 text-green-600 mb-4">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <h1 className="text-3xl font-bold mb-2">Booking Confirmed!</h1>
          <p className="text-muted-foreground">
            Your appointment has been successfully booked. We've sent a confirmation to your email.
          </p>
        </div>
        
        <Card>
          <CardHeader>
            <CardTitle>Booking Details</CardTitle>
            <CardDescription>Confirmation #{confirmationNumber}</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="border-b pb-4">
                <h3 className="font-bold mb-2">{business.name}</h3>
                <p className="text-muted-foreground">{business.location}</p>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-muted-foreground">Date</p>
                  <p className="font-medium">
                    {searchParams.date 
                      ? format(new Date(searchParams.date), 'MMMM d, yyyy')
                      : 'Not specified'
                    }
                  </p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Time</p>
                  <p className="font-medium">{searchParams.time || 'Not specified'}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Service</p>
                  <p className="font-medium">{selectedService?.name || 'Not specified'}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Duration</p>
                  <p className="font-medium">{selectedService?.duration} minutes</p>
                </div>
              </div>
              
              <div className="border-t pt-4 mt-4">
                <div className="flex justify-between font-bold">
                  <span>Total Paid</span>
                  <span>${selectedService?.price || 0}</span>
                </div>
              </div>
            </div>
          </CardContent>
          <CardFooter className="flex flex-col sm:flex-row sm:justify-between gap-4">
            <Button variant="outline" asChild>
              <Link href="/">Return to Homepage</Link>
            </Button>
            <Button asChild>
              <Link href="/dashboard/reservations">View My Reservations</Link>
            </Button>
          </CardFooter>
        </Card>
        
        <div className="mt-8 text-center">
          <h3 className="text-lg font-medium mb-2">Need to make changes?</h3>
          <p className="text-muted-foreground mb-4">
            You can manage your booking through your account or by contacting the business directly.
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <Button variant="outline" asChild>
              <Link href={`/dashboard/reservations`}>
                Manage Booking
              </Link>
            </Button>
            <Button variant="outline" asChild>
              <Link href={`/${params.shopId}`}>
                Contact {business.name}
              </Link>
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
} 