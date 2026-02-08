import React, { memo, useRef, useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { MESH_NODES } from '@/data/mockData';
import type { MeshNode } from '@/types';

interface MeshTopologyGraphProps {
  width?: number;
  height?: number;
}

export const MeshTopologyGraph = memo<MeshTopologyGraphProps>(function MeshTopologyGraph({
  width = 400,
  height = 300,
}) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [hoveredNode, setHoveredNode] = useState<MeshNode | null>(null);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });

  // Filter to visible nodes (limit for performance)
  const visibleNodes = MESH_NODES.slice(0, 30);

  // Calculate positions (center on canvas)
  const centerX = width / 2;
  const centerY = height / 2;
  const scale = 8000; // Scale factor for lat/lng to pixels

  const getNodePosition = (node: MeshNode) => {
    const baseLat = 28.61;
    const baseLng = 77.20;
    return {
      x: centerX + (node.position[1] - baseLng) * scale,
      y: centerY - (node.position[0] - baseLat) * scale,
    };
  };

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Clear canvas
    ctx.fillStyle = '#020617';
    ctx.fillRect(0, 0, width, height);

    // Draw grid
    ctx.strokeStyle = 'rgba(6, 182, 212, 0.05)';
    ctx.lineWidth = 1;
    const gridSize = 40;
    
    for (let x = 0; x < width; x += gridSize) {
      ctx.beginPath();
      ctx.moveTo(x, 0);
      ctx.lineTo(x, height);
      ctx.stroke();
    }
    
    for (let y = 0; y < height; y += gridSize) {
      ctx.beginPath();
      ctx.moveTo(0, y);
      ctx.lineTo(width, y);
      ctx.stroke();
    }

    // Draw connections
    visibleNodes.forEach(node => {
      const pos = getNodePosition(node);
      
      node.connections.forEach(targetId => {
        const target = visibleNodes.find(n => n.id === targetId);
        if (target) {
          const targetPos = getNodePosition(target);
          
          ctx.beginPath();
          ctx.moveTo(pos.x, pos.y);
          ctx.lineTo(targetPos.x, targetPos.y);
          ctx.strokeStyle = node.status === 'online' && target.status === 'online'
            ? 'rgba(6, 182, 212, 0.3)'
            : 'rgba(239, 68, 68, 0.2)';
          ctx.lineWidth = 1;
          ctx.stroke();
        }
      });
    });

    // Draw nodes
    visibleNodes.forEach(node => {
      const pos = getNodePosition(node);
      
      const color = node.status === 'online' ? '#22c55e' :
                    node.status === 'weak' ? '#eab308' : '#ef4444';
      
      // Node glow
      const gradient = ctx.createRadialGradient(pos.x, pos.y, 0, pos.x, pos.y, 15);
      gradient.addColorStop(0, color);
      gradient.addColorStop(1, 'transparent');
      ctx.fillStyle = gradient;
      ctx.beginPath();
      ctx.arc(pos.x, pos.y, 15, 0, Math.PI * 2);
      ctx.fill();
      
      // Node center
      ctx.beginPath();
      ctx.arc(pos.x, pos.y, 4, 0, Math.PI * 2);
      ctx.fillStyle = color;
      ctx.fill();
      
      // Node type indicator
      ctx.fillStyle = '#fff';
      ctx.font = '6px monospace';
      ctx.textAlign = 'center';
      ctx.fillText(node.type[0].toUpperCase(), pos.x, pos.y - 8);
    });

  }, [visibleNodes, width, height]);

  const handleMouseMove = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    setMousePos({ x: e.clientX, y: e.clientY });

    // Find hovered node
    const hovered = visibleNodes.find(node => {
      const pos = getNodePosition(node);
      const dist = Math.sqrt(Math.pow(pos.x - x, 2) + Math.pow(pos.y - y, 2));
      return dist < 15;
    });

    setHoveredNode(hovered || null);
  };

  return (
    <div className="relative">
      <canvas
        ref={canvasRef}
        width={width}
        height={height}
        className="rounded-xl border border-cyan-500/20 cursor-crosshair"
        onMouseMove={handleMouseMove}
        onMouseLeave={() => setHoveredNode(null)}
      />
      
      {/* Legend */}
      <div className="absolute bottom-2 left-2 flex gap-3 text-[8px] font-mono">
        <span className="flex items-center gap-1">
          <span className="w-2 h-2 rounded-full bg-green-500" />
          Online
        </span>
        <span className="flex items-center gap-1">
          <span className="w-2 h-2 rounded-full bg-yellow-500" />
          Weak
        </span>
        <span className="flex items-center gap-1">
          <span className="w-2 h-2 rounded-full bg-red-500" />
          Offline
        </span>
      </div>

      {/* Stats */}
      <div className="absolute top-2 right-2 text-right">
        <p className="text-[8px] font-mono text-slate-500">Nodes: {visibleNodes.length}</p>
        <p className="text-[8px] font-mono text-green-500">
          Online: {visibleNodes.filter(n => n.status === 'online').length}
        </p>
      </div>

      {/* Tooltip */}
      {hoveredNode && (
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="fixed z-50 bg-slate-900 border border-cyan-500/30 rounded-lg p-2 text-[10px] font-mono"
          style={{ left: mousePos.x + 10, top: mousePos.y - 40 }}
        >
          <p className="text-cyan-400 font-bold">{hoveredNode.id}</p>
          <p className="text-slate-400">Type: {hoveredNode.type}</p>
          <p className="text-slate-400">Battery: {hoveredNode.batteryLevel}%</p>
          <p className={hoveredNode.status === 'online' ? 'text-green-400' : 'text-yellow-400'}>
            Status: {hoveredNode.status}
          </p>
        </motion.div>
      )}
    </div>
  );
});

export default MeshTopologyGraph;
