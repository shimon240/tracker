import { AlertCircle, FileText } from 'lucide-react'
import { AmbientBackground } from '@/components/layout/AmbientBackground'
import { SpotlightCard } from '@/components/layout/SpotlightCard'

export function EnvSetupPage() {
  const missing = [
    !import.meta.env.VITE_SUPABASE_URL && 'VITE_SUPABASE_URL',
    !import.meta.env.VITE_SUPABASE_ANON_KEY && 'VITE_SUPABASE_ANON_KEY',
  ].filter(Boolean) as string[]

  return (
    <div className="relative min-h-screen flex items-center justify-center p-4 overflow-hidden">
      <AmbientBackground />
      <SpotlightCard interactive={false} className="relative z-10 w-full max-w-lg p-8">
        <div className="flex items-start gap-3">
          <AlertCircle className="h-6 w-6 text-amber-400 shrink-0 mt-0.5" />
          <div>
            <h1 className="text-lg font-semibold text-foreground">Нужна настройка окружения</h1>
            <p className="text-sm text-foreground-muted mt-1">
              Отсутствуют переменные Supabase в файле <code className="text-xs bg-surface border border-border px-1 py-0.5 rounded">.env.local</code>.
            </p>
          </div>
        </div>

        {missing.length > 0 && (
          <p className="text-sm text-foreground-muted mt-4">
            Не задано: {missing.join(', ')}
          </p>
        )}

        <div className="mt-6 rounded-xl border border-border bg-surface/50 p-4">
          <div className="flex items-center gap-2 text-sm font-medium text-foreground mb-2">
            <FileText className="h-4 w-4" />
            Создайте файл <code>.env.local</code>:
          </div>
          <pre className="text-xs text-foreground-muted overflow-x-auto whitespace-pre-wrap font-mono leading-relaxed">
{`VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key
VITE_APP_URL=http://localhost:5173`}
          </pre>
        </div>

        <ol className="mt-6 space-y-2 text-sm text-foreground-muted list-decimal list-inside">
          <li>Скопируйте <code className="text-xs bg-surface border border-border px-1 rounded">.env.example</code> в <code className="text-xs bg-surface border border-border px-1 rounded">.env.local</code></li>
          <li>Вставьте URL и anon key из Supabase Dashboard</li>
          <li>Перезапустите: <code className="text-xs bg-surface border border-border px-1 rounded">npm run dev</code></li>
        </ol>
      </SpotlightCard>
    </div>
  )
}
