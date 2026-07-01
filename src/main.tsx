import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import { EnvSetupPage } from '@/components/EnvSetupPage'
import { BootstrapErrorPage } from '@/components/BootstrapErrorPage'

const isConfigured = Boolean(
  import.meta.env.VITE_SUPABASE_URL && import.meta.env.VITE_SUPABASE_ANON_KEY
)

async function bootstrap() {
  const rootEl = document.getElementById('root')
  if (!rootEl) throw new Error('Элемент #root не найден')
  const root = createRoot(rootEl)

  if (!isConfigured) {
    root.render(
      <StrictMode>
        <EnvSetupPage />
      </StrictMode>
    )
    return
  }

  const [{ default: App }, { ToastProvider }, { Toaster }] = await Promise.all([
    import('./App.tsx'),
    import('@/hooks/useToast'),
    import('@/components/ui/toaster'),
  ])

  root.render(
    <StrictMode>
      <ToastProvider>
        <App />
        <Toaster />
      </ToastProvider>
    </StrictMode>
  )
}

bootstrap().catch(error => {
  const rootEl = document.getElementById('root')
  if (!rootEl) return
  createRoot(rootEl).render(
    <StrictMode>
      <BootstrapErrorPage error={error} />
    </StrictMode>
  )
})
