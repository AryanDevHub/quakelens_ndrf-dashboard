import React, { useState, useEffect, memo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Activity,
  Map as MapIcon,
  Cpu,
  Database,
  ShieldAlert,
  Radio,
  Sun,
  Moon,
  Siren,
} from 'lucide-react';
import { OverviewTab, GISTab, OperationsTab, IntelligenceTab } from '@/components/features';
import { TELEMETRY_LOGS } from '@/data/mockData';
import { useTimeUpdater } from '@/hooks';

type TabId = 'HOME' | 'GIS' | 'PLAN' | 'INTELLIGENCE';

interface NavItem {
  id: TabId;
  icon: React.ComponentType<{ size?: number; className?: string }>;
  label: string;
}

const NAV_ITEMS: NavItem[] = [
  { id: 'HOME', icon: Activity, label: 'Overview' },
  { id: 'GIS', icon: MapIcon, label: 'Tactical GIS' },
  { id: 'PLAN', icon: Cpu, label: 'AI Operations' },
  { id: 'INTELLIGENCE', icon: Database, label: 'Intelligence' },
];

// Telemetry Log Item
const TelemetryItem = memo<{ log: typeof TELEMETRY_LOGS[0]; index: number }>(
  function TelemetryItem({ log, index }) {
    const severityColors = {
      info: 'border-cyan-500/30',
      warning: 'border-yellow-500/30',
      critical: 'border-red-500/30',
    };

    return (
      <motion.div
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: index * 0.05 }}
        className={`p-4 bg-slate-50 dark:bg-white/5 rounded-[2rem] border ${severityColors[log.severity]} group hover:border-cyan-500/30 transition-all cursor-default shadow-sm`}
      >
        <div className="flex justify-between items-center mb-2">
          <span className="text-cyan-600 font-mono font-black text-[10px]">[{log.timestamp}]</span>
          <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest text-white tracking-tighter underline">
            {log.nodeId}
          </span>
        </div>
        <p className="text-xs text-slate-700 dark:text-slate-300 italic font-medium leading-relaxed tracking-tight uppercase font-mono">
          {log.message}
        </p>
      </motion.div>
    );
  }
);

