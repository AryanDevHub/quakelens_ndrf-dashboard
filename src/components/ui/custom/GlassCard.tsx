import React, { memo } from 'react';
import { cn } from '@/lib/utils';

interface GlassCardProps {
  children: React.ReactNode;
  title?: string;
  icon?: React.ComponentType<{ size?: number; className?: string }>;
  className?: string;
  variant?: 'default' | 'danger' | 'warning' | 'success' | 'info';
  borderPosition?: 'all' | 'left' | 'right' | 'top' | 'bottom';
  onClick?: () => void;
}

const variantStyles = {
  default: 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800',
  danger: 'bg-red-50 dark:bg-red-950/20 border-red-200 dark:border-red-900/30',
  warning: 'bg-yellow-50 dark:bg-yellow-950/20 border-yellow-200 dark:border-yellow-900/30',
  success: 'bg-green-50 dark:bg-green-950/20 border-green-200 dark:border-green-900/30',
  info: 'bg-cyan-50 dark:bg-cyan-950/20 border-cyan-200 dark:border-cyan-900/30',
};

const borderPositionStyles = {
  all: '',
  left: 'border-l-4',
  right: 'border-r-4',
  top: 'border-t-4',
  bottom: 'border-b-4',
};

const borderColorStyles = {
  default: 'border-l-slate-300 dark:border-l-slate-700',
  danger: 'border-l-red-500',
  warning: 'border-l-yellow-500',
  success: 'border-l-green-500',
  info: 'border-l-cyan-500',
};

export const GlassCard = memo<GlassCardProps>(function GlassCard({
  children,
  title,
  icon: Icon,
  className,
  variant = 'default',
  borderPosition = 'all',
  onClick,
}) {
  return (
    <div
      className={cn(
        'rounded-[2rem] p-6 shadow-xl relative overflow-hidden transition-all duration-300 border',
        variantStyles[variant],
        borderPosition !== 'all' && borderPositionStyles[borderPosition],
        borderPosition === 'left' && borderColorStyles[variant],
        onClick && 'cursor-pointer hover:shadow-2xl active:scale-[0.99]',
        className
      )}
      onClick={onClick}
    >
      {title && (
        <div className="flex items-center gap-3 mb-6 border-b border-slate-100 dark:border-white/5 pb-4">
          {Icon && <Icon size={18} className="text-cyan-600" />}
          <h3 className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-500 dark:text-slate-400">
            {title}
          </h3>
        </div>
      )}
      {children}
    </div>
  );
});

export default GlassCard;
