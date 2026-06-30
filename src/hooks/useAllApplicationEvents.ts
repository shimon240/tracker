import { useState, useEffect, useCallback } from 'react'
import type { ApplicationEvent } from '@/types'
import { supabase } from '@/lib/supabase'

export function useAllApplicationEvents() {
  const [events, setEvents] = useState<ApplicationEvent[]>([])
  const [loading, setLoading] = useState(true)

  const fetchEvents = useCallback(async () => {
    setLoading(true)
    try {
      const { data, error } = await supabase
        .from('application_events')
        .select('*')
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
    void fetchEvents()
  }, [fetchEvents])

  useEffect(() => {
    const channel = supabase
      .channel('application_events_changes')
      .on(
        'postgres_changes',
        { event: 'INSERT', schema: 'public', table: 'application_events' },
        (payload) => {
          setEvents(prev => [...prev, payload.new as ApplicationEvent])
        }
      )
      .subscribe()

    return () => { void supabase.removeChannel(channel) }
  }, [])

  return { events, loading }
}
