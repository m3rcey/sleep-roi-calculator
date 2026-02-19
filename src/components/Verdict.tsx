import { SleepAuditState, DISRUPTORS } from '../App'
import { formatCurrency } from '../utils/format'

interface CalculationResults {
  totalAnnualCost: number
  totalInvestment: number
  roiScenarios: {
    key: string
    label: string
    annualSavings: number
    paybackMonths: number
    fiveYearNetGain: number
    roiPercent: number
  }[]
}

interface VerdictProps {
  state: SleepAuditState
  calculations: CalculationResults
}

export function Verdict({ state, calculations }: VerdictProps) {
  const { totalAnnualCost, totalInvestment, roiScenarios } = calculations

  // Get top disruptors
  const topDisruptors = state.checkedDisruptors
    .map(id => DISRUPTORS.find(d => d.id === id))
    .filter(Boolean)
    .sort((a, b) => b!.weight - a!.weight)
    .slice(0, 2)
    .map(d => d!.label)

  const disruptorPhrase = topDisruptors.length > 0 
    ? topDisruptors.join(' and ') 
    : 'sleep deprivation and productivity loss'

  const moderateScenario = roiScenarios.find(s => s.key === 'moderate')!

  // Build recommendations
  const recommendations: string[] = []
  const checked = state.checkedDisruptors
  
  if (checked.some(id => ['back_pain', 'neck_pain', 'shoulder_pain'].includes(id))) {
    recommendations.push("A mattress with proper spinal alignment and pressure relief directly targets your top pain-related disruptors.")
  }
  if (checked.includes('temperature')) {
    recommendations.push("Temperature-regulating mattress materials can significantly reduce the thermal disruptions you reported.")
  }
  if (checked.includes('acid_reflux')) {
    recommendations.push("An adjustable base that elevates your head is clinically shown to reduce nighttime GERD and acid reflux symptoms.")
  }
  if (checked.some(id => ['snoring', 'sleep_apnea'].includes(id))) {
    recommendations.push("Head elevation via an adjustable base is a proven first-line intervention for snoring and mild sleep apnea.")
  }
  if (checked.includes('partner')) {
    recommendations.push("Mattresses engineered with isolated motion transfer are specifically designed to eliminate the partner disturbances you checked.")
  }
  if (checked.includes('allergies')) {
    recommendations.push("Hypoallergenic mattress materials can reduce allergen exposure and the nighttime congestion you reported.")
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-12">
      <div className="bg-card-bg rounded-2xl border border-gold p-8 text-center">
        <h2 className="text-3xl font-bold text-gold mb-6">
          Your Sleep Audit Results
        </h2>

        <div className="text-white text-lg leading-relaxed mb-8">
          <p>
            Based on your audit, poor sleep — primarily driven by <span className="text-gold font-semibold">{disruptorPhrase}</span> — is costing you an estimated{' '}
            <span className="text-alert-red font-bold">{formatCurrency(totalAnnualCost)}</span> per year. 
            A <span className="text-gold font-semibold">{formatCurrency(totalInvestment)}</span> sleep upgrade would pay for itself in{' '}
            <span className="text-gold font-semibold">{moderateScenario.paybackMonths.toFixed(0)} months</span> under moderate assumptions, 
            and generate <span className="text-healthy-green font-semibold">{formatCurrency(moderateScenario.fiveYearNetGain)}</span> in recovered value over 5 years. 
            That's a <span className="text-gold font-semibold">{moderateScenario.roiPercent.toFixed(0)}% ROI</span> on a one-time purchase.
          </p>
        </div>

        {recommendations.length > 0 && (
          <div className="text-left space-y-4 mb-8">
            <h3 className="text-white font-semibold text-center mb-4">
              Recommendations Based on Your Sleep Profile:
            </h3>
            {recommendations.map((rec, idx) => (
              <div key={idx} className="flex gap-3 p-4 bg-gray-700/50 rounded-lg">
                <span className="text-gold">→</span>
                <p className="text-gray-300">{rec}</p>
              </div>
            ))}
          </div>
        )}

        <button className="w-full md:w-auto px-8 py-4 bg-gold text-bg-dark font-semibold rounded-lg text-lg hover:bg-yellow-400 transition-colors">
          See the Sleep Setup Matched to My Results →
        </button>
        
        <p className="text-gray-500 text-sm mt-4">
          No account required. Your data never leaves this page.
        </p>
      </div>
    </div>
  )
}
