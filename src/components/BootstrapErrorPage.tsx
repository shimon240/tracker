import { AlertTriangle } from 'lucide-react'
import { AmbientBackground } from '@/components/layout/AmbientBackground'
import { SpotlightCard } from '@/components/layout/SpotlightCard'

interface BootstrapErrorPageProps {
  error: unknown
}

export function BootstrapErrorPage({ error }: BootstrapErrorPageProps) {
  const message = error instanceof Error ? error.message : String(error)
  const isOutdatedDep = message.includes('Outdated Optimize Dep') || message.includes('dynamically imported module')

  return (
    <div className="relative min-h-screen flex items-center justify-center p-4 overflow-hidden">
      <AmbientBackground />
      <SpotlightCard interactive={false} className="relative z-10 w-full max-w-lg p-8">
        <div className="flex items-start gap-3">
          <AlertTriangle className="h-6 w-6 text-red-400 shrink-0 mt-0.5" />
          <div>
            <h1 className="text-lg font-semibold text-foreground">Ошибка загрузки приложения</h1>
            <p className="text-sm text-foreground-muted mt-1 break-words">{message}</p>
          </div>
        </div>

        {isOutdatedDep && (
          <div className="mt-6 rounded-xl border border-border bg-surface/50 p-4">
            <p className="text-sm font-medium text-foreground mb-2">Очистите кэш Vite:</p>
            <pre className="text-xs text-foreground-muted font-mono whitespace-pre-wrap">
{`rm -rf node_modules/.vite
npm run dev`}
            </pre>
          </div>
        )}
      </SpotlightCard>
    </div>
  )
}
