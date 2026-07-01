import { AlertTriangle } from 'lucide-react'

interface BootstrapErrorPageProps {
  error: unknown
}

export function BootstrapErrorPage({ error }: BootstrapErrorPageProps) {
  const message = error instanceof Error ? error.message : String(error)
  const isOutdatedDep = message.includes('Outdated Optimize Dep') || message.includes('dynamically imported module')

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <div className="w-full max-w-lg rounded-2xl border border-red-200 bg-white p-8 shadow-sm">
        <div className="flex items-start gap-3">
          <AlertTriangle className="h-6 w-6 text-red-500 shrink-0 mt-0.5" />
          <div>
            <h1 className="text-lg font-semibold text-gray-900">Ошибка загрузки приложения</h1>
            <p className="text-sm text-gray-600 mt-1 break-words">{message}</p>
          </div>
        </div>

        {isOutdatedDep && (
          <div className="mt-6 rounded-xl bg-gray-50 border border-gray-100 p-4">
            <p className="text-sm font-medium text-gray-700 mb-2">Скорее всего устарел кэш Vite. Выполните в терминале:</p>
            <pre className="text-xs text-gray-700 font-mono whitespace-pre-wrap">
{`rm -rf node_modules/.vite
npm run dev`}
            </pre>
            <p className="text-xs text-gray-500 mt-2">Затем обновите страницу (Ctrl+Shift+R).</p>
          </div>
        )}

        <p className="text-xs text-gray-400 mt-6">
          Если не помогло — проверьте консоль браузера (F12) и наличие файла <code>.env.local</code>.
        </p>
      </div>
    </div>
  )
}
