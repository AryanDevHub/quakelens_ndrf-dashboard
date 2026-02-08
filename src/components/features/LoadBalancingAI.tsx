import { memo, useMemo } from 'react';
import { motion } from 'framer-motion';
import { Users, UserCheck, TrendingUp, AlertCircle, Target } from 'lucide-react';
import { GlassCard, StatusBadge } from '@/components/ui/custom';
import { RESOURCE_ALLOCATIONS, VICTIM_CLUSTERS } from '@/data/mockData';

export const LoadBalancingAI = memo(function LoadBalancingAI() {
  // Calculate overall statistics
  const stats = useMemo(() => {
    const totalVictims = RESOURCE_ALLOCATIONS.reduce((sum, r) => sum + r.victims, 0);
    const totalRescuers = RESOURCE_ALLOCATIONS.reduce((sum, r) => sum + r.rescuers, 0);
    const avgRatio = totalVictims / (totalRescuers || 1);
    const criticalSectors = RESOURCE_ALLOCATIONS.filter(r => r.priority === 'CRITICAL').length;
    
    return { totalVictims, totalRescuers, avgRatio, criticalSectors };
  }, []);

  // Sort by priority
  const sortedAllocations = useMemo(() => {
    const priorityOrder = { CRITICAL: 0, HIGH: 1, MEDIUM: 2, LOW: 3 };
    return [...RESOURCE_ALLOCATIONS].sort((a, b) => 
      priorityOrder[a.priority] - priorityOrder[b.priority]
    );
  }, []);

  return (
    <GlassCard title="Human Load-Balancing AI" icon={Target} className="col-span-12">
      <div className="space-y-6">
        {/* KPI Row */}
        <div className="grid grid-cols-4 gap-4">
          <div className="p-4 bg-slate-50 dark:bg-slate-800/50 rounded-2xl">
            <div className="flex items-center gap-2 mb-2">
              <Users size={16} className="text-red-500" />
              <span className="text-[9px] font-bold text-slate-500 uppercase tracking-wider">Est. Victims</span>
            </div>
            <p className="text-3xl font-black text-red-500">{stats.totalVictims}</p>
            <p className="text-[9px] text-slate-400 mt-1">
              Across {VICTIM_CLUSTERS.length} detected clusters
            </p>
          </div>

          <div className="p-4 bg-slate-50 dark:bg-slate-800/50 rounded-2xl">
            <div className="flex items-center gap-2 mb-2">
              <UserCheck size={16} className="text-cyan-600" />
              <span className="text-[9px] font-bold text-slate-500 uppercase tracking-wider">Active Rescuers</span>
            </div>
            <p className="text-3xl font-black text-cyan-600">{stats.totalRescuers}</p>
            <p className="text-[9px] text-slate-400 mt-1">
              NDRF + Local Teams
            </p>
          </div>

          <div className="p-4 bg-slate-50 dark:bg-slate-800/50 rounded-2xl">
            <div className="flex items-center gap-2 mb-2">
              <TrendingUp size={16} className="text-yellow-500" />
              <span className="text-[9px] font-bold text-slate-500 uppercase tracking-wider">V:R Ratio</span>
            </div>
            <p className={`text-3xl font-black ${stats.avgRatio > 10 ? 'text-red-500' : stats.avgRatio > 5 ? 'text-yellow-500' : 'text-green-500'}`}>
              {stats.avgRatio.toFixed(1)}:1
            </p>
            <p className="text-[9px] text-slate-400 mt-1">
              Target: 5:1
            </p>
          </div>

          <div className="p-4 bg-slate-50 dark:bg-slate-800/50 rounded-2xl">
            <div className="flex items-center gap-2 mb-2">
              <AlertCircle size={16} className="text-red-500" />
              <span className="text-[9px] font-bold text-slate-500 uppercase tracking-wider">Critical Sectors</span>
            </div>
            <p className="text-3xl font-black text-red-500">{stats.criticalSectors}</p>
            <p className="text-[9px] text-slate-400 mt-1">
              Need immediate reinforcement
            </p>
          </div>
        </div>

        {/* Allocation Table */}
        <div className="overflow-hidden rounded-2xl border border-slate-200 dark:border-slate-700">
          <table className="w-full">
            <thead>
              <tr className="bg-slate-100 dark:bg-slate-800">
                <th className="px-4 py-3 text-left text-[9px] font-black text-slate-500 uppercase tracking-wider">Sector</th>
                <th className="px-4 py-3 text-center text-[9px] font-black text-slate-500 uppercase tracking-wider">Victims</th>
                <th className="px-4 py-3 text-center text-[9px] font-black text-slate-500 uppercase tracking-wider">Rescuers</th>
                <th className="px-4 py-3 text-center text-[9px] font-black text-slate-500 uppercase tracking-wider">Ratio</th>
                <th className="px-4 py-3 text-center text-[9px] font-black text-slate-500 uppercase tracking-wider">Priority</th>
                <th className="px-4 py-3 text-right text-[9px] font-black text-slate-500 uppercase tracking-wider">AI Recommendation</th>
              </tr>
            </thead>
            <tbody>
              {sortedAllocations.map((alloc, i) => (
                <motion.tr
                  key={alloc.sectorId}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.05 }}
                  className={`border-t border-slate-200 dark:border-slate-700 ${
                    alloc.priority === 'CRITICAL' ? 'bg-red-50/50 dark:bg-red-950/10' : ''
                  }`}
                >
                  <td className="px-4 py-3">
                    <span className="text-xs font-bold text-slate-700 dark:text-slate-300">
                      {alloc.sectorId}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-center">
                    <span className="text-sm font-mono font-black text-red-500">
                      {alloc.victims}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-center">
                    <span className="text-sm font-mono font-black text-cyan-600">
                      {alloc.rescuers}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-center">
                    <span className={`text-sm font-mono font-black ${
                      alloc.ratio > 10 ? 'text-red-500' :
                      alloc.ratio > 5 ? 'text-yellow-500' : 'text-green-500'
                    }`}>
                      {alloc.ratio}:1
                    </span>
                  </td>
                  <td className="px-4 py-3 text-center">
                    <StatusBadge status={alloc.priority} size="sm" pulse={alloc.priority === 'CRITICAL'} />
                  </td>
                  <td className="px-4 py-3 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <span className="text-[9px] text-slate-500">
                        Deploy +{alloc.recommendedRescuers - alloc.rescuers}
                      </span>
                      {alloc.priority === 'CRITICAL' && (
                        <motion.div
                          animate={{ scale: [1, 1.2, 1] }}
                          transition={{ repeat: Infinity, duration: 1 }}
                          className="w-2 h-2 rounded-full bg-red-500"
                        />
                      )}
                    </div>
                  </td>
                </motion.tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* AI Insights */}
        <div className="p-4 bg-cyan-50 dark:bg-cyan-950/20 rounded-2xl border border-cyan-200 dark:border-cyan-900/30">
          <p className="text-[10px] font-bold text-cyan-600 uppercase tracking-wider mb-2 flex items-center gap-2">
            <Target size={14} />
            AI Optimization Insights
          </p>
          <ul className="space-y-2 text-[10px] text-slate-600 dark:text-slate-400">
            <li className="flex items-start gap-2">
              <span className="text-cyan-600">→</span>
              Sector S-07 (Connaught Place) requires immediate reinforcement: Current ratio {sortedAllocations.find(a => a.sectorId === 'S-07')?.ratio}:1 exceeds safe threshold.
            </li>
            <li className="flex items-start gap-2">
              <span className="text-cyan-600">→</span>
              Recommend redirecting 3 teams from S-02 (East Residential) to S-07 - S-02 has sufficient coverage with ratio {sortedAllocations.find(a => a.sectorId === 'S-02')?.ratio}:1.
            </li>
            <li className="flex items-start gap-2">
              <span className="text-cyan-600">→</span>
              Estimated time to optimal distribution: 18 minutes with current resource deployment rate.
            </li>
          </ul>
        </div>
      </div>
    </GlassCard>
  );
});

export default LoadBalancingAI;
