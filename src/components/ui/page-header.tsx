import * as React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { ArrowLeft, type LucideIcon } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { cn } from '@/lib/utils';

// =============================================================================
// TYPES
// =============================================================================

export interface PageHeaderAction {
  label: string;
  icon?: LucideIcon;
  onClick?: () => void;
  href?: string;
  variant?: 'default' | 'outline' | 'secondary' | 'ghost' | 'destructive';
  disabled?: boolean;
  loading?: boolean;
}

export interface PageHeaderProps {
  /** Título da página */
  title: string;
  /** Descrição/subtítulo */
  description?: string;
  /** Ícone do título */
  icon?: LucideIcon;
  /** Cor do ícone */
  iconColor?: string;
  /** Background do ícone */
  iconBg?: string;
  /** Badge ao lado do título */
  badge?: {
    label: string;
    variant?: 'default' | 'secondary' | 'destructive' | 'outline';
  };
  /** Link de voltar */
  backHref?: string;
  /** Texto do botão voltar */
  backLabel?: string;
  /** Ações principais (lado direito) */
  actions?: PageHeaderAction[];
  /** Ações secundárias (dropdown ou menos destaque) */
  secondaryActions?: PageHeaderAction[];
  /** Conteúdo customizado à direita */
  rightContent?: React.ReactNode;
  /** Loading state */
  loading?: boolean;
  /** Classes adicionais */
  className?: string;
  /** Children (filtros, tabs, etc.) */
  children?: React.ReactNode;
}

// =============================================================================
// COMPONENT
// =============================================================================

export function PageHeader({
  title,
  description,
  icon: Icon,
  iconColor = 'text-primary',
  iconBg = 'bg-primary/10',
  badge,
  backHref,
  backLabel = 'Voltar',
  actions,
  secondaryActions,
  rightContent,
  loading = false,
  className,
  children,
}: PageHeaderProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.2 }}
      className={cn('space-y-4', className)}
    >
      {/* Back Button */}
      {backHref && (
        <Button variant="ghost" size="sm" asChild className="-ml-2 text-muted-foreground">
          <Link to={backHref}>
            <ArrowLeft className="mr-1 h-4 w-4" />
            {backLabel}
          </Link>
        </Button>
      )}

      {/* Main Header Row */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        {/* Left: Title Section */}
        <div className="flex items-start gap-4">
          {/* Icon */}
          {Icon && !loading && (
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className={cn(
                'hidden sm:flex h-12 w-12 items-center justify-center rounded-xl shrink-0',
                iconBg
              )}
            >
              <Icon className={cn('h-6 w-6', iconColor)} />
            </motion.div>
          )}

          {loading && (
            <Skeleton className="hidden sm:block h-12 w-12 rounded-xl" />
          )}

          {/* Text */}
          <div className="space-y-1">
            <div className="flex items-center gap-3">
              {loading ? (
                <Skeleton className="h-8 w-48" />
              ) : (
                <h1 className="text-2xl font-bold tracking-tight text-foreground">
                  {title}
                </h1>
              )}

              {badge && !loading && (
                <Badge variant={badge.variant || 'secondary'}>{badge.label}</Badge>
              )}
            </div>

            {loading ? (
              <Skeleton className="h-4 w-64" />
            ) : (
              description && (
                <p className="text-sm text-muted-foreground">{description}</p>
              )
            )}
          </div>
        </div>

        {/* Right: Actions */}
        <div className="flex items-center gap-2 shrink-0">
          {/* Custom Right Content */}
          {rightContent}

          {/* Secondary Actions */}
          {secondaryActions?.map((action, index) => (
            <ActionButton
              key={`secondary-${index}`}
              action={action}
              variant={action.variant || 'ghost'}
            />
          ))}

          {/* Primary Actions */}
          {actions?.map((action, index) => (
            <ActionButton
              key={`primary-${index}`}
              action={action}
              variant={action.variant || 'default'}
            />
          ))}
        </div>
      </div>

      {/* Additional Content (filters, tabs, etc.) */}
      {children && <div className="pt-2">{children}</div>}
    </motion.div>
  );
}

// =============================================================================
// ACTION BUTTON
// =============================================================================

function ActionButton({
  action,
  variant,
}: {
  action: PageHeaderAction;
  variant: PageHeaderAction['variant'];
}) {
  const Icon = action.icon;

  const buttonContent = (
    <>
      {action.loading ? (
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
          className="h-4 w-4 border-2 border-current border-t-transparent rounded-full mr-2"
        />
      ) : (
        Icon && <Icon className="h-4 w-4 mr-2" />
      )}
      {action.label}
    </>
  );

  if (action.href) {
    return (
      <Button
        variant={variant}
        size="sm"
        disabled={action.disabled || action.loading}
        asChild
      >
        <Link to={action.href}>{buttonContent}</Link>
      </Button>
    );
  }

  return (
    <Button
      variant={variant}
      size="sm"
      onClick={action.onClick}
      disabled={action.disabled || action.loading}
    >
      {buttonContent}
    </Button>
  );
}

// =============================================================================
// VARIANTS
// =============================================================================

/** Header para páginas de listagem */
export function ListPageHeader({
  title,
  description,
  icon,
  onAdd,
  addLabel = 'Adicionar',
  addHref,
  onExport,
  exportLabel = 'Exportar',
  ...props
}: Omit<PageHeaderProps, 'actions'> & {
  onAdd?: () => void;
  addLabel?: string;
  addHref?: string;
  onExport?: () => void;
  exportLabel?: string;
}) {
  const actions: PageHeaderAction[] = [];

  if (onExport) {
    actions.push({
      label: exportLabel,
      onClick: onExport,
      variant: 'outline',
    });
  }

  if (onAdd || addHref) {
    actions.push({
      label: addLabel,
      onClick: onAdd,
      href: addHref,
      variant: 'default',
    });
  }

  return (
    <PageHeader
      title={title}
      description={description}
      icon={icon}
      actions={actions}
      {...props}
    />
  );
}

/** Header para páginas de detalhe */
export function DetailPageHeader({
  title,
  description,
  icon,
  backHref,
  onEdit,
  onDelete,
  status,
  ...props
}: Omit<PageHeaderProps, 'actions' | 'badge'> & {
  onEdit?: () => void;
  onDelete?: () => void;
  status?: {
    label: string;
    variant?: 'default' | 'secondary' | 'destructive' | 'outline';
  };
}) {
  const actions: PageHeaderAction[] = [];

  if (onEdit) {
    actions.push({
      label: 'Editar',
      onClick: onEdit,
      variant: 'outline',
    });
  }

  if (onDelete) {
    actions.push({
      label: 'Excluir',
      onClick: onDelete,
      variant: 'destructive',
    });
  }

  return (
    <PageHeader
      title={title}
      description={description}
      icon={icon}
      backHref={backHref}
      badge={status}
      actions={actions}
      {...props}
    />
  );
}
