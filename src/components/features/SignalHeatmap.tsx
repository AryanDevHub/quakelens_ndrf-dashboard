import { memo, useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import { Radio, AlertTriangle, Navigation } from 'lucide-react';
import { GlassCard } from '@/components/ui/custom';
import { SIGNAL_NODES, SECTOR_DATA } from '@/data/mockData';

interface SignalHeatmapProps {
  onUAVRedirect?: (sector: string) => void;
}

export const SignalHeatmap = memo<SignalHeatmapProps>(function SignalHeatmap({
  onUAVRedirect,
}) {
  const [showGaps, setShowGaps] = useState(true);

  // Calculate signal coverage per sector
  const sectorCoverage = useMemo(() => {
    return SECTOR_DATA.map(sector => {
      const nodesInSector = SIGNAL_NODES.filter(node => {
        const dist = Math.sqrt(
          Math.pow(node.position[0] - sector.pos[0], 2) +
          Math.pow(node.position[1] - sector.pos[1], 2)
        );
        return dist < 0.008;
      });

      const avgSignal = nodesInSector.length > 0
        ? nodesInSector.reduce((sum, n) => sum + n.signalStrength, 0) / nodesInSector.length
        : 0;

      const connectedNodes = nodesInSector.filter(n => n.connected).length;
      const coverage = nodesInSector.length > 0
        ? (connectedNodes / nodesInSector.length) * 100
        : 0;

      return {
        ...sector,
        nodeCount: nodesInSector.length,
        avgSignal: Math.round(avgSignal),
        coverage: Math.round(coverage),
        hasGap: coverage < 70 || avgSignal < 50,
      };
    });
  }, []);

  // Find communication gaps
  const gaps = useMemo(() => {
    return sectorCoverage
      .filter(s => s.hasGap)
      .map(s => ({
        sectorId: s.id,
        sectorName: s.label,
        coverage: s.coverage,
        avgSignal: s.avgSignal,
        recommendedAction: s.coverage < 50 
          ? 'Deploy UAV Gateway immediately'
          : 'Strengthen mesh relay',
      }));
  }, [sectorCoverage]);

  return (
    <GlassCard title="Signal Digital Dark Heatmap" icon={Radio} className="col-span-6">
      <div className="space-y-4">
        {/* Coverage Overview */}
        <div className="grid grid-cols-3 gap-3">
          <div className="p-3 bg-slate-50 dark:bg-slate-800/50 rounded-xl text-center">
            <p className="text-2xl font-black text-cyan-600">
              {Math.round(sectorCoverage.reduce((sum, s) => sum + s.coverage, 0) / sectorCoverage.length)}%
            </p>
            <p className="text-[9px] text-slate-500 uppercase tracking-wider">Avg Coverage</p>
          </div>
          <div className="p-3 bg-slate-50 dark:bg-slate-800/50 rounded-xl text-center">
            <p className="text-2xl font-black text-green-600">
              {SIGNAL_NODES.filter(n => n.connected).length}
            </p>
            <p className="text-[9px] text-slate-500 uppercase tracking-wider">Online Nodes</p>
          </div>
          <div className="p-3 bg-slate-50 dark:bg-slate-800/50 rounded-xl text-center">
            <p className="text-2xl font-black text-red-500">
              {gaps.length}
            </p>
            <p className="text-[9px] text-slate-500 uppercase tracking-wider">Dead Zones</p>
          </div>
        </div>

        {/* Gap Toggle */}
        <button
          onClick={() => setShowGaps(!showGaps)}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-[10px] font-bold uppercase tracking-wider transition-all ${
            showGaps
              ? 'bg-yellow-500/20 text-yellow-600 border border-yellow-500/30'
              : 'bg-slate-100 dark:bg-slate-800 text-slate-500'
          }`}
        >
          <AlertTriangle size={14} />
          {showGaps ? 'Hide' : 'Show'} Communication Gaps
        </button>

        {/* Sector Coverage Grid */}
        <div className="grid grid-cols-2 gap-3">
          {sectorCoverage.map(sector => (
            <motion.div
              key={sector.id}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className={`p-3 rounded-xl border transition-all ${
                sector.hasGap && showGaps
                  ? 'bg-red-50 dark:bg-red-950/20 border-red-200 dark:border-red-900/30'
                  : 'bg-slate-50 dark:bg-slate-800/50 border-slate-200 dark:border-slate-700'
              }`}
            >
              <div className="flex items-center justify-between mb-2">
                <span className="text-[10px] font-bold text-slate-700 dark:text-slate-300 uppercase">
                  {sector.label}
                </span>
                {sector.hasGap && showGaps && (
                  <motion.div
                    animate={{ opacity: [0.5, 1, 0.5] }}
                    transition={{ repeat: Infinity, duration: 1 }}
                  >
                    <AlertTriangle size={14} className="text-red-500" />
                  </motion.div>
                )}
              </div>

              {/* Coverage Bar */}
              <div className="h-2 bg-slate-200 dark:bg-slate-700 rounded-full overflow-hidden mb-2">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${sector.coverage}%` }}
                  transition={{ duration: 0.8 }}
                  className={`h-full rounded-full ${
                    sector.coverage > 80 ? 'bg-green-500' :
                    sector.coverage > 50 ? 'bg-yellow-500' : 'bg-red-500'
                  }`}
                />
              </div>

              <div className="flex justify-between text-[9px] font-mono text-slate-500">
                <span>Coverage: {sector.coverage}%</span>
                <span>Signal: {sector.avgSignal}%</span>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Gap Alerts */}
        {showGaps && gaps.length > 0 && (
          <div className="space-y-2">
            <p className="text-[10px] font-bold text-red-500 uppercase tracking-wider flex items-center gap-2">
              <Navigation size={12} />
              Recommended UAV Redirects
            </p>
            {gaps.map((gap, i) => (
              <motion.div
                key={gap.sectorId}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.1 }}
                className="p-3 bg-red-50 dark:bg-red-950/20 rounded-xl border border-red-200 dark:border-red-900/30"
              >
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-[10px] font-bold text-red-600 uppercase">
                      {gap.sectorName}
                    </p>
                    <p className="text-[9px] text-slate-500">
                      Coverage: {gap.coverage}% • Signal: {gap.avgSignal}%
                    </p>
                  </div>
                  <button
                    onClick={() => onUAVRedirect?.(gap.sectorId)}
                    className="px-3 py-1.5 bg-red-600 text-white rounded-lg text-[9px] font-bold uppercase tracking-wider hover:bg-red-500 transition-colors"
                  >
                    Deploy UAV
                  </button>
                </div>
                <p className="text-[9px] text-red-500 mt-1 italic">
                  AI Suggestion: {gap.recommendedAction}
                </p>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </GlassCard>
  );
});

export default SignalHeatmap;
