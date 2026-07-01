import { useState } from 'react'
import { signInWithGoogle } from '@/hooks/useAuth'
import { AmbientBackground } from '@/components/layout/AmbientBackground'
import { SpotlightCard } from '@/components/layout/SpotlightCard'
import { Button } from '@/components/ui/button'
import { Briefcase, Loader2 } from 'lucide-react'

export function LoginPage() {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  async function handleGoogleSignIn() {
    setLoading(true)
    setError(null)
    try {
      await signInWithGoogle()
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Ошибка входа')
      setLoading(false)
    }
  }

  return (
    <div className="relative min-h-screen flex items-center justify-center p-4 overflow-hidden">
      <AmbientBackground />

      <div className="relative z-10 w-full max-w-sm">
        <div className="flex flex-col items-center mb-8">
          <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-accent ds-shadow-accent mb-4">
            <Briefcase className="h-7 w-7 text-white" />
          </div>
          <h1 className="text-2xl font-semibold ds-text-gradient tracking-tight">ApplyTrack</h1>
          <p className="text-foreground-muted text-sm mt-1">Трекер откликов на вакансии</p>
        </div>

        <SpotlightCard className="p-8 space-y-6">
          <div className="text-center">
            <h2 className="text-lg font-semibold text-foreground tracking-tight">Войдите в аккаунт</h2>
            <p className="text-sm text-foreground-muted mt-1">
              Все ваши отклики будут сохранены и доступны с любого устройства
            </p>
          </div>

          {error && (
            <div className="rounded-lg border border-red-500/30 bg-red-500/10 px-3 py-2.5 text-sm text-red-300">
              {error}
            </div>
          )}

          <Button
            onClick={handleGoogleSignIn}
            disabled={loading}
            variant="secondary"
            className="w-full h-11 gap-3"
          >
            {loading ? (
              <Loader2 className="h-5 w-5 animate-spin text-foreground-muted" />
            ) : (
              <GoogleIcon />
            )}
            {loading ? 'Перенаправление...' : 'Войти через Google'}
          </Button>
        </SpotlightCard>

        <p className="text-center text-xs text-foreground-muted mt-6">
          Данные хранятся в защищённой базе данных и доступны только вам
        </p>
      </div>
    </div>
  )
}

function GoogleIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
      <path
        d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
        fill="#4285F4"
      />
      <path
        d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
        fill="#34A853"
      />
      <path
        d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
        fill="#FBBC05"
      />
      <path
        d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
        fill="#EA4335"
      />
    </svg>
  )
}
