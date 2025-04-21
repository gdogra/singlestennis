import React from 'react'
import { Auth } from '@supabase/auth-ui-react'
import { supabase } from '../supabaseClient'

export default function LoginPage() {
  return (
    <div className="max-w-md mx-auto p-6">
      <h1 className="text-2xl mb-4">Log In</h1>
      <Auth
        supabaseClient={supabase}
        providers={['google', 'github']}
        socialLayout="horizontal"
      />
    </div>
  )
}

