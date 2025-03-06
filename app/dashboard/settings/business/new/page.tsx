import { createServerClient } from "@/lib/supabase-server";
import { BusinessForm } from "./business-form";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export default async function NewBusinessPage() {
  const supabase = await createServerClient();
  
  // Fetch industries
  const { data: industries } = await supabase
    .from('industries')
    .select('id, name')
    .order('name');

  return (
    <div className="container mx-auto py-8">
      <Card>
        <CardHeader>
          <CardTitle>Create New Business</CardTitle>
          <CardDescription>
            Fill in the details below to create your business profile.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <BusinessForm industries={industries || []} />
        </CardContent>
      </Card>
    </div>
  );
} 