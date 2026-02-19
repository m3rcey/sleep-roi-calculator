import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, 
  LineChart, Line, Legend, ReferenceLine 
} from 'recharts'
import { formatCurrency } from '../utils/format'

interface CalculationResults {
  productivityCost: number
  healthcareCost: number
  stimulantCost: number
  careerCost: number
  cognitiveDeclineCost: number
  totalAnnualCost: number
  chartCostBreakdown: { name: string; value: number; color: string }[]
  chartTimelineData: { year: number; doNothing: number; afterUpgrade: number }[]
}

interface ChartsProps {
  calculations: CalculationResults
}

export function Charts({ calculations }: ChartsProps) {
  const { chartCostBreakdown, chartTimelineData } = calculations

  // Find break-even year
  const breakEvenYear = chartTimelineData.find(
    (d, i) => d.afterUpgrade <= d.doNothing && (i === 0 || chartTimelineData[i - 1].afterUpgrade > chartTimelineData[i - 1].doNothing)
  )?.year

  const CustomTooltip = ({ active, payload, label }: { active?: boolean; payload?: { value: number }[]; label?: string }) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-card-bg border border-border-subtle p-3 rounded-lg">
          <p className="text-gray-400 text-sm">{label}</p>
          {payload.map((entry, index) => (
            <p key={index} className="text-white font-medium">
              {formatCurrency(entry.value)}
            </p>
          ))}
        </div>
      )
    }
    return null
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-12 space-y-12">
      {/* Bar Chart */}
      <div className="bg-card-bg rounded-2xl border border-border-subtle p-6">
        <h3 className="text-xl font-bold text-white mb-6">
          Your Annual Sleep Tax by Category
        </h3>
        <div className="overflow-x-auto">
          <ResponsiveContainer width="100%" height={320}>
            <BarChart data={chartCostBreakdown} layout="vertical" margin={{ left: 80 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
              <XAxis 
                type="number" 
                tickFormatter={(value) => `$${(value / 1000).toFixed(0)}k`}
                stroke="#94a3b8"
              />
              <YAxis 
                type="category" 
                dataKey="name" 
                stroke="#94a3b8"
                width={80}
              />
              <Tooltip content={<CustomTooltip />} />
              <Bar 
                dataKey="value" 
                radius={[0, 4, 4, 0]}
                fill="#ef4444"
              />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Line Chart */}
      <div className="bg-card-bg rounded-2xl border border-border-subtle p-6">
        <h3 className="text-xl font-bold text-white mb-6">
          Cost of Doing Nothing vs. Investing in Better Sleep
        </h3>
        <div className="overflow-x-auto">
          <ResponsiveContainer width="100%" height={320}>
            <LineChart data={chartTimelineData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
              <XAxis 
                dataKey="year" 
                stroke="#94a3b8"
                tickFormatter={(value) => `Year ${value}`}
              />
              <YAxis 
                tickFormatter={(value) => `$${(value / 1000).toFixed(0)}k`}
                stroke="#94a3b8"
              />
              <Tooltip content={<CustomTooltip />} />
              <Legend 
                wrapperStyle={{ paddingTop: '20px' }}
                formatter={(value) => (
                  <span className="text-gray-300">
                    {value === 'doNothing' ? 'Cost of No Change' : 'After Sleep Upgrade'}
                  </span>
                )}
              />
              <Line 
                type="monotone" 
                dataKey="doNothing" 
                stroke="#ef4444" 
                strokeWidth={2}
                dot={false}
                name="doNothing"
              />
              <Line 
                type="monotone" 
                dataKey="afterUpgrade" 
                stroke="#22c55e" 
                strokeWidth={2}
                dot={false}
                name="afterUpgrade"
              />
              {breakEvenYear && (
                <ReferenceLine 
                  x={breakEvenYear} 
                  stroke="#f59e0b" 
                  strokeDasharray="5 5"
                  label={{ 
                    value: 'Break-Even', 
                    fill: '#f59e0b',
                    position: 'insideTopRight'
                  }} 
                />
              )}
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  )
}
