import * as React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import {
  TrendingUp,
  TrendingDown,
  Minus,
  ArrowRight,
  type LucideIcon,
} from 'lucide-react';

// =============================================================================
// TYPES
// =============================================================================

export interface KPIAction {
  label: string;
  href?: string;
  onClick?: () => void;
  variant?: 'default' | 'primary' | 'secondary' | 'ghost';
  icon?: LucideIcon;
}

export interface ActionableKPICardProps {
  /** Título do KPI */
  title: string;
  /** Valor principal formatado */
  value: string | number;
  /** Valor anterior para cálculo de variação */
  previousValue?: number;
  /** Variação percentual (se não quiser calcular automaticamente) */
  variation?: number;
  /** Texto de variação customizado */
  variationText?: string;
  /** Ícone do KPI */
  icon?: LucideIcon;
  /** Cor do ícone */
  iconColor?: string;
  /** Cor de fundo do ícone */
  iconBgColor?: string;
  /** Link principal ao clicar no card */
  href?: string;
  /** Ação ao clicar no card */
  onClick?: () => void;
  /** Ações secundárias no footer */
  actions?: KPIAction[];
  /** Destaque visual (pulse, glow) */
  highlight?: boolean;
  /** Tipo de destaque */
  highlightType?: 'pulse' | 'glow' | 'border';
  /** Cor do destaque */
  highlightColor?: 'primary' | 'success' | 'warning' | 'destructive';
  /** Tooltip explicativo */
  tooltip?: string;
  /** Loading state */
  loading?: boolean;
  /** Classes adicionais */
  className?: string;
  /** Tamanho do card */
  size?: 'sm' | 'md' | 'lg';
  /** Se variação positiva é boa ou ruim */
  positiveIsGood?: boolean;
}

// =============================================================================
// COMPONENT
// =============================================================================

