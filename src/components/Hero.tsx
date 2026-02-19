import { Star, Moon } from 'lucide-react'

interface HeroProps {
  onStart: () => void
}

export function Hero({ onStart }: HeroProps) {
  return (
    <div className="relative bg-bg-dark overflow-hidden">
      {/* Decorative gradient */}
      <div className="absolute inset-0 bg-gradient-to-br from-slate-blue/20 via-transparent to-bg-dark" />
      
      {/* Stars decoration */}
      <div className="absolute top-20 left-10 opacity-20">
        <Star className="w-4 h-4 text-white" />
      </div>
      <div className="absolute top-32 right-20 opacity-15">
        <Star className="w-3 h-3 text-white" />
      </div>
      <div className="absolute bottom-20 left-1/4 opacity-10">
        <Moon className="w-6 h-6 text-gold" />
      </div>
      
      <div className="relative max-w-4xl mx-auto px-4 py-24 md:py-32 text-center">
        <h1 className="text-4xl md:text-5xl font-bold text-white mb-6">
          What Is Poor Sleep Actually Costing You?
        </h1>
        
        <p className="text-lg md:text-xl text-gray-400 mb-10 max-w-2xl mx-auto">
          Answer a few quick questions and we'll calculate the real financial impact of your sleep — down to the dollar.
        </p>
        
        <button
          onClick={onStart}
          className="inline-flex items-center gap-2 px-8 py-4 bg-gold text-bg-dark font-semibold rounded-lg text-lg hover:bg-yellow-400 transition-colors"
        >
          Start My Sleep Audit →
        </button>
        
        <p className="mt-6 text-sm text-gray-500">
          Based on peer-reviewed research from Harvard Medical School, RAND Corporation, and the CDC
        </p>
      </div>
    </div>
  )
}
