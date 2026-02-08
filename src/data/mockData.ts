import type { 
  SectorData, 
  BuildingProfile, 
  SignalNode, 
  VictimCluster, 
  ResourceAllocation,
  BuildingVulnerability,
  UAVFeed,
  MeshNode,
  Mission,
  TelemetryLog,
  DataSource,
  TrendDataPoint
} from '@/types';

// Sector Data for New Delhi
export const SECTOR_DATA: SectorData[] = [
  { id: 'S-07', label: 'Connaught Place', risk: 84, nodes: 1240, status: 'CRITICAL', color: '#ef4444', pos: [28.6139, 77.2090], population: 4500, rescuers: 120 },
  { id: 'S-12', label: 'Govt District', risk: 42, nodes: 890, status: 'WARNING', color: '#f59e0b', pos: [28.6239, 77.2190], population: 2800, rescuers: 85 },
  { id: 'S-02', label: 'East Residential', risk: 12, nodes: 2100, status: 'STABLE', color: '#22c55e', pos: [28.6039, 77.1990], population: 6200, rescuers: 45 },
  { id: 'S-15', label: 'Industrial Zone', risk: 67, nodes: 560, status: 'WARNING', color: '#f59e0b', pos: [28.6339, 77.2290], population: 1800, rescuers: 60 },
  { id: 'S-03', label: 'School Complex', risk: 28, nodes: 1450, status: 'STABLE', color: '#22c55e', pos: [28.5939, 77.1890], population: 3200, rescuers: 50 },
  { id: 'S-09', label: 'Hospital District', risk: 8, nodes: 980, status: 'STABLE', color: '#22c55e', pos: [28.6439, 77.2390], population: 1500, rescuers: 95 },
];

// Building Profiles for Vertical Triage
export const BUILDING_PROFILES: BuildingProfile[] = [
  {
    id: 'B-CP-01',
    name: 'Connaught Tower',
    position: [28.6139, 77.2090],
    totalFloors: 12,
    overallStatus: 'DANGER',
    floors: [
      { floor: 12, integrity: 15, barometerReading: 1010.2, status: 'COLLAPSED', occupantCount: 0 },
      { floor: 11, integrity: 25, barometerReading: 1010.5, status: 'DANGER', occupantCount: 5 },
      { floor: 10, integrity: 35, barometerReading: 1010.8, status: 'DANGER', occupantCount: 12 },
      { floor: 9, integrity: 45, barometerReading: 1011.1, status: 'CAUTION', occupantCount: 18 },
      { floor: 8, integrity: 55, barometerReading: 1011.4, status: 'CAUTION', occupantCount: 25 },
      { floor: 7, integrity: 62, barometerReading: 1011.7, status: 'CAUTION', occupantCount: 30 },
      { floor: 6, integrity: 68, barometerReading: 1012.0, status: 'SAFE', occupantCount: 35 },
      { floor: 5, integrity: 72, barometerReading: 1012.3, status: 'SAFE', occupantCount: 40 },
      { floor: 4, integrity: 78, barometerReading: 1012.6, status: 'SAFE', occupantCount: 45 },
      { floor: 3, integrity: 82, barometerReading: 1012.9, status: 'SAFE', occupantCount: 50 },
      { floor: 2, integrity: 85, barometerReading: 1013.2, status: 'SAFE', occupantCount: 55 },
      { floor: 1, integrity: 88, barometerReading: 1013.5, status: 'SAFE', occupantCount: 60 },
    ]
  },
  {
    id: 'B-GD-02',
    name: 'Parliament Annex',
    position: [28.6239, 77.2190],
    totalFloors: 8,
    overallStatus: 'CAUTION',
    floors: [
      { floor: 8, integrity: 55, barometerReading: 1011.0, status: 'CAUTION', occupantCount: 15 },
      { floor: 7, integrity: 62, barometerReading: 1011.3, status: 'CAUTION', occupantCount: 20 },
      { floor: 6, integrity: 68, barometerReading: 1011.6, status: 'SAFE', occupantCount: 25 },
      { floor: 5, integrity: 72, barometerReading: 1011.9, status: 'SAFE', occupantCount: 30 },
      { floor: 4, integrity: 78, barometerReading: 1012.2, status: 'SAFE', occupantCount: 35 },
      { floor: 3, integrity: 82, barometerReading: 1012.5, status: 'SAFE', occupantCount: 40 },
      { floor: 2, integrity: 85, barometerReading: 1012.8, status: 'SAFE', occupantCount: 45 },
      { floor: 1, integrity: 88, barometerReading: 1013.1, status: 'SAFE', occupantCount: 50 },
    ]
  },
  {
    id: 'B-ER-03',
    name: 'Residential Complex A',
    position: [28.6039, 77.1990],
    totalFloors: 6,
    overallStatus: 'SAFE',
    floors: [
      { floor: 6, integrity: 92, barometerReading: 1012.0, status: 'SAFE', occupantCount: 20 },
      { floor: 5, integrity: 94, barometerReading: 1012.3, status: 'SAFE', occupantCount: 22 },
      { floor: 4, integrity: 95, barometerReading: 1012.6, status: 'SAFE', occupantCount: 25 },
      { floor: 3, integrity: 96, barometerReading: 1012.9, status: 'SAFE', occupantCount: 28 },
      { floor: 2, integrity: 97, barometerReading: 1013.2, status: 'SAFE', occupantCount: 30 },
      { floor: 1, integrity: 98, barometerReading: 1013.5, status: 'SAFE', occupantCount: 32 },
    ]
  },
];

