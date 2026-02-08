import React, { memo } from 'react';
import { motion } from 'framer-motion';
import { 
  Database, 
  Zap, 
  Globe, 
  Wind, 
  Radio, 
  DatabaseZap,
  Activity,
  ShieldCheck,
  Cpu
} from 'lucide-react';
import { GlassCard } from '@/components/ui/custom';
import { 
  Spectrogram, 
  FFTWaveform, 
  MeshTopologyGraph, 
  UAVThermalFeed 
} from '@/components/visualizations';
import { 
  VerticalTriageMatrix, 
  SignalHeatmap, 
  LoadBalancingAI, 
  AftershockSimulator 
} from '@/components/features';
import { DATA_SOURCES } from '@/data/mockData';

const DataSourceItem = memo<{ source: typeof DATA_SOURCES[0] }>(function DataSourceItem({ source }) {
  const icons: Record<string, React.ComponentType<{ size?: number; className?: string }>> = {
    Globe, Wind, Radio, DatabaseZap, Activity, Zap
  };
  const Icon = icons[source.icon] || Globe;

  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      className="flex justify-between items-center p-5 bg-slate-50 dark:bg-white/5 rounded-3xl border border-slate-100 dark:border-white/5 group hover:border-cyan-500/30 transition-all"
    >
      <div className="flex items-center gap-4">
        <Icon size={20} className={source.color} />
        <div>
          <p className="text-xs font-black text-slate-800 dark:text-white uppercase">{source.name}</p>
          <p className="text-[9px] text-slate-500 font-bold uppercase tracking-widest">{source.status}</p>
        </div>
      </div>
      <span className="text-sm font-mono text-slate-900 dark:text-white font-black">{source.load}</span>
    </motion.div>
  );
});

export const IntelligenceTab = memo(function IntelligenceTab() {
  return (
    <motion.div 
      initial={{ opacity: 0, x: 20 }} 
      animate={{ opacity: 1, x: 0 }} 
      className="space-y-8 pb-20"
    >
      {/* Data Sources */}
      <div className="grid grid-cols-2 gap-8">
        <GlassCard title="Multi-Source Ingestion Matrix" icon={Database}>
          <div className="space-y-4">
            {DATA_SOURCES.map((source) => (
              <DataSourceItem key={source.name} source={source} />
            ))}
          </div>
        </GlassCard>

        <div className="space-y-8">
          {/* FFT Waveform */}
          <GlassCard title="Real-time FFT Analysis" icon={Activity}>
            <FFTWaveform width={400} height={120} />
            <div className="mt-4 flex justify-between text-[9px] font-mono text-slate-500">
              <span>Sample Rate: 104Hz</span>
              <span>Resolution: 0.5Hz</span>
              <span>Window: Hamming</span>
            </div>
          </GlassCard>

          {/* Spectrogram */}
          <GlassCard title="Spectrogram Visualization" icon={Cpu}>
            <Spectrogram width={400} height={150} />
          </GlassCard>
        </div>
      </div>

      {/* Advanced Features Row */}
      <div className="grid grid-cols-2 gap-8">
        <VerticalTriageMatrix />
        <SignalHeatmap />
      </div>

      {/* Load Balancing & Aftershock */}
      <LoadBalancingAI />

      <div className="grid grid-cols-2 gap-8">
        <AftershockSimulator />

        {/* UAV Thermal Feed */}
        <GlassCard title="UAV Thermal Reconnaissance" icon={Wind}>
          <UAVThermalFeed uavId="UAV-01" width={400} height={240} />
          <div className="mt-4 grid grid-cols-3 gap-2">
            <div className="p-2 bg-slate-50 dark:bg-slate-800 rounded-xl text-center">
              <p className="text-lg font-black text-cyan-600">3</p>
              <p className="text-[8px] text-slate-500 uppercase">Active UAVs</p>
            </div>
            <div className="p-2 bg-slate-50 dark:bg-slate-800 rounded-xl text-center">
              <p className="text-lg font-black text-yellow-500">12</p>
              <p className="text-[8px] text-slate-500 uppercase">Heat Signatures</p>
            </div>
            <div className="p-2 bg-slate-50 dark:bg-slate-800 rounded-xl text-center">
              <p className="text-lg font-black text-green-500">8</p>
              <p className="text-[8px] text-slate-500 uppercase">Human Targets</p>
            </div>
          </div>
        </GlassCard>
      </div>

      {/* Mesh Topology */}
      <GlassCard title="Mesh Network Topology" icon={Radio}>
        <div className="grid grid-cols-2 gap-8">
          <MeshTopologyGraph width={500} height={300} />
          <div className="space-y-4">
            <div className="p-4 bg-slate-50 dark:bg-slate-800/50 rounded-2xl">
              <p className="text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-3">
                Network Statistics
              </p>
              <div className="grid grid-cols-2 gap-3">
                <div className="text-center p-3 bg-white dark:bg-slate-900 rounded-xl">
                  <p className="text-2xl font-black text-green-500">847</p>
                  <p className="text-[8px] text-slate-500 uppercase">Online Nodes</p>
                </div>
                <div className="text-center p-3 bg-white dark:bg-slate-900 rounded-xl">
                  <p className="text-2xl font-black text-yellow-500">124</p>
                  <p className="text-[8px] text-slate-500 uppercase">Weak Signal</p>
                </div>
                <div className="text-center p-3 bg-white dark:bg-slate-900 rounded-xl">
                  <p className="text-2xl font-black text-red-500">89</p>
                  <p className="text-[8px] text-slate-500 uppercase">Offline</p>
                </div>
                <div className="text-center p-3 bg-white dark:bg-slate-900 rounded-xl">
                  <p className="text-2xl font-black text-cyan-600">12</p>
                  <p className="text-[8px] text-slate-500 uppercase">Gateways</p>
                </div>
              </div>
            </div>
            <div className="p-4 bg-cyan-50 dark:bg-cyan-950/20 rounded-2xl border border-cyan-200 dark:border-cyan-900/30">
              <p className="text-[10px] font-bold text-cyan-600 uppercase tracking-wider mb-2">
                AI Network Insight
              </p>
              <p className="text-[10px] text-slate-600 dark:text-slate-400">
                Detected 3 potential mesh partitions in Sector S-07. Recommend deploying 
                UAV-2 as temporary relay bridge to maintain connectivity.
              </p>
            </div>
          </div>
        </div>
      </GlassCard>

      {/* Encrypted Hub Link */}
      <div className="p-10 bg-slate-900 rounded-[3rem] flex flex-col items-center justify-center text-center text-white border-4 border-white shadow-2xl">
        <ShieldCheck size={48} className="text-green-400 mb-4" />
        <h4 className="text-lg font-black uppercase tracking-[0.4em]">Encrypted_Hub_Link</h4>
        <p className="text-[10px] text-slate-500 mt-2 uppercase font-bold tracking-widest">
          AES-256 Tunnel Established • Latency: 12ms
        </p>
        <div className="mt-4 flex gap-4 text-[9px] font-mono text-slate-400">
          <span>NDRF_CMD ←→ OMEGA_C2</span>
          <span className="text-green-500">● SECURE</span>
        </div>
      </div>
    </motion.div>
  );
});

export default IntelligenceTab;
