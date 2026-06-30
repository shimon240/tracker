import { useState, useEffect, useCallback } from 'react'
import type { ApplicationEvent } from '@/types'
import { supabase } from '@/lib/supabase'

export function useApplicationEvents(applicationId: string | null) {
  const [events, setEvents] = useState<ApplicationEvent[]>([])
  const [loading, setLoading] = useState(false)

  const fetchEvents = useCallback(async (id: string) => {
    setLoading(true)
    try {
      const { data, error } = await supabase
        .from('application_events')
        .select('*')
        .eq('application_id', id)
        .order('created_at', { ascending: true })
      if (error) throw error
      setEvents((data ?? []) as ApplicationEvent[])
    } catch {
      setEvents([])
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    if (applicationId) {
      void fetchEvents(applicationId)
    } else {
      setEvents([])
    }
  }, [applicationId, fetchEvents])

  return { events, loading }
}
