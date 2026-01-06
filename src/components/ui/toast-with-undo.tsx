import * as React from 'react';
import { toast } from 'sonner';
import { motion, AnimatePresence } from 'framer-motion';
import { Undo2, CheckCircle, XCircle, AlertTriangle, Info, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

// =============================================================================
// TYPES
// =============================================================================

export interface ToastWithUndoOptions {
  /** Mensagem principal */
  message: string;
  /** Descrição adicional */
  description?: string;
  /** Tempo em ms antes de executar a ação (default: 5000) */
  duration?: number;
  /** Ação a ser executada após o timeout */
  onAction: () => void | Promise<void>;
  /** Callback se o usuário clicar em "Desfazer" */
  onUndo?: () => void;
  /** Tipo visual */
  type?: 'success' | 'error' | 'warning' | 'info' | 'default';
  /** Texto do botão de undo */
  undoLabel?: string;
}

// =============================================================================
// TOAST WITH UNDO
// =============================================================================

export function toastWithUndo({
  message,
  description,
  duration = 5000,
  onAction,
  onUndo,
  type = 'default',
  undoLabel = 'Desfazer',
}: ToastWithUndoOptions) {
  let actionExecuted = false;
  let toastId: string | number;

  const executeAction = async () => {
    if (actionExecuted) return;
    actionExecuted = true;
    toast.dismiss(toastId);
    await onAction();
  };

  const handleUndo = () => {
    if (actionExecuted) return;
    actionExecuted = true;
    toast.dismiss(toastId);
    onUndo?.();
    toast.success('Ação desfeita');
  };

  // Configurações de ícone e cor por tipo
  const typeConfig = {
    success: { icon: CheckCircle, color: 'text-success' },
    error: { icon: XCircle, color: 'text-destructive' },
    warning: { icon: AlertTriangle, color: 'text-warning' },
    info: { icon: Info, color: 'text-primary' },
    default: { icon: null, color: '' },
  };

  const config = typeConfig[type];
  const Icon = config.icon;

  toastId = toast.custom(
    (t) => (
      <ToastContent
        id={t}
        message={message}
        description={description}
        duration={duration}
        onUndo={handleUndo}
        undoLabel={undoLabel}
        icon={Icon}
        iconColor={config.color}
      />
    ),
    {
      duration: duration,
      onAutoClose: () => executeAction(),
      onDismiss: () => {
        if (!actionExecuted) {
          executeAction();
        }
      },
    }
  );

  return toastId;
}

// =============================================================================
// TOAST CONTENT COMPONENT
// =============================================================================

interface ToastContentProps {
  id: string | number;
  message: string;
  description?: string;
  duration: number;
  onUndo: () => void;
  undoLabel: string;
  icon: React.ElementType | null;
  iconColor: string;
}

function ToastContent({
  id,
  message,
  description,
  duration,
  onUndo,
  undoLabel,
  icon: Icon,
  iconColor,
}: ToastContentProps) {
  const [progress, setProgress] = React.useState(100);

  React.useEffect(() => {
    const interval = 50;
    const decrement = (100 / duration) * interval;

    const timer = setInterval(() => {
      setProgress((prev) => Math.max(0, prev - decrement));
    }, interval);

    return () => clearInterval(timer);
  }, [duration]);

  return (
    <motion.div
      initial={{ opacity: 0, y: 50, scale: 0.9 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, scale: 0.9 }}
      className="relative bg-card border border-border rounded-lg shadow-lg overflow-hidden min-w-[300px] max-w-md"
    >
      {/* Progress bar */}
      <div className="absolute top-0 left-0 right-0 h-1 bg-muted overflow-hidden">
        <motion.div
          className="h-full bg-primary"
          initial={{ width: '100%' }}
          animate={{ width: `${progress}%` }}
          transition={{ duration: 0.05 }}
        />
      </div>

      <div className="p-4 pt-5">
        <div className="flex items-start gap-3">
          {/* Icon */}
          {Icon && (
            <div className={cn('shrink-0 mt-0.5', iconColor)}>
              <Icon className="h-5 w-5" />
            </div>
          )}

          {/* Content */}
          <div className="flex-1 min-w-0">
            <p className="font-medium text-foreground">{message}</p>
            {description && (
              <p className="text-sm text-muted-foreground mt-1">{description}</p>
            )}
          </div>

          {/* Actions */}
          <div className="flex items-center gap-2 shrink-0">
            <Button
              variant="outline"
              size="sm"
              className="h-8 gap-1.5"
              onClick={onUndo}
            >
              <Undo2 className="h-3.5 w-3.5" />
              {undoLabel}
            </Button>
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8"
              onClick={() => toast.dismiss(id)}
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>
    </motion.div>
  );
}

// =============================================================================
// QUICK TOAST HELPERS
// =============================================================================

/** Toast de sucesso com undo */
export function toastSuccessWithUndo(
  message: string,
  options: Omit<ToastWithUndoOptions, 'message' | 'type'>
) {
  return toastWithUndo({ message, type: 'success', ...options });
}

/** Toast de delete com undo */
export function toastDeleteWithUndo(
  entityName: string,
  options: Omit<ToastWithUndoOptions, 'message' | 'description' | 'type'>
) {
  return toastWithUndo({
    message: `${entityName} excluído`,
    description: 'Clique em desfazer para recuperar',
    type: 'warning',
    undoLabel: 'Desfazer',
    ...options,
  });
}

/** Toast de ação com undo */
export function toastActionWithUndo(
  action: string,
  entityName: string,
  options: Omit<ToastWithUndoOptions, 'message' | 'type'>
) {
  return toastWithUndo({
    message: `${entityName} ${action}`,
    type: 'success',
    ...options,
  });
}

// =============================================================================
// CONFIRMATION TOAST
// =============================================================================

export interface ConfirmationToastOptions {
  message: string;
  description?: string;
  confirmLabel?: string;
  cancelLabel?: string;
  onConfirm: () => void | Promise<void>;
  onCancel?: () => void;
  type?: 'warning' | 'danger';
}

export function toastConfirmation({
  message,
  description,
  confirmLabel = 'Confirmar',
  cancelLabel = 'Cancelar',
  onConfirm,
  onCancel,
  type = 'warning',
}: ConfirmationToastOptions) {
  const toastId = toast.custom(
    (t) => (
      <motion.div
        initial={{ opacity: 0, y: 50, scale: 0.9 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, scale: 0.9 }}
        className="bg-card border border-border rounded-lg shadow-lg overflow-hidden min-w-[300px] max-w-md p-4"
      >
        <div className="flex items-start gap-3">
          <div className={cn('shrink-0 mt-0.5', type === 'danger' ? 'text-destructive' : 'text-warning')}>
            <AlertTriangle className="h-5 w-5" />
          </div>

          <div className="flex-1 min-w-0">
            <p className="font-medium text-foreground">{message}</p>
            {description && (
              <p className="text-sm text-muted-foreground mt-1">{description}</p>
            )}

            <div className="flex items-center gap-2 mt-3">
              <Button
                variant={type === 'danger' ? 'destructive' : 'default'}
                size="sm"
                onClick={async () => {
                  toast.dismiss(t);
                  await onConfirm();
                }}
              >
                {confirmLabel}
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => {
                  toast.dismiss(t);
                  onCancel?.();
                }}
              >
                {cancelLabel}
              </Button>
            </div>
          </div>
        </div>
      </motion.div>
    ),
    {
      duration: Infinity,
    }
  );

  return toastId;
}
