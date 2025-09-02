import { Radar, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, ResponsiveContainer, Tooltip } from 'recharts'

type Stat = { name: string; value: number }

export default function StatRadar({ stats }: { stats: Stat[] }) {
  return (
    <div className="w-full h-64">
      <ResponsiveContainer>
        <RadarChart data={stats}>
          <PolarGrid />
          <PolarAngleAxis dataKey="name" />
          <PolarRadiusAxis />
          <Radar dataKey="value" strokeWidth={2} fillOpacity={0.2} />
          <Tooltip />
        </RadarChart>
      </ResponsiveContainer>
    </div>
  )
}