export function ActionableKPICard({
  title,
  value,
  previousValue,
  variation: variationProp,
  variationText,
  icon: Icon,
  iconColor = 'text-primary',
  iconBgColor = 'bg-primary/10',
  href,
  onClick,
  actions = [],
  highlight = false,
  highlightType = 'pulse',
  highlightColor = 'primary',
  tooltip,
  loading = false,
  className,
  size = 'md',
  positiveIsGood = true,
}: ActionableKPICardProps) {
  // Calculate variation if previousValue is provided
  const variation = React.useMemo(() => {
    if (variationProp !== undefined) return variationProp;
    if (previousValue !== undefined && typeof value === 'number') {
      if (previousValue === 0) return value > 0 ? 100 : 0;
      return ((value - previousValue) / Math.abs(previousValue)) * 100;
    }
    return undefined;
  }, [variationProp, previousValue, value]);

  // Determine variation color and icon
  const variationInfo = React.useMemo(() => {
    if (variation === undefined) return null;

    const isPositive = variation > 0;
    const isNeutral = variation === 0;

    let color: string;
    let TrendIcon: LucideIcon;

    if (isNeutral) {
      color = 'text-muted-foreground';
      TrendIcon = Minus;
    } else if ((isPositive && positiveIsGood) || (!isPositive && !positiveIsGood)) {
      color = 'text-success';
      TrendIcon = TrendingUp;
    } else {
      color = 'text-destructive';
      TrendIcon = TrendingDown;
    }

    return {
      color,
      icon: TrendIcon,
      value: variation,
      text: variationText || `${variation > 0 ? '+' : ''}${variation.toFixed(1)}%`,
    };
  }, [variation, positiveIsGood, variationText]);

  // Size classes
  const sizeClasses = {
    sm: {
      card: 'p-3',
      icon: 'h-8 w-8',
      iconInner: 'h-4 w-4',
      title: 'text-xs',
      value: 'text-lg',
      variation: 'text-[10px]',
    },
    md: {
      card: 'p-4',
      icon: 'h-10 w-10',
      iconInner: 'h-5 w-5',
      title: 'text-sm',
      value: 'text-2xl',
      variation: 'text-xs',
    },
    lg: {
      card: 'p-5',
      icon: 'h-12 w-12',
      iconInner: 'h-6 w-6',
      title: 'text-sm',
      value: 'text-3xl',
      variation: 'text-sm',
    },
  };

  const sizes = sizeClasses[size];

  // Highlight classes
  const highlightClasses = highlight
    ? {
        pulse: 'animate-pulse',
        glow: `shadow-glow-${highlightColor}`,
        border: `ring-2 ring-${highlightColor} ring-offset-2`,
      }[highlightType]
    : '';

  // Interactive classes
  const isClickable = href || onClick;
  const interactiveClasses = isClickable
    ? 'cursor-pointer hover:shadow-md hover:scale-[1.02] active:scale-[0.98] transition-all duration-200'
    : '';

  // Card content
  const cardContent = (
    <Card
      className={cn(
        'relative overflow-hidden',
        sizes.card,
        highlightClasses,
        interactiveClasses,
        className
      )}
      onClick={onClick}
    >
      <CardContent className="p-0">
        {/* Loading Skeleton */}
        {loading ? (
          <div className="space-y-3 animate-pulse">
            <div className="flex items-center gap-3">
              <div className={cn('rounded-lg bg-muted', sizes.icon)} />
              <div className="space-y-2 flex-1">
                <div className="h-3 bg-muted rounded w-20" />
                <div className="h-6 bg-muted rounded w-24" />
              </div>
            </div>
          </div>
        ) : (
          <>
            {/* Main Content */}
            <div className="flex items-start gap-3">
              {/* Icon */}
              {Icon && (
                <div
                  className={cn(
                    'rounded-lg flex items-center justify-center flex-shrink-0',
                    sizes.icon,
                    iconBgColor
                  )}
                >
                  <Icon className={cn(sizes.iconInner, iconColor)} />
                </div>
              )}

              {/* Text */}
              <div className="flex-1 min-w-0">
                <p className={cn('text-muted-foreground font-medium', sizes.title)}>
                  {title}
                </p>
                <motion.p
                  className={cn('font-bold text-foreground tracking-tight', sizes.value)}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  key={String(value)}
                >
                  {value}
                </motion.p>
              </div>

              {/* Arrow indicator for clickable */}
              {isClickable && !actions.length && (
                <ArrowRight className="h-4 w-4 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity" />
              )}
            </div>

            {/* Variation */}
            {variationInfo && (
              <div className={cn('flex items-center gap-1 mt-2', sizes.variation)}>
                <variationInfo.icon className={cn('h-3 w-3', variationInfo.color)} />
                <span className={variationInfo.color}>{variationInfo.text}</span>
                <span className="text-muted-foreground">vs período anterior</span>
              </div>
            )}

            {/* Actions */}
            {actions.length > 0 && (
              <div className="flex items-center gap-2 mt-3 pt-3 border-t border-border">
                {actions.map((action, index) => {
                  const ActionIcon = action.icon;
                  const buttonContent = (
                    <>
                      {ActionIcon && <ActionIcon className="h-3 w-3 mr-1" />}
                      {action.label}
                    </>
                  );

                  if (action.href) {
                    return (
                      <Button
                        key={index}
                        variant={action.variant || 'ghost'}
                        size="sm"
                        className="h-7 text-xs"
                        asChild
                      >
                        <Link to={action.href}>{buttonContent}</Link>
                      </Button>
                    );
                  }

                  return (
                    <Button
                      key={index}
                      variant={action.variant || 'ghost'}
                      size="sm"
                      className="h-7 text-xs"
                      onClick={(e) => {
                        e.stopPropagation();
                        action.onClick?.();
                      }}
                    >
                      {buttonContent}
                    </Button>
                  );
                })}
              </div>
            )}
          </>
        )}
      </CardContent>
    </Card>
  );

  // Wrap with Link if href is provided
  const wrappedContent = href ? (
    <Link to={href} className="block group">
      {cardContent}
    </Link>
  ) : (
    <div className="group">{cardContent}</div>
  );

  // Wrap with Tooltip if provided
  if (tooltip) {
    return (
      <Tooltip>
        <TooltipTrigger asChild>{wrappedContent}</TooltipTrigger>
        <TooltipContent>
          <p>{tooltip}</p>
        </TooltipContent>
      </Tooltip>
    );
  }

  return wrappedContent;
}

// =============================================================================
// PRESET VARIANTS
// =============================================================================

export function RevenueKPICard(
  props: Omit<ActionableKPICardProps, 'icon' | 'iconColor' | 'iconBgColor' | 'positiveIsGood'>
) {
  return (
    <ActionableKPICard
      {...props}
      icon={TrendingUp}
      iconColor="text-success"
      iconBgColor="bg-success/10"
      positiveIsGood={true}
    />
  );
}

export function ExpenseKPICard(
  props: Omit<ActionableKPICardProps, 'icon' | 'iconColor' | 'iconBgColor' | 'positiveIsGood'>
) {
  return (
    <ActionableKPICard
      {...props}
      icon={TrendingDown}
      iconColor="text-destructive"
      iconBgColor="bg-destructive/10"
      positiveIsGood={false}
    />
  );
}
