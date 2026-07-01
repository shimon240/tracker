export function AmbientBackground() {
  return (
    <div className="pointer-events-none fixed inset-0 z-0 overflow-hidden" aria-hidden>
      <div className="absolute inset-0 bg-background-base" />

      <div className="absolute -top-24 right-0 h-[500px] w-[500px] rounded-full bg-indigo-200/40 blur-3xl animate-float" />
      <div className="absolute top-1/3 -left-32 h-[400px] w-[400px] rounded-full bg-violet-200/35 blur-3xl animate-float-slow" />
      <div className="absolute bottom-0 right-1/4 h-[350px] w-[600px] rounded-full bg-indigo-100/50 blur-3xl" />
    </div>
  )
}
