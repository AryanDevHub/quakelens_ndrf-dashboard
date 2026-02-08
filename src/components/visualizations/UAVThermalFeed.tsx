import { memo, useRef, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Crosshair, Battery, Navigation, Target } from 'lucide-react';
import { UAV_FEEDS } from '@/data/mockData';

interface UAVThermalFeedProps {
  uavId?: string;
  width?: number;
  height?: number;
}

export const UAVThermalFeed = memo<UAVThermalFeedProps>(function UAVThermalFeed({
  uavId = 'UAV-01',
  width = 320,
  height = 240,
}) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  
  const uav = UAV_FEEDS.find(u => u.id === uavId) || UAV_FEEDS[0];

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationId: number;
    let offset = 0;

    const animate = () => {
      offset += 0.5;
      
      // Clear canvas
      ctx.fillStyle = '#000';
      ctx.fillRect(0, 0, width, height);

      // Generate thermal noise background
      const imageData = ctx.createImageData(width, height);
      for (let i = 0; i < imageData.data.length; i += 4) {
        const noise = Math.random() * 30;
        imageData.data[i] = noise;     // R
        imageData.data[i + 1] = noise; // G
        imageData.data[i + 2] = noise; // B
        imageData.data[i + 3] = 255;   // A
      }
      ctx.putImageData(imageData, 0, 0);

      // Draw buildings (dark shapes)
      ctx.fillStyle = '#1a1a1a';
      ctx.fillRect(50, 80, 80, 120);
      ctx.fillRect(180, 60, 100, 140);
      ctx.fillRect(100, 200, 150, 40);

      // Draw thermal signatures (targets)
      uav.thermalTargets.forEach(target => {
        const x = target.relativeX * width;
        const y = target.relativeY * height;
        
        // Thermal glow
        const gradient = ctx.createRadialGradient(x, y, 0, x, y, 30);
        const tempIntensity = (target.temperature - 30) / 20;
        
        if (target.type === 'HUMAN') {
          gradient.addColorStop(0, `rgba(255, 200, 100, ${0.3 + tempIntensity * 0.4})`);
          gradient.addColorStop(0.5, `rgba(255, 150, 50, ${0.2 + tempIntensity * 0.2})`);
          gradient.addColorStop(1, 'transparent');
        } else {
          gradient.addColorStop(0, `rgba(255, 100, 50, ${0.4 + tempIntensity * 0.3})`);
          gradient.addColorStop(0.5, `rgba(200, 50, 30, ${0.2 + tempIntensity * 0.2})`);
          gradient.addColorStop(1, 'transparent');
        }
        
        ctx.fillStyle = gradient;
        ctx.beginPath();
        ctx.arc(x, y, 30, 0, Math.PI * 2);
        ctx.fill();

        // Target center
        ctx.fillStyle = target.type === 'HUMAN' ? '#ffcc66' : '#ff6633';
        ctx.beginPath();
        ctx.arc(x, y, 4, 0, Math.PI * 2);
        ctx.fill();

        // Target ID
        ctx.fillStyle = '#fff';
        ctx.font = '8px monospace';
        ctx.fillText(target.id, x + 8, y - 8);
        
        // Temperature
        ctx.fillStyle = '#ffcc66';
        ctx.fillText(`${target.temperature.toFixed(1)}°C`, x + 8, y + 4);
      });

      // Scan line effect
      const scanY = (offset % (height + 40)) - 20;
      ctx.strokeStyle = 'rgba(6, 182, 212, 0.3)';
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.moveTo(0, scanY);
      ctx.lineTo(width, scanY);
      ctx.stroke();

      // HUD overlay
      ctx.strokeStyle = 'rgba(6, 182, 212, 0.5)';
      ctx.lineWidth = 1;
      
      // Crosshair
      const cx = width / 2;
      const cy = height / 2;
      ctx.beginPath();
      ctx.moveTo(cx - 20, cy);
      ctx.lineTo(cx - 5, cy);
      ctx.moveTo(cx + 5, cy);
      ctx.lineTo(cx + 20, cy);
      ctx.moveTo(cx, cy - 20);
      ctx.lineTo(cx, cy - 5);
      ctx.moveTo(cx, cy + 5);
      ctx.lineTo(cx, cy + 20);
      ctx.stroke();

      // Corner brackets
      const bracketSize = 20;
      ctx.beginPath();
      ctx.moveTo(10, 10 + bracketSize);
      ctx.lineTo(10, 10);
      ctx.lineTo(10 + bracketSize, 10);
      ctx.moveTo(width - 10 - bracketSize, 10);
      ctx.lineTo(width - 10, 10);
      ctx.lineTo(width - 10, 10 + bracketSize);
      ctx.moveTo(width - 10, height - 10 - bracketSize);
      ctx.lineTo(width - 10, height - 10);
      ctx.lineTo(width - 10 - bracketSize, height - 10);
      ctx.moveTo(10 + bracketSize, height - 10);
      ctx.lineTo(10, height - 10);
      ctx.lineTo(10, height - 10 - bracketSize);
      ctx.stroke();

      animationId = requestAnimationFrame(animate);
    };

    animate();

    return () => cancelAnimationFrame(animationId);
  }, [uav, width, height]);

  return (
    <div className="relative">
      <canvas
        ref={canvasRef}
        width={width}
        height={height}
        className="rounded-xl border border-cyan-500/20"
      />
      
      {/* HUD Overlay */}
      <div className="absolute top-2 left-2 flex items-center gap-2">
        <motion.div
          animate={{ opacity: [0.5, 1, 0.5] }}
          transition={{ repeat: Infinity, duration: 1 }}
          className="w-2 h-2 rounded-full bg-red-500"
        />
        <span className="text-[8px] font-mono text-red-400 uppercase">REC</span>
      </div>

      <div className="absolute top-2 right-2 text-right">
        <p className="text-[8px] font-mono text-cyan-400">{uav.name}</p>
        <p className="text-[8px] font-mono text-slate-400">FLIR THERMAL</p>
      </div>

      <div className="absolute bottom-2 left-2 space-y-1">
        <div className="flex items-center gap-1 text-[8px] font-mono text-slate-400">
          <Navigation size={10} className="text-cyan-400" />
          {uav.altitude}m
        </div>
        <div className="flex items-center gap-1 text-[8px] font-mono text-slate-400">
          <Battery size={10} className={uav.battery < 30 ? 'text-red-400' : 'text-green-400'} />
          {uav.battery}%
        </div>
      </div>

      <div className="absolute bottom-2 right-2 text-right">
        <p className="text-[8px] font-mono text-yellow-400">
          <Target size={10} className="inline mr-1" />
          {uav.thermalTargets.length} TARGETS
        </p>
        <p className="text-[8px] font-mono text-slate-400">
          {uav.thermalTargets.filter(t => t.type === 'HUMAN').length} HUMAN
        </p>
      </div>

      {/* Center crosshair icon */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none">
        <Crosshair size={24} className="text-cyan-500/30" />
      </div>
    </div>
  );
});

export default UAVThermalFeed;