// Signal/Mesh Network Nodes
export const SIGNAL_NODES: SignalNode[] = Array.from({ length: 150 }, (_, i) => ({
  id: `NODE-${i.toString().padStart(3, '0')}`,
  position: [
    28.58 + Math.random() * 0.1,
    77.17 + Math.random() * 0.1
  ] as [number, number],
  signalStrength: Math.random() > 0.3 ? Math.floor(Math.random() * 60) + 40 : Math.floor(Math.random() * 30),
  lastPing: Date.now() - Math.floor(Math.random() * 300000),
  batteryLevel: Math.floor(Math.random() * 100),
  type: Math.random() > 0.8 ? 'responder' : Math.random() > 0.9 ? 'uav' : 'mobile',
  connected: Math.random() > 0.2,
}));

// Victim Clusters for Load Balancing
export const VICTIM_CLUSTERS: VictimCluster[] = [
  { id: 'VC-01', position: [28.6145, 77.2095], estimatedCount: 45, confidence: 0.92, lastUpdate: Date.now() - 120000 },
  { id: 'VC-02', position: [28.6135, 77.2085], estimatedCount: 32, confidence: 0.87, lastUpdate: Date.now() - 180000 },
  { id: 'VC-03', position: [28.6245, 77.2195], estimatedCount: 18, confidence: 0.78, lastUpdate: Date.now() - 240000 },
  { id: 'VC-04', position: [28.6045, 77.1995], estimatedCount: 8, confidence: 0.65, lastUpdate: Date.now() - 300000 },
  { id: 'VC-05', position: [28.6345, 77.2295], estimatedCount: 25, confidence: 0.83, lastUpdate: Date.now() - 150000 },
  { id: 'VC-06', position: [28.5945, 77.1895], estimatedCount: 12, confidence: 0.71, lastUpdate: Date.now() - 210000 },
];

// Resource Allocations
export const RESOURCE_ALLOCATIONS: ResourceAllocation[] = SECTOR_DATA.map(sector => {
  const victims = VICTIM_CLUSTERS
    .filter(vc => {
      const dist = Math.sqrt(
        Math.pow(vc.position[0] - sector.pos[0], 2) + 
        Math.pow(vc.position[1] - sector.pos[1], 2)
      );
      return dist < 0.005;
    })
    .reduce((sum, vc) => sum + vc.estimatedCount, 0);
  
  const ratio = victims / (sector.rescuers || 1);
  const recommendedRescuers = Math.ceil(victims / 5); // 1 rescuer per 5 victims
  
  return {
    sectorId: sector.id,
    victims,
    rescuers: sector.rescuers || 0,
    ratio: Math.round(ratio * 10) / 10,
    recommendedRescuers,
    priority: ratio > 10 ? 'CRITICAL' : ratio > 5 ? 'HIGH' : ratio > 2 ? 'MEDIUM' : 'LOW',
  };
});

