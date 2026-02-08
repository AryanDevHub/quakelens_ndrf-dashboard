import { memo, useState, useCallback, useEffect } from 'react';
import { motion } from 'framer-motion';
import { MapContainer, TileLayer, Circle, Popup, useMap } from 'react-leaflet';
import { 
  Layers, 
  Navigation, 
  Users, 
  Radio, 
  AlertTriangle,
  Building2,
  Target
} from 'lucide-react';
import { GlassCard } from '@/components/ui/custom';
import { SECTOR_DATA, VICTIM_CLUSTERS, SIGNAL_NODES } from '@/data/mockData';

// Type assertions for Leaflet components
const TypedMapContainer = MapContainer as any;
const TypedCircle = Circle as any;

// Map controller component
const MapController = memo(function MapController() {
  const map = useMap();
  
  useEffect(() => {
    map.setView([28.6139, 77.2090], 13);
  }, [map]);
  
  return null;
});

type LayerType = 'satellite' | 'risk' | 'victims' | 'signal';

export const GISTab = memo(function GISTab() {
  const [activeLayers, setActiveLayers] = useState<LayerType[]>(['satellite', 'risk']);
  const [selectedSector, setSelectedSector] = useState<string | null>(null);

  const toggleLayer = useCallback((layer: LayerType) => {
    setActiveLayers(prev => 
      prev.includes(layer) 
        ? prev.filter(l => l !== layer)
        : [...prev, layer]
    );
  }, []);

  const layerButtons = [
    { id: 'satellite' as LayerType, label: 'Satellite', icon: Navigation },
    { id: 'risk' as LayerType, label: 'Risk Zones', icon: AlertTriangle },
    { id: 'victims' as LayerType, label: 'Victim Clusters', icon: Users },
    { id: 'signal' as LayerType, label: 'Signal Coverage', icon: Radio },
  ];

  return (
    <motion.div 
      initial={{ opacity: 0 }} 
      animate={{ opacity: 1 }} 
      className="h-[750px] flex gap-6"
    >
      {/* Map Container */}
      <div className="flex-1 relative">
        <div className="h-full w-full bg-slate-900 rounded-[3rem] overflow-hidden relative shadow-2xl border-4 border-slate-200 dark:border-white/5">
          <TypedMapContainer
            center={[28.6139, 77.2090]}
            zoom={13}
            style={{ height: '100%', width: '100%' }}
            zoomControl={false}
            scrollWheelZoom={true}
          >
            <MapController />
            
            {activeLayers.includes('satellite') && (
              <TileLayer 
                url="https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}" 
              />
            )}

            {/* Risk Zones */}
            {activeLayers.includes('risk') && SECTOR_DATA.map(sector => (
              <TypedCircle
                key={sector.id}
                center={sector.pos}
                radius={850}
                pathOptions={{
                  color: 'white',
                  weight: 1.5,
                  fillColor: sector.color,
                  fillOpacity: 0.6,
                }}
                eventHandlers={{
                  click: () => setSelectedSector(sector.id),
                }}
              >
                <Popup>
                  <div className="text-xs p-2 font-mono uppercase font-bold tracking-tighter min-w-[150px]">
                    <p className="font-black mb-1" style={{ color: sector.color }}>
                      {sector.label}
                    </p>
                    <p className="text-slate-400 text-[10px]">TAG: {sector.status}</p>
                    <p className="text-slate-400 text-[10px]">RISK: {sector.risk}%</p>
                    <p className="text-slate-400 text-[10px]">NODES: {sector.nodes}</p>
                  </div>
                </Popup>
              </TypedCircle>
            ))}

            {/* Victim Clusters */}
            {activeLayers.includes('victims') && VICTIM_CLUSTERS.map(cluster => (
              <TypedCircle
                key={cluster.id}
                center={cluster.position}
                radius={100 + cluster.estimatedCount * 5}
                pathOptions={{
                  color: '#ef4444',
                  weight: 2,
                  fillColor: '#ef4444',
                  fillOpacity: 0.4,
                }}
              >
                <Popup>
                  <div className="text-xs p-2 font-mono uppercase font-bold tracking-tighter">
                    <p className="text-red-500 font-black mb-1">{cluster.id}</p>
                    <p className="text-slate-400 text-[10px]">Est. Victims: {cluster.estimatedCount}</p>
                    <p className="text-slate-400 text-[10px]">Confidence: {(cluster.confidence * 100).toFixed(0)}%</p>
                  </div>
                </Popup>
              </TypedCircle>
            ))}

            {/* Signal Nodes */}
            {activeLayers.includes('signal') && SIGNAL_NODES.slice(0, 50).map(node => (
              <TypedCircle
                key={node.id}
                center={node.position}
                radius={50}
                pathOptions={{
                  color: node.connected ? '#22c55e' : '#ef4444',
                  weight: 1,
                  fillColor: node.connected ? '#22c55e' : '#ef4444',
                  fillOpacity: 0.5,
                }}
              />
            ))}
          </TypedMapContainer>

          {/* Layer Controls */}
          <div className="absolute top-4 left-4 z-[1000] flex flex-col gap-2">
            {layerButtons.map(({ id, label, icon: Icon }) => (
              <button
                key={id}
                onClick={() => toggleLayer(id)}
                className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-[10px] font-bold uppercase tracking-wider transition-all ${
                  activeLayers.includes(id)
                    ? 'bg-cyan-600 text-white shadow-lg'
                    : 'bg-black/80 text-slate-400 hover:bg-black/60'
                }`}
              >
                <Icon size={14} />
                {label}
              </button>
            ))}
          </div>

          {/* Scan Line */}
          <motion.div
            animate={{ top: ['0%', '100%'] }}
            transition={{ duration: 4, repeat: Infinity, ease: 'linear' }}
            className="absolute left-0 right-0 h-[2px] bg-cyan-500/30 z-[402] pointer-events-none"
          />
        </div>
      </div>

      {/* Side Panel */}
      <div className="w-80 space-y-4">
        {/* Legend */}
        <GlassCard title="Map Legend" icon={Layers}>
          <div className="space-y-3">
            <div className="flex items-center gap-2 text-[10px]">
              <span className="w-3 h-3 rounded-full bg-red-500 shadow-lg shadow-red-500/50" />
              <span className="text-slate-600 dark:text-slate-400">Critical Risk (&gt;70%)</span>
            </div>
            <div className="flex items-center gap-2 text-[10px]">
              <span className="w-3 h-3 rounded-full bg-yellow-500 shadow-lg shadow-yellow-500/50" />
              <span className="text-slate-600 dark:text-slate-400">Warning (30-70%)</span>
            </div>
            <div className="flex items-center gap-2 text-[10px]">
              <span className="w-3 h-3 rounded-full bg-green-500 shadow-lg shadow-green-500/50" />
              <span className="text-slate-600 dark:text-slate-400">Stable (&lt;30%)</span>
            </div>
            <div className="flex items-center gap-2 text-[10px]">
              <span className="w-3 h-3 rounded-full border-2 border-red-500 border-dashed" />
              <span className="text-slate-600 dark:text-slate-400">Victim Clusters</span>
            </div>
          </div>
        </GlassCard>

        {/* Selected Sector Info */}
        {selectedSector && (
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
          >
            <GlassCard title="Sector Details" icon={Target}>
              {(() => {
                const sector = SECTOR_DATA.find(s => s.id === selectedSector);
                if (!sector) return null;
                return (
                  <div className="space-y-3">
                    <div>
                      <p className="text-lg font-black text-slate-800 dark:text-white">{sector.label}</p>
                      <p className="text-[10px] text-slate-500 uppercase tracking-wider">{sector.id}</p>
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                      <div className="p-3 bg-slate-50 dark:bg-slate-800 rounded-xl text-center">
                        <p className="text-2xl font-black" style={{ color: sector.color }}>{sector.risk}%</p>
                        <p className="text-[9px] text-slate-500 uppercase">Risk Level</p>
                      </div>
                      <div className="p-3 bg-slate-50 dark:bg-slate-800 rounded-xl text-center">
                        <p className="text-2xl font-black text-cyan-600">{sector.nodes}</p>
                        <p className="text-[9px] text-slate-500 uppercase">Active Nodes</p>
                      </div>
                    </div>
                  </div>
                );
              })()}
            </GlassCard>
          </motion.div>
        )}

        {/* Quick Stats */}
        <GlassCard title="Zone Summary" icon={Building2}>
          <div className="grid grid-cols-3 gap-2 text-center">
            <div className="p-2 bg-red-50 dark:bg-red-950/20 rounded-xl">
              <p className="text-xl font-black text-red-500">
                {SECTOR_DATA.filter(s => s.status === 'CRITICAL').length}
              </p>
              <p className="text-[8px] text-slate-500 uppercase">Critical</p>
            </div>
            <div className="p-2 bg-yellow-50 dark:bg-yellow-950/20 rounded-xl">
              <p className="text-xl font-black text-yellow-500">
                {SECTOR_DATA.filter(s => s.status === 'WARNING').length}
              </p>
              <p className="text-[8px] text-slate-500 uppercase">Warning</p>
            </div>
            <div className="p-2 bg-green-50 dark:bg-green-950/20 rounded-xl">
              <p className="text-xl font-black text-green-500">
                {SECTOR_DATA.filter(s => s.status === 'STABLE').length}
              </p>
              <p className="text-[8px] text-slate-500 uppercase">Stable</p>
            </div>
          </div>
        </GlassCard>
      </div>
    </motion.div>
  );
});

export default GISTab;
