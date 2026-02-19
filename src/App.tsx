import { useState, useMemo } from 'react'
import { Hero } from './components/Hero'
import { SleepAudit } from './components/SleepAudit'
import { CostDashboard } from './components/CostDashboard'
import { InvestmentCalculator } from './components/InvestmentCalculator'
import { Charts } from './components/Charts'
import { Verdict } from './components/Verdict'

export interface SleepAuditState {
  annualIncome: number
  sleepHoursPerNight: number
  poorSleepNightsPerWeek: number
  employmentType: 'Salaried' | 'Hourly' | 'Self-Employed' | 'Not Currently Employed'
  checkedDisruptors: string[]
  workDaysPerWeek: number
  morningSharpness: number
  afternoonCrash: boolean
  errorsLevel: 'Never' | 'Sometimes' | 'Often' | 'Always'
  medicalVisitsPerYear: number
  avgVisitCost: number
  caffeineMonthlyCost: number
  mattressCost: number
  adjustableBaseCost: number
}

const DISRUPTORS = [
  { id: "partner", label: "Partner Disturbance", icon: "Users", weight: 0.08, affects: ["Productivity"] },
  { id: "temperature", label: "Temperature Discomfort", icon: "Thermometer", weight: 0.06, affects: ["Sleep Quality"] },
  { id: "snoring", label: "Snoring (yours or partner's)", icon: "Wind", weight: 0.10, affects: ["Productivity", "Cognitive"] },
  { id: "sleep_apnea", label: "Sleep Apnea (diagnosed or suspected)", icon: "Cigarette", weight: 0.18, affects: ["Healthcare", "Cognitive", "Productivity"] },
  { id: "allergies", label: "Allergies / Congestion", icon: "Flower2", weight: 0.07, affects: ["Healthcare", "Sleep Quality"] },
  { id: "back_pain", label: "Back Pain", icon: "Activity", weight: 0.12, affects: ["Productivity", "Healthcare"] },
  { id: "neck_pain", label: "Neck Pain", icon: "AlertCircle", weight: 0.10, affects: ["Productivity", "Healthcare"] },
  { id: "shoulder_pain", label: "Shoulder Pain", icon: "Zap", weight: 0.09, affects: ["Productivity"] },
  { id: "headaches", label: "Headaches Upon Waking", icon: "Brain", weight: 0.11, affects: ["Productivity", "Cognitive"] },
  { id: "acid_reflux", label: "Acid Reflux / GERD", icon: "Flame", weight: 0.09, affects: ["Healthcare", "Sleep Quality"] },
  { id: "anxiety", label: "Anxiety / Racing Mind", icon: "Radio", weight: 0.13, affects: ["Productivity", "Cognitive"] },
  { id: "frequent_waking", label: "Frequent Waking", icon: "RefreshCw", weight: 0.10, affects: ["Productivity", "Cognitive"] }
]

const DISRUPTOR_SOLUTIONS: Record<string, string> = {
  back_pain: 'Mattress — spinal alignment support',
  neck_pain: 'Mattress — pressure relief',
  shoulder_pain: 'Mattress — pressure point relief',
  acid_reflux: 'Adjustable Base — head elevation',
  snoring: 'Adjustable Base — head elevation',
  sleep_apnea: 'Adjustable Base — head elevation',
  temperature: 'Mattress — cooling materials',
  partner: 'Mattress — motion isolation',
  allergies: 'Mattress — hypoallergenic materials',
  anxiety: 'Both — general sleep environment improvement',
  frequent_waking: 'Both — general sleep environment improvement',
  headaches: 'Both — general sleep environment improvement',
}

export { DISRUPTORS, DISRUPTOR_SOLUTIONS }

