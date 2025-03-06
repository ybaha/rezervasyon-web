import { createServerClient } from './supabase-server';

/**
 * Server-side database utility functions
 * All Supabase database calls should go through these functions
 * to ensure they're properly handled server-side
 */

/**
 * Get a business by its ID
 */
export async function getBusinessById(id: string) {
  const supabase = await createServerClient();
  
  const { data, error } = await supabase
    .from('businesses')
    .select('*')
    .eq('id', id)
    .single();
    
  if (error) {
    console.error('Error fetching business:', error.message);
    return null;
  }
  
  return data;
}

/**
 * Get a list of businesses with optional filters
 */
export async function getBusinesses({ 
  limit = 10, 
  offset = 0, 
  industry = null,
  location = null,
  search = null
}: {
  limit?: number;
  offset?: number;
  industry?: string | null;
  location?: string | null;
  search?: string | null;
} = {}) {
  const supabase = await createServerClient();
  
  let query = supabase
    .from('businesses')
    .select('*', { count: 'exact' });
  
  // Apply filters
  if (industry && industry !== 'all') {
    query = query.eq('industry', industry);
  }
  
  if (location) {
    query = query.ilike('location', `%${location}%`);
  }
  
  if (search) {
    query = query.or(`name.ilike.%${search}%, description.ilike.%${search}%`);
  }
  
  // Apply pagination
  const { data, error, count } = await query
    .order('created_at', { ascending: false })
    .range(offset, offset + limit - 1);
    
  if (error) {
    console.error('Error fetching businesses:', error.message);
    return { businesses: [], count: 0 };
  }
  
  return { businesses: data || [], count: count || 0 };
}

/**
 * Get available appointments for a business
 */
export async function getAvailableAppointments(businessId: string, date: string) {
  const supabase = await createServerClient();
  
  const { data, error } = await supabase
    .from('available_slots')
    .select('*')
    .eq('business_id', businessId)
    .eq('date', date)
    .not('is_booked', 'eq', true);
    
  if (error) {
    console.error('Error fetching available slots:', error.message);
    return [];
  }
  
  return data || [];
}

/**
 * Get a user's reservations
 */
export async function getUserReservations(userId: string) {
  const supabase = await createServerClient();
  
  const { data, error } = await supabase
    .from('reservations')
    .select(`
      *,
      businesses (
        id,
        name,
        location
      )
    `)
    .eq('user_id', userId)
    .order('reservation_date', { ascending: false });
    
  if (error) {
    console.error('Error fetching user reservations:', error.message);
    return [];
  }
  
  return data || [];
}

/**
 * Get a business owner's reservation list
 */
export async function getBusinessReservations(businessId: string) {
  const supabase = await createServerClient();
  
  const { data, error } = await supabase
    .from('reservations')
    .select(`
      *,
      users (
        id,
        email,
        full_name,
        phone
      )
    `)
    .eq('business_id', businessId)
    .order('reservation_date', { ascending: false });
    
  if (error) {
    console.error('Error fetching business reservations:', error.message);
    return [];
  }
  
  return data || [];
} 