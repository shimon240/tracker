import { AlertCircle, FileText } from 'lucide-react'

export function EnvSetupPage() {
  const missing = [
    !import.meta.env.VITE_SUPABASE_URL && 'VITE_SUPABASE_URL',
    !import.meta.env.VITE_SUPABASE_ANON_KEY && 'VITE_SUPABASE_ANON_KEY',
  ].filter(Boolean) as string[]

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <div className="w-full max-w-lg rounded-2xl border border-amber-200 bg-white p-8 shadow-sm">
        <div className="flex items-start gap-3">
          <AlertCircle className="h-6 w-6 text-amber-500 shrink-0 mt-0.5" />
          <div>
            <h1 className="text-lg font-semibold text-gray-900">Нужна настройка окружения</h1>
            <p className="text-sm text-gray-600 mt-1">
              Приложение не запущено: отсутствуют переменные Supabase в файле <code className="text-xs bg-gray-100 px-1 py-0.5 rounded">.env.local</code>.
            </p>
          </div>
        </div>

        {missing.length > 0 && (
          <p className="text-sm text-gray-500 mt-4">
            Не задано: {missing.join(', ')}
          </p>
        )}

        <div className="mt-6 rounded-xl bg-gray-50 border border-gray-100 p-4">
          <div className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-2">
            <FileText className="h-4 w-4" />
            Создайте файл <code>.env.local</code> в корне проекта:
          </div>
          <pre className="text-xs text-gray-700 overflow-x-auto whitespace-pre-wrap font-mono leading-relaxed">
{`VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key
VITE_APP_URL=http://localhost:5173`}
          </pre>
        </div>

        <ol className="mt-6 space-y-2 text-sm text-gray-600 list-decimal list-inside">
          <li>Скопируйте <code className="text-xs bg-gray-100 px-1 rounded">.env.example</code> в <code className="text-xs bg-gray-100 px-1 rounded">.env.local</code></li>
          <li>Вставьте URL и anon key из Supabase Dashboard → Settings → API</li>
          <li>Перезапустите сервер: <code className="text-xs bg-gray-100 px-1 rounded">npm run dev</code></li>
          <li>Откройте <code className="text-xs bg-gray-100 px-1 rounded">http://localhost:5173</code></li>
        </ol>
      </div>
    </div>
  )
}
