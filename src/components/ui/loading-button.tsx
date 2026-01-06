import * as React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Check, X, Loader2, type LucideIcon } from 'lucide-react';
import { Button, type ButtonProps } from '@/components/ui/button';
import { cn } from '@/lib/utils';

// =============================================================================
// TYPES
// =============================================================================

export type LoadingButtonState = 'idle' | 'loading' | 'success' | 'error';

export interface LoadingButtonProps extends Omit<ButtonProps, 'children'> {
  /** Estado do botão */
  state?: LoadingButtonState;
  /** Texto padrão (idle) */
  children: React.ReactNode;
  /** Texto durante loading */
  loadingText?: string;
  /** Texto após sucesso */
  successText?: string;
  /** Texto após erro */
  errorText?: string;
  /** Ícone padrão */
  icon?: LucideIcon;
  /** Duração do estado de sucesso/erro antes de voltar ao idle (ms) */
  resetDelay?: number;
  /** Callback após reset */
  onReset?: () => void;
  /** Esconder texto durante loading */
  hideTextOnLoading?: boolean;
}

// =============================================================================
// COMPONENT
// =============================================================================

export const LoadingButton = React.forwardRef<HTMLButtonElement, LoadingButtonProps>(
  (
    {
      state = 'idle',
      children,
      loadingText,
      successText = 'Sucesso!',
      errorText = 'Erro!',
      icon: Icon,
      resetDelay = 2000,
      onReset,
      hideTextOnLoading = false,
      disabled,
      className,
      variant,
      ...props
    },
    ref
  ) => {
    const [internalState, setInternalState] = React.useState<LoadingButtonState>(state);

    // Sync with external state
    React.useEffect(() => {
      setInternalState(state);
    }, [state]);

    // Auto-reset after success/error
    React.useEffect(() => {
      if (internalState === 'success' || internalState === 'error') {
        const timer = setTimeout(() => {
          setInternalState('idle');
          onReset?.();
        }, resetDelay);
        return () => clearTimeout(timer);
      }
    }, [internalState, resetDelay, onReset]);

    // Determine variant based on state
    const stateVariant = React.useMemo(() => {
      if (internalState === 'success') return 'default';
      if (internalState === 'error') return 'destructive';
      return variant;
    }, [internalState, variant]);

    // Determine if button is disabled
    const isDisabled = disabled || internalState === 'loading';

    // Get current content
    const getContent = () => {
      switch (internalState) {
        case 'loading':
          return (
            <motion.span
              key="loading"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="flex items-center gap-2"
            >
              <Loader2 className="h-4 w-4 animate-spin" />
              {!hideTextOnLoading && <span>{loadingText || children}</span>}
            </motion.span>
          );

        case 'success':
          return (
            <motion.span
              key="success"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0 }}
              className="flex items-center gap-2"
            >
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: 'spring', stiffness: 500, damping: 15 }}
              >
                <Check className="h-4 w-4" />
              </motion.div>
              <span>{successText}</span>
            </motion.span>
          );

        case 'error':
          return (
            <motion.span
              key="error"
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0 }}
              className="flex items-center gap-2"
            >
              <motion.div
                animate={{ x: [0, -3, 3, -3, 3, 0] }}
                transition={{ duration: 0.4 }}
              >
                <X className="h-4 w-4" />
              </motion.div>
              <span>{errorText}</span>
            </motion.span>
          );

        default:
          return (
            <motion.span
              key="idle"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="flex items-center gap-2"
            >
              {Icon && <Icon className="h-4 w-4" />}
              <span>{children}</span>
            </motion.span>
          );
      }
    };

    return (
      <Button
        ref={ref}
        variant={stateVariant}
        disabled={isDisabled}
        className={cn(
          'relative overflow-hidden transition-all',
          internalState === 'success' && 'bg-success hover:bg-success/90 text-success-foreground',
          className
        )}
        {...props}
      >
        <AnimatePresence mode="wait">{getContent()}</AnimatePresence>
      </Button>
    );
  }
);

LoadingButton.displayName = 'LoadingButton';

// =============================================================================
// HOOK FOR STATE MANAGEMENT
// =============================================================================

export interface UseLoadingButtonOptions {
  /** Duração do estado de sucesso/erro */
  resetDelay?: number;
  /** Callback após sucesso */
  onSuccess?: () => void;
  /** Callback após erro */
  onError?: (error: Error) => void;
}

export function useLoadingButton(options: UseLoadingButtonOptions = {}) {
  const { resetDelay = 2000, onSuccess, onError } = options;
  const [state, setState] = React.useState<LoadingButtonState>('idle');

  const execute = React.useCallback(
    async (action: () => Promise<void>) => {
      setState('loading');
      try {
        await action();
        setState('success');
        onSuccess?.();
      } catch (error) {
        setState('error');
        onError?.(error as Error);
      }
    },
    [onSuccess, onError]
  );

  const reset = React.useCallback(() => {
    setState('idle');
  }, []);

  return {
    state,
    execute,
    reset,
    isLoading: state === 'loading',
    isSuccess: state === 'success',
    isError: state === 'error',
    buttonProps: {
      state,
      resetDelay,
      onReset: reset,
    },
  };
}

// =============================================================================
// SAVE BUTTON PRESET
// =============================================================================

export interface SaveButtonProps extends Omit<LoadingButtonProps, 'children' | 'successText' | 'errorText'> {
  /** Ação de salvar */
  onSave?: () => Promise<void>;
}

export function SaveButton({ onSave, ...props }: SaveButtonProps) {
  const { state, execute, buttonProps } = useLoadingButton();

  const handleClick = async () => {
    if (onSave) {
      await execute(onSave);
    }
  };

  return (
    <LoadingButton
      {...buttonProps}
      {...props}
      onClick={handleClick}
      loadingText="Salvando..."
      successText="Salvo!"
      errorText="Erro ao salvar"
    >
      Salvar
    </LoadingButton>
  );
}

// =============================================================================
// SUBMIT BUTTON PRESET
// =============================================================================

export interface SubmitButtonProps extends Omit<LoadingButtonProps, 'type'> {
  /** Form ID para submit */
  form?: string;
}

export function SubmitButton({ form, ...props }: SubmitButtonProps) {
  return (
    <LoadingButton
      type="submit"
      form={form}
      loadingText="Enviando..."
      successText="Enviado!"
      errorText="Erro ao enviar"
      {...props}
    >
      {props.children || 'Enviar'}
    </LoadingButton>
  );
}

// =============================================================================
// DELETE BUTTON PRESET
// =============================================================================

export interface DeleteButtonProps extends Omit<LoadingButtonProps, 'variant' | 'successText' | 'errorText'> {
  /** Ação de deletar */
  onDelete?: () => Promise<void>;
}

export function DeleteButton({ onDelete, children = 'Excluir', ...props }: DeleteButtonProps) {
  const { state, execute, buttonProps } = useLoadingButton();

  const handleClick = async () => {
    if (onDelete) {
      await execute(onDelete);
    }
  };

  return (
    <LoadingButton
      variant="destructive"
      {...buttonProps}
      {...props}
      onClick={handleClick}
      loadingText="Excluindo..."
      successText="Excluído!"
      errorText="Erro ao excluir"
    >
      {children}
    </LoadingButton>
  );
}
