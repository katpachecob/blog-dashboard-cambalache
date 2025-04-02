'use server'

import { createClientServer } from '@/utils/supabase/server'
import { redirect } from 'next/navigation'

export async function login(email, password) {
  const supabase = await createClientServer()

  const dataUser = {
    email: email,
    password: password,
  }

  const { error, data } = await supabase.auth.signInWithPassword(dataUser)

  if (error) {
    return { error: error.message }
  }

  return { data }
}
