import * as React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  AlertTriangle,
  Trash2,
  XCircle,
  CheckCircle,
  AlertCircle,
  Info,
  type LucideIcon,
} from 'lucide-react';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

// =============================================================================
// TYPES
// =============================================================================

export type ConfirmDialogVariant = 'danger' | 'warning' | 'info' | 'success';

export interface ConfirmDialogConsequence {
  text: string;
  type?: 'danger' | 'warning' | 'neutral';
}

export interface EnhancedConfirmDialogProps {
  /** Controle de abertura */
  open: boolean;
  /** Callback ao fechar */
  onOpenChange: (open: boolean) => void;
  /** Variante visual */
  variant?: ConfirmDialogVariant;
  /** Ícone customizado */
  icon?: LucideIcon;
  /** Título do dialog */
  title: string;
  /** Descrição do dialog */
  description?: string;
  /** Lista de consequências da ação */
  consequences?: ConfirmDialogConsequence[];
  /** Texto de confirmação que o usuário precisa digitar */
  confirmText?: string;
  /** Placeholder para o campo de confirmação */
  confirmPlaceholder?: string;
  /** Tempo de espera antes de poder confirmar (em segundos) */
  cooldownSeconds?: number;
  /** Texto do botão de confirmação */
  confirmButtonText?: string;
  /** Texto do botão de cancelar */
  cancelButtonText?: string;
  /** Callback ao confirmar */
  onConfirm: () => void | Promise<void>;
  /** Loading state */
  loading?: boolean;
  /** Desabilitar confirmação */
  disabled?: boolean;
}

// =============================================================================
// VARIANT CONFIGS
// =============================================================================

const variantConfigs: Record<
  ConfirmDialogVariant,
  {
    icon: LucideIcon;
    iconColor: string;
    iconBg: string;
    buttonVariant: 'destructive' | 'default' | 'secondary';
  }
> = {
  danger: {
    icon: Trash2,
    iconColor: 'text-destructive',
    iconBg: 'bg-destructive/10',
    buttonVariant: 'destructive',
  },
  warning: {
    icon: AlertTriangle,
    iconColor: 'text-warning',
    iconBg: 'bg-warning/10',
    buttonVariant: 'default',
  },
  info: {
    icon: Info,
    iconColor: 'text-primary',
    iconBg: 'bg-primary/10',
    buttonVariant: 'default',
  },
  success: {
    icon: CheckCircle,
    iconColor: 'text-success',
    iconBg: 'bg-success/10',
    buttonVariant: 'default',
  },
};

// =============================================================================
// COMPONENT
// =============================================================================

export function EnhancedConfirmDialog({
  open,
  onOpenChange,
  variant = 'danger',
  icon,
  title,
  description,
  consequences,
  confirmText,
  confirmPlaceholder,
  cooldownSeconds = 0,
  confirmButtonText = 'Confirmar',
  cancelButtonText = 'Cancelar',
  onConfirm,
  loading = false,
  disabled = false,
}: EnhancedConfirmDialogProps) {
  const [inputValue, setInputValue] = React.useState('');
  const [cooldownRemaining, setCooldownRemaining] = React.useState(cooldownSeconds);
  const [isConfirming, setIsConfirming] = React.useState(false);

  const config = variantConfigs[variant];
  const Icon = icon || config.icon;

  // Reset state when dialog opens
  React.useEffect(() => {
    if (open) {
      setInputValue('');
      setCooldownRemaining(cooldownSeconds);
    }
  }, [open, cooldownSeconds]);

  // Cooldown timer
  React.useEffect(() => {
    if (!open || cooldownRemaining <= 0) return;

    const timer = setInterval(() => {
      setCooldownRemaining((prev) => Math.max(0, prev - 1));
    }, 1000);

    return () => clearInterval(timer);
  }, [open, cooldownRemaining]);

  // Check if confirm is allowed
  const confirmAllowed = React.useMemo(() => {
    if (disabled) return false;
    if (cooldownRemaining > 0) return false;
    if (confirmText && inputValue !== confirmText) return false;
    return true;
  }, [disabled, cooldownRemaining, confirmText, inputValue]);

  // Handle confirm
  const handleConfirm = async () => {
    if (!confirmAllowed || isConfirming) return;

    setIsConfirming(true);
    try {
      await onConfirm();
      onOpenChange(false);
    } finally {
      setIsConfirming(false);
    }
  };

  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent className="max-w-md">
        <AlertDialogHeader>
          {/* Icon */}
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: 'spring', duration: 0.5 }}
            className="mx-auto mb-4"
          >
            <div
              className={cn(
                'h-16 w-16 rounded-full flex items-center justify-center',
                config.iconBg
              )}
            >
              <Icon className={cn('h-8 w-8', config.iconColor)} />
            </div>
          </motion.div>

          <AlertDialogTitle className="text-center text-xl">
            {title}
          </AlertDialogTitle>

          {description && (
            <AlertDialogDescription className="text-center">
              {description}
            </AlertDialogDescription>
          )}
        </AlertDialogHeader>

        {/* Consequences */}
        {consequences && consequences.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="my-4 p-4 rounded-lg bg-muted/50 border border-border"
          >
            <p className="text-sm font-medium text-foreground mb-2">
              Esta ação irá:
            </p>
            <ul className="space-y-2">
              {consequences.map((consequence, index) => (
                <li
                  key={index}
                  className={cn(
                    'flex items-start gap-2 text-sm',
                    consequence.type === 'danger' && 'text-destructive',
                    consequence.type === 'warning' && 'text-warning',
                    !consequence.type && 'text-muted-foreground'
                  )}
                >
                  <span className="mt-0.5">
                    {consequence.type === 'danger' && <XCircle className="h-4 w-4" />}
                    {consequence.type === 'warning' && <AlertCircle className="h-4 w-4" />}
                    {!consequence.type && <span className="block h-1.5 w-1.5 rounded-full bg-current mt-1.5" />}
                  </span>
                  {consequence.text}
                </li>
              ))}
            </ul>
          </motion.div>
        )}

        {/* Warning Message */}
        {variant === 'danger' && (
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.15 }}
            className="text-center text-sm font-medium text-destructive"
          >
            Esta ação NÃO pode ser desfeita.
          </motion.p>
        )}

        {/* Confirm Text Input */}
        {confirmText && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="mt-4 space-y-2"
          >
            <Label htmlFor="confirm-input" className="text-sm">
              Digite <span className="font-mono font-bold text-destructive">"{confirmText}"</span> para confirmar:
            </Label>
            <Input
              id="confirm-input"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              placeholder={confirmPlaceholder || confirmText}
              className={cn(
                'font-mono',
                inputValue === confirmText && 'border-success focus-visible:ring-success'
              )}
              autoComplete="off"
              autoFocus
            />
            {inputValue && inputValue !== confirmText && (
              <p className="text-xs text-destructive">
                O texto digitado não corresponde
              </p>
            )}
          </motion.div>
        )}

        <AlertDialogFooter className="mt-6 gap-2 sm:gap-2">
          <AlertDialogCancel asChild>
            <Button variant="outline" disabled={loading || isConfirming}>
              {cancelButtonText}
            </Button>
          </AlertDialogCancel>

          <Button
            variant={config.buttonVariant}
            onClick={handleConfirm}
            disabled={!confirmAllowed || loading || isConfirming}
            className="relative"
          >
            {/* Cooldown overlay */}
            {cooldownRemaining > 0 && (
              <span className="absolute inset-0 flex items-center justify-center bg-inherit rounded-md">
                Aguarde {cooldownRemaining}s
              </span>
            )}

            {/* Loading spinner */}
            {(loading || isConfirming) && (
              <span className="absolute inset-0 flex items-center justify-center bg-inherit rounded-md">
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
                  className="h-4 w-4 border-2 border-current border-t-transparent rounded-full"
                />
              </span>
            )}

            <span className={cn((cooldownRemaining > 0 || loading || isConfirming) && 'invisible')}>
              {confirmButtonText}
            </span>
          </Button>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}