function App() {
  const [activeTab, setActiveTab] = useState<1 | 2 | 3>(1)
  
  const [state, setState] = useState<SleepAuditState>({
    annualIncome: 75000,
    sleepHoursPerNight: 6,
    poorSleepNightsPerWeek: 4,
    employmentType: 'Salaried',
    checkedDisruptors: [],
    workDaysPerWeek: 5,
    morningSharpness: 4,
    afternoonCrash: true,
    errorsLevel: 'Sometimes',
    medicalVisitsPerYear: 3,
    avgVisitCost: 125,
    caffeineMonthlyCost: 60,
    mattressCost: 2500,
    adjustableBaseCost: 1800,
  })

  const calculations = useMemo(() => {
    const {
      annualIncome,
      sleepHoursPerNight,
      poorSleepNightsPerWeek,
      employmentType,
      checkedDisruptors,
      workDaysPerWeek,
      morningSharpness,
      afternoonCrash,
      errorsLevel,
      medicalVisitsPerYear,
      avgVisitCost,
      caffeineMonthlyCost,
      mattressCost,
      adjustableBaseCost,
    } = state

    // PRODUCTIVITY COST
    const dailyEarnings = annualIncome / (workDaysPerWeek * 52)
    const morningImpairmentPct = ((10 - morningSharpness) / 10) * 0.40
    const afternoonSlumpPct = afternoonCrash ? 0.15 : 0
    const mistakesPctMap: Record<string, number> = { Never: 0, Sometimes: 0.05, Often: 0.10, Always: 0.15 }
    const mistakesPct = mistakesPctMap[errorsLevel]
    const baseImpairment = morningImpairmentPct + afternoonSlumpPct + mistakesPct
    const disruptorSeveritySum = checkedDisruptors.reduce((sum, id) => {
      const d = DISRUPTORS.find(x => x.id === id)
      return sum + (d?.weight ?? 0)
    }, 0)
    const disruptorBoost = disruptorSeveritySum * 0.30
    const effectiveImpairment = Math.min(baseImpairment + disruptorBoost, 0.50)
    const poorNightsPerYear = poorSleepNightsPerWeek * 52
    const productivityCost = dailyEarnings * effectiveImpairment * poorNightsPerYear

    // HEALTHCARE COST
    const baseMedicalCost = medicalVisitsPerYear * avgVisitCost
    const apneaCost = checkedDisruptors.includes('sleep_apnea') ? 800 : 0
    const allergyCost = checkedDisruptors.includes('allergies') ? 150 : 0
    const refluxCost = checkedDisruptors.includes('acid_reflux') ? 200 : 0
    const painCost = (checkedDisruptors.includes('back_pain') || checkedDisruptors.includes('neck_pain') || checkedDisruptors.includes('shoulder_pain')) ? 240 : 0
    const healthcareCost = baseMedicalCost + apneaCost + allergyCost + refluxCost + painCost

    // STIMULANT COST
    const stimulantCost = caffeineMonthlyCost * 12

    // CAREER COST
    const cognitiveDisruptorIds = ['snoring', 'sleep_apnea', 'headaches', 'anxiety', 'frequent_waking']
    const cognitiveDisruptorCount = checkedDisruptors.filter(id => cognitiveDisruptorIds.includes(id)).length
    const cognitivePenalty = cognitiveDisruptorCount * 0.012
    const raisePenalty = annualIncome * 0.03 * ((10 - morningSharpness) / 10) * (poorSleepNightsPerWeek / 7)
    const careerCostRaw = annualIncome * cognitivePenalty + raisePenalty
    const careerCost = employmentType === 'Not Currently Employed' ? 0 : Math.min(careerCostRaw, annualIncome * 0.08)

    // COGNITIVE DECLINE COST
    const sleepDeficit = Math.max(0, 7 - sleepHoursPerNight)
    const cognitiveDeclineCost = Math.min(
      annualIncome * sleepDeficit * 0.004 * (poorSleepNightsPerWeek / 7) * 52,
      8000
    )

    // TOTALS
    const totalAnnualCost = productivityCost + healthcareCost + stimulantCost + careerCost + cognitiveDeclineCost
    const capWarning = totalAnnualCost > annualIncome * 0.40

    // INVESTMENT & ROI
    const totalInvestment = mattressCost + adjustableBaseCost
    const scenarioMultipliers: Record<string, number> = { conservative: 0.30, moderate: 0.55, optimistic: 0.75 }
    const roiScenarios = Object.entries(scenarioMultipliers).map(([key, mult]) => {
      const annualSavings = totalAnnualCost * mult
      const monthlySavings = annualSavings / 12
      const paybackMonths = totalInvestment / monthlySavings
      const paybackYears = paybackMonths / 12
      const fiveYearNetGain = (annualSavings * 5) - totalInvestment
      const roiPercent = ((annualSavings * 5 - totalInvestment) / totalInvestment) * 100
      return { key, label: key.charAt(0).toUpperCase() + key.slice(1), multiplier: mult, annualSavings, monthlySavings, paybackMonths, paybackYears, fiveYearNetGain, roiPercent }
    })

    // CHART DATA
    const moderateSavings = totalAnnualCost * 0.55
    const chartCostBreakdown = [
      { name: 'Productivity', value: Math.round(productivityCost), color: '#ef4444' },
      { name: 'Healthcare', value: Math.round(healthcareCost), color: '#f97316' },
      { name: 'Stimulants', value: Math.round(stimulantCost), color: '#f59e0b' },
      { name: 'Career Impact', value: Math.round(careerCost), color: '#a855f7' },
      { name: 'Cognitive', value: Math.round(cognitiveDeclineCost), color: '#3b82f6' }
    ]
    const chartTimelineData = Array.from({ length: 10 }, (_, i) => ({
      year: i + 1,
      doNothing: Math.round(totalAnnualCost * (i + 1) * Math.pow(1.02, i)),
      afterUpgrade: Math.round(totalInvestment + (totalAnnualCost - moderateSavings) * (i + 1) * Math.pow(1.02, i))
    }))

    return {
      productivityCost,
      healthcareCost,
      stimulantCost,
      careerCost,
      cognitiveDeclineCost,
      totalAnnualCost,
      capWarning,
      totalInvestment,
      roiScenarios,
      chartCostBreakdown,
      chartTimelineData
    }
  }, [state])

  const updateState = (updates: Partial<SleepAuditState>) => {
    setState(prev => ({ ...prev, ...updates }))
  }

  const toggleDisruptor = (id: string) => {
    setState(prev => ({
      ...prev,
      checkedDisruptors: prev.checkedDisruptors.includes(id)
        ? prev.checkedDisruptors.filter(d => d !== id)
        : [...prev.checkedDisruptors, id]
    }))
  }

  return (
    <div className="min-h-screen bg-bg-dark">
      <Hero onStart={() => document.getElementById('audit')?.scrollIntoView({ behavior: 'smooth' })} />
      
      <SleepAudit
        state={state}
        updateState={updateState}
        toggleDisruptor={toggleDisruptor}
        activeTab={activeTab}
        setActiveTab={setActiveTab}
      />
      
      <CostDashboard calculations={calculations} />
      
      <InvestmentCalculator
        state={state}
        updateState={updateState}
      />
      
      <Charts calculations={calculations} />
      
      <Verdict state={state} calculations={calculations} />
      
      <footer className="text-center py-8 text-gray-500 text-sm">
        <p>Based on peer-reviewed research from Harvard Medical School, RAND Corporation, and the CDC</p>
      </footer>
    </div>
  )
}

export default App
