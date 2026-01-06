import * as React from 'react';
import { motion } from 'framer-motion';
import {
  TrendingUp,
  TrendingDown,
  Minus,
  ArrowUpRight,
  ArrowDownRight,
  Info,
  MoreVertical,
  type LucideIcon,
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Skeleton } from '@/components/ui/skeleton';
import { cn } from '@/lib/utils';

// =============================================================================
// TYPES
// =============================================================================

export interface StatCardProps {
  /** Título do stat */
  title: string;
  /** Valor principal */
  value: string | number;
  /** Valor anterior (para comparação) */
  previousValue?: string | number;
  /** Porcentagem de mudança */
  change?: number;
  /** Período de comparação */
  changePeriod?: string;
  /** Tipo de mudança (positive é bom, negative é ruim) */
  changeType?: 'positive' | 'negative' | 'neutral';
  /** Ícone */
  icon?: LucideIcon;
  /** Cor do ícone */
  iconColor?: string;
  /** Background do ícone */
  iconBg?: string;
  /** Descrição/tooltip */
  description?: string;
  /** Data para sparkline mini */
  sparklineData?: number[];
  /** Loading state */
  loading?: boolean;
  /** Ações do menu */
  actions?: Array<{ label: string; onClick: () => void }>;
  /** Click na card */
  onClick?: () => void;
  /** Tamanho */
  size?: 'sm' | 'md' | 'lg';
  /** Classes adicionais */
  className?: string;
}

// =============================================================================
// SPARKLINE MINI
// =============================================================================

function Sparkline({
  data,
  color = 'text-primary',
  height = 40,
}: {
  data: number[];
  color?: string;
  height?: number;
}) {
  if (data.length < 2) return null;

  const min = Math.min(...data);
  const max = Math.max(...data);
  const range = max - min || 1;

  const points = data
    .map((value, index) => {
      const x = (index / (data.length - 1)) * 100;
      const y = height - ((value - min) / range) * height;
      return `${x},${y}`;
    })
    .join(' ');

  return (
    <svg
      viewBox={`0 0 100 ${height}`}
      className={cn('w-full', color)}
      preserveAspectRatio="none"
      style={{ height }}
    >
      <polyline
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        points={points}
      />
    </svg>
  );
}

// =============================================================================
// STAT CARD
// =============================================================================

