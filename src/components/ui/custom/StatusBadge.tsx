import { memo } from 'react';
import { cn } from '@/lib/utils';

type StatusType = 'CRITICAL' | 'HIGH' | 'MEDIUM' | 'LOW' | 'NORMAL' | 'STABLE' | 'WARNING' | 'DANGER' | 'SAFE' | 'ACTIVE' | 'OFFLINE';

interface StatusBadgeProps {
  status: StatusType;
  size?: 'sm' | 'md' | 'lg';
  pulse?: boolean;
}

const statusConfig: Record<StatusType, { bg: string; text: string; dot: string }> = {
  CRITICAL: { bg: 'bg-red-500', text: 'text-white', dot: 'bg-white' },
  HIGH: { bg: 'bg-red-500/20', text: 'text-red-500', dot: 'bg-red-500' },
  MEDIUM: { bg: 'bg-yellow-500/20', text: 'text-yellow-500', dot: 'bg-yellow-500' },
  LOW: { bg: 'bg-cyan-500/20', text: 'text-cyan-600', dot: 'bg-cyan-500' },
  NORMAL: { bg: 'bg-cyan-500/20', text: 'text-cyan-600', dot: 'bg-cyan-500' },
  STABLE: { bg: 'bg-green-500/20', text: 'text-green-600', dot: 'bg-green-500' },
  WARNING: { bg: 'bg-yellow-500/20', text: 'text-yellow-600', dot: 'bg-yellow-500' },
  DANGER: { bg: 'bg-red-500/20', text: 'text-red-500', dot: 'bg-red-500' },
  SAFE: { bg: 'bg-green-500/20', text: 'text-green-600', dot: 'bg-green-500' },
  ACTIVE: { bg: 'bg-cyan-500/20', text: 'text-cyan-600', dot: 'bg-cyan-500' },
  OFFLINE: { bg: 'bg-slate-500/20', text: 'text-slate-500', dot: 'bg-slate-500' },
};

const sizeConfig = {
  sm: 'px-2 py-0.5 text-[8px]',
  md: 'px-3 py-1 text-[10px]',
  lg: 'px-4 py-1.5 text-xs',
};

export const StatusBadge = memo<StatusBadgeProps>(function StatusBadge({
  status,
  size = 'md',
  pulse = false,
}) {
  const config = statusConfig[status] || statusConfig.NORMAL;

  return (
    <span
      className={cn(
        'inline-flex items-center gap-1.5 rounded-full font-black uppercase tracking-widest',
        config.bg,
        config.text,
        sizeConfig[size]
      )}
    >
      <span
        className={cn(
          'w-1.5 h-1.5 rounded-full',
          config.dot,
          pulse && 'animate-pulse'
        )}
      />
      {status}
    </span>
  );
});

export default StatusBadge;
