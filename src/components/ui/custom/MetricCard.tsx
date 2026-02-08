import { memo } from 'react';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';
import { useAnimatedCounter } from '@/hooks';

interface MetricCardProps {
  label: string;
  value: number | string;
  unit?: string;
  icon: React.ComponentType<{ size?: number; className?: string }>;
  color: string;
  animate?: boolean;
  decimals?: number;
  trend?: 'up' | 'down' | 'neutral';
  trendValue?: string;
}

export const MetricCard = memo<MetricCardProps>(function MetricCard({
  label,
  value,
  unit = '',
  icon: Icon,
  color,
  animate = true,
  decimals = 0,
  trend,
  trendValue,
}) {
  const numericValue = typeof value === 'number' ? value : parseFloat(value as string) || 0;
  const animatedValue = useAnimatedCounter(numericValue, 1000, decimals);
  const displayValue = animate ? animatedValue : value;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className={cn(
        'bg-white dark:bg-slate-900 rounded-[2rem] p-6 shadow-xl border border-slate-200 dark:border-slate-800',
        'border-l-4 transition-all duration-300 hover:shadow-2xl'
      )}
      style={{ borderLeftColor: color }}
    >
      <div className="flex items-center gap-4">
        <div
          className="p-3 rounded-xl"
          style={{ backgroundColor: `${color}20` }}
        >
          <div style={{ color }}>
            <Icon size={28} />
          </div>
        </div>
        <div className="flex-1">
          <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest leading-none mb-1">
            {label}
          </p>
          <div className="flex items-baseline gap-1">
            <p className="text-2xl font-mono font-black" style={{ color }}>
              {displayValue}
            </p>
            {unit && (
              <span className="text-sm text-slate-500 font-bold">{unit}</span>
            )}
          </div>
          {trend && trendValue && (
            <div className="flex items-center gap-1 mt-1">
              <span
                className={cn(
                  'text-[9px] font-bold uppercase',
                  trend === 'up' ? 'text-green-500' :
                  trend === 'down' ? 'text-red-500' : 'text-slate-500'
                )}
              >
                {trend === 'up' ? '↑' : trend === 'down' ? '↓' : '→'} {trendValue}
              </span>
            </div>
          )}
        </div>
      </div>
    </motion.div>
  );
});

export default MetricCard;
