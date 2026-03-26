'use client'

export function LoadingState() {
  return (
    <div className="flex flex-col items-center justify-center h-full text-center px-8 py-16">
      <div className="relative mb-6">
        <div className="w-16 h-16 rounded-full border-4 border-blue-100 border-t-blue-500 animate-spin" />
      </div>

      <h2 className="text-xl font-semibold text-slate-900 mb-2 font-display">
        Generating your proposal...
      </h2>

      <p className="text-slate-500 max-w-sm">
        Claude is writing a professional proposal tailored to your project brief.
        This usually takes 15-30 seconds.
      </p>

      <div className="mt-8 flex items-center gap-2">
        <div className="w-2 h-2 rounded-full bg-blue-500 animate-pulse" />
        <div className="w-2 h-2 rounded-full bg-blue-500 animate-pulse" style={{ animationDelay: '0.2s' }} />
        <div className="w-2 h-2 rounded-full bg-blue-500 animate-pulse" style={{ animationDelay: '0.4s' }} />
      </div>
    </div>
  )
}
