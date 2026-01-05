import * as React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link, useLocation } from 'react-router-dom';
import {
  Plus,
  X,
  ArrowUpCircle,
  ArrowDownCircle,
  Users,
  Truck,
  RefreshCcw,
  FileText,
  CreditCard,
  type LucideIcon,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import { cn } from '@/lib/utils';

// =============================================================================
// TYPES
// =============================================================================

interface QuickAction {
  id: string;
  label: string;
  icon: LucideIcon;
  href?: string;
  onClick?: () => void;
  color?: string;
  bgColor?: string;
}

interface QuickActionsFABProps {
  /** Ações customizadas (substitui as padrão) */
  actions?: QuickAction[];
  /** Posição do FAB */
  position?: 'bottom-right' | 'bottom-left' | 'bottom-center';
  /** Classes adicionais */
  className?: string;
}

// =============================================================================
// DEFAULT ACTIONS
// =============================================================================

const defaultActions: QuickAction[] = [
  {
    id: 'new-pagar',
    label: 'Nova Conta a Pagar',
    icon: ArrowUpCircle,
    href: '/contas-pagar?action=new',
    color: 'text-destructive',
    bgColor: 'bg-destructive/10 hover:bg-destructive/20',
  },
  {
    id: 'new-receber',
    label: 'Nova Conta a Receber',
    icon: ArrowDownCircle,
    href: '/contas-receber?action=new',
    color: 'text-success',
    bgColor: 'bg-success/10 hover:bg-success/20',
  },
  {
    id: 'new-cliente',
    label: 'Novo Cliente',
    icon: Users,
    href: '/clientes?action=new',
    color: 'text-primary',
    bgColor: 'bg-primary/10 hover:bg-primary/20',
  },
  {
    id: 'new-fornecedor',
    label: 'Novo Fornecedor',
    icon: Truck,
    href: '/fornecedores?action=new',
    color: 'text-warning',
    bgColor: 'bg-warning/10 hover:bg-warning/20',
  },
  {
    id: 'importar-extrato',
    label: 'Importar Extrato',
    icon: RefreshCcw,
    href: '/conciliacao?action=import',
    color: 'text-secondary',
    bgColor: 'bg-secondary/10 hover:bg-secondary/20',
  },
];

// =============================================================================
// COMPONENT
// =============================================================================

export function QuickActionsFAB({
  actions = defaultActions,
  position = 'bottom-right',
  className,
}: QuickActionsFABProps) {
  const [isOpen, setIsOpen] = React.useState(false);
  const location = useLocation();

  // Close on route change
  React.useEffect(() => {
    setIsOpen(false);
  }, [location.pathname]);

  // Close on escape
  React.useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setIsOpen(false);
    };

    if (isOpen) {
      document.addEventListener('keydown', handleEscape);
      return () => document.removeEventListener('keydown', handleEscape);
    }
  }, [isOpen]);

  // Position classes
  const positionClasses = {
    'bottom-right': 'bottom-20 right-6',
    'bottom-left': 'bottom-20 left-6',
    'bottom-center': 'bottom-20 left-1/2 -translate-x-1/2',
  };

  return (
    <>
      {/* Backdrop */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-background/80 backdrop-blur-sm z-40"
            onClick={() => setIsOpen(false)}
          />
        )}
      </AnimatePresence>

      {/* FAB Container */}
      <div
        className={cn(
          'fixed z-50 flex flex-col-reverse items-center gap-3',
          positionClasses[position],
          className
        )}
      >
        {/* Action Buttons */}
        <AnimatePresence>
          {isOpen && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="flex flex-col-reverse items-center gap-2"
            >
              {actions.map((action, index) => (
                <motion.div
                  key={action.id}
                  initial={{ opacity: 0, y: 20, scale: 0.8 }}
                  animate={{
                    opacity: 1,
                    y: 0,
                    scale: 1,
                    transition: { delay: index * 0.05 },
                  }}
                  exit={{
                    opacity: 0,
                    y: 20,
                    scale: 0.8,
                    transition: { delay: (actions.length - index) * 0.03 },
                  }}
                >
                  <Tooltip>
                    <TooltipTrigger asChild>
                      {action.href ? (
                        <Button
                          asChild
                          size="icon"
                          variant="outline"
                          className={cn(
                            'h-12 w-12 rounded-full shadow-lg',
                            action.bgColor
                          )}
                          onClick={() => setIsOpen(false)}
                        >
                          <Link to={action.href}>
                            <action.icon className={cn('h-5 w-5', action.color)} />
                            <span className="sr-only">{action.label}</span>
                          </Link>
                        </Button>
                      ) : (
                        <Button
                          size="icon"
                          variant="outline"
                          className={cn(
                            'h-12 w-12 rounded-full shadow-lg',
                            action.bgColor
                          )}
                          onClick={() => {
                            setIsOpen(false);
                            action.onClick?.();
                          }}
                        >
                          <action.icon className={cn('h-5 w-5', action.color)} />
                          <span className="sr-only">{action.label}</span>
                        </Button>
                      )}
                    </TooltipTrigger>
                    <TooltipContent side="left" sideOffset={8}>
                      {action.label}
                    </TooltipContent>
                  </Tooltip>
                </motion.div>
              ))}
            </motion.div>
          )}
        </AnimatePresence>

        {/* Main FAB Button */}
        <motion.div whileTap={{ scale: 0.95 }}>
          <Button
            size="icon"
            className={cn(
              'h-14 w-14 rounded-full shadow-lg',
              isOpen
                ? 'bg-muted hover:bg-muted/80 text-foreground'
                : 'bg-primary hover:bg-primary/90 text-primary-foreground shadow-glow-primary'
            )}
            onClick={() => setIsOpen(!isOpen)}
            aria-label={isOpen ? 'Fechar ações rápidas' : 'Abrir ações rápidas'}
            aria-expanded={isOpen}
          >
            <motion.div
              animate={{ rotate: isOpen ? 45 : 0 }}
              transition={{ duration: 0.2 }}
            >
              {isOpen ? (
                <X className="h-6 w-6" />
              ) : (
                <Plus className="h-6 w-6" />
              )}
            </motion.div>
          </Button>
        </motion.div>

        {/* Label when closed */}
        <AnimatePresence>
          {!isOpen && (
            <motion.span
              initial={{ opacity: 0, x: 10 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 10 }}
              className="absolute right-16 bg-card px-3 py-1.5 rounded-lg shadow-md text-sm font-medium whitespace-nowrap"
            >
              Ação Rápida
            </motion.span>
          )}
        </AnimatePresence>
      </div>
    </>
  );
}

// =============================================================================
// CONTEXTUAL FAB
// =============================================================================

/** FAB específico para página de Contas a Pagar */
export function ContasPagarFAB({ onNewConta }: { onNewConta?: () => void }) {
  return (
    <QuickActionsFAB
      actions={[
        {
          id: 'new-pagar',
          label: 'Nova Conta a Pagar',
          icon: ArrowUpCircle,
          onClick: onNewConta,
          color: 'text-destructive',
          bgColor: 'bg-destructive/10 hover:bg-destructive/20',
        },
        {
          id: 'importar',
          label: 'Importar Planilha',
          icon: FileText,
          color: 'text-primary',
          bgColor: 'bg-primary/10 hover:bg-primary/20',
        },
        {
          id: 'boleto',
          label: 'Ler Código de Barras',
          icon: CreditCard,
          color: 'text-secondary',
          bgColor: 'bg-secondary/10 hover:bg-secondary/20',
        },
      ]}
    />
  );
}

/** FAB específico para página de Contas a Receber */
export function ContasReceberFAB({ onNewConta }: { onNewConta?: () => void }) {
  return (
    <QuickActionsFAB
      actions={[
        {
          id: 'new-receber',
          label: 'Nova Conta a Receber',
          icon: ArrowDownCircle,
          onClick: onNewConta,
          color: 'text-success',
          bgColor: 'bg-success/10 hover:bg-success/20',
        },
        {
          id: 'importar',
          label: 'Importar Planilha',
          icon: FileText,
          color: 'text-primary',
          bgColor: 'bg-primary/10 hover:bg-primary/20',
        },
        {
          id: 'enviar-cobranca',
          label: 'Enviar Cobrança em Massa',
          icon: Users,
          color: 'text-warning',
          bgColor: 'bg-warning/10 hover:bg-warning/20',
        },
      ]}
    />
  );
}
