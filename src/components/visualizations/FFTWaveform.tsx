import { memo, useRef, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useRealtimeFFT } from '@/hooks';

interface FFTWaveformProps {
  width?: number;
  height?: number;
}

export const FFTWaveform = memo<FFTWaveformProps>(function FFTWaveform({
  width = 300,
  height = 100,
}) {
  const fftData = useRealtimeFFT(50);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas || fftData.length === 0) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Clear canvas
    ctx.fillStyle = '#020617';
    ctx.fillRect(0, 0, width, height);

    // Draw waveform
    ctx.beginPath();
    ctx.strokeStyle = '#06b6d4';
    ctx.lineWidth = 2;

    const stepX = width / fftData.length;
    const maxAmp = Math.max(...fftData.map(d => d.amplitude), 1);

    fftData.forEach((point, i) => {
      const x = i * stepX;
      const y = height - (point.amplitude / maxAmp) * height * 0.8 - height * 0.1;
      
      if (i === 0) {
        ctx.moveTo(x, y);
      } else {
        ctx.lineTo(x, y);
      }
    });

    ctx.stroke();

    // Fill area under curve
    ctx.lineTo(width, height);
    ctx.lineTo(0, height);
    ctx.closePath();
    
    const gradient = ctx.createLinearGradient(0, 0, 0, height);
    gradient.addColorStop(0, 'rgba(6, 182, 212, 0.3)');
    gradient.addColorStop(1, 'rgba(6, 182, 212, 0)');
    ctx.fillStyle = gradient;
    ctx.fill();

    // Draw peak markers
    const peaks = fftData
      .map((d, i) => ({ ...d, index: i }))
      .filter((d, i, arr) => {
        if (i === 0 || i === arr.length - 1) return false;
        return d.amplitude > arr[i - 1].amplitude && d.amplitude > arr[i + 1].amplitude && d.amplitude > maxAmp * 0.6;
      })
      .slice(0, 3);

    peaks.forEach(peak => {
      const x = peak.index * stepX;
      const y = height - (peak.amplitude / maxAmp) * height * 0.8 - height * 0.1;
      
      ctx.beginPath();
      ctx.arc(x, y, 4, 0, Math.PI * 2);
      ctx.fillStyle = '#ef4444';
      ctx.fill();
      
      ctx.fillStyle = '#ef4444';
      ctx.font = '8px monospace';
      ctx.fillText(`${peak.frequency.toFixed(1)}Hz`, x - 10, y - 8);
    });

  }, [fftData, width, height]);

  return (
    <div className="relative">
      <canvas
        ref={canvasRef}
        width={width}
        height={height}
        className="rounded-xl border border-cyan-500/20"
      />
      <div className="absolute top-2 left-2 flex items-center gap-2">
        <motion.div
          animate={{ scale: [1, 1.2, 1] }}
          transition={{ repeat: Infinity, duration: 0.5 }}
          className="w-2 h-2 rounded-full bg-cyan-500"
        />
        <span className="text-[8px] font-mono text-cyan-500 uppercase">FFT: 104Hz</span>
      </div>
      <div className="absolute bottom-2 right-2 text-[8px] font-mono text-slate-500">
        Peak: 4.2Hz
      </div>
    </div>
  );
});

export default FFTWaveform;
