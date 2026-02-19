import { ChevronLeft, ChevronRight } from 'lucide-react'
import { SleepAuditState, DISRUPTORS } from '../App'
import { formatCurrency } from '../utils/format'

interface SleepAuditProps {
  state: SleepAuditState
  updateState: (updates: Partial<SleepAuditState>) => void
  toggleDisruptor: (id: string) => void
  activeTab: 1 | 2 | 3
  setActiveTab: (tab: 1 | 2 | 3) => void
}

export function SleepAudit({ state, updateState, toggleDisruptor, activeTab, setActiveTab }: SleepAuditProps) {
  const totalWeight = state.checkedDisruptors.reduce((sum, id) => {
    const d = DISRUPTORS.find(x => x.id === id)
    return sum + (d?.weight ?? 0)
  }, 0)
  const disruptionIndex = Math.min(100, Math.round((totalWeight / 1.12) * 100))

  const getIncomeFeedback = (value: number) => {
    if (value < 40000) return "Entry-level income range"
    if (value <= 80000) return "Moderate income range"
    return "Above-average income range"
  }

  const getSleepHoursFeedback = (value: number) => {
    if (value <= 5) return "Severely sleep deprived range"
    if (value <= 6) return "Below the recommended range"
    if (value < 7) return "Mild sleep deficit"
    return "Near-optimal range"
  }

  const getSharpnessFeedback = (value: number) => {
    if (value <= 3) return "Severely impaired"
    if (value <= 6) return "Noticeably impaired"
    return "Mildly impaired"
  }

  const getDisruptionTier = (idx: number) => {
    if (idx <= 30) return "Low Disruption"
    if (idx <= 60) return "Moderate Disruption"
    return "High Disruption"
  }

  const getDisruptionColor = (idx: number) => {
    if (idx <= 30) return "bg-healthy-green"
    if (idx <= 60) return "bg-gold"
    return "bg-alert-red"
  }

  return (
    <div id="audit" className="max-w-4xl mx-auto px-4 py-12">
      <div className="bg-card-bg rounded-2xl border border-border-subtle p-6 md:p-8">
        {/* Tabs */}
        <div className="flex border-b border-border-subtle mb-8">
          {[
            { num: 1, label: 'Sleep Baseline' },
            { num: 2, label: 'Sleep Disruptors' },
            { num: 3, label: 'Productivity Profile' }
          ].map(tab => (
            <button
              key={tab.num}
              onClick={() => setActiveTab(tab.num as 1 | 2 | 3)}
              className={`flex-1 py-3 text-center font-medium transition-colors ${
                activeTab === tab.num
                  ? 'text-white border-b-2 border-gold'
                  : 'text-gray-400 hover:text-white'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Tab 1: Sleep Baseline */}
        {activeTab === 1 && (
          <div className="space-y-8">
            <div>
              <label className="block text-white font-medium mb-4">
                What is your annual household income?
              </label>
              <input
                type="range"
                min={25000}
                max={300000}
                step={5000}
                value={state.annualIncome}
                onChange={(e) => updateState({ annualIncome: Number(e.target.value) })}
                className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer accent-gold"
              />
              <div className="flex justify-between mt-2">
                <span className="text-gold font-semibold text-lg">
                  {formatCurrency(state.annualIncome)}
                </span>
              </div>
              <p className="text-gray-400 text-sm mt-1">
                {getIncomeFeedback(state.annualIncome)}
              </p>
            </div>

            <div>
              <label className="block text-white font-medium mb-4">
                On most nights, how many hours of sleep do you actually get?
              </label>
              <input
                type="range"
                min={4}
                max={9}
                step={0.5}
                value={state.sleepHoursPerNight}
                onChange={(e) => updateState({ sleepHoursPerNight: Number(e.target.value) })}
                className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer accent-gold"
              />
              <div className="flex justify-between mt-2">
                <span className="text-gold font-semibold text-lg">
                  {state.sleepHoursPerNight} hours
                </span>
              </div>
              <p className="text-gray-400 text-sm mt-1">
                {getSleepHoursFeedback(state.sleepHoursPerNight)}
              </p>
            </div>

            <div>
              <label className="block text-white font-medium mb-4">
                How many nights per week would you describe your sleep as restless or poor quality?
              </label>
              <input
                type="range"
                min={0}
                max={7}
                step={1}
                value={state.poorSleepNightsPerWeek}
                onChange={(e) => updateState({ poorSleepNightsPerWeek: Number(e.target.value) })}
                className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer accent-gold"
              />
              <div className="flex justify-between mt-2">
                <span className="text-gold font-semibold text-lg">
                  {state.poorSleepNightsPerWeek} nights/week
                </span>
              </div>
              <p className="text-gray-400 text-sm mt-1">
                That's {state.poorSleepNightsPerWeek * 52} poor nights per year — {Math.round((state.poorSleepNightsPerWeek / 7) * 100)}% of your nights
              </p>
            </div>

            <div>
              <label className="block text-white font-medium mb-4">
                What best describes your work?
              </label>
              <div className="flex flex-wrap gap-2">
                {(['Salaried', 'Hourly', 'Self-Employed', 'Not Currently Employed'] as const).map(type => (
                  <button
                    key={type}
                    onClick={() => updateState({ employmentType: type })}
                    className={`px-4 py-2 rounded-full transition-colors ${
                      state.employmentType === type
                        ? 'bg-gold text-bg-dark font-medium'
                        : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                    }`}
                  >
                    {type}
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Tab 2: Sleep Disruptors */}
        {activeTab === 2 && (
          <div className="space-y-6">
            <div>
              <h3 className="text-xl font-semibold text-white mb-2">
                Check everything that regularly disrupts your sleep:
              </h3>
              <p className="text-gray-400 text-sm mb-4">
                Be honest — this is what makes your results accurate.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {DISRUPTORS.map(disruptor => {
                const isChecked = state.checkedDisruptors.includes(disruptor.id)
                
                return (
                  <label
                    key={disruptor.id}
                    className={`flex items-start gap-3 p-4 rounded-xl cursor-pointer transition-colors ${
                      isChecked ? 'bg-slate-blue border border-gold' : 'bg-gray-700/50 hover:bg-gray-700'
                    }`}
                  >
                    <input
                      type="checkbox"
                      checked={isChecked}
                      onChange={() => toggleDisruptor(disruptor.id)}
                      className="w-5 h-5 mt-0.5 rounded border-gray-500 bg-gray-600 text-gold"
                    />
                    <div className="flex-1">
                      <div className="flex items-center justify-between">
                        <span className="font-medium text-white">{disruptor.label}</span>
                      </div>
                      <div className="flex gap-1 mt-1">
                        {disruptor.affects.map(tag => (
                          <span key={tag} className="text-xs px-2 py-0.5 bg-gray-600 text-gray-300 rounded">
                            {tag}
                          </span>
                        ))}
                      </div>
                    </div>
                  </label>
                )
              })}
            </div>

            {/* Sleep Disruption Index */}
            <div className="mt-6 p-4 bg-gray-700/50 rounded-xl">
              <p className="text-white font-medium mb-2">
                Your Sleep Disruption Index: {disruptionIndex} / 100
              </p>
              <div className="h-4 bg-gray-600 rounded-full overflow-hidden">
                <div 
                  className={`h-full ${getDisruptionColor(disruptionIndex)} transition-all duration-500`}
                  style={{ width: `${disruptionIndex}%` }}
                />
              </div>
              <p className="text-gray-400 text-sm mt-2">
                {getDisruptionTier(disruptionIndex)}
              </p>
            </div>
          </div>
        )}

        {/* Tab 3: Productivity Profile */}
        {activeTab === 3 && (
          <div className="space-y-8">
            <div>
              <label className="block text-white font-medium mb-4">
                How many days per week do you work?
              </label>
              <input
                type="range"
                min={3}
                max={7}
                step={1}
                value={state.workDaysPerWeek}
                onChange={(e) => updateState({ workDaysPerWeek: Number(e.target.value) })}
                className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer accent-gold"
              />
              <div className="mt-2">
                <span className="text-gold font-semibold text-lg">{state.workDaysPerWeek} days</span>
              </div>
            </div>

            <div>
              <label className="block text-white font-medium mb-4">
                How would you rate your mental sharpness on mornings after poor sleep?
              </label>
              <input
                type="range"
                min={1}
                max={10}
                step={1}
                value={state.morningSharpness}
                onChange={(e) => updateState({ morningSharpness: Number(e.target.value) })}
                className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer accent-gold"
              />
              <div className="flex justify-between mt-2">
                <span className="text-gold font-semibold text-lg">{state.morningSharpness}/10</span>
              </div>
              <p className="text-gray-400 text-sm mt-1">
                {getSharpnessFeedback(state.morningSharpness)}
              </p>
            </div>

            <div>
              <label className="block text-white font-medium mb-4">
                Do you experience a mid-afternoon energy crash after poor sleep nights?
              </label>
              <div className="flex gap-2">
                <button
                  onClick={() => updateState({ afternoonCrash: true })}
                  className={`px-6 py-2 rounded-lg transition-colors ${
                    state.afternoonCrash ? 'bg-gold text-bg-dark font-medium' : 'bg-gray-700 text-gray-300'
                  }`}
                >
                  Yes
                </button>
                <button
                  onClick={() => updateState({ afternoonCrash: false })}
                  className={`px-6 py-2 rounded-lg transition-colors ${
                    !state.afternoonCrash ? 'bg-gold text-bg-dark font-medium' : 'bg-gray-700 text-gray-300'
                  }`}
                >
                  No
                </button>
              </div>
            </div>

            <div>
              <label className="block text-white font-medium mb-4">
                After bad sleep, how often do you make mistakes or have to redo work?
              </label>
              <div className="flex flex-wrap gap-2">
                {(['Never', 'Sometimes', 'Often', 'Always'] as const).map(level => (
                  <button
                    key={level}
                    onClick={() => updateState({ errorsLevel: level })}
                    className={`px-4 py-2 rounded-lg transition-colors ${
                      state.errorsLevel === level ? 'bg-gold text-bg-dark font-medium' : 'bg-gray-700 text-gray-300'
                    }`}
                  >
                    {level}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-white font-medium mb-4">
                How many times per year do you visit a doctor or urgent care for sleep-related issues?
              </label>
              <input
                type="range"
                min={0}
                max={20}
                step={1}
                value={state.medicalVisitsPerYear}
                onChange={(e) => updateState({ medicalVisitsPerYear: Number(e.target.value) })}
                className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer accent-gold"
              />
              <div className="mt-2">
                <span className="text-gold font-semibold text-lg">{state.medicalVisitsPerYear} visits/year</span>
              </div>
            </div>

            <div>
              <label className="block text-white font-medium mb-4">
                Average out-of-pocket cost per visit (including copays)
              </label>
              <input
                type="range"
                min={0}
                max={500}
                step={25}
                value={state.avgVisitCost}
                onChange={(e) => updateState({ avgVisitCost: Number(e.target.value) })}
                className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer accent-gold"
              />
              <div className="mt-2">
                <span className="text-gold font-semibold text-lg">{formatCurrency(state.avgVisitCost)}</span>
              </div>
            </div>

            <div>
              <label className="block text-white font-medium mb-4">
                Monthly spend on coffee, energy drinks, or supplements to compensate for poor sleep
              </label>
              <input
                type="range"
                min={0}
                max={300}
                step={5}
                value={state.caffeineMonthlyCost}
                onChange={(e) => updateState({ caffeineMonthlyCost: Number(e.target.value) })}
                className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer accent-gold"
              />
              <div className="flex justify-between mt-2">
                <span className="text-gold font-semibold text-lg">{formatCurrency(state.caffeineMonthlyCost)}/month</span>
              </div>
              <p className="text-gray-400 text-sm mt-1">
                That's {formatCurrency(state.caffeineMonthlyCost * 12)} per year spent treating a symptom, not the cause
              </p>
            </div>
          </div>
        )}

        {/* Navigation */}
        <div className="flex justify-between mt-8 pt-6 border-t border-border-subtle">
          <button
            onClick={() => setActiveTab(Math.max(1, activeTab - 1) as 1 | 2 | 3)}
            disabled={activeTab === 1}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-colors ${
              activeTab === 1 
                ? 'text-gray-600 cursor-not-allowed' 
                : 'text-white hover:bg-gray-700'
            }`}
          >
            <ChevronLeft className="w-4 h-4" />
            Previous
          </button>
          <button
            onClick={() => setActiveTab(Math.min(3, activeTab + 1) as 1 | 2 | 3)}
            disabled={activeTab === 3}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-colors ${
              activeTab === 3 
                ? 'text-gray-600 cursor-not-allowed' 
                : 'text-white hover:bg-gray-700'
            }`}
          >
            Next
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  )
}
