import { useState, useEffect, useRef } from 'react';
import type { FFTDataPoint } from '@/types';

// Hook for real-time FFT data
export function useRealtimeFFT(updateInterval: number = 100) {
  const [fftData, setFftData] = useState<FFTDataPoint[]>([]);
  const animationRef = useRef<number | null>(null);

  useEffect(() => {
    const generateData = () => {
      const now = Date.now();
      const newData: FFTDataPoint[] = Array.from({ length: 128 }, (_, i) => ({
        frequency: i * 0.5,
        amplitude: Math.random() * 40 + 
                  Math.sin(i * 0.1 + now * 0.001) * 20 + 
                  (i > 40 && i < 50 ? 30 : 0) + // Peak at 20-25Hz
                  10,
        timestamp: now,
      }));
      setFftData(newData);
    };

    const animate = () => {
      generateData();
      animationRef.current = setTimeout(() => {
        requestAnimationFrame(animate);
      }, updateInterval);
    };

    animate();

    return () => {
      if (animationRef.current !== null) {
        clearTimeout(animationRef.current);
      }
    };
  }, [updateInterval]);

  return fftData;
}

// Hook for spectrogram data
export function useSpectrogramData(historyLength: number = 60) {
  const [spectrogramData, setSpectrogramData] = useState<number[][]>([]);
  const animationRef = useRef<number | null>(null);

  useEffect(() => {
    const generateFrame = () => {
      const frame = Array.from({ length: 64 }, (_, i) => {
        const base = Math.random() * 30;
        const peak = (i > 20 && i < 30) ? Math.random() * 50 : 0;
        return Math.min(100, base + peak);
      });

      setSpectrogramData(prev => {
        const newData = [...prev, frame];
        if (newData.length > historyLength) {
          return newData.slice(newData.length - historyLength);
        }
        return newData;
      });
    };

    const animate = () => {
      generateFrame();
      animationRef.current = setTimeout(() => {
        requestAnimationFrame(animate);
      }, 100);
    };

    animate();

    return () => {
      if (animationRef.current !== null) {
        clearTimeout(animationRef.current);
      }
    };
  }, [historyLength]);

  return spectrogramData;
}

// Hook for animated counter
export function useAnimatedCounter(
  targetValue: number,
  duration: number = 1000,
  decimals: number = 0
): string {
  const [displayValue, setDisplayValue] = useState(0);
  const startTimeRef = useRef<number | null>(null);
  const startValueRef = useRef(0);

  useEffect(() => {
    startTimeRef.current = null;
    startValueRef.current = displayValue;

    const animate = (timestamp: number) => {
      if (!startTimeRef.current) {
        startTimeRef.current = timestamp;
      }

      const elapsed = timestamp - startTimeRef.current;
      const progress = Math.min(elapsed / duration, 1);
      
      // Ease out cubic
      const easeProgress = 1 - Math.pow(1 - progress, 3);
      
      const currentValue = startValueRef.current + (targetValue - startValueRef.current) * easeProgress;
      setDisplayValue(currentValue);

      if (progress < 1) {
        requestAnimationFrame(animate);
      }
    };

    requestAnimationFrame(animate);
  }, [targetValue, duration]);

  return displayValue.toFixed(decimals);
}

// Hook for pulsing animation
export function usePulseAnimation(active: boolean = true, interval: number = 1000) {
  const [pulse, setPulse] = useState(0);

  useEffect(() => {
    if (!active) return;

    const intervalId = setInterval(() => {
      setPulse(prev => (prev + 1) % 2);
    }, interval);

    return () => clearInterval(intervalId);
  }, [active, interval]);

  return pulse;
}

// Hook for time-based updates
export function useTimeUpdater(interval: number = 1000): string {
  const [time, setTime] = useState(new Date().toLocaleTimeString());

  useEffect(() => {
    const intervalId = setInterval(() => {
      setTime(new Date().toLocaleTimeString());
    }, interval);

    return () => clearInterval(intervalId);
  }, [interval]);

  return time;
}
