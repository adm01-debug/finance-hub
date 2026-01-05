import * as React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import {
  LucideIcon,
  Search,
  Filter,
  FileX,
  Database,
  WifiOff,
  AlertCircle,
  Plus,
  Upload,
  RefreshCw,
  PlayCircle,
  BookOpen,
  ExternalLink,
  ArrowRight,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

// =============================================================================
// TYPES
// =============================================================================

export type EmptyStateVariant =
  | 'empty'        // Nenhum dado cadastrado
  | 'no-results'   // Busca/filtro sem resultados
  | 'error'        // Erro ao carregar
  | 'offline'      // Sem conexão
  | 'permission'   // Sem permissão
  | 'coming-soon'  // Em breve
  | 'custom';      // Customizado

export interface EmptyStateAction {
  label: string;
  onClick?: () => void;
  href?: string;
  variant?: 'default' | 'outline' | 'secondary' | 'ghost' | 'link';
  icon?: LucideIcon;
}

export interface EmptyStateLink {
  label: string;
  href: string;
  external?: boolean;
}

export interface EmptyStateProps {
  /** Variante pré-definida */
  variant?: EmptyStateVariant;
  /** Ícone principal */
  icon?: LucideIcon;
  /** Título principal */
  title: string;
  /** Descrição educativa */
  description?: string;
  /** Dicas/passos para o usuário */
  tips?: string[];
  /** Ação principal */
  action?: EmptyStateAction;
  /** Ações secundárias */
  secondaryActions?: EmptyStateAction[];
  /** Links de ajuda */
  helpLinks?: EmptyStateLink[];
  /** Link para tutorial em vídeo */
  videoTutorialUrl?: string;
  /** Mostrar ilustração animada */
  animated?: boolean;
  /** Tamanho do empty state */
  size?: 'sm' | 'md' | 'lg';
  /** Classes adicionais */
  className?: string;
  /** Conteúdo customizado no lugar do ícone */
  illustration?: React.ReactNode;
}

// =============================================================================
// PRESET CONFIGS POR VARIANTE
// =============================================================================

const variantConfigs: Record<EmptyStateVariant, Partial<EmptyStateProps>> = {
  empty: {
    icon: Database,
    title: 'Nenhum dado cadastrado',
    description: 'Comece adicionando seu primeiro registro para visualizar informações aqui.',
  },
  'no-results': {
    icon: Search,
    title: 'Nenhum resultado encontrado',
    description: 'Tente ajustar os filtros ou usar termos de busca diferentes.',
    tips: [
      'Verifique a ortografia dos termos de busca',
      'Use filtros menos restritivos',
      'Tente buscar por termos parciais',
    ],
  },
  error: {
    icon: AlertCircle,
    title: 'Erro ao carregar dados',
    description: 'Não foi possível carregar as informações. Por favor, tente novamente.',
  },
  offline: {
    icon: WifiOff,
    title: 'Sem conexão com a internet',
    description: 'Verifique sua conexão e tente novamente. Algumas funcionalidades podem estar limitadas.',
  },
  permission: {
    icon: FileX,
    title: 'Acesso não autorizado',
    description: 'Você não tem permissão para acessar este conteúdo. Entre em contato com o administrador.',
  },
  'coming-soon': {
    icon: PlayCircle,
    title: 'Em breve',
    description: 'Esta funcionalidade está em desenvolvimento e estará disponível em breve.',
  },
  custom: {},
};

// =============================================================================
// ANIMATED ILLUSTRATIONS
// =============================================================================

function AnimatedIcon({ icon: Icon, variant }: { icon: LucideIcon; variant?: EmptyStateVariant }) {
  const iconColor = {
    empty: 'text-muted-foreground',
    'no-results': 'text-muted-foreground',
    error: 'text-destructive',
    offline: 'text-warning',
    permission: 'text-destructive',
    'coming-soon': 'text-primary',
    custom: 'text-muted-foreground',
  }[variant || 'custom'];

  const bgColor = {
    empty: 'bg-muted',
    'no-results': 'bg-muted',
    error: 'bg-destructive/10',
    offline: 'bg-warning/10',
    permission: 'bg-destructive/10',
    'coming-soon': 'bg-primary/10',
    custom: 'bg-muted',
  }[variant || 'custom'];

  return (
    <motion.div
      initial={{ scale: 0.8, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      transition={{ type: 'spring', duration: 0.5 }}
      className={cn(
        'mx-auto flex items-center justify-center rounded-full',
        bgColor
      )}
      style={{ width: 80, height: 80 }}
    >
      <motion.div
        animate={{
          y: [0, -4, 0],
        }}
        transition={{
          duration: 2,
          repeat: Infinity,
          ease: 'easeInOut',
        }}
      >
        <Icon className={cn('h-10 w-10', iconColor)} />
      </motion.div>
    </motion.div>
  );
}

// =============================================================================
// COMPONENT
// =============================================================================

export function EmptyState({
  variant = 'custom',
  icon,
  title,
  description,
  tips,
  action,
  secondaryActions,
  helpLinks,
  videoTutorialUrl,
  animated = true,
  size = 'md',
  className,
  illustration,
}: EmptyStateProps) {
  // Merge variant config with props
  const config = variantConfigs[variant];
  const finalIcon = icon || config.icon || Database;
  const finalTitle = title || config.title || 'Sem dados';
  const finalDescription = description || config.description;
  const finalTips = tips || config.tips;

  // Size classes
  const sizeClasses = {
    sm: {
      container: 'py-8 px-4',
      icon: 'h-12 w-12',
      title: 'text-base',
      description: 'text-sm max-w-xs',
    },
    md: {
      container: 'py-12 px-4',
      icon: 'h-16 w-16',
      title: 'text-lg',
      description: 'text-sm max-w-sm',
    },
    lg: {
      container: 'py-16 px-6',
      icon: 'h-20 w-20',
      title: 'text-xl',
      description: 'text-base max-w-md',
    },
  };

  const sizes = sizeClasses[size];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className={cn(
        'flex flex-col items-center justify-center text-center',
        sizes.container,
        className
      )}
    >
      {/* Illustration or Icon */}
      {illustration || (
        animated ? (
          <AnimatedIcon icon={finalIcon} variant={variant} />
        ) : (
          <div className={cn('mx-auto flex items-center justify-center rounded-full bg-muted', sizes.icon)}>
            <finalIcon className={cn('h-1/2 w-1/2 text-muted-foreground')} />
          </div>
        )
      )}

      {/* Title */}
      <motion.h3
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.1 }}
        className={cn('mt-4 font-semibold text-foreground', sizes.title)}
      >
        {finalTitle}
      </motion.h3>

      {/* Description */}
      {finalDescription && (
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.15 }}
          className={cn('mt-2 text-muted-foreground', sizes.description)}
        >
          {finalDescription}
        </motion.p>
      )}

      {/* Tips */}
      {finalTips && finalTips.length > 0 && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="mt-4 text-left"
        >
          <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider mb-2">
            Dicas:
          </p>
          <ul className="space-y-1">
            {finalTips.map((tip, index) => (
              <li key={index} className="flex items-start gap-2 text-sm text-muted-foreground">
                <span className="text-primary">•</span>
                {tip}
              </li>
            ))}
          </ul>
        </motion.div>
      )}

      {/* Primary Action */}
      {action && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.25 }}
          className="mt-6"
        >
          {action.href ? (
            <Button asChild variant={action.variant || 'default'}>
              <Link to={action.href}>
                {action.icon && <action.icon className="mr-2 h-4 w-4" />}
                {action.label}
              </Link>
            </Button>
          ) : (
            <Button onClick={action.onClick} variant={action.variant || 'default'}>
              {action.icon && <action.icon className="mr-2 h-4 w-4" />}
              {action.label}
            </Button>
          )}
        </motion.div>
      )}

      {/* Secondary Actions */}
      {secondaryActions && secondaryActions.length > 0 && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="mt-3 flex flex-wrap items-center justify-center gap-2"
        >
          {secondaryActions.map((secAction, index) => {
            const SecIcon = secAction.icon;
            if (secAction.href) {
              return (
                <Button key={index} variant={secAction.variant || 'ghost'} size="sm" asChild>
                  <Link to={secAction.href}>
                    {SecIcon && <SecIcon className="mr-1 h-3 w-3" />}
                    {secAction.label}
                  </Link>
                </Button>
              );
            }
            return (
              <Button
                key={index}
                variant={secAction.variant || 'ghost'}
                size="sm"
                onClick={secAction.onClick}
              >
                {SecIcon && <SecIcon className="mr-1 h-3 w-3" />}
                {secAction.label}
              </Button>
            );
          })}
        </motion.div>
      )}

      {/* Video Tutorial Link */}
      {videoTutorialUrl && (
        <motion.a
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.35 }}
          href={videoTutorialUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="mt-4 inline-flex items-center gap-2 text-sm text-primary hover:underline"
        >
          <PlayCircle className="h-4 w-4" />
          Ver tutorial em vídeo
          <ExternalLink className="h-3 w-3" />
        </motion.a>
      )}

      {/* Help Links */}
      {helpLinks && helpLinks.length > 0 && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
          className="mt-6 pt-4 border-t border-border"
        >
          <p className="text-xs text-muted-foreground mb-2">Precisa de ajuda?</p>
          <div className="flex flex-wrap items-center justify-center gap-4">
            {helpLinks.map((link, index) => (
              <a
                key={index}
                href={link.href}
                target={link.external ? '_blank' : undefined}
                rel={link.external ? 'noopener noreferrer' : undefined}
                className="inline-flex items-center gap-1 text-sm text-primary hover:underline"
              >
                <BookOpen className="h-3 w-3" />
                {link.label}
                {link.external && <ExternalLink className="h-3 w-3" />}
              </a>
            ))}
          </div>
        </motion.div>
      )}
    </motion.div>
  );
}

