import { memo, useRef, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useSpectrogramData } from '@/hooks';

interface SpectrogramProps {
  width?: number;
  height?: number;
  barCount?: number;
}

export const Spectrogram = memo<SpectrogramProps>(function Spectrogram({
  width = 300,
  height = 150,
  barCount = 64,
}) {
  const data = useSpectrogramData(60);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas || data.length === 0) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Clear canvas
    ctx.fillStyle = '#020617';
    ctx.fillRect(0, 0, width, height);

    // Draw spectrogram
    const cellWidth = width / data.length;
    const cellHeight = height / barCount;

    data.forEach((frame, frameIndex) => {
      frame.forEach((value, binIndex) => {
        const x = frameIndex * cellWidth;
        const y = height - (binIndex * cellHeight);
        
        // Color based on intensity
        const intensity = value / 100;
        const hue = 180 + (1 - intensity) * 60; // Cyan to blue
        const saturation = 100;
        const lightness = 20 + intensity * 60;
        
        ctx.fillStyle = `hsla(${hue}, ${saturation}%, ${lightness}%, ${0.3 + intensity * 0.7})`;
        ctx.fillRect(x, y - cellHeight, cellWidth + 0.5, cellHeight + 0.5);
      });
    });

    // Draw grid lines
    ctx.strokeStyle = 'rgba(6, 182, 212, 0.1)';
    ctx.lineWidth = 0.5;
    
    // Horizontal lines
    for (let i = 0; i <= 4; i++) {
      const y = (height / 4) * i;
      ctx.beginPath();
      ctx.moveTo(0, y);
      ctx.lineTo(width, y);
      ctx.stroke();
    }

  }, [data, width, height, barCount]);

  return (
    <div className="relative">
      <canvas
        ref={canvasRef}
        width={width}
        height={height}
        className="rounded-xl border border-cyan-500/20"
      />
      <div className="absolute bottom-2 left-2 text-[8px] font-mono text-cyan-500/60 uppercase">
        Freq: 0-32Hz
      </div>
      <div className="absolute bottom-2 right-2 text-[8px] font-mono text-cyan-500/60 uppercase">
        Time: -6s
      </div>
      <div className="absolute top-2 left-2 flex items-center gap-2">
        <motion.div
          animate={{ opacity: [0.5, 1, 0.5] }}
          transition={{ repeat: Infinity, duration: 1 }}
          className="w-2 h-2 rounded-full bg-cyan-500"
        />
        <span className="text-[8px] font-mono text-cyan-500 uppercase">LIVE</span>
      </div>
    </div>
  );
});

export default Spectrogram;
