import { memo, useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Activity, AlertTriangle, Building2 } from 'lucide-react';
import { GlassCard, StatusBadge } from '@/components/ui/custom';
import { BUILDING_VULNERABILITIES } from '@/data/mockData';

type ScenarioType = 'M5' | 'M6' | 'M7';

interface AftershockSimulatorProps {
  onRunSimulation?: (scenario: ScenarioType) => void;
}

export const AftershockSimulator = memo<AftershockSimulatorProps>(function AftershockSimulator({
  onRunSimulation,
}) {
  const [activeScenario, setActiveScenario] = useState<ScenarioType | null>(null);
  const [isSimulating, setIsSimulating] = useState(false);

  const scenarios = {
    M5: { label: 'Magnitude 5.0', probability: '45%', color: 'text-yellow-500' },
    M6: { label: 'Magnitude 6.0', probability: '18%', color: 'text-orange-500' },
    M7: { label: 'Magnitude 7.0', probability: '5%', color: 'text-red-500' },
  };

  const runSimulation = (scenario: ScenarioType) => {
    setIsSimulating(true);
    setActiveScenario(scenario);
    onRunSimulation?.(scenario);
    
    setTimeout(() => {
      setIsSimulating(false);
    }, 2000);
  };

  // Calculate impact summary
  const impactSummary = useMemo(() => {
    if (!activeScenario) return null;

    const field = activeScenario === 'M5' ? 'aftershockM5' :
                  activeScenario === 'M6' ? 'aftershockM6' : 'aftershockM6';

    const atRisk = BUILDING_VULNERABILITIES.filter(b => 
      b[field as keyof typeof b] === 'COLLAPSE_RISK'
    );
    const likelyDamage = BUILDING_VULNERABILITIES.filter(b =>
      b[field as keyof typeof b] === 'LIKELY_DAMAGE'
    );
    const safe = BUILDING_VULNERABILITIES.filter(b =>
      b[field as keyof typeof b] === 'SAFE'
    );

    return { atRisk, likelyDamage, safe };
  }, [activeScenario]);

  return (
    <GlassCard title="Predictive Aftershock Simulator" icon={Activity} className="col-span-6">
      <div className="space-y-4">
        {/* Scenario Selector */}
        <div className="grid grid-cols-3 gap-3">
          {(Object.keys(scenarios) as ScenarioType[]).map((scenario) => {
            const config = scenarios[scenario];
            return (
              <button
                key={scenario}
                onClick={() => runSimulation(scenario)}
                disabled={isSimulating}
                className={`p-4 rounded-xl border transition-all ${
                  activeScenario === scenario
                    ? 'bg-cyan-600 border-cyan-600 text-white'
                    : 'bg-slate-50 dark:bg-slate-800 border-slate-200 dark:border-slate-700 hover:border-cyan-500/30'
                }`}
              >
                <p className={`text-xs font-black uppercase tracking-wider ${
                  activeScenario === scenario ? 'text-white' : config.color
                }`}>
                  {config.label}
                </p>
                <p className={`text-[9px] mt-1 ${
                  activeScenario === scenario ? 'text-white/70' : 'text-slate-500'
                }`}>
                  Prob: {config.probability}
                </p>
              </button>
            );
          })}
        </div>

        {/* Simulation Status */}
        <AnimatePresence>
          {isSimulating && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="p-4 bg-cyan-50 dark:bg-cyan-950/20 rounded-xl border border-cyan-200 dark:border-cyan-900/30"
            >
              <div className="flex items-center gap-3">
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ repeat: Infinity, duration: 1, ease: 'linear' }}
                >
                  <Activity size={20} className="text-cyan-600" />
                </motion.div>
                <div>
                  <p className="text-xs font-bold text-cyan-600 uppercase">
                    Running Seismic Stress Simulation...
                  </p>
                  <p className="text-[9px] text-slate-500">
                    Analyzing structural vulnerabilities for {scenarios[activeScenario!].label} scenario
                  </p>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Impact Results */}
        <AnimatePresence>
          {impactSummary && !isSimulating && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="space-y-4"
            >
              {/* Summary Stats */}
              <div className="grid grid-cols-3 gap-3">
                <div className="p-3 bg-red-50 dark:bg-red-950/20 rounded-xl text-center border border-red-200 dark:border-red-900/30">
                  <p className="text-2xl font-black text-red-500">{impactSummary.atRisk.length}</p>
                  <p className="text-[9px] text-slate-500 uppercase tracking-wider">Collapse Risk</p>
                </div>
                <div className="p-3 bg-yellow-50 dark:bg-yellow-950/20 rounded-xl text-center border border-yellow-200 dark:border-yellow-900/30">
                  <p className="text-2xl font-black text-yellow-500">{impactSummary.likelyDamage.length}</p>
                  <p className="text-[9px] text-slate-500 uppercase tracking-wider">Likely Damage</p>
                </div>
                <div className="p-3 bg-green-50 dark:bg-green-950/20 rounded-xl text-center border border-green-200 dark:border-green-900/30">
                  <p className="text-2xl font-black text-green-500">{impactSummary.safe.length}</p>
                  <p className="text-[9px] text-slate-500 uppercase tracking-wider">Expected Safe</p>
                </div>
              </div>

              {/* Building List */}
              <div className="space-y-2 max-h-48 overflow-y-auto scrollbar-hide">
                <p className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">
                  Building Impact Analysis
                </p>
                {BUILDING_VULNERABILITIES.map((building, i) => {
                  const field = activeScenario === 'M5' ? 'aftershockM5' :
                               activeScenario === 'M6' ? 'aftershockM6' : 'aftershockM6';
                  const impact = building[field as keyof typeof building] as string;
                  
                  return (
                    <motion.div
                      key={building.buildingId}
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: i * 0.05 }}
                      className={`flex items-center justify-between p-3 rounded-xl border ${
                        impact === 'COLLAPSE_RISK'
                          ? 'bg-red-50 dark:bg-red-950/20 border-red-200 dark:border-red-900/30'
                          : impact === 'LIKELY_DAMAGE'
                          ? 'bg-yellow-50 dark:bg-yellow-950/20 border-yellow-200 dark:border-yellow-900/30'
                          : 'bg-green-50 dark:bg-green-950/20 border-green-200 dark:border-green-900/30'
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <Building2 size={16} className={
                          impact === 'COLLAPSE_RISK' ? 'text-red-500' :
                          impact === 'LIKELY_DAMAGE' ? 'text-yellow-500' : 'text-green-500'
                        } />
                        <div>
                          <p className="text-xs font-bold text-slate-700 dark:text-slate-300">
                            {building.buildingName}
                          </p>
                          <p className="text-[9px] text-slate-500">
                            Current: {building.currentStatus}
                          </p>
                        </div>
                      </div>
                      <StatusBadge 
                        status={impact === 'COLLAPSE_RISK' ? 'CRITICAL' : 
                                impact === 'LIKELY_DAMAGE' ? 'WARNING' : 'SAFE'} 
                        size="sm"
                        pulse={impact === 'COLLAPSE_RISK'}
                      />
                    </motion.div>
                  );
                })}
              </div>

              {/* Warning Banner */}
              {impactSummary.atRisk.length > 0 && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="p-3 bg-red-500/10 rounded-xl border border-red-500/30"
                >
                  <div className="flex items-start gap-2">
                    <AlertTriangle size={16} className="text-red-500 flex-shrink-0 mt-0.5" />
                    <div>
                      <p className="text-xs font-bold text-red-500 uppercase">
                        Critical Warning
                      </p>
                      <p className="text-[10px] text-slate-600 dark:text-slate-400 mt-1">
                        {impactSummary.atRisk.length} buildings at collapse risk. 
                        Recommend immediate evacuation and structural reinforcement.
                      </p>
                    </div>
                  </div>
                </motion.div>
              )}
            </motion.div>
          )}
        </AnimatePresence>

        {/* No Simulation State */}
        {!activeScenario && !isSimulating && (
          <div className="p-8 text-center text-slate-500">
            <Activity size={32} className="mx-auto mb-3 opacity-30" />
            <p className="text-xs uppercase tracking-wider">Select a scenario to run simulation</p>
          </div>
        )}
      </div>
    </GlassCard>
  );
});

export default AftershockSimulator;
