import { SleepAuditState, DISRUPTOR_SOLUTIONS } from '../App'
import { formatCurrency } from '../utils/format'

interface InvestmentCalculatorProps {
  state: SleepAuditState
  updateState: (updates: Partial<SleepAuditState>) => void
}

interface ROIScenario {
  key: string
  label: string
  multiplier: number
  annualSavings: number
  monthlySavings: number
  paybackMonths: number
  paybackYears: number
  fiveYearNetGain: number
  roiPercent: number
}

export function InvestmentCalculator({ state, updateState }: InvestmentCalculatorProps) {
  const totalInvestment = state.mattressCost + state.adjustableBaseCost
  
  const scenarioMultipliers: Record<string, number> = { conservative: 0.30, moderate: 0.55, optimistic: 0.75 }
  const annualCostEstimate = 25000 // Approximate for display
  const roiScenarios: ROIScenario[] = Object.entries(scenarioMultipliers).map(([key, mult]) => {
    const annualSavings = annualCostEstimate * mult
    const monthlySavings = annualSavings / 12
    const paybackMonths = totalInvestment / monthlySavings
    const paybackYears = paybackMonths / 12
    const fiveYearNetGain = (annualSavings * 5) - totalInvestment
    const roiPercent = ((annualSavings * 5 - totalInvestment) / totalInvestment) * 100
    return { key, label: key.charAt(0).toUpperCase() + key.slice(1), multiplier: mult, annualSavings, monthlySavings, paybackMonths, paybackYears, fiveYearNetGain, roiPercent }
  })

  return (
    <div className="max-w-4xl mx-auto px-4 py-12">
      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold text-white mb-2">
          What Would It Cost to Fix It?
        </h2>
        <p className="text-gray-400">
          A quality sleep upgrade is a one-time investment. Here's how fast it pays for itself.
        </p>
      </div>

      <div className="bg-card-bg rounded-2xl border border-border-subtle p-6 md:p-8 space-y-8">
        {/* Mattress Slider */}
        <div>
          <label className="block text-white font-medium mb-4">
            Mattress Investment
          </label>
          <input
            type="range"
            min={500}
            max={8000}
            step={100}
            value={state.mattressCost}
            onChange={(e) => updateState({ mattressCost: Number(e.target.value) })}
            className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer accent-gold"
          />
          <div className="mt-2">
            <span className="text-gold font-semibold text-lg">{formatCurrency(state.mattressCost)}</span>
          </div>
        </div>

        {/* Adjustable Base Slider */}
        <div>
          <label className="block text-white font-medium mb-4">
            Adjustable Base Investment
          </label>
          <input
            type="range"
            min={0}
            max={5000}
            step={100}
            value={state.adjustableBaseCost}
            onChange={(e) => updateState({ adjustableBaseCost: Number(e.target.value) })}
            className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer accent-gold"
          />
          <div className="mt-2">
            <span className="text-gold font-semibold text-lg">{formatCurrency(state.adjustableBaseCost)}</span>
          </div>
          <p className="text-gray-500 text-sm mt-2">
            An adjustable base directly addresses acid reflux, snoring, sleep apnea, and back pain via head/foot elevation
          </p>
        </div>

        {/* Total Investment */}
        <div className="text-center p-6 bg-gold/10 rounded-xl border border-gold">
          <p className="text-gray-400 text-sm">Total Investment</p>
          <p className="text-4xl font-bold text-gold">{formatCurrency(totalInvestment)}</p>
        </div>

        {/* Disruptor Solutions */}
        {state.checkedDisruptors.length > 0 && (
          <div>
            <h3 className="text-white font-medium mb-4">Your Sleep Solutions:</h3>
            <div className="space-y-2">
              {state.checkedDisruptors.map(id => (
                <div key={id} className="flex items-center gap-3 p-3 bg-gray-700/50 rounded-lg">
                  <span className="text-healthy-green">✓</span>
                  <span className="text-gray-300 text-sm">
                    {DISRUPTOR_SOLUTIONS[id] || 'Sleep improvement'}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ROI Scenario Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {roiScenarios.map(scenario => (
            <div
              key={scenario.key}
              className={`p-5 rounded-xl border-2 transition-all ${
                scenario.key === 'moderate'
                  ? 'border-gold bg-gold/10'
                  : 'border-border-subtle bg-gray-700/30'
              }`}
            >
              <p className={`text-sm font-medium ${scenario.key === 'moderate' ? 'text-gold' : 'text-gray-400'}`}>
                {scenario.label} ({Math.round(scenario.multiplier * 100)}% resolved)
              </p>
              
              <div className="mt-3 space-y-2">
                <div>
                  <p className="text-gray-500 text-xs">Annual Savings</p>
                  <p className="text-xl font-bold text-healthy-green">
                    {formatCurrency(scenario.annualSavings)}
                  </p>
                </div>
                <div>
                  <p className="text-gray-500 text-xs">Monthly Savings</p>
                  <p className="text-lg font-semibold text-white">
                    {formatCurrency(scenario.monthlySavings)}
                  </p>
                </div>
                <div>
                  <p className="text-gray-500 text-xs">Payback Period</p>
                  <p className="text-white">
                    {scenario.paybackMonths.toFixed(1)} months ({scenario.paybackYears.toFixed(1)} years)
                  </p>
                </div>
                <div>
                  <p className="text-gray-500 text-xs">5-Year Net Gain</p>
                  <p className="text-healthy-green font-semibold">
                    {formatCurrency(scenario.fiveYearNetGain)}
                  </p>
                </div>
                <div>
                  <p className="text-gray-500 text-xs">ROI</p>
                  <p className="text-gold font-bold">{scenario.roiPercent.toFixed(0)}%</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
