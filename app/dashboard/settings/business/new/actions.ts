'use server'

import { createServerClient } from "@/lib/supabase-server";
import { businessFormSchema, type BusinessFormData } from "@/lib/schemas/business";
import { revalidatePath } from "next/cache";

export async function createBusiness(data: BusinessFormData) {
  const validatedFields = businessFormSchema.safeParse(data);
  
  if (!validatedFields.success) {
    return { error: "Invalid form data" };
  }

  const supabase = await createServerClient();
  
  // Get the current user
  const { data: { session } } = await supabase.auth.getSession();
  if (!session?.user) {
    return { error: "Unauthorized" };
  }

  // Create the business
  const { data: business, error } = await supabase
    .from('businesses')
    .insert({
      ...validatedFields.data,
      owner_id: session.user.id,
      slug: validatedFields.data.name.toLowerCase().replace(/\s+/g, '-'),
    })
    .select()
    .single();

  if (error) {
    console.error('Error creating business:', error);
    return { error: error.message };
  }

  // Update user profile to mark as business owner
  const { error: profileError } = await supabase
    .from('user_profiles')
    .update({ is_business_owner: true })
    .eq('id', session.user.id);

  if (profileError) {
    console.error('Error updating user profile:', profileError);
  }

  revalidatePath('/dashboard/settings/business');
  return { data: business };
} 