// Building Vulnerability for Aftershock Prediction
export const BUILDING_VULNERABILITIES: BuildingVulnerability[] = [
  { buildingId: 'B-CP-01', buildingName: 'Connaught Tower', currentStatus: 'DANGER', aftershockM5: 'COLLAPSE_RISK', aftershockM6: 'COLLAPSE_RISK', collapseProbability: 0.87 },
  { buildingId: 'B-GD-02', buildingName: 'Parliament Annex', currentStatus: 'CAUTION', aftershockM5: 'LIKELY_DAMAGE', aftershockM6: 'COLLAPSE_RISK', collapseProbability: 0.62 },
  { buildingId: 'B-ER-03', buildingName: 'Residential Complex A', currentStatus: 'SAFE', aftershockM5: 'SAFE', aftershockM6: 'LIKELY_DAMAGE', collapseProbability: 0.23 },
  { buildingId: 'B-IZ-04', buildingName: 'Factory Unit 7', currentStatus: 'CAUTION', aftershockM5: 'LIKELY_DAMAGE', aftershockM6: 'COLLAPSE_RISK', collapseProbability: 0.71 },
  { buildingId: 'B-SC-05', buildingName: 'Delhi Public School', currentStatus: 'SAFE', aftershockM5: 'SAFE', aftershockM6: 'LIKELY_DAMAGE', collapseProbability: 0.18 },
  { buildingId: 'B-HD-06', buildingName: 'AIIMS Trauma Center', currentStatus: 'SAFE', aftershockM5: 'SAFE', aftershockM6: 'SAFE', collapseProbability: 0.08 },
];

// UAV Feeds
export const UAV_FEEDS: UAVFeed[] = [
  {
    id: 'UAV-01',
    name: 'Alpha-1',
    position: [28.6140, 77.2090],
    altitude: 150,
    battery: 78,
    status: 'ACTIVE',
    thermalTargets: [
      { id: 'T1', relativeX: 0.3, relativeY: 0.4, temperature: 36.5, type: 'HUMAN' },
      { id: 'T2', relativeX: 0.6, relativeY: 0.5, temperature: 37.2, type: 'HUMAN' },
      { id: 'T3', relativeX: 0.8, relativeY: 0.3, temperature: 45.0, type: 'VEHICLE' },
    ]
  },
  {
    id: 'UAV-02',
    name: 'Bravo-2',
    position: [28.6240, 77.2190],
    altitude: 200,
    battery: 45,
    status: 'RETURNING',
    thermalTargets: [
      { id: 'T4', relativeX: 0.4, relativeY: 0.6, temperature: 36.8, type: 'HUMAN' },
    ]
  },
  {
    id: 'UAV-03',
    name: 'Charlie-3',
    position: [28.6040, 77.1990],
    altitude: 180,
    battery: 92,
    status: 'ACTIVE',
    thermalTargets: [
      { id: 'T5', relativeX: 0.5, relativeY: 0.5, temperature: 36.2, type: 'HUMAN' },
      { id: 'T6', relativeX: 0.7, relativeY: 0.4, temperature: 36.9, type: 'HUMAN' },
      { id: 'T7', relativeX: 0.2, relativeY: 0.7, temperature: 42.0, type: 'VEHICLE' },
    ]
  },
];

// Mesh Topology Nodes
export const MESH_NODES: MeshNode[] = [
  { id: 'GATEWAY-01', position: [28.6139, 77.2090], type: 'gateway', status: 'online', batteryLevel: 100, connections: ['RESP-01', 'RESP-02', 'PHONE-001'] },
  { id: 'GATEWAY-02', position: [28.6239, 77.2190], type: 'gateway', status: 'online', batteryLevel: 95, connections: ['RESP-03', 'UAV-01', 'PHONE-050'] },
  { id: 'RESP-01', position: [28.6145, 77.2095], type: 'responder', status: 'online', batteryLevel: 78, connections: ['GATEWAY-01', 'PHONE-001', 'PHONE-002'] },
  { id: 'RESP-02', position: [28.6135, 77.2085], type: 'responder', status: 'online', batteryLevel: 65, connections: ['GATEWAY-01', 'PHONE-003'] },
  { id: 'RESP-03', position: [28.6245, 77.2195], type: 'responder', status: 'weak', batteryLevel: 32, connections: ['GATEWAY-02', 'PHONE-050'] },
  { id: 'UAV-01', position: [28.6140, 77.2090], type: 'uav', status: 'online', batteryLevel: 78, connections: ['GATEWAY-02', 'PHONE-100'] },
  ...Array.from({ length: 50 }, (_, i): import('@/types').MeshNode => ({
    id: `PHONE-${i.toString().padStart(3, '0')}`,
    position: [
      28.58 + Math.random() * 0.08,
      77.17 + Math.random() * 0.08
    ] as [number, number],
    type: 'phone',
    status: Math.random() > 0.3 ? 'online' : Math.random() > 0.5 ? 'weak' : 'offline',
    batteryLevel: Math.floor(Math.random() * 100),
    connections: [],
  })),
];