// =============================================================================
// PRESET DIALOGS
// =============================================================================

interface DeleteConfirmDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  entityName: string;
  entityIdentifier?: string;
  consequences?: ConfirmDialogConsequence[];
  requireTextConfirmation?: boolean;
  onConfirm: () => void | Promise<void>;
  loading?: boolean;
}

export function DeleteConfirmDialog({
  open,
  onOpenChange,
  entityName,
  entityIdentifier,
  consequences,
  requireTextConfirmation = false,
  onConfirm,
  loading,
}: DeleteConfirmDialogProps) {
  return (
    <EnhancedConfirmDialog
      open={open}
      onOpenChange={onOpenChange}
      variant="danger"
      icon={Trash2}
      title={`Excluir ${entityName}?`}
      description={
        entityIdentifier
          ? `Você está prestes a excluir "${entityIdentifier}".`
          : `Você está prestes a excluir este ${entityName}.`
      }
      consequences={consequences}
      confirmText={requireTextConfirmation ? entityIdentifier || 'EXCLUIR' : undefined}
      confirmButtonText="Excluir Permanentemente"
      cancelButtonText="Cancelar"
      cooldownSeconds={requireTextConfirmation ? 3 : 0}
      onConfirm={onConfirm}
      loading={loading}
    />
  );
}

interface CancelConfirmDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  entityName: string;
  onConfirm: () => void | Promise<void>;
  loading?: boolean;
}

export function CancelConfirmDialog({
  open,
  onOpenChange,
  entityName,
  onConfirm,
  loading,
}: CancelConfirmDialogProps) {
  return (
    <EnhancedConfirmDialog
      open={open}
      onOpenChange={onOpenChange}
      variant="warning"
      icon={AlertTriangle}
      title={`Cancelar ${entityName}?`}
      description={`Tem certeza que deseja cancelar este ${entityName}? Esta ação pode afetar outros registros relacionados.`}
      confirmButtonText="Sim, Cancelar"
      cancelButtonText="Voltar"
      onConfirm={onConfirm}
      loading={loading}
    />
  );
}

// =============================================================================
// HOOK FOR EASY USAGE
// =============================================================================

export function useConfirmDialog() {
  const [state, setState] = React.useState<{
    open: boolean;
    props: Partial<EnhancedConfirmDialogProps>;
    resolve?: (confirmed: boolean) => void;
  }>({
    open: false,
    props: {},
  });

  const confirm = React.useCallback(
    (props: Omit<EnhancedConfirmDialogProps, 'open' | 'onOpenChange' | 'onConfirm'>) => {
      return new Promise<boolean>((resolve) => {
        setState({
          open: true,
          props,
          resolve,
        });
      });
    },
    []
  );

  const handleOpenChange = React.useCallback((open: boolean) => {
    if (!open) {
      state.resolve?.(false);
      setState((prev) => ({ ...prev, open: false }));
    }
  }, [state]);

  const handleConfirm = React.useCallback(() => {
    state.resolve?.(true);
    setState((prev) => ({ ...prev, open: false }));
  }, [state]);

  const Dialog = React.useCallback(
    () => (
      <EnhancedConfirmDialog
        {...state.props}
        open={state.open}
        onOpenChange={handleOpenChange}
        onConfirm={handleConfirm}
        title={state.props.title || 'Confirmar'}
      />
    ),
    [state, handleOpenChange, handleConfirm]
  );

  return { confirm, Dialog };
}
