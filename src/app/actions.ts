'use server'; // Mark this whole file as containing Server Actions

import { createClient as createServerClient } from '@/lib/supabase/server';
import type { Okr } from '@/types'; // Import the type definition

/**
 * Server Action to create a new OKR item.
 */
export async function createOkrAction(okrData: Pick<Okr, 'content' | 'okr_type'>): Promise<Okr> {
  const supabase = createServerClient();

  // Get user session on the server
  const { data: { user }, error: authError } = await supabase.auth.getUser();

  if (authError) {
    console.error('[Server Action] Auth error:', authError);
    throw new Error('Authentication error');
  }
  if (!user) {
    console.error('[Server Action] No authenticated user.');
    throw new Error('User not authenticated');
  }

  const dataToInsert = { ...okrData, user_id: user.id };

  // Use the actual Supabase insert logic (similar to okrService)
  const { data, error } = await supabase
    .from('okrs') 
    .insert(dataToInsert)
    .select('*') // Simplified select
    .single(); 

  if (error) {
    console.error('[Server Action] Error creating OKR:', error);
    throw new Error(`Failed to create OKR: ${error.message}`);
  }
  if (!data) {
    console.error('[Server Action] No data returned after creating OKR');
    throw new Error('Failed to create OKR, no data returned.');
  }
  console.log("[Server Action] Created OKR:", data);
  // Ensure the returned data matches the Okr type expected by the client
  // Add type assertion if needed, though Supabase types should align if schema matches type
  return data as Okr; 
}

// --- Add other server actions below --- 