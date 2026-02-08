import { memo, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Building2, Users, Activity, ChevronDown } from 'lucide-react';
import { GlassCard, StatusBadge } from '@/components/ui/custom';
import { BUILDING_PROFILES } from '@/data/mockData';

interface FloorBarProps {
  floor: number;
  integrity: number;
  status: string;
  occupantCount: number;
}

const FloorBar = memo<FloorBarProps>(function FloorBar({
  floor,
  integrity,
  status,
  occupantCount,
}) {
  const getColor = (integrity: number) => {
    if (integrity < 30) return 'bg-red-500';
    if (integrity < 60) return 'bg-yellow-500';
    return 'bg-green-500';
  };

  const getGlow = (integrity: number) => {
    if (integrity < 30) return 'shadow-red-500/50';
    if (integrity < 60) return 'shadow-yellow-500/50';
    return 'shadow-green-500/50';
  };

  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: (12 - floor) * 0.05 }}
      className="flex items-center gap-3 py-1"
    >
      <span className="text-[10px] font-mono text-slate-500 w-8 text-right">
        F{floor.toString().padStart(2, '0')}
      </span>
      
      <div className="flex-1 h-6 bg-slate-800 rounded-full overflow-hidden relative">
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: `${integrity}%` }}
          transition={{ duration: 1, delay: 0.2 }}
          className={`h-full ${getColor(integrity)} rounded-full relative`}
        >
          {integrity < 40 && (
            <motion.div
              animate={{ opacity: [0.5, 1, 0.5] }}
              transition={{ repeat: Infinity, duration: 0.8 }}
              className={`absolute inset-0 ${getColor(integrity)} rounded-full ${getGlow(integrity)}`}
            />
          )}
        </motion.div>
        
        {/* Barometer reading */}
        <span className="absolute right-2 top-1/2 -translate-y-1/2 text-[8px] font-mono text-slate-400">
          {1010 + (12 - floor) * 0.3}hPa
        </span>
      </div>

      <div className="flex items-center gap-2 w-20">
        <Users size={12} className="text-slate-500" />
        <span className={`text-[10px] font-mono ${occupantCount > 0 ? 'text-cyan-400' : 'text-slate-600'}`}>
          {occupantCount}
        </span>
      </div>

      <StatusBadge 
        status={status as any} 
        size="sm" 
        pulse={status === 'DANGER' || status === 'COLLAPSED'} 
      />
    </motion.div>
  );
});

export const VerticalTriageMatrix = memo(function VerticalTriageMatrix() {
  const [selectedBuilding, setSelectedBuilding] = useState(BUILDING_PROFILES[0]);
  const [isExpanded, setIsExpanded] = useState(true);

  return (
    <GlassCard title="Vertical Triage Matrix" icon={Building2} className="col-span-6">
      <div className="space-y-4">
        {/* Building Selector */}
        <div className="flex gap-2">
          {BUILDING_PROFILES.map(building => (
            <button
              key={building.id}
              onClick={() => setSelectedBuilding(building)}
              className={`px-3 py-2 rounded-xl text-[10px] font-bold uppercase tracking-wider transition-all ${
                selectedBuilding.id === building.id
                  ? 'bg-cyan-600 text-white'
                  : 'bg-slate-100 dark:bg-slate-800 text-slate-500 hover:bg-slate-200 dark:hover:bg-slate-700'
              }`}
            >
              {building.name}
            </button>
          ))}
        </div>

        {/* Building Info */}
        <div className="flex items-center justify-between p-3 bg-slate-50 dark:bg-slate-800/50 rounded-xl">
          <div>
            <p className="text-xs font-black text-slate-800 dark:text-white uppercase">
              {selectedBuilding.name}
            </p>
            <p className="text-[9px] text-slate-500">
              {selectedBuilding.totalFloors} Floors • Barometer-Based Analysis
            </p>
          </div>
          <StatusBadge 
            status={selectedBuilding.overallStatus as any} 
            size="md" 
            pulse={selectedBuilding.overallStatus === 'DANGER'} 
          />
        </div>

        {/* Floor Visualization */}
        <div className="relative">
          <button
            onClick={() => setIsExpanded(!isExpanded)}
            className="flex items-center gap-2 text-[10px] font-bold text-cyan-600 uppercase tracking-wider mb-2"
          >
            <Activity size={14} />
            Floor Integrity Profile
            <ChevronDown 
              size={14} 
              className={`transition-transform ${isExpanded ? '' : '-rotate-90'}`} 
            />
          </button>

          <AnimatePresence>
            {isExpanded && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: 'auto', opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                className="space-y-1 overflow-hidden"
              >
                {[...selectedBuilding.floors].reverse().map((floor) => (
                  <FloorBar
                    key={floor.floor}
                    floor={floor.floor}
                    integrity={floor.integrity}
                    status={floor.status}
                    occupantCount={floor.occupantCount || 0}
                  />
                ))}
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Legend */}
        <div className="flex gap-4 text-[9px] font-mono text-slate-500 pt-2 border-t border-slate-200 dark:border-white/5">
          <span className="flex items-center gap-1">
            <span className="w-3 h-3 rounded bg-green-500" />
            Safe (&gt;60%)
          </span>
          <span className="flex items-center gap-1">
            <span className="w-3 h-3 rounded bg-yellow-500" />
            Caution (30-60%)
          </span>
          <span className="flex items-center gap-1">
            <span className="w-3 h-3 rounded bg-red-500" />
            Danger (&lt;30%)
          </span>
        </div>
      </div>
    </GlassCard>
  );
});

export default VerticalTriageMatrix;
