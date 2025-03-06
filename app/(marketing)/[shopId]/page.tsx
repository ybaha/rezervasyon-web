import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { getBusinessById } from "@/lib/db";
import { notFound } from "next/navigation";
import Link from "next/link";
import { siteConfig } from "@/config/site";

interface BusinessPageProps {
  params: {
    shopId: string;
  };
}

export default async function BusinessPage({ params }: BusinessPageProps) {
  const business = await getBusinessById(params.shopId);
  
  if (!business) {
    notFound();
  }
  
  // Mock data for reviews and services - in a real app, these would be fetched from the database
  const reviews = [
    { id: 1, user: "John D.", rating: 5, comment: "Great service and very professional staff!", date: "2023-06-15" },
    { id: 2, user: "Sarah M.", rating: 4, comment: "Really enjoyed my experience. Will be back again.", date: "2023-05-22" },
    { id: 3, user: "Alex K.", rating: 5, comment: "Best in town! Highly recommend.", date: "2023-04-10" },
  ];
  
  const services = [
    { id: 1, name: "Basic Service", price: 25, duration: 30, description: "Quick and efficient service" },
    { id: 2, name: "Premium Service", price: 45, duration: 60, description: "Our most popular comprehensive service" },
    { id: 3, name: "Deluxe Package", price: 75, duration: 90, description: "The ultimate experience with extra features" },
  ];

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Business Header */}
      <div className="mb-8">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-4">
          <div>
            <h1 className="text-3xl font-bold mb-2">{business.name}</h1>
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <span>{business.location}</span>
              <span>•</span>
              <span>{siteConfig.industry}</span>
            </div>
          </div>
          <div className="mt-4 md:mt-0">
            <Button asChild size="lg">
              <Link href={`/${business.id}/book`}>Book Now</Link>
            </Button>
          </div>
        </div>
        
        <div className="flex items-center mb-6">
          <div className="flex items-center space-x-1 mr-4">
            {Array.from({ length: 5 }).map((_, i) => (
              <svg 
                key={i}
                className={`w-5 h-5 ${i < (business.rating || 0) ? "text-yellow-400" : "text-gray-300"}`} 
                fill="currentColor" 
                viewBox="0 0 20 20"
              >
                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118l-2.8-2.034c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
              </svg>
            ))}
            <span className="ml-1 font-medium">{business.rating || 0}</span>
            <span className="text-muted-foreground ml-1">({business.review_count || 0} reviews)</span>
          </div>
          
          <div className="text-sm">
            <span className="font-medium">
              {Array(business.price_level || 1).fill('$').join('')}
            </span>
            <span className="mx-2">•</span>
            <span>{business.industry}</span>
          </div>
        </div>
        
        <p className="text-lg">{business.description}</p>
      </div>
      
      {/* Business Information */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
        <div className="md:col-span-2">
          {/* About Section */}
          <div className="mb-10">
            <h2 className="text-2xl font-bold mb-4">About</h2>
            <p className="mb-4">
              Welcome to {business.name}, where we pride ourselves on delivering exceptional service tailored to your needs.
              Our team of experienced professionals is dedicated to ensuring you have the best experience possible.
            </p>
            <p className="text-muted-foreground mb-6">
              Founded in {2020 - Math.floor(Math.random() * 5)}, we have built a reputation for excellence in {siteConfig.industry.toLowerCase()} services.
            </p>
          </div>
          
          {/* Services Section */}
          <div className="mb-10">
            <h2 className="text-2xl font-bold mb-4">Services</h2>
            <div className="space-y-4">
              {services.map((service) => (
                <Card key={service.id} className="overflow-hidden">
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
                  </CardContent>
                </Card>
              ))}
            </div>
            <div className="mt-6">
              <Button asChild>
                <Link href={`/${business.id}/book`}>Book Appointment</Link>
              </Button>
            </div>
          </div>
          
          {/* Reviews Section */}
          <div>
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-2xl font-bold">Reviews</h2>
              <Button variant="outline" size="sm">Write a Review</Button>
            </div>
            <div className="space-y-6">
              {reviews.map((review) => (
                <div key={review.id} className="border-b pb-6 last:border-0">
                  <div className="flex justify-between items-start mb-2">
                    <span className="font-bold">{review.user}</span>
                    <span className="text-sm text-muted-foreground">{review.date}</span>
                  </div>
                  <div className="flex items-center mb-2">
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
                  <p>{review.comment}</p>
                </div>
              ))}
            </div>
            {business.review_count && business.review_count > 3 && (
              <Button variant="link" className="mt-4 px-0">
                See all {business.review_count} reviews
              </Button>
            )}
          </div>
        </div>
        
        {/* Sidebar */}
        <div>
          <div className="sticky top-4 space-y-6">
            {/* Business Hours */}
            <Card>
              <CardContent className="p-6">
                <h3 className="font-bold text-lg mb-4">Business Hours</h3>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span>Monday</span>
                    <span>9:00 AM - 6:00 PM</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Tuesday</span>
                    <span>9:00 AM - 6:00 PM</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Wednesday</span>
                    <span>9:00 AM - 6:00 PM</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Thursday</span>
                    <span>9:00 AM - 6:00 PM</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Friday</span>
                    <span>9:00 AM - 6:00 PM</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Saturday</span>
                    <span>10:00 AM - 4:00 PM</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Sunday</span>
                    <span>Closed</span>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            {/* Location */}
            <Card>
              <CardContent className="p-6">
                <h3 className="font-bold text-lg mb-4">Location</h3>
                <p className="mb-2">{business.location}</p>
                <div className="mt-4">
                  <Button variant="outline" className="w-full">Get Directions</Button>
                </div>
              </CardContent>
            </Card>
            
            {/* Contact */}
            <Card>
              <CardContent className="p-6">
                <h3 className="font-bold text-lg mb-4">Contact</h3>
                <div className="space-y-2">
                  <div className="flex items-center">
                    <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                    </svg>
                    <span>(555) 123-4567</span>
                  </div>
                  <div className="flex items-center">
                    <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                    </svg>
                    <span>contact@{business.name.toLowerCase().replace(/\s+/g, '')}.com</span>
                  </div>
                </div>
                <div className="mt-4">
                  <Button className="w-full">
                    <Link href={`/${business.id}/book`}>Book Appointment</Link>
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
} 