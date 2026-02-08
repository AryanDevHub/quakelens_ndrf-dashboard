// NDRF Omega-C2 Dashboard Types

// Sector/Risk Data Types
export interface SectorData {
  id: string;
  label: string;
  risk: number;
  nodes: number;
  status: 'CRITICAL' | 'WARNING' | 'STABLE';
  color: string;
  pos: [number, number];
  population?: number;
  rescuers?: number;
}

// Building Floor Data for Vertical Triage
export interface FloorData {
  floor: number;
  integrity: number;
  barometerReading: number;
  status: 'SAFE' | 'CAUTION' | 'DANGER' | 'COLLAPSED';
  occupantCount?: number;
}

export interface BuildingProfile {
  id: string;
  name: string;
  position: [number, number];
  totalFloors: number;
  floors: FloorData[];
  overallStatus: 'SAFE' | 'CAUTION' | 'DANGER' | 'COLLAPSED';
}

// Signal/Mesh Network Types
export interface SignalNode {
  id: string;
  position: [number, number];
  signalStrength: number;
  lastPing: number;
  batteryLevel: number;
  type: 'mobile' | 'responder' | 'uav' | 'gateway';
  connected: boolean;
}

export interface SignalHeatmapCell {
  pos: [number, number];
  density: number; // 0-100
  avgSignalStrength: number;
}

// Human Load Balancing
export interface VictimCluster {
  id: string;
  position: [number, number];
  estimatedCount: number;
  confidence: number;
  lastUpdate: number;
}

export interface ResourceAllocation {
  sectorId: string;
  victims: number;
  rescuers: number;
  ratio: number;
  recommendedRescuers: number;
  priority: 'CRITICAL' | 'HIGH' | 'MEDIUM' | 'LOW';
}

// Aftershock Prediction
export interface AftershockScenario {
  magnitude: number;
  probability: number;
  timeWindow: string;
}

export interface BuildingVulnerability {
  buildingId: string;
  buildingName: string;
  currentStatus: 'SAFE' | 'CAUTION' | 'DANGER';
  aftershockM5: 'SAFE' | 'LIKELY_DAMAGE' | 'COLLAPSE_RISK';
  aftershockM6: 'SAFE' | 'LIKELY_DAMAGE' | 'COLLAPSE_RISK';
  collapseProbability: number;
}

// Spectrogram/FFT Data
export interface FFTDataPoint {
  frequency: number;
  amplitude: number;
  timestamp: number;
}

export interface SpectrogramFrame {
  timestamp: number;
  bins: number[];
}

// UAV/Thermal Types
export interface UAVFeed {
  id: string;
  name: string;
  position: [number, number];
  altitude: number;
  battery: number;
  status: 'ACTIVE' | 'RETURNING' | 'STANDBY';
  thermalTargets: ThermalTarget[];
}

export interface ThermalTarget {
  id: string;
  relativeX: number; // 0-1
  relativeY: number; // 0-1
  temperature: number;
  type: 'HUMAN' | 'VEHICLE' | 'UNKNOWN';
}

// Mesh Topology
export interface MeshNode {
  id: string;
  position: [number, number];
  type: 'phone' | 'responder' | 'gateway' | 'uav';
  status: 'online' | 'offline' | 'weak';
  batteryLevel: number;
  connections: string[]; // Node IDs
}

export interface MeshLink {
  source: string;
  target: string;
  strength: number;
  hops: number;
}

// Mission Types
export interface Mission {
  id: string;
  task: string;
  progress: number;
  priority: 'Critical' | 'High' | 'Normal' | 'Low';
  assignedTeam?: string;
  eta?: string;
  sectorId?: string;
}

// Telemetry Log
export interface TelemetryLog {
  timestamp: string;
  nodeId: string;
  message: string;
  severity: 'info' | 'warning' | 'critical';
}

// Data Source Types
export interface DataSource {
  name: string;
  status: 'Synced' | 'Active' | 'Congested' | 'Offline';
  load: string;
  icon: string;
  color: string;
}

// Chart Data
export interface TrendDataPoint {
  time: string;
  value: number;
}

// Tab Types
export type TabId = 'HOME' | 'GIS' | 'PLAN' | 'INTELLIGENCE';
