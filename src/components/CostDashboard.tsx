import { useState } from 'react'
import { Info } from 'lucide-react'
import { formatCurrency } from '../utils/format'

interface CalculationResults {
  productivityCost: number
  healthcareCost: number
  stimulantCost: number
  careerCost: number
  cognitiveDeclineCost: number
  totalAnnualCost: number
  capWarning: boolean
}

interface CostDashboardProps {
  calculations: CalculationResults
}

const tooltips = {
  productivity: "We estimate annual earning potential lost from poor sleep using your morning sharpness, afternoon crash, and error rate, adjusted for your checked disruptors. Source: RAND Corporation (2016) found sleep-deprived workers cost the US economy up to $411 billion annually in lost productivity.",
  healthcare: "Includes your reported medical visits plus estimated annual costs for each condition you checked that is clinically linked to poor sleep. Source: CDC estimates sleep disorders cost the US healthcare system over $15 billion annually.",
  stimulants: "This is what you spend annually compensating for low sleep energy with caffeine and supplements — money spent treating a symptom rather than fixing the root cause.",
  career: "This isn't about today's output — it's about what you stop earning over time. Poor sleep makes you less sharp in meetings, less visible to leadership, and less confident negotiating raises. Someone performing at 80% of their potential for a few years earns significantly less than their well-rested peers — even if they never miss a deadline. Source: RAND Corporation (2016).",
  cognitive: "This is separate from productivity loss. You can finish every task on your list and still lose money here. Cognitive decline affects the quality of your thinking — the deal negotiated poorly, the hire you misjudged, the detail you missed in a contract. Johns Hopkins research shows sleep-deprived people make measurably worse decisions even when they feel fine. This hits hardest if your role involves judgment, negotiation, hiring, or strategy."
}

const tileConfig = [
  { key: 'productivityCost', label: 'Productivity Loss', description: 'Annual earnings lost to reduced output on poor sleep nights', tooltip: tooltips.productivity },
  { key: 'healthcareCost', label: 'Healthcare Costs', description: 'Medical visits + condition-related expenses', tooltip: tooltips.healthcare },
  { key: 'stimulantCost', label: 'Stimulant Spending', description: 'Caffeine & supplements to compensate', tooltip: tooltips.stimulants },
  { key: 'careerCost', label: 'Career Impact', description: 'Reduced raises & promotion potential', tooltip: tooltips.career },
  { key: 'cognitiveDeclineCost', label: 'Cognitive Decline', description: 'Value lost through poor decisions and judgment — separate from how much work you completed', tooltip: tooltips.cognitive },
  { key: 'totalAnnualCost', label: 'Total Annual Cost', description: 'Combined cost of poor sleep', tooltip: '', isTotal: true }
]

export function CostDashboard({ calculations }: CostDashboardProps) {
  const [expandedTile, setExpandedTile] = useState<string | null>(null)

  return (
    <div className="max-w-4xl mx-auto px-4 py-12">
      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold text-white mb-2">
          Here's What Your Sleep Is Costing You
        </h2>
        <p className="text-gray-400">
          Updated in real-time as you complete your audit.
        </p>
      </div>

      {calculations.capWarning && (
        <div className="mb-6 p-3 bg-gray-800/50 border border-gray-700 rounded-xl text-center">
          <p className="text-gray-400 text-sm">
            Conservative caps applied to keep estimates realistic.
          </p>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {tileConfig.map(tile => {
          const value = calculations[tile.key as keyof CalculationResults] as number
          const isExpanded = expandedTile === tile.key

          return (
            <div
              key={tile.key}
              className={`p-5 rounded-xl border ${
                tile.isTotal 
                  ? 'bg-gold/10 border-gold col-span-1 md:col-span-2' 
                  : 'bg-card-bg border-border-subtle'
              }`}
            >
              <div className="flex justify-between items-start">
                <div>
                  <p className={`font-medium ${tile.isTotal ? 'text-gold' : 'text-gray-400'} text-sm`}>
                    {tile.label}
                  </p>
                  <p className={`text-2xl font-bold ${tile.isTotal ? 'text-gold' : 'text-alert-red'} mt-1`}>
                    {formatCurrency(value)}
                  </p>
                  <p className="text-gray-500 text-xs mt-1">
                    {tile.description}
                  </p>
                </div>
                {tile.tooltip && (
                  <button
                    onClick={() => setExpandedTile(isExpanded ? null : tile.key)}
                    className="text-gray-500 hover:text-white transition-colors"
                  >
                    <Info className="w-5 h-5" />
                  </button>
                )}
              </div>
              
              {isExpanded && tile.tooltip && (
                <div className="mt-3 pt-3 border-t border-border-subtle">
                  <p className="text-gray-400 text-sm leading-relaxed">
                    {tile.tooltip}
                  </p>
                </div>
              )}
            </div>
          )
        })}
      </div>
    </div>
  )
}
