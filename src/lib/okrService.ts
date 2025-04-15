import { createClient } from './supabase/server' // Or './supabase/client' depending on context
import type { Okr } from '@/types' // Import the Okr type

// TODO: Define Entry type in src/types/index.ts
// interface Entry { 
//   id: string;
//   user_id: string;
//   content: string;
//   created_at: string;
// }

// Placeholder for Supabase client instance
// In a real application, you'd get the client based on the execution context (server/client)
// For server-side operations (Server Components, Route Handlers, Server Actions):
// import { createClient } from './supabase/server'
// For client-side operations:
// import { createClient } from './supabase/client'

// Example: Fetching OKRs (adjust based on actual Supabase client usage)
export async function getOkrs(): Promise<Okr[]> {
  const supabase = createClient(); // Use server client for server-side fetching
  const { data: { user }, error: authError } = await supabase.auth.getUser();

  if (authError) {
    console.error('Auth error fetching user:', authError);
    throw new Error('Authentication error');
  }
  if (!user) {
    console.warn('No authenticated user found while fetching OKRs.');
    return [];
  }

  const { data, error } = await supabase
    .from('okrs') // Use the 'okrs' table name
    .select<string, Okr>('*') // Specify the Okr return type
    .eq('user_id', user.id); // RLS is handled by Supabase policies

  if (error) {
    console.error('Error fetching OKRs:', error);
    throw new Error(`Failed to fetch OKRs: ${error.message}`);
  }

  // Filter out any potential null results if needed, though RLS should prevent this for owned OKRs
  return (data || []).filter(okr => okr !== null) as Okr[];
}

// Example: Creating an OKR
// Accept an Okr object or specific fields needed for creation
export async function createOkr(okrData: Pick<Okr, 'content'> & Partial<Okr>): Promise<Okr> {
  const supabase = createClient(); // Use server or client client appropriately
  const { data: { user }, error: authError } = await supabase.auth.getUser();

  if (authError) {
    console.error('Auth error fetching user:', authError);
    throw new Error('Authentication error');
  }
  if (!user) {
    console.warn('No authenticated user found while creating OKR.');
    throw new Error('User not authenticated');
  }

  // Ensure user_id is set correctly, merge with provided data
  const dataToInsert = { ...okrData, user_id: user.id };

  const { data, error } = await supabase
    .from('okrs') // Use the 'okrs' table name
    .insert(dataToInsert)
    .select<string, Okr>('*') // Specify Okr return type
    .single(); // Expecting a single record back

  if (error) {
    console.error('Error creating OKR:', error);
    throw new Error(`Failed to create OKR: ${error.message}`);
  }

  if (!data) {
    console.error('No data returned after creating OKR');
    throw new Error('Failed to create OKR, no data returned.');
  }

  return data;
}

// TODO: Implement updateOkr function
export async function updateOkr(id: string, updates: Partial<Okr>): Promise<Okr> {
  const supabase = createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error('User not authenticated');

  // Ensure user_id cannot be changed by the update payload
  const { user_id, ...safeUpdates } = updates;

  const { data, error } = await supabase
    .from('okrs')
    .update(safeUpdates)
    .eq('id', id)
    // RLS policy already ensures the user owns this row
    // .eq('user_id', user.id) // This is technically redundant due to RLS
    .select<string, Okr>('*')
    .single();

  if (error) {
    console.error('Error updating OKR:', error);
    throw new Error(`Failed to update OKR: ${error.message}`);
  }
  if (!data) {
     console.error('No data returned after updating OKR');
     throw new Error('Failed to update OKR, no data returned.');
   }
  return data;
}

// TODO: Implement deleteOkr function
export async function deleteOkr(id: string): Promise<void> {
  const supabase = createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error('User not authenticated');

  const { error } = await supabase
    .from('okrs')
    .delete()
    .eq('id', id);
    // RLS policy ensures the user owns this row
    // .eq('user_id', user.id); // Redundant due to RLS

  if (error) {
    console.error('Error deleting OKR:', error);
    throw new Error(`Failed to delete OKR: ${error.message}`);
  }
}

// Add other CRUD operations (updateEntry, deleteEntry) as needed 