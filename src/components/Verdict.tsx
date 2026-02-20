import { SleepAuditState, DISRUPTORS } from '../App'
import { formatCurrency } from '../utils/format'
import { jsPDF } from 'jspdf'

interface CalculationResults {
  totalAnnualCost: number
  totalInvestment: number
  productivityCost: number
  healthcareCost: number
  stimulantCost: number
  careerCost: number
  cognitiveDeclineCost: number
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

function getBaseResolution(totalInvestment: number): number {
  if (totalInvestment <= 1500) return 20
  if (totalInvestment <= 2500) return 35
  if (totalInvestment <= 3500) return 48
  if (totalInvestment <= 4999) return 58
  if (totalInvestment <= 6499) return 68
  if (totalInvestment <= 8399) return 78
  return 88
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
  const baseResolution = getBaseResolution(totalInvestment)

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

  const buildEmailBody = () => {
    const allDisruptors = state.checkedDisruptors
      .map(id => DISRUPTORS.find(d => d.id === id))
      .filter(Boolean)
      .map(d => d!.label)
      .join(', ') || 'None'
    
    const br = '\n'
    return `YOUR SLEEP AUDIT RESULTS` + br +
      `══════════════════════════════════════════` + br + br +
      `📊 YOUR SLEEP PROFILE` + br +
      `• Sleep Hours per Night: ${state.sleepHoursPerNight}` + br +
      `• Poor Sleep Nights per Week: ${state.poorSleepNightsPerWeek}` + br +
      `• Morning Sharpness (1-10): ${state.morningSharpness}/10` + br +
      `• Afternoon Energy Crash: ${state.afternoonCrash ? 'Yes - frequently' : 'No - stable'}` + br +
      `• Error Rate: ${state.errorsLevel}` + br +
      `• Work Days per Week: ${state.workDaysPerWeek}` + br + br +
      `💰 ANNUAL COST BREAKDOWN` + br +
      `══════════════════════════════════════════` + br +
      `• Productivity Loss: ${formatCurrency(calculations.productivityCost || 0)}` + br +
      `• Healthcare Costs: ${formatCurrency(calculations.healthcareCost || 0)}` + br +
      `• Stimulant Spending: ${formatCurrency(calculations.stimulantCost || 0)}` + br +
      `• Career Impact: ${formatCurrency(calculations.careerCost || 0)}` + br +
      `• Cognitive Decline: ${formatCurrency(calculations.cognitiveDeclineCost || 0)}` + br +
      `──────────────────────────────────────────` + br +
      `• TOTAL ANNUAL COST: ${formatCurrency(totalAnnualCost)}` + br + br +
      `🔧 YOUR IDENTIFIED SLEEP DISRUPTORS` + br +
      allDisruptors + br + br +
      `💡 RECOMMENDED SOLUTIONS` + br +
      recommendations.map((r, i) => `${i + 1}. ${r}`).join(br) + br + br +
      `💵 INVESTMENT & ROI` + br +
      `══════════════════════════════════════════` + br +
      `• Recommended Investment: ${formatCurrency(totalInvestment)}` + br +
      `  - Mattress: ${formatCurrency(state.mattressCost)}` + br +
      `  - Adjustable Base: ${formatCurrency(state.adjustableBaseCost)}` + br +
      `  - Sleep Issues Resolved: ${baseResolution}%` + br + br +
      `• Conservative Scenario:` + br +
      `  - Annual Savings: ${formatCurrency(Math.round(totalAnnualCost * 0.55 * 0.70))}` + br +
      `  - Payback: ${Math.round(totalInvestment / (totalAnnualCost * 0.55 * 0.70 / 12))} months` + br +
      `  - 5-Year Gain: ${formatCurrency(Math.round(totalAnnualCost * 0.55 * 0.70 * 5 - totalInvestment))}` + br + br +
      `• Moderate Scenario:` + br +
      `  - Annual Savings: ${formatCurrency(Math.round(totalAnnualCost * 0.55))}` + br +
      `  - Payback: ${moderateScenario.paybackMonths.toFixed(0)} months` + br +
      `  - 5-Year Gain: ${formatCurrency(moderateScenario.fiveYearNetGain)}` + br + br +
      `• Optimistic Scenario:` + br +
      `  - Annual Savings: ${formatCurrency(Math.round(Math.min(totalAnnualCost * 0.55 * 1.25, totalAnnualCost * 0.92)))}` + br +
      `  - Payback: ${Math.round(totalInvestment / (totalAnnualCost * 0.55 * 1.25 / 12))} months` + br +
      `  - 5-Year Gain: ${formatCurrency(Math.round(Math.min(totalAnnualCost * 0.55 * 1.25, totalAnnualCost * 0.92) * 5 - totalInvestment))}` + br + br +
      `══════════════════════════════════════════` + br +
      `This Sleep ROI Calculator was created by Joshua Williams - not affiliated with, endorsed by, or representing Mattress Firm.`
  }

  const downloadPDF = () => {
    // Load the pre-generated report image and wrap it in a PDF
    const img = new Image()
    img.onload = () => {
      const doc = new jsPDF({
        orientation: img.width > img.height ? 'landscape' : 'portrait',
        unit: 'px',
        format: [img.width, img.height]
      })
      doc.addImage(img, 'PNG', 0, 0, img.width, img.height)
      doc.save('Sleep-ROI-Report.pdf')
    }
    img.src = '/sleep-roi-calculator/assets/sleep-roi-report.png'
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

        <div className="flex flex-col md:flex-row gap-4 justify-center">
          <button 
            onClick={downloadPDF}
            className="w-full md:w-auto px-8 py-4 bg-gold text-bg-dark font-semibold rounded-lg text-lg hover:bg-yellow-400 transition-colors"
          >
            Download PDF
          </button>
          
          <button 
            onClick={() => {
              const body = buildEmailBody()
              window.location.href = `mailto:?subject=${encodeURIComponent('Your Sleep Audit Results')}&body=${encodeURIComponent(body)}`
            }}
            className="w-full md:w-auto px-8 py-4 bg-gray-700 text-white font-semibold rounded-lg text-lg hover:bg-gray-600 transition-colors"
          >
            Email Results
          </button>

          <button 
            onClick={() => {
              const body = buildEmailBody()
              navigator.clipboard.writeText(body).then(() => {
                alert('Results copied to clipboard!')
              }).catch(() => {
                alert('Could not copy to clipboard. Please select and copy manually.')
              })
            }}
            className="w-full md:w-auto px-8 py-4 bg-gray-600 text-white font-semibold rounded-lg text-lg hover:bg-gray-500 transition-colors"
          >
            Copy Results
          </button>
        </div>
        
        <p className="text-gray-500 text-sm mt-4">
          No account required. Your data never leaves this page.<br/>
          <span className="text-gray-600">Note: Email opens your default mail app. To use Outlook, set it as default in iPhone Settings → Mail → Default Mail App.</span>
        </p>
      </div>
    </div>
  )
}