function App() {
  const [activeTab, setActiveTab] = useState<TabId>('HOME');
  const [darkMode, setDarkMode] = useState(true);
  const [logs, setLogs] = useState(TELEMETRY_LOGS);
  const currentTime = useTimeUpdater(1000);

  // Simulate new telemetry logs
  useEffect(() => {
    const interval = setInterval(() => {
      const newLog = {
        timestamp: new Date().toLocaleTimeString('en-US', { hour12: false }),
        nodeId: `NODE-${Math.floor(Math.random() * 900) + 100}`,
        message: [
          'Structural Pulse: Integrity fluctuation detected',
          'UAV thermal signature update',
          'Mesh node reconnected',
          'Barometer reading: Level 4 anomaly',
          'FFT Peak: 4.2Hz resonance confirmed',
        ][Math.floor(Math.random() * 5)],
        severity: ['info', 'info', 'warning', 'critical'][Math.floor(Math.random() * 4)] as any,
      };
      
      setLogs(prev => [newLog, ...prev].slice(0, 20));
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  const renderTab = () => {
    switch (activeTab) {
      case 'HOME':
        return <OverviewTab />;
      case 'GIS':
        return <GISTab />;
      case 'PLAN':
        return <OperationsTab />;
      case 'INTELLIGENCE':
        return <IntelligenceTab />;
      default:
        return <OverviewTab />;
    }
  };

  return (
    <div className={`${darkMode ? 'dark' : ''} h-screen w-screen bg-[#F1F5F9] dark:bg-[#020617] text-slate-900 dark:text-slate-200 flex overflow-hidden transition-all duration-500 font-sans`}>
      
      {/* SIDEBAR NAVIGATION */}
      <aside className="w-64 bg-white dark:bg-slate-950 border-r border-slate-200 dark:border-white/5 flex flex-col py-10 z-50 shadow-2xl">
        {/* Logo */}
        <div className="px-8 mb-16 flex items-center gap-4">
          <div className="p-3 bg-cyan-600 rounded-2xl shadow-xl shadow-cyan-600/20">
            <ShieldAlert size={24} className="text-white" />
          </div>
          <div>
            <h1 className="font-black italic text-xl text-slate-900 dark:text-white uppercase tracking-widest leading-none font-serif">
              QuakeLens
            </h1>
            <p className="text-[8px] text-slate-500 uppercase tracking-wider mt-1">NDRF Command</p>
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 px-4 space-y-2">
          {NAV_ITEMS.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            
            return (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={`w-full flex items-center gap-4 px-6 py-5 rounded-2xl transition-all duration-300 text-[10px] font-black uppercase tracking-widest ${
                  isActive
                    ? 'bg-cyan-600/10 text-cyan-600 border border-cyan-600/20 shadow-sm'
                    : 'text-slate-500 hover:bg-slate-50 dark:hover:bg-white/5'
                }`}
              >
                <Icon size={20} />
                {item.label}
                {isActive && (
                  <motion.div
                    layoutId="activeIndicator"
                    className="ml-auto w-1.5 h-1.5 rounded-full bg-cyan-600"
                  />
                )}
              </button>
            );
          })}
        </nav>

        {/* Dark Mode Toggle */}
        <button
          onClick={() => setDarkMode(!darkMode)}
          className="mt-auto mx-8 p-4 rounded-2xl bg-slate-100 dark:bg-white/5 text-slate-400 hover:text-cyan-600 transition-all flex justify-center"
        >
          {darkMode ? <Sun size={24} /> : <Moon size={24} />}
        </button>
      </aside>

      {/* MAIN CONTENT AREA */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Header */}
        <header className="h-24 border-b border-slate-200 dark:border-white/5 flex justify-between items-center px-12 bg-white/60 dark:bg-slate-950/40 backdrop-blur-xl z-40">
          <div>
            <h1 className="text-2xl font-black italic uppercase text-slate-900 dark:text-white tracking-widest leading-none">
              OMEGA-C2 <span className="text-cyan-600 opacity-60 font-light underline underline-offset-8">COMMAND</span>
            </h1>
            <p className="text-[9px] font-black text-slate-500 uppercase tracking-[0.4em] mt-3">
              Strategic Status: Operational // New Delhi Sector // {currentTime}
            </p>
          </div>
          <button className="bg-red-600 text-white px-8 py-4 rounded-2xl text-[10px] font-black uppercase tracking-widest shadow-xl shadow-red-600/20 active:scale-95 transition-all flex items-center gap-2 hover:bg-red-500">
            <Siren size={16} />
            Broadcast SOS
          </button>
        </header>

        {/* Main Content */}
        <main className="flex-1 overflow-y-auto p-12 relative scrollbar-hide">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
            >
              {renderTab()}
            </motion.div>
          </AnimatePresence>
        </main>
      </div>

      {/* TELEMETRY FEED (RIGHT PANEL) */}
      <aside className="w-96 bg-white dark:bg-slate-950 border-l border-slate-200 dark:border-white/5 flex flex-col p-8 overflow-hidden z-50">
        <div className="flex items-center justify-between mb-8">
          <h3 className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-400 flex items-center gap-3">
            <motion.div
              animate={{ opacity: [0.5, 1, 0.5] }}
              transition={{ repeat: Infinity, duration: 1 }}
            >
              <Radio size={14} className="text-cyan-600" />
            </motion.div>
            Tactical Telemetry
          </h3>
          <span className="text-[9px] font-mono text-cyan-600">LIVE</span>
        </div>
        
        <div className="flex-1 overflow-y-auto space-y-4 pr-2 scrollbar-hide">
          <AnimatePresence initial={false}>
            {logs.map((log, i) => (
              <TelemetryItem key={`${log.timestamp}-${i}`} log={log} index={i} />
            ))}
          </AnimatePresence>
        </div>

        {/* Connection Status */}
        <div className="mt-4 pt-4 border-t border-slate-200 dark:border-white/5">
          <div className="flex items-center justify-between text-[9px] font-mono text-slate-500">
            <span>Mesh Coverage: 94%</span>
            <span className="text-green-500">● ONLINE</span>
          </div>
        </div>
      </aside>
    </div>
  );
}

export default App;
