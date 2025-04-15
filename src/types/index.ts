/**
 * Represents an OKR (Objective and Key Result) in the database.
 * Align this with your actual 'okrs' table schema in Supabase.
 */
export interface Okr {
  id: string; // UUID
  user_id: string | null; // Foreign key to auth.users table (UUID). Can be null if user deleted (ON DELETE SET NULL).
  content: string | null; // The main content of the OKR (adjust nullability based on schema)
  created_at: string; // Timestamp with timezone
  // Add other fields from your 'okrs' table here
  // e.g., title?: string;
  // e.g., objective_id?: string | null;
  // e.g., status?: string | null;
  // e.g., progress?: number | null;
}

/**
 * Represents a user profile (optional, if you have a public.users table
 * linked to auth.users).
 */
// export interface UserProfile {
//   id: string; // Matches auth.users.id
//   username?: string;
//   full_name?: string;
//   avatar_url?: string;
//   // Add other profile fields
// }

// Add other shared types for your application here 