// =============================================================================
// PRESET EMPTY STATES
// =============================================================================

/** Empty state para quando não há dados cadastrados */
export function NoDataEmptyState({
  entityName,
  onAdd,
  addHref,
  onImport,
  ...props
}: Omit<EmptyStateProps, 'variant' | 'action'> & {
  entityName: string;
  onAdd?: () => void;
  addHref?: string;
  onImport?: () => void;
}) {
  return (
    <EmptyState
      {...props}
      variant="empty"
      title={`Nenhum ${entityName} cadastrado`}
      description={`Você ainda não possui ${entityName} cadastrados. Comece adicionando o primeiro ou importe de um arquivo.`}
      action={{
        label: `Adicionar ${entityName}`,
        onClick: onAdd,
        href: addHref,
        icon: Plus,
      }}
      secondaryActions={
        onImport
          ? [
              {
                label: 'Importar arquivo',
                onClick: onImport,
                icon: Upload,
                variant: 'outline',
              },
            ]
          : undefined
      }
    />
  );
}

/** Empty state para quando filtros não retornam resultados */
export function NoResultsEmptyState({
  onClearFilters,
  searchTerm,
  ...props
}: Omit<EmptyStateProps, 'variant'> & {
  onClearFilters?: () => void;
  searchTerm?: string;
}) {
  return (
    <EmptyState
      {...props}
      variant="no-results"
      title={searchTerm ? `Nenhum resultado para "${searchTerm}"` : 'Nenhum resultado encontrado'}
      action={
        onClearFilters
          ? {
              label: 'Limpar filtros',
              onClick: onClearFilters,
              icon: Filter,
              variant: 'outline',
            }
          : undefined
      }
    />
  );
}

/** Empty state para erros de carregamento */
export function ErrorEmptyState({
  onRetry,
  errorMessage,
  ...props
}: Omit<EmptyStateProps, 'variant'> & {
  onRetry?: () => void;
  errorMessage?: string;
}) {
  return (
    <EmptyState
      {...props}
      variant="error"
      description={errorMessage || 'Ocorreu um erro ao carregar os dados. Por favor, tente novamente.'}
      action={
        onRetry
          ? {
              label: 'Tentar novamente',
              onClick: onRetry,
              icon: RefreshCw,
            }
          : undefined
      }
    />
  );
}

/** Empty state para modo offline */
export function OfflineEmptyState(props: Omit<EmptyStateProps, 'variant'>) {
  return <EmptyState {...props} variant="offline" />;
}

// =============================================================================
// CONTEXTUAL EMPTY STATES
// =============================================================================

/** Empty state para Contas a Pagar */
export function ContasPagarEmptyState({ onAdd }: { onAdd?: () => void }) {
  return (
    <NoDataEmptyState
      entityName="conta a pagar"
      icon={Database}
      onAdd={onAdd}
      tips={[
        'Cadastre suas contas a pagar para controlar vencimentos',
        'Importe extratos bancários para agilizar o processo',
        'Configure alertas de vencimento para não perder prazos',
      ]}
      helpLinks={[
        { label: 'Como cadastrar contas', href: '/docs/contas-pagar' },
        { label: 'Importar do Excel', href: '/docs/importacao' },
      ]}
    />
  );
}

/** Empty state para Contas a Receber */
export function ContasReceberEmptyState({ onAdd }: { onAdd?: () => void }) {
  return (
    <NoDataEmptyState
      entityName="conta a receber"
      icon={Database}
      onAdd={onAdd}
      tips={[
        'Controle seus recebíveis e acompanhe a inadimplência',
        'Envie cobranças automáticas para clientes em atraso',
        'Visualize projeções de fluxo de caixa',
      ]}
    />
  );
}

/** Empty state para Clientes */
export function ClientesEmptyState({ onAdd }: { onAdd?: () => void }) {
  return (
    <NoDataEmptyState
      entityName="cliente"
      icon={Database}
      onAdd={onAdd}
      tips={[
        'Cadastre seus clientes para facilitar o controle de recebíveis',
        'Mantenha dados de contato atualizados para cobranças',
        'Acompanhe o histórico de cada cliente',
      ]}
    />
  );
}
