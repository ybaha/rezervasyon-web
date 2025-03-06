import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { getAvailableAppointments, getBusinessById } from "@/lib/db";
import { format } from "date-fns";
import { notFound } from "next/navigation";

interface BookingPageProps {
  params: {
    shopId: string;
  };
  searchParams: {
    step?: string;
    date?: string;
    time?: string;
    service?: string;
  };
}

export default async function BookingPage({ params, searchParams }: BookingPageProps) {
  const business = await getBusinessById(params.shopId);
  
  if (!business) {
    notFound();
  }
  
  // Get current step from query params, default to 1
  const currentStep = searchParams.step ? parseInt(searchParams.step) : 1;
  const selectedDate = searchParams.date || format(new Date(), 'yyyy-MM-dd');
  
  // Get available time slots from the database based on the selected date
  const availableSlots = await getAvailableAppointments(params.shopId, selectedDate);
  
  // Mock data for services - in a real app, these would be fetched from the database
  const services = [
    { id: 1, name: "Basic Service", price: 25, duration: 30, description: "Quick and efficient service" },
    { id: 2, name: "Premium Service", price: 45, duration: 60, description: "Our most popular comprehensive service" },
    { id: 3, name: "Deluxe Package", price: 75, duration: 90, description: "The ultimate experience with extra features" },
  ];

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-2">Book an Appointment</h1>
      <p className="text-muted-foreground mb-8">
        <span>{business.name}</span>
        <span className="mx-2">•</span>
        <span>{business.location}</span>
      </p>
      
      {/* Booking Progress */}
      <div className="relative mb-8">
        <div className="absolute left-0 top-1/2 -translate-y-1/2 w-full h-1 bg-border" />
        <ol className="relative z-10 flex justify-between">
          <li className="flex flex-col items-center">
            <div className={`w-8 h-8 rounded-full flex items-center justify-center ${currentStep >= 1 ? 'bg-primary text-primary-foreground' : 'bg-muted text-muted-foreground'}`}>
              1
            </div>
            <span className="text-sm mt-2">Date & Time</span>
          </li>
          <li className="flex flex-col items-center">
            <div className={`w-8 h-8 rounded-full flex items-center justify-center ${currentStep >= 2 ? 'bg-primary text-primary-foreground' : 'bg-muted text-muted-foreground'}`}>
              2
            </div>
            <span className="text-sm mt-2">Services</span>
          </li>
          <li className="flex flex-col items-center">
            <div className={`w-8 h-8 rounded-full flex items-center justify-center ${currentStep >= 3 ? 'bg-primary text-primary-foreground' : 'bg-muted text-muted-foreground'}`}>
              3
            </div>
            <span className="text-sm mt-2">Your Info</span>
          </li>
          <li className="flex flex-col items-center">
            <div className={`w-8 h-8 rounded-full flex items-center justify-center ${currentStep >= 4 ? 'bg-primary text-primary-foreground' : 'bg-muted text-muted-foreground'}`}>
              4
            </div>
            <span className="text-sm mt-2">Payment</span>
          </li>
        </ol>
      </div>
      
      {/* Step 1: Date & Time Selection */}
      {currentStep === 1 && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <Card>
            <CardHeader>
              <CardTitle>Select a Date</CardTitle>
              <CardDescription>Pick a date for your appointment</CardDescription>
            </CardHeader>
            <CardContent>
              <Calendar
                mode="single"
                selected={new Date(selectedDate)}
                className="rounded-md border"
              />
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle>Select a Time</CardTitle>
              <CardDescription>Available time slots for {format(new Date(selectedDate), 'MMMM d, yyyy')}</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                {availableSlots.length > 0 ? (
                  availableSlots.map((slot) => (
                    <Button
                      key={slot.id}
                      variant="outline"
                      className="text-center py-6"
                      asChild
                    >
                      <a href={`/${params.shopId}/book?step=2&date=${selectedDate}&time=${slot.time}`}>
                        {slot.time}
                      </a>
                    </Button>
                  ))
                ) : (
                  // Mock time slots if none are returned from the database
                  ["9:00 AM", "10:00 AM", "11:00 AM", "1:00 PM", "2:00 PM", "3:00 PM", "4:00 PM"].map((time) => (
                    <Button
                      key={time}
                      variant="outline"
                      className="text-center py-6"
                      asChild
                    >
                      <a href={`/${params.shopId}/book?step=2&date=${selectedDate}&time=${time}`}>
                        {time}
                      </a>
                    </Button>
                  ))
                )}
              </div>
            </CardContent>
            <CardFooter className="flex justify-between">
              <Button variant="outline" asChild>
                <a href={`/${params.shopId}`}>Cancel</a>
              </Button>
            </CardFooter>
          </Card>
        </div>
      )}
      
      {/* Step 2: Service Selection */}
      {currentStep === 2 && (
        <Card>
          <CardHeader>
            <CardTitle>Select a Service</CardTitle>
            <CardDescription>Choose the service you want to book</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {services.map((service) => (
                <Card key={service.id} className="overflow-hidden cursor-pointer hover:border-primary">
                  <CardContent className="p-6">
                    <div className="flex justify-between items-start mb-2">
                      <div>
                        <h3 className="font-bold text-lg">{service.name}</h3>
                        <p className="text-sm text-muted-foreground">{service.duration} minutes</p>
                      </div>
                      <div className="text-right">
                        <span className="font-bold">${service.price}</span>
                      </div>
                    </div>
                    <p className="text-sm">{service.description}</p>
                    <div className="mt-4">
                      <Button asChild className="w-full">
                        <a href={`/${params.shopId}/book?step=3&date=${searchParams.date}&time=${searchParams.time}&service=${service.id}`}>
                          Select
                        </a>
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </CardContent>
          <CardFooter className="flex justify-between">
            <Button variant="outline" asChild>
              <a href={`/${params.shopId}/book?step=1`}>Back</a>
            </Button>
          </CardFooter>
        </Card>
      )}
      
      {/* Step 3: Your Information */}
      {currentStep === 3 && (
        <Card>
          <CardHeader>
            <CardTitle>Your Information</CardTitle>
            <CardDescription>Please provide your contact details</CardDescription>
          </CardHeader>
          <CardContent>
            <form className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="first-name">First Name</Label>
                  <Input id="first-name" placeholder="John" required />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="last-name">Last Name</Label>
                  <Input id="last-name" placeholder="Doe" required />
                </div>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input id="email" type="email" placeholder="john.doe@example.com" required />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="phone">Phone Number</Label>
                <Input id="phone" placeholder="(123) 456-7890" required />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="notes">Special Requests (Optional)</Label>
                <textarea 
                  id="notes" 
                  className="flex min-h-20 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50" 
                  placeholder="Any special requests or notes for your appointment"
                />
              </div>
            </form>
          </CardContent>
          <CardFooter className="flex justify-between">
            <Button variant="outline" asChild>
              <a href={`/${params.shopId}/book?step=2&date=${searchParams.date}&time=${searchParams.time}`}>Back</a>
            </Button>
            <Button asChild>
              <a href={`/${params.shopId}/book?step=4&date=${searchParams.date}&time=${searchParams.time}&service=${searchParams.service}`}>
                Continue to Payment
              </a>
            </Button>
          </CardFooter>
        </Card>
      )}
      
      {/* Step 4: Payment & Confirmation */}
      {currentStep === 4 && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="md:col-span-2">
            <Card>
              <CardHeader>
                <CardTitle>Payment</CardTitle>
                <CardDescription>Secure payment processed by Stripe</CardDescription>
              </CardHeader>
              <CardContent>
                <Tabs defaultValue="card">
                  <TabsList className="mb-4">
                    <TabsTrigger value="card">Credit Card</TabsTrigger>
                    <TabsTrigger value="paypal">PayPal</TabsTrigger>
                  </TabsList>
                  
                  <TabsContent value="card">
                    <form className="space-y-4">
                      <div className="space-y-2">
                        <Label htmlFor="card-name">Name on Card</Label>
                        <Input id="card-name" placeholder="John Doe" required />
                      </div>
                      
                      <div className="space-y-2">
                        <Label htmlFor="card-number">Card Number</Label>
                        <Input id="card-number" placeholder="1234 5678 9012 3456" required />
                      </div>
                      
                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor="expiry">Expiry Date</Label>
                          <Input id="expiry" placeholder="MM/YY" required />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="cvc">CVC</Label>
                          <Input id="cvc" placeholder="123" required />
                        </div>
                      </div>
                    </form>
                  </TabsContent>
                  
                  <TabsContent value="paypal">
                    <div className="flex flex-col items-center justify-center py-8">
                      <p className="mb-4">You will be redirected to PayPal to complete your payment.</p>
                      <Button>Continue with PayPal</Button>
                    </div>
                  </TabsContent>
                </Tabs>
              </CardContent>
              <CardFooter className="flex justify-between">
                <Button variant="outline" asChild>
                  <a href={`/${params.shopId}/book?step=3&date=${searchParams.date}&time=${searchParams.time}&service=${searchParams.service}`}>
                    Back
                  </a>
                </Button>
                <Button asChild>
                  <a href={`/${params.shopId}/book/confirmation?date=${searchParams.date}&time=${searchParams.time}&service=${searchParams.service}`}>
                    Complete Booking
                  </a>
                </Button>
              </CardFooter>
            </Card>
          </div>
          
          {/* Booking Summary */}
          <Card>
            <CardHeader>
              <CardTitle>Booking Summary</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex justify-between">
                  <span className="font-medium">Business</span>
                  <span>{business.name}</span>
                </div>
                <div className="flex justify-between">
                  <span className="font-medium">Date</span>
                  <span>{format(new Date(searchParams.date || ''), 'MMMM d, yyyy')}</span>
                </div>
                <div className="flex justify-between">
                  <span className="font-medium">Time</span>
                  <span>{searchParams.time}</span>
                </div>
                <div className="flex justify-between">
                  <span className="font-medium">Service</span>
                  <span>
                    {services.find(s => s.id.toString() === searchParams.service)?.name || 'Not selected'}
                  </span>
                </div>
                <div className="border-t pt-4 mt-4">
                  <div className="flex justify-between font-bold">
                    <span>Total</span>
                    <span>${services.find(s => s.id.toString() === searchParams.service)?.price || 0}</span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
} 