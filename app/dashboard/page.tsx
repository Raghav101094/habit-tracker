import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase-server'
import DashboardClient from '@/components/dashboard/DashboardClient'

export default async function DashboardPage() {
  const supabase = await createClient()

  const { data: { user }, error } = await supabase.auth.getUser()

  if (error || !user) {
    redirect('/login')
  }

  // Fetch user's habits
  const { data: habits } = await supabase
    .from('habits')
    .select('*')
    .eq('user_id', user.id)
    .eq('archived', false)
    .order('created_at', { ascending: true })

  return <DashboardClient user={user} initialHabits={habits || []} />
}
