import * as React from 'react';
import { motion } from 'framer-motion';
import {
  CheckCircle,
  Clock,
  AlertTriangle,
  XCircle,
  Timer,
  ShieldCheck,
  Ban,
  Loader2,
  type LucideIcon,
} from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';

// =============================================================================
// TYPES
// =============================================================================

export type FinancialStatus =
  // Pagamento
  | 'pago'
  | 'pendente'
  | 'vencido'
  | 'parcial'
  | 'cancelado'
  // Recebimento
  | 'recebido'
  | 'a_receber'
  | 'inadimplente'
  // Aprovação
  | 'aprovado'
  | 'rejeitado'
  | 'aguardando_aprovacao'
  // Geral
  | 'ativo'
  | 'inativo'
  | 'processando'
  | 'erro'
  | 'sucesso'
  | 'draft';

export interface StatusBadgeProps {
  /** Status financeiro */
  status: FinancialStatus | string;
  /** Label customizado (sobrescreve o padrão) */
  label?: string;
  /** Tamanho */
  size?: 'sm' | 'md' | 'lg';
  /** Mostrar ícone */
  showIcon?: boolean;
  /** Animação de pulse para status ativos */
  pulse?: boolean;
  /** Classes adicionais */
  className?: string;
}

// =============================================================================
// STATUS CONFIG
// =============================================================================

interface StatusConfig {
  label: string;
  icon: LucideIcon;
  className: string;
  pulseColor?: string;
}

const statusConfigs: Record<string, StatusConfig> = {
  // Pagamento
  pago: {
    label: 'Pago',
    icon: CheckCircle,
    className: 'bg-success/10 text-success border-success/20 hover:bg-success/20',
  },
  pendente: {
    label: 'Pendente',
    icon: Clock,
    className: 'bg-warning/10 text-warning border-warning/20 hover:bg-warning/20',
    pulseColor: 'bg-warning',
  },
  vencido: {
    label: 'Vencido',
    icon: AlertTriangle,
    className: 'bg-destructive/10 text-destructive border-destructive/20 hover:bg-destructive/20',
    pulseColor: 'bg-destructive',
  },
  parcial: {
    label: 'Parcial',
    icon: Timer,
    className: 'bg-secondary/10 text-secondary border-secondary/20 hover:bg-secondary/20',
  },
  cancelado: {
    label: 'Cancelado',
    icon: Ban,
    className: 'bg-muted text-muted-foreground border-border hover:bg-muted/80',
  },

  // Recebimento
  recebido: {
    label: 'Recebido',
    icon: CheckCircle,
    className: 'bg-success/10 text-success border-success/20 hover:bg-success/20',
  },
  a_receber: {
    label: 'A Receber',
    icon: Clock,
    className: 'bg-primary/10 text-primary border-primary/20 hover:bg-primary/20',
  },
  inadimplente: {
    label: 'Inadimplente',
    icon: AlertTriangle,
    className: 'bg-destructive/10 text-destructive border-destructive/20 hover:bg-destructive/20',
    pulseColor: 'bg-destructive',
  },

  // Aprovação
  aprovado: {
    label: 'Aprovado',
    icon: ShieldCheck,
    className: 'bg-success/10 text-success border-success/20 hover:bg-success/20',
  },
  rejeitado: {
    label: 'Rejeitado',
    icon: XCircle,
    className: 'bg-destructive/10 text-destructive border-destructive/20 hover:bg-destructive/20',
  },
  aguardando_aprovacao: {
    label: 'Aguardando Aprovação',
    icon: Clock,
    className: 'bg-warning/10 text-warning border-warning/20 hover:bg-warning/20',
    pulseColor: 'bg-warning',
  },

  // Geral
  ativo: {
    label: 'Ativo',
    icon: CheckCircle,
    className: 'bg-success/10 text-success border-success/20 hover:bg-success/20',
  },
  inativo: {
    label: 'Inativo',
    icon: Ban,
    className: 'bg-muted text-muted-foreground border-border hover:bg-muted/80',
  },
  processando: {
    label: 'Processando',
    icon: Loader2,
    className: 'bg-primary/10 text-primary border-primary/20 hover:bg-primary/20',
  },
  erro: {
    label: 'Erro',
    icon: XCircle,
    className: 'bg-destructive/10 text-destructive border-destructive/20 hover:bg-destructive/20',
  },
  sucesso: {
    label: 'Sucesso',
    icon: CheckCircle,
    className: 'bg-success/10 text-success border-success/20 hover:bg-success/20',
  },
  draft: {
    label: 'Rascunho',
    icon: Clock,
    className: 'bg-muted text-muted-foreground border-border hover:bg-muted/80',
  },
};

// Aliases para status em português alternativo
const statusAliases: Record<string, string> = {
  paid: 'pago',
  pending: 'pendente',
  overdue: 'vencido',
  partial: 'parcial',
  cancelled: 'cancelado',
  received: 'recebido',
  approved: 'aprovado',
  rejected: 'rejeitado',
  active: 'ativo',
  inactive: 'inativo',
  processing: 'processando',
  error: 'erro',
  success: 'sucesso',
};

// =============================================================================
// COMPONENT
// =============================================================================

