import { memo } from 'react';
import { motion } from 'framer-motion';
import { 
  AlertTriangle, 
  Radio, 
  CheckCircle2, 
  TrendingUp,
  Activity,
  Siren
} from 'lucide-react';
import { AreaChart, Area, XAxis, Tooltip, ResponsiveContainer } from 'recharts';
import { MetricCard, GlassCard } from '@/components/ui/custom';
import { SECTOR_DATA, MISSIONS, INTEGRITY_TRENDS } from '@/data/mockData';

export const OverviewTab = memo(function OverviewTab() {
  const kpis = [
    { label: 'Structural Failures', value: 142, unit: '', color: '#ef4444', icon: AlertTriangle, trend: 'up' as const, trendValue: '+12%' },
    { label: 'Mesh Connectivity', value: 94, unit: '%', color: '#0891b2', icon: Radio, trend: 'down' as const, trendValue: '-3%' },
    { label: 'Lives Secured', value: 2400, unit: '', color: '#16a34a', icon: CheckCircle2, trend: 'up' as const, trendValue: '+8%' },
    { label: 'Triage Coverage', value: 82, unit: '%', color: '#ca8a04', icon: TrendingUp, trend: 'neutral' as const, trendValue: '0%' },
  ];

  return (
    <motion.div 
      initial={{ opacity: 0 }} 
      animate={{ opacity: 1 }} 
      className="space-y-8 pb-20"
    >
      {/* KPI Row */}
      <div className="grid grid-cols-4 gap-6">
        {kpis.map((kpi) => (
          <MetricCard
            key={kpi.label}
            label={kpi.label}
            value={kpi.value}
            unit={kpi.unit}
            icon={kpi.icon}
            color={kpi.color}
            trend={kpi.trend}
            trendValue={kpi.trendValue}
          />
        ))}
      </div>

      {/* Analytics Grid */}
      <div className="grid grid-cols-12 gap-8">
        {/* Stability Chart */}
        <GlassCard title="City-Wide Stability Index" icon={Activity} className="col-span-8">
          <div className="h-72 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={INTEGRITY_TRENDS}>
                <defs>
                  <linearGradient id="colorValue" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#06b6d4" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#06b6d4" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <XAxis 
                  dataKey="time" 
                  stroke="#94a3b8" 
                  fontSize={10} 
                  axisLine={false} 
                  tickLine={false} 
                />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: '#0f172a', 
                    border: '1px solid #1e293b',
                    borderRadius: '8px',
                    fontSize: '12px'
                  }}
                />
                <Area 
                  type="monotone" 
                  dataKey="value" 
                  stroke="#06b6d4" 
                  fill="url(#colorValue)" 
                  strokeWidth={3} 
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </GlassCard>

        {/* Mission Progress */}
        <GlassCard title="Mission Progress" icon={Siren} className="col-span-4">
          <div className="space-y-6">
            {MISSIONS.slice(0, 3).map((mission, i) => (
              <div key={mission.id} className="space-y-2">
                <div className="flex justify-between text-[10px] font-black uppercase tracking-tighter">
                  <span className="text-slate-500">{mission.task}</span>
                  <span className="text-cyan-600">{mission.progress}%</span>
                </div>
                <div className="h-2 w-full bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                  <motion.div 
                    initial={{ width: 0 }}
                    animate={{ width: `${mission.progress}%` }}
                    transition={{ duration: 1, delay: i * 0.2 }}
                    className={`h-full rounded-full ${
                      mission.priority === 'Critical' ? 'bg-red-500' :
                      mission.priority === 'High' ? 'bg-yellow-500' : 'bg-cyan-500'
                    }`}
                  />
                </div>
                <div className="flex justify-between text-[9px] text-slate-400">
                  <span>{mission.assignedTeam}</span>
                  <span>ETA: {mission.eta}</span>
                </div>
              </div>
            ))}
          </div>
          <button className="w-full mt-6 py-3 bg-slate-900 text-white rounded-xl text-[9px] font-black uppercase tracking-widest hover:bg-slate-800 transition-colors">
            Full Ops Log
          </button>
        </GlassCard>
      </div>

      {/* Regional Stats */}
      <div className="grid grid-cols-3 gap-8">
        {SECTOR_DATA.slice(0, 6).map((sector, i) => (
          <motion.div
            key={sector.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
            className="p-4 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 border-b-4"
            style={{ borderBottomColor: sector.color }}
          >
            <p className="text-[8px] font-black text-slate-400 uppercase tracking-[0.3em]">{sector.id}</p>
            <h4 className="text-sm font-black text-slate-700 dark:text-slate-300 uppercase tracking-tighter mb-4">
              {sector.label}
            </h4>
            <div className="flex justify-between items-end">
              <div>
                <p className="text-[8px] font-bold text-slate-400 uppercase">Risk</p>
                <p className="text-xl font-mono font-black" style={{ color: sector.color }}>
                  {sector.risk}%
                </p>
              </div>
              <div className="text-right">
                <p className="text-[8px] font-bold text-slate-400 uppercase">Nodes</p>
                <p className="text-xs font-mono font-bold text-slate-700 dark:text-slate-300">
                  {sector.nodes}
                </p>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
});

export default OverviewTab;
