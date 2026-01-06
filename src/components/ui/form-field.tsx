import * as React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { AlertCircle, HelpCircle, Info, CheckCircle } from 'lucide-react';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import { cn } from '@/lib/utils';

// =============================================================================
// TYPES
// =============================================================================

export interface FormFieldProps {
  /** ID único do campo */
  id?: string;
  /** Nome do campo (para formulários) */
  name?: string;
  /** Label do campo */
  label?: string;
  /** Texto de ajuda */
  hint?: string;
  /** Tooltip de ajuda */
  tooltip?: string;
  /** Mensagem de erro */
  error?: string;
  /** Mensagem de sucesso */
  success?: string;
  /** Campo obrigatório */
  required?: boolean;
  /** Campo desabilitado */
  disabled?: boolean;
  /** Campo em modo de edição inline */
  inline?: boolean;
  /** Caracteres restantes (para inputs com maxLength) */
  charCount?: { current: number; max: number };
  /** Classes adicionais */
  className?: string;
  /** Conteúdo do campo */
  children?: React.ReactNode;
}

// =============================================================================
// FORM FIELD WRAPPER
// =============================================================================

export function FormField({
  id,
  name,
  label,
  hint,
  tooltip,
  error,
  success,
  required = false,
  disabled = false,
  inline = false,
  charCount,
  className,
  children,
}: FormFieldProps) {
  const fieldId = id || name;
  const hasError = !!error;
  const hasSuccess = !!success;

  return (
    <div
      className={cn(
        'space-y-2',
        inline && 'flex items-center gap-4',
        disabled && 'opacity-60',
        className
      )}
    >
      {/* Label Row */}
      {label && (
        <div className={cn('flex items-center gap-1', inline && 'min-w-[120px]')}>
          <Label
            htmlFor={fieldId}
            className={cn(
              'text-sm font-medium',
              hasError && 'text-destructive',
              hasSuccess && 'text-success'
            )}
          >
            {label}
            {required && <span className="text-destructive ml-1">*</span>}
          </Label>

          {tooltip && (
            <Tooltip>
              <TooltipTrigger asChild>
                <button type="button" className="text-muted-foreground hover:text-foreground">
                  <HelpCircle className="h-3.5 w-3.5" />
                </button>
              </TooltipTrigger>
              <TooltipContent className="max-w-xs">
                {tooltip}
              </TooltipContent>
            </Tooltip>
          )}
        </div>
      )}

      {/* Field Content */}
      <div className={cn('relative', inline && 'flex-1')}>
        {children}

        {/* Character count */}
        {charCount && (
          <div
            className={cn(
              'absolute right-2 bottom-2 text-xs',
              charCount.current > charCount.max * 0.9
                ? 'text-warning'
                : 'text-muted-foreground',
              charCount.current >= charCount.max && 'text-destructive'
            )}
          >
            {charCount.current}/{charCount.max}
          </div>
        )}
      </div>

      {/* Messages */}
      <AnimatePresence mode="wait">
        {hasError && (
          <motion.div
            key="error"
            initial={{ opacity: 0, y: -10, height: 0 }}
            animate={{ opacity: 1, y: 0, height: 'auto' }}
            exit={{ opacity: 0, y: -10, height: 0 }}
            className="flex items-center gap-1.5 text-sm text-destructive"
          >
            <AlertCircle className="h-3.5 w-3.5 shrink-0" />
            <span>{error}</span>
          </motion.div>
        )}

        {hasSuccess && !hasError && (
          <motion.div
            key="success"
            initial={{ opacity: 0, y: -10, height: 0 }}
            animate={{ opacity: 1, y: 0, height: 'auto' }}
            exit={{ opacity: 0, y: -10, height: 0 }}
            className="flex items-center gap-1.5 text-sm text-success"
          >
            <CheckCircle className="h-3.5 w-3.5 shrink-0" />
            <span>{success}</span>
          </motion.div>
        )}

        {hint && !hasError && !hasSuccess && (
          <motion.div
            key="hint"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="flex items-center gap-1.5 text-sm text-muted-foreground"
          >
            <Info className="h-3.5 w-3.5 shrink-0" />
            <span>{hint}</span>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

// =============================================================================
// FORM INPUT (Convenience wrapper)
// =============================================================================

export interface FormInputProps
  extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'className'> {
  /** Props do FormField */
  fieldProps?: Omit<FormFieldProps, 'children'>;
  /** Classes do input */
  inputClassName?: string;
  /** Classes do wrapper */
  className?: string;
}

export const FormInput = React.forwardRef<HTMLInputElement, FormInputProps>(
  ({ fieldProps, inputClassName, className, ...inputProps }, ref) => {
    const hasError = !!fieldProps?.error;

    return (
      <FormField {...fieldProps} className={className}>
        <Input
          ref={ref}
          id={fieldProps?.id || fieldProps?.name}
          name={fieldProps?.name}
          disabled={fieldProps?.disabled}
          className={cn(
            hasError && 'border-destructive focus-visible:ring-destructive',
            inputClassName
          )}
          aria-invalid={hasError}
          aria-describedby={hasError ? `${fieldProps?.name}-error` : undefined}
          {...inputProps}
        />
      </FormField>
    );
  }
);

FormInput.displayName = 'FormInput';

// =============================================================================
// FORM TEXTAREA
// =============================================================================

export interface FormTextareaProps
  extends Omit<React.TextareaHTMLAttributes<HTMLTextAreaElement>, 'className'> {
  fieldProps?: Omit<FormFieldProps, 'children'>;
  textareaClassName?: string;
  className?: string;
}

export const FormTextarea = React.forwardRef<HTMLTextAreaElement, FormTextareaProps>(
  ({ fieldProps, textareaClassName, className, ...textareaProps }, ref) => {
    const hasError = !!fieldProps?.error;

    return (
      <FormField {...fieldProps} className={className}>
        <Textarea
          ref={ref}
          id={fieldProps?.id || fieldProps?.name}
          name={fieldProps?.name}
          disabled={fieldProps?.disabled}
          className={cn(
            hasError && 'border-destructive focus-visible:ring-destructive',
            textareaClassName
          )}
          aria-invalid={hasError}
          {...textareaProps}
        />
      </FormField>
    );
  }
);

FormTextarea.displayName = 'FormTextarea';

// =============================================================================
// FORM SELECT (Wrapper for custom selects)
// =============================================================================

export function FormSelect({
  fieldProps,
  children,
  className,
}: {
  fieldProps?: Omit<FormFieldProps, 'children'>;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <FormField {...fieldProps} className={className}>
      {children}
    </FormField>
  );
}

// =============================================================================
// FORM SECTION
// =============================================================================

export interface FormSectionProps {
  title?: string;
  description?: string;
  children: React.ReactNode;
  collapsible?: boolean;
  defaultOpen?: boolean;
  className?: string;
}

export function FormSection({
  title,
  description,
  children,
  collapsible = false,
  defaultOpen = true,
  className,
}: FormSectionProps) {
  const [isOpen, setIsOpen] = React.useState(defaultOpen);

  return (
    <div className={cn('space-y-4', className)}>
      {(title || description) && (
        <div
          className={cn(
            'flex items-start justify-between',
            collapsible && 'cursor-pointer'
          )}
          onClick={() => collapsible && setIsOpen(!isOpen)}
        >
          <div>
            {title && <h3 className="text-lg font-semibold">{title}</h3>}
            {description && (
              <p className="text-sm text-muted-foreground mt-1">{description}</p>
            )}
          </div>

          {collapsible && (
            <motion.div
              animate={{ rotate: isOpen ? 180 : 0 }}
              className="text-muted-foreground"
            >
              <svg
                width="20"
                height="20"
                viewBox="0 0 20 20"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
              >
                <path d="M5 7.5L10 12.5L15 7.5" />
              </svg>
            </motion.div>
          )}
        </div>
      )}

      <AnimatePresence initial={false}>
        {(!collapsible || isOpen) && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.2 }}
          >
            {children}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

// =============================================================================
// FORM ROW (For horizontal layouts)
// =============================================================================

export function FormRow({
  children,
  columns = 2,
  gap = 4,
  className,
}: {
  children: React.ReactNode;
  columns?: 1 | 2 | 3 | 4;
  gap?: 2 | 3 | 4 | 6 | 8;
  className?: string;
}) {
  const gridCols = {
    1: 'grid-cols-1',
    2: 'grid-cols-1 sm:grid-cols-2',
    3: 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3',
    4: 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-4',
  };

  const gapClasses = {
    2: 'gap-2',
    3: 'gap-3',
    4: 'gap-4',
    6: 'gap-6',
    8: 'gap-8',
  };

  return (
    <div className={cn('grid', gridCols[columns], gapClasses[gap], className)}>
      {children}
    </div>
  );
}

// =============================================================================
// FORM ACTIONS
// =============================================================================

export function FormActions({
  children,
  align = 'right',
  sticky = false,
  className,
}: {
  children: React.ReactNode;
  align?: 'left' | 'center' | 'right';
  sticky?: boolean;
  className?: string;
}) {
  const alignClasses = {
    left: 'justify-start',
    center: 'justify-center',
    right: 'justify-end',
  };

  return (
    <div
      className={cn(
        'flex items-center gap-3 pt-6 border-t',
        alignClasses[align],
        sticky && 'sticky bottom-0 bg-background py-4',
        className
      )}
    >
      {children}
    </div>
  );
}

// =============================================================================
// FORM DIVIDER
// =============================================================================

export function FormDivider({
  label,
  className,
}: {
  label?: string;
  className?: string;
}) {
  if (!label) {
    return <hr className={cn('border-t', className)} />;
  }

  return (
    <div className={cn('relative', className)}>
      <div className="absolute inset-0 flex items-center">
        <hr className="w-full border-t" />
      </div>
      <div className="relative flex justify-center">
        <span className="bg-background px-3 text-sm text-muted-foreground">
          {label}
        </span>
      </div>
    </div>
  );
}

// =============================================================================
// INLINE EDIT FIELD
// =============================================================================

export function InlineEditField({
  value,
  onSave,
  label,
  placeholder = 'Clique para editar',
  className,
}: {
  value: string;
  onSave: (value: string) => void;
  label?: string;
  placeholder?: string;
  className?: string;
}) {
  const [isEditing, setIsEditing] = React.useState(false);
  const [editValue, setEditValue] = React.useState(value);
  const inputRef = React.useRef<HTMLInputElement>(null);

  React.useEffect(() => {
    if (isEditing) {
      inputRef.current?.focus();
      inputRef.current?.select();
    }
  }, [isEditing]);

  const handleSave = () => {
    onSave(editValue);
    setIsEditing(false);
  };

  const handleCancel = () => {
    setEditValue(value);
    setIsEditing(false);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSave();
    }
    if (e.key === 'Escape') {
      handleCancel();
    }
  };

  return (
    <div className={cn('group', className)}>
      {label && (
        <Label className="text-xs text-muted-foreground mb-1">{label}</Label>
      )}

      <AnimatePresence mode="wait">
        {isEditing ? (
          <motion.div
            key="editing"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="flex items-center gap-2"
          >
            <Input
              ref={inputRef}
              value={editValue}
              onChange={(e) => setEditValue(e.target.value)}
              onKeyDown={handleKeyDown}
              onBlur={handleSave}
              className="h-8"
            />
          </motion.div>
        ) : (
          <motion.div
            key="display"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setIsEditing(true)}
            className={cn(
              'px-2 py-1 rounded cursor-pointer',
              'hover:bg-muted transition-colors',
              'flex items-center gap-2'
            )}
          >
            <span className={cn(!value && 'text-muted-foreground')}>
              {value || placeholder}
            </span>
            <svg
              width="12"
              height="12"
              viewBox="0 0 12 12"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.5"
              className="opacity-0 group-hover:opacity-50"
            >
              <path d="M8.5 2.5L9.5 3.5L4 9L2 9.5L2.5 7.5L8.5 2.5Z" />
            </svg>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
