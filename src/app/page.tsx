'use client' // Required for Auth UI component

import { useEffect } from 'react'
import { Auth } from '@supabase/auth-ui-react'
import { ThemeSupa } from '@supabase/auth-ui-shared'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client' // Use client-side Supabase client
import { useUserStore } from '@/stores/useUserStore'

export default function Home() {
  const supabase = createClient()
  const router = useRouter()
  const { user, setUser } = useUserStore()

  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      setUser(session?.user ?? null)
      if (session?.user) {
        router.push('/dashboard') // Redirect to dashboard if logged in
      }
    })

    // Check initial auth state
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null)
      if (session?.user) {
        router.push('/dashboard')
      }
    });

    return () => {
      subscription?.unsubscribe()
    }
  }, [supabase, router, setUser])

  // Show Auth UI if not logged in
  if (!user) {
    return (
      <div className="w-full max-w-md p-8 space-y-8 bg-card rounded-lg shadow-lg">
        <h1 className="text-2xl font-bold text-center">Welcome to OKR App</h1>
        <Auth
          supabaseClient={supabase}
          appearance={{ theme: ThemeSupa }}
          providers={['github']} // Optional: Add providers like Google, GitHub
          redirectTo="/dashboard" // Where to redirect after successful login (can be handled by onAuthStateChange too)
          theme="dark" // Or "light" or match system preference
          // Only show email/password auth for now
          onlyThirdPartyProviders={false}
          view="sign_in" // Can be "sign_in", "sign_up", "forgotten_password", etc.
        />
      </div>
    )
  }

  // Optionally, show a loading state or redirect message while checking auth/redirecting
  return (
     <div className="text-center">
       <p>Loading or redirecting...</p>
       {/* You might want a spinner component here */}
     </div>
  );
}
