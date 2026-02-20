import { SleepAuditState, DISRUPTOR_SOLUTIONS } from '../App'
import { formatCurrency } from '../utils/format'

interface InvestmentCalculatorProps {
  state: SleepAuditState
  updateState: (updates: Partial<SleepAuditState>) => void
  totalAnnualCost: number
}

interface ROIScenario {
  key: string
  label: string
  multiplier: number
  resolutionPercent: number
  annualSavings: number
  monthlySavings: number
  paybackMonths: number
  paybackYears: number
  fiveYearNetGain: number
  roiPercent: number
}

function getBaseResolution(totalInvestment: number): number {
  if (totalInvestment <= 1500) return 0.20
  if (totalInvestment <= 2500) return 0.35
  if (totalInvestment <= 3500) return 0.48
  if (totalInvestment <= 4999) return 0.58
  if (totalInvestment <= 6499) return 0.68
  if (totalInvestment <= 8399) return 0.78
  return 0.88
}

function getResolutionTier(totalInvestment: number): { level: string; range: string; issues: string } {
  if (totalInvestment <= 2500) {
    return { level: 'Entry', range: '$800–$2,500', issues: '20–35%' }
  }
  if (totalInvestment <= 5000) {
    return { level: 'Mid-Range', range: '$2,500–$5,000', issues: '48–68%' }
  }
  return { level: 'Premium', range: '$5,000–$8,400+', issues: '78–88%' }
}

export function InvestmentCalculator({ state, updateState, totalAnnualCost }: InvestmentCalculatorProps) {
  const totalInvestment = state.mattressCost + state.adjustableBaseCost
  
  const baseResolution = getBaseResolution(totalInvestment)
  
  const scenarioMultipliers: Record<string, number> = { 
    conservative: Math.min(baseResolution * 0.70, 0.92), 
    moderate: Math.min(baseResolution * 1.00, 0.92), 
    optimistic: Math.min(baseResolution * 1.25, 0.92) 
  }
  
  const tier = getResolutionTier(totalInvestment)

  const roiScenarios: ROIScenario[] = Object.entries(scenarioMultipliers).map(([key, mult]) => {
    const resolutionPercent = Math.round(mult * 100)
    const annualSavings = totalAnnualCost * mult
    const monthlySavings = annualSavings / 12
    const paybackMonths = monthlySavings > 0 ? totalInvestment / monthlySavings : 999
    const paybackYears = paybackMonths / 12
    const fiveYearNetGain = (annualSavings * 5) - totalInvestment
    const roiPercent = totalInvestment > 0 ? ((annualSavings * 5 - totalInvestment) / totalInvestment) * 100 : 0
    return { key, label: key.charAt(0).toUpperCase() + key.slice(1), multiplier: mult, resolutionPercent, annualSavings, monthlySavings, paybackMonths, paybackYears, fiveYearNetGain, roiPercent }
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
          <p className="text-gray-400 text-sm mt-2">
            This setup addresses an estimated {Math.round(baseResolution * 100)}% of your identified sleep issues
          </p>
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
                {scenario.label} ({scenario.resolutionPercent}% resolved)
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
                    {scenario.paybackMonths > 100 ? 'N/A' : `${scenario.paybackMonths.toFixed(1)} months (${scenario.paybackYears.toFixed(1)} years)`}
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

        {/* Explanation Panel */}
        <div className="border border-gray-700 rounded-xl p-6">
          <h3 className="text-white font-medium mb-4">Why does a higher investment save more?</h3>
          <p className="text-gray-400 text-sm mb-6">
            Not all mattresses and bases solve the same problems. An entry-level setup addresses basic comfort and support. A mid-range setup adds better pressure relief, motion isolation, and material quality. A premium setup resolves the widest range of disruptors — including temperature regulation, advanced spinal alignment, and full adjustability for acid reflux, snoring, and sleep apnea. The more disruptors your setup resolves, the more of your annual sleep cost it eliminates.
          </p>
          
          {/* Comparison Table */}
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-gray-700">
                  <th className="text-left text-gray-400 py-2 pr-4">Investment Level</th>
                  <th className="text-left text-gray-400 py-2 pr-4">What It Addresses</th>
                  <th className="text-left text-gray-400 py-2">Est. Issues Resolved</th>
                </tr>
              </thead>
              <tbody>
                <tr className={`border-b border-gray-800 ${tier.level === 'Entry' ? 'border-l-4 border-l-gold pl-4' : ''}`}>
                  <td className="py-3 pr-4 text-gray-300">Entry ($800–$2,500)</td>
                  <td className="py-3 pr-4 text-gray-400">Basic comfort and support</td>
                  <td className="py-3 text-gray-300">20–35%</td>
                </tr>
                <tr className={`border-b border-gray-800 ${tier.level === 'Mid-Range' ? 'border-l-4 border-l-gold pl-4' : ''}`}>
                  <td className="py-3 pr-4 text-gray-300">Mid-Range ($2,500–$5,000)</td>
                  <td className="py-3 pr-4 text-gray-400">Pressure relief, motion isolation, adjustability</td>
                  <td className="py-3 text-gray-300">48–68%</td>
                </tr>
                <tr className={tier.level === 'Premium' ? 'border-l-4 border-l-gold pl-4' : ''}>
                  <td className="py-3 pr-4 text-gray-300">Premium ($5,000–$8,400+)</td>
                  <td className="py-3 pr-4 text-gray-400">Full disruptor resolution including temperature, reflux, apnea, and alignment</td>
                  <td className="py-3 text-gray-300">78–88%</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  )
}