// Missions
export const MISSIONS: Mission[] = [
  { id: 'M-001', task: 'Evacuate Connaught Tower - Floors 10-12', progress: 65, priority: 'Critical', assignedTeam: 'Team Alpha', eta: '12:45', sectorId: 'S-07' },
  { id: 'M-002', task: 'Medical Drop: Parliament District', progress: 30, priority: 'High', assignedTeam: 'Team Bravo', eta: '13:15', sectorId: 'S-12' },
  { id: 'M-003', task: 'UAV Mapping: East Industrial Zone', progress: 100, priority: 'Normal', assignedTeam: 'UAV Squad', eta: 'Complete', sectorId: 'S-15' },
  { id: 'M-004', task: 'Search & Rescue: School Complex', progress: 45, priority: 'High', assignedTeam: 'Team Charlie', eta: '14:00', sectorId: 'S-03' },
  { id: 'M-005', task: 'Establish Mesh Gateway - Sector 9', progress: 15, priority: 'Critical', assignedTeam: 'Tech Unit', eta: '13:30', sectorId: 'S-09' },
];

// Telemetry Logs
export const TELEMETRY_LOGS: TelemetryLog[] = [
  { timestamp: '12:04:32', nodeId: 'X788', message: 'Structural Pulse: 34% Integrity Drop Detected', severity: 'critical' },
  { timestamp: '12:03:15', nodeId: 'UAV-1', message: 'Sector 7 Thermal Scan Complete - 12 Heat Signatures', severity: 'info' },
  { timestamp: '12:02:48', nodeId: 'SAT-L', message: 'Change Detection: Zone 4 Red-Tagged', severity: 'warning' },
  { timestamp: '12:01:22', nodeId: 'NODE-442', message: 'Mesh Connection Lost - Attempting Reconnect', severity: 'warning' },
  { timestamp: '12:00:05', nodeId: 'GATEWAY-01', message: 'P2P Network Propagation: 94% Coverage', severity: 'info' },
  { timestamp: '11:58:33', nodeId: 'RESP-03', message: 'Victim Located - Coordinates Logged', severity: 'info' },
  { timestamp: '11:57:12', nodeId: 'FFT-PROC', message: 'Spectral Peak Detected: 4.2Hz Resonance', severity: 'warning' },
  { timestamp: '11:55:47', nodeId: 'UAV-2', message: 'Battery Low - Returning to Base', severity: 'warning' },
];

// Data Sources
export const DATA_SOURCES: DataSource[] = [
  { name: 'Sentinel-2 Satellite', status: 'Synced', load: '100%', icon: 'Globe', color: 'text-green-500' },
  { name: 'UAV Swarm Alpha', status: 'Active', load: '94%', icon: 'Wind', color: 'text-cyan-500' },
  { name: 'P2P Citizen Mesh', status: 'Congested', load: '82%', icon: 'Radio', color: 'text-yellow-500' },
  { name: 'Govt Infrastructure', status: 'Offline', load: '0%', icon: 'DatabaseZap', color: 'text-red-500' },
  { name: 'Seismic Array', status: 'Active', load: '98%', icon: 'Activity', color: 'text-cyan-500' },
  { name: 'Thermal Sensors', status: 'Active', load: '91%', icon: 'Zap', color: 'text-green-500' },
];

// Trend Data for Charts
export const INTEGRITY_TRENDS: TrendDataPoint[] = [
  { time: '08:00', value: 95 },
  { time: '09:00', value: 82 },
  { time: '10:00', value: 45 },
  { time: '11:00', value: 38 },
  { time: '12:00', value: 32 },
  { time: '12:30', value: 28 },
];

// Spectrogram Data Generator
export const generateSpectrogramData = (frames: number = 50): number[][] => {
  return Array.from({ length: frames }, () => 
    Array.from({ length: 64 }, () => Math.random() * 100)
  );
};

// FFT Data Generator
export const generateFFTData = (points: number = 128): { freq: number; amp: number }[] => {
  return Array.from({ length: points }, (_, i) => ({
    freq: i * 0.5,
    amp: Math.random() * 50 + Math.sin(i * 0.2) * 30 + 20,
  }));
};