export function StatCard({
  title,
  value,
  previousValue,
  change,
  changePeriod = 'vs mês anterior',
  changeType,
  icon: Icon,
  iconColor = 'text-primary',
  iconBg = 'bg-primary/10',
  description,
  sparklineData,
  loading = false,
  actions,
  onClick,
  size = 'md',
  className,
}: StatCardProps) {
  // Determine trend direction
  const getTrendIcon = () => {
    if (change === undefined || change === 0) {
      return { icon: Minus, color: 'text-muted-foreground' };
    }
    const isPositive = change > 0;
    const isGood = changeType === 'positive' ? isPositive : changeType === 'negative' ? !isPositive : true;

    return {
      icon: isPositive ? TrendingUp : TrendingDown,
      color: isGood ? 'text-success' : 'text-destructive',
    };
  };

  const trend = getTrendIcon();
  const TrendIcon = trend.icon;

  // Size styles
  const sizeStyles = {
    sm: {
      card: 'p-3',
      title: 'text-xs',
      value: 'text-xl',
      icon: 'h-8 w-8',
      iconInner: 'h-4 w-4',
      change: 'text-[10px]',
    },
    md: {
      card: 'p-4',
      title: 'text-sm',
      value: 'text-2xl',
      icon: 'h-10 w-10',
      iconInner: 'h-5 w-5',
      change: 'text-xs',
    },
    lg: {
      card: 'p-6',
      title: 'text-base',
      value: 'text-3xl',
      icon: 'h-12 w-12',
      iconInner: 'h-6 w-6',
      change: 'text-sm',
    },
  };

  const styles = sizeStyles[size];

  if (loading) {
    return (
      <Card className={cn(styles.card, className)}>
        <div className="flex items-start justify-between">
          <div className="space-y-2">
            <Skeleton className="h-4 w-24" />
            <Skeleton className="h-8 w-32" />
            <Skeleton className="h-3 w-20" />
          </div>
          <Skeleton className={cn('rounded-lg', styles.icon)} />
        </div>
      </Card>
    );
  }

  return (
    <motion.div
      whileHover={onClick ? { scale: 1.02 } : {}}
      whileTap={onClick ? { scale: 0.98 } : {}}
    >
      <Card
        className={cn(
          styles.card,
          onClick && 'cursor-pointer hover:shadow-md transition-shadow',
          className
        )}
        onClick={onClick}
      >
        <div className="flex items-start justify-between">
          {/* Content */}
          <div className="space-y-1">
            {/* Title with tooltip */}
            <div className="flex items-center gap-1.5">
              <span className={cn('font-medium text-muted-foreground', styles.title)}>
                {title}
              </span>
              {description && (
                <Tooltip>
                  <TooltipTrigger asChild>
                    <button type="button">
                      <Info className="h-3 w-3 text-muted-foreground" />
                    </button>
                  </TooltipTrigger>
                  <TooltipContent className="max-w-xs">
                    {description}
                  </TooltipContent>
                </Tooltip>
              )}
            </div>

            {/* Value */}
            <p className={cn('font-bold tracking-tight', styles.value)}>
              {typeof value === 'number'
                ? new Intl.NumberFormat('pt-BR', {
                    style: 'currency',
                    currency: 'BRL',
                  }).format(value)
                : value}
            </p>

            {/* Change indicator */}
            {change !== undefined && (
              <div className={cn('flex items-center gap-1', styles.change)}>
                <span className={cn('flex items-center', trend.color)}>
                  <TrendIcon className="h-3 w-3 mr-0.5" />
                  {Math.abs(change).toFixed(1)}%
                </span>
                <span className="text-muted-foreground">{changePeriod}</span>
              </div>
            )}

            {/* Previous value */}
            {previousValue !== undefined && (
              <p className="text-xs text-muted-foreground">
                Anterior:{' '}
                {typeof previousValue === 'number'
                  ? new Intl.NumberFormat('pt-BR', {
                      style: 'currency',
                      currency: 'BRL',
                    }).format(previousValue)
                  : previousValue}
              </p>
            )}
          </div>

          {/* Right side: Icon or sparkline */}
          <div className="flex flex-col items-end gap-2">
            {/* Actions menu */}
            {actions && actions.length > 0 && (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="icon" className="h-6 w-6 -mt-1 -mr-1">
                    <MoreVertical className="h-3 w-3" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  {actions.map((action, index) => (
                    <DropdownMenuItem key={index} onClick={action.onClick}>
                      {action.label}
                    </DropdownMenuItem>
                  ))}
                </DropdownMenuContent>
              </DropdownMenu>
            )}

            {/* Icon */}
            {Icon && (
              <div className={cn('rounded-lg flex items-center justify-center', iconBg, styles.icon)}>
                <Icon className={cn(iconColor, styles.iconInner)} />
              </div>
            )}

            {/* Sparkline */}
            {sparklineData && sparklineData.length > 0 && (
              <div className="w-16">
                <Sparkline
                  data={sparklineData}
                  color={trend.color}
                  height={size === 'sm' ? 24 : size === 'lg' ? 40 : 32}
                />
              </div>
            )}
          </div>
        </div>
      </Card>
    </motion.div>
  );
}

// =============================================================================
// STAT CARD GRID
// =============================================================================

export function StatCardGrid({
  children,
  columns = 4,
  className,
}: {
  children: React.ReactNode;
  columns?: 2 | 3 | 4 | 5;
  className?: string;
}) {
  const gridCols = {
    2: 'grid-cols-1 sm:grid-cols-2',
    3: 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3',
    4: 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-4',
    5: 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5',
  };

  return (
    <div className={cn('grid gap-4', gridCols[columns], className)}>
      {children}
    </div>
  );
}

// =============================================================================
// COMPACT STAT
// =============================================================================

export function CompactStat({
  label,
  value,
  change,
  changeType,
  className,
}: {
  label: string;
  value: string | number;
  change?: number;
  changeType?: 'positive' | 'negative' | 'neutral';
  className?: string;
}) {
  const isPositive = change !== undefined && change > 0;
  const isGood = changeType === 'positive' ? isPositive : changeType === 'negative' ? !isPositive : true;

  return (
    <div className={cn('flex items-center justify-between', className)}>
      <span className="text-sm text-muted-foreground">{label}</span>
      <div className="flex items-center gap-2">
        <span className="font-semibold">
          {typeof value === 'number'
            ? new Intl.NumberFormat('pt-BR', {
                style: 'currency',
                currency: 'BRL',
              }).format(value)
            : value}
        </span>
        {change !== undefined && (
          <span
            className={cn(
              'text-xs flex items-center',
              isGood ? 'text-success' : 'text-destructive'
            )}
          >
            {isPositive ? (
              <ArrowUpRight className="h-3 w-3" />
            ) : (
              <ArrowDownRight className="h-3 w-3" />
            )}
            {Math.abs(change).toFixed(1)}%
          </span>
        )}
      </div>
    </div>
  );
}

