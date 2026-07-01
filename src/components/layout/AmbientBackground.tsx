export function AmbientBackground() {
  return (
    <div className="pointer-events-none fixed inset-0 z-0 overflow-hidden" aria-hidden>
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,#0a0a0f_0%,#050506_50%,#020203_100%)]" />

      <div className="absolute inset-0 ds-noise" />
      <div className="absolute inset-0 ds-grid-overlay" />

      <div
        className="absolute -top-32 left-1/2 h-[900px] w-[1400px] -translate-x-1/2 rounded-full bg-accent/25 blur-[150px] animate-float"
        style={{ animationDuration: '9s' }}
      />
      <div
        className="absolute top-1/4 -left-32 h-[800px] w-[600px] rounded-full bg-purple-500/15 blur-[120px] animate-float-slow"
      />
      <div
        className="absolute top-1/3 -right-24 h-[700px] w-[500px] rounded-full bg-indigo-500/12 blur-[100px] animate-float"
        style={{ animationDuration: '10s', animationDelay: '-3s' }}
      />
      <div
        className="absolute bottom-0 left-1/3 h-[500px] w-[800px] rounded-full bg-accent/10 blur-[120px] animate-pulse-glow"
      />
    </div>
  )
}