export function StatusBadge({
  status,
  label,
  size = 'md',
  showIcon = true,
  pulse = false,
  className,
}: StatusBadgeProps) {
  // Normalize status
  const normalizedStatus = statusAliases[status.toLowerCase()] || status.toLowerCase().replace(/[\s-]/g, '_');
  const config = statusConfigs[normalizedStatus];

  // Fallback for unknown status
  if (!config) {
    return (
      <Badge variant="outline" className={cn('capitalize', className)}>
        {label || status}
      </Badge>
    );
  }

  const Icon = config.icon;
  const displayLabel = label || config.label;
  const shouldPulse = pulse && config.pulseColor;

  // Size classes
  const sizeClasses = {
    sm: {
      badge: 'text-[10px] px-1.5 py-0.5 gap-1',
      icon: 'h-3 w-3',
      pulse: 'h-1.5 w-1.5',
    },
    md: {
      badge: 'text-xs px-2 py-1 gap-1.5',
      icon: 'h-3.5 w-3.5',
      pulse: 'h-2 w-2',
    },
    lg: {
      badge: 'text-sm px-3 py-1.5 gap-2',
      icon: 'h-4 w-4',
      pulse: 'h-2.5 w-2.5',
    },
  };

  const sizes = sizeClasses[size];

  return (
    <Badge
      variant="outline"
      className={cn(
        'inline-flex items-center font-medium border transition-colors',
        config.className,
        sizes.badge,
        className
      )}
    >
      {/* Pulse indicator */}
      {shouldPulse && (
        <span className="relative flex">
          <span
            className={cn(
              'animate-ping absolute inline-flex h-full w-full rounded-full opacity-75',
              config.pulseColor
            )}
          />
          <span className={cn('relative inline-flex rounded-full', config.pulseColor, sizes.pulse)} />
        </span>
      )}

      {/* Icon */}
      {showIcon && !shouldPulse && (
        <Icon
          className={cn(
            sizes.icon,
            normalizedStatus === 'processando' && 'animate-spin'
          )}
        />
      )}

      {/* Label */}
      <span>{displayLabel}</span>
    </Badge>
  );
}

// =============================================================================
// PRESET STATUS BADGES
// =============================================================================

/** Badge para status de pagamento */
export function PaymentStatusBadge({
  status,
  ...props
}: Omit<StatusBadgeProps, 'status'> & {
  status: 'pago' | 'pendente' | 'vencido' | 'parcial' | 'cancelado';
}) {
  return <StatusBadge status={status} {...props} />;
}

/** Badge para status de aprovação */
export function ApprovalStatusBadge({
  status,
  ...props
}: Omit<StatusBadgeProps, 'status'> & {
  status: 'aprovado' | 'rejeitado' | 'aguardando_aprovacao';
}) {
  const shouldPulse = status === 'aguardando_aprovacao';
  return <StatusBadge status={status} pulse={shouldPulse} {...props} />;
}

/** Badge para status de conta */
export function AccountStatusBadge({
  status,
  overdueDays,
  ...props
}: Omit<StatusBadgeProps, 'status'> & {
  status: 'pago' | 'pendente' | 'vencido' | 'parcial';
  overdueDays?: number;
}) {
  const label =
    status === 'vencido' && overdueDays
      ? `Vencido há ${overdueDays} dias`
      : undefined;

  return <StatusBadge status={status} label={label} pulse={status === 'vencido'} {...props} />;
}

// =============================================================================
// INLINE STATUS DOT
// =============================================================================

export function StatusDot({
  status,
  size = 'md',
  pulse = false,
  className,
}: {
  status: FinancialStatus | string;
  size?: 'sm' | 'md' | 'lg';
  pulse?: boolean;
  className?: string;
}) {
  const normalizedStatus = statusAliases[status.toLowerCase()] || status.toLowerCase().replace(/[\s-]/g, '_');
  const config = statusConfigs[normalizedStatus];

  const sizeClasses = {
    sm: 'h-1.5 w-1.5',
    md: 'h-2 w-2',
    lg: 'h-2.5 w-2.5',
  };

  const colorClasses: Record<string, string> = {
    pago: 'bg-success',
    recebido: 'bg-success',
    aprovado: 'bg-success',
    ativo: 'bg-success',
    sucesso: 'bg-success',
    pendente: 'bg-warning',
    a_receber: 'bg-primary',
    aguardando_aprovacao: 'bg-warning',
    processando: 'bg-primary',
    vencido: 'bg-destructive',
    inadimplente: 'bg-destructive',
    rejeitado: 'bg-destructive',
    erro: 'bg-destructive',
    parcial: 'bg-secondary',
    cancelado: 'bg-muted-foreground',
    inativo: 'bg-muted-foreground',
    draft: 'bg-muted-foreground',
  };

  const color = colorClasses[normalizedStatus] || 'bg-muted-foreground';

  if (pulse && config?.pulseColor) {
    return (
      <span className={cn('relative flex', className)}>
        <span
          className={cn(
            'animate-ping absolute inline-flex rounded-full opacity-75',
            config.pulseColor,
            sizeClasses[size]
          )}
        />
        <span className={cn('relative inline-flex rounded-full', color, sizeClasses[size])} />
      </span>
    );
  }

  return <span className={cn('inline-flex rounded-full', color, sizeClasses[size], className)} />;
}