// =============================================================================
// STAT LIST
// =============================================================================

export function StatList({
  stats,
  className,
}: {
  stats: Array<{
    label: string;
    value: string | number;
    change?: number;
    changeType?: 'positive' | 'negative' | 'neutral';
  }>;
  className?: string;
}) {
  return (
    <Card className={className}>
      <CardContent className="p-4 space-y-3">
        {stats.map((stat, index) => (
          <React.Fragment key={index}>
            <CompactStat {...stat} />
            {index < stats.length - 1 && <hr className="border-border" />}
          </React.Fragment>
        ))}
      </CardContent>
    </Card>
  );
}

// =============================================================================
// COMPARISON STAT
// =============================================================================

export function ComparisonStat({
  title,
  currentValue,
  currentLabel = 'Atual',
  compareValue,
  compareLabel = 'Anterior',
  format = 'currency',
  className,
}: {
  title: string;
  currentValue: number;
  currentLabel?: string;
  compareValue: number;
  compareLabel?: string;
  format?: 'currency' | 'number' | 'percent';
  className?: string;
}) {
  const formatValue = (value: number) => {
    switch (format) {
      case 'currency':
        return new Intl.NumberFormat('pt-BR', {
          style: 'currency',
          currency: 'BRL',
        }).format(value);
      case 'percent':
        return `${value.toFixed(1)}%`;
      default:
        return new Intl.NumberFormat('pt-BR').format(value);
    }
  };

  const diff = ((currentValue - compareValue) / compareValue) * 100;
  const isPositive = diff > 0;
  const progressPercent = (currentValue / Math.max(currentValue, compareValue)) * 100;
  const comparePercent = (compareValue / Math.max(currentValue, compareValue)) * 100;

  return (
    <Card className={className}>
      <CardHeader className="pb-2">
        <CardTitle className="text-sm font-medium text-muted-foreground">
          {title}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex items-end justify-between">
          <div>
            <p className="text-2xl font-bold">{formatValue(currentValue)}</p>
            <p className="text-xs text-muted-foreground">{currentLabel}</p>
          </div>
          <div className="text-right">
            <p className="text-lg text-muted-foreground">{formatValue(compareValue)}</p>
            <p className="text-xs text-muted-foreground">{compareLabel}</p>
          </div>
        </div>

        {/* Progress bars */}
        <div className="space-y-2">
          <div className="relative h-2 bg-muted rounded-full overflow-hidden">
            <motion.div
              className="absolute top-0 left-0 h-full bg-primary rounded-full"
              initial={{ width: 0 }}
              animate={{ width: `${progressPercent}%` }}
              transition={{ duration: 0.5 }}
            />
          </div>
          <div className="relative h-2 bg-muted rounded-full overflow-hidden">
            <motion.div
              className="absolute top-0 left-0 h-full bg-muted-foreground/30 rounded-full"
              initial={{ width: 0 }}
              animate={{ width: `${comparePercent}%` }}
              transition={{ duration: 0.5 }}
            />
          </div>
        </div>

        {/* Change indicator */}
        <div
          className={cn(
            'flex items-center justify-center gap-1 text-sm font-medium',
            isPositive ? 'text-success' : 'text-destructive'
          )}
        >
          {isPositive ? (
            <TrendingUp className="h-4 w-4" />
          ) : (
            <TrendingDown className="h-4 w-4" />
          )}
          <span>{isPositive ? '+' : ''}{diff.toFixed(1)}%</span>
        </div>
      </CardContent>
    </Card>
  );
}

// =============================================================================
// PRESET CARDS
// =============================================================================

export function RevenueStatCard(props: Omit<StatCardProps, 'changeType'>) {
  return <StatCard changeType="positive" {...props} />;
}

export function ExpenseStatCard(props: Omit<StatCardProps, 'changeType'>) {
  return <StatCard changeType="negative" {...props} />;
}
