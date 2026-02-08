import { memo, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Cpu, 
  ChevronRight, 
  Users, 
  Clock,
  AlertCircle,
  Play,
  Pause,
  RotateCcw
} from 'lucide-react';
import { GlassCard, StatusBadge } from '@/components/ui/custom';
import { MISSIONS } from '@/data/mockData';

interface MissionCardProps {
  mission: typeof MISSIONS[0];
  index: number;
  isSelected: boolean;
  onClick: () => void;
}

const MissionCard = memo<MissionCardProps>(function MissionCard({
  mission,
  index,
  isSelected,
  onClick,
}) {
  const [isPlaying, setIsPlaying] = useState(false);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.1 }}
      onClick={onClick}
      className={`p-6 bg-white dark:bg-slate-900 rounded-3xl border transition-all cursor-pointer group ${
        isSelected 
          ? 'border-cyan-500 shadow-lg shadow-cyan-500/10' 
          : 'border-slate-200 dark:border-slate-800 hover:border-cyan-500/30'
      }`}
    >
      <div className="flex justify-between items-start mb-4">
        <div>
          <StatusBadge 
            status={mission.priority as any} 
            size="sm" 
            pulse={mission.priority === 'Critical'} 
          />
          <h4 className="text-slate-800 dark:text-white text-lg font-black uppercase mt-2 italic tracking-tight">
            {mission.task}
          </h4>
        </div>
        <ChevronRight 
          size={24} 
          className={`transition-all ${isSelected ? 'text-cyan-600 rotate-90' : 'text-slate-300 group-hover:text-cyan-600'}`} 
        />
      </div>

      {/* Progress Bar */}
      <div className="h-3 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden mb-4">
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: `${mission.progress}%` }}
          transition={{ duration: 1, delay: index * 0.2 }}
          className={`h-full rounded-full ${
            mission.priority === 'Critical' ? 'bg-red-500' :
            mission.priority === 'High' ? 'bg-yellow-500' : 'bg-cyan-500'
          }`}
        />
      </div>

      <div className="flex justify-between items-center text-[10px] text-slate-500">
        <div className="flex items-center gap-4">
          <span className="flex items-center gap-1">
            <Users size={12} />
            {mission.assignedTeam}
          </span>
          <span className="flex items-center gap-1">
            <Clock size={12} />
            ETA: {mission.eta}
          </span>
        </div>
        <span className="font-mono font-black text-cyan-600">{mission.progress}%</span>
      </div>

      {/* Expanded Controls */}
      <AnimatePresence>
        {isSelected && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="mt-4 pt-4 border-t border-slate-200 dark:border-slate-700"
          >
            <div className="flex gap-2">
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setIsPlaying(!isPlaying);
                }}
                className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-cyan-600 text-white rounded-xl text-[10px] font-bold uppercase tracking-wider hover:bg-cyan-500 transition-colors"
              >
                {isPlaying ? <Pause size={14} /> : <Play size={14} />}
                {isPlaying ? 'Pause' : 'Resume'}
              </button>
              <button
                onClick={(e) => e.stopPropagation()}
                className="px-4 py-2 bg-slate-100 dark:bg-slate-800 text-slate-600 rounded-xl text-[10px] font-bold uppercase tracking-wider hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors"
              >
                <RotateCcw size={14} />
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
});

export const OperationsTab = memo(function OperationsTab() {
  const [selectedMission, setSelectedMission] = useState<string | null>(null);

  return (
    <motion.div 
      initial={{ opacity: 0 }} 
      animate={{ opacity: 1 }} 
      className="space-y-6 pb-20"
    >
      {/* Mission Stats */}
      <div className="grid grid-cols-4 gap-4">
        <div className="p-4 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800">
          <p className="text-3xl font-black text-cyan-600">{MISSIONS.length}</p>
          <p className="text-[9px] text-slate-500 uppercase tracking-wider">Active Missions</p>
        </div>
        <div className="p-4 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800">
          <p className="text-3xl font-black text-red-500">
            {MISSIONS.filter(m => m.priority === 'Critical').length}
          </p>
          <p className="text-[9px] text-slate-500 uppercase tracking-wider">Critical</p>
        </div>
        <div className="p-4 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800">
          <p className="text-3xl font-black text-yellow-500">
            {MISSIONS.filter(m => m.priority === 'High').length}
          </p>
          <p className="text-[9px] text-slate-500 uppercase tracking-wider">High Priority</p>
        </div>
        <div className="p-4 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800">
          <p className="text-3xl font-black text-green-500">
            {MISSIONS.filter(m => m.progress === 100).length}
          </p>
          <p className="text-[9px] text-slate-500 uppercase tracking-wider">Completed</p>
        </div>
      </div>

      {/* Mission List */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-[10px] font-black text-slate-500 uppercase tracking-[0.3em]">
            Active Operations
          </h3>
          <button className="px-4 py-2 bg-cyan-600 text-white rounded-xl text-[10px] font-bold uppercase tracking-wider hover:bg-cyan-500 transition-colors">
            + New Mission
          </button>
        </div>

        {MISSIONS.map((mission, i) => (
          <MissionCard
            key={mission.id}
            mission={mission}
            index={i}
            isSelected={selectedMission === mission.id}
            onClick={() => setSelectedMission(
              selectedMission === mission.id ? null : mission.id
            )}
          />
        ))}
      </div>

      {/* AI Recommendations */}
      <GlassCard title="AI Mission Optimization" icon={Cpu}>
        <div className="space-y-3">
          <div className="flex items-start gap-3 p-3 bg-cyan-50 dark:bg-cyan-950/20 rounded-xl">
            <AlertCircle size={16} className="text-cyan-600 flex-shrink-0 mt-0.5" />
            <div>
              <p className="text-xs font-bold text-cyan-600">Resource Reallocation Suggested</p>
              <p className="text-[10px] text-slate-600 dark:text-slate-400 mt-1">
                Mission M-001 is 65% complete. Recommend transferring 2 units to M-004 
                for optimal resource utilization.
              </p>
            </div>
          </div>
          <div className="flex items-start gap-3 p-3 bg-yellow-50 dark:bg-yellow-950/20 rounded-xl">
            <Clock size={16} className="text-yellow-600 flex-shrink-0 mt-0.5" />
            <div>
              <p className="text-xs font-bold text-yellow-600">ETA Alert</p>
              <p className="text-[10px] text-slate-600 dark:text-slate-400 mt-1">
                Mission M-002 is behind schedule. Estimated delay: 15 minutes.
              </p>
            </div>
          </div>
        </div>
      </GlassCard>
    </motion.div>
  );
});

export default OperationsTab;
