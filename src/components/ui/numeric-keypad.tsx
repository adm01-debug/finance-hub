import * as React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Delete, Check, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { cn } from '@/lib/utils';

// =============================================================================
// TYPES
// =============================================================================

export interface NumericKeypadProps {
  value: string;
  onChange: (value: string) => void;
  onConfirm?: () => void;
  onCancel?: () => void;
  maxLength?: number;
  decimalPlaces?: number;
  allowDecimal?: boolean;
  showDisplay?: boolean;
  displayPrefix?: string;
  displaySuffix?: string;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

// =============================================================================
// NUMERIC KEYPAD
// =============================================================================

export function NumericKeypad({
  value,
  onChange,
  onConfirm,
  onCancel,
  maxLength = 15,
  decimalPlaces = 2,
  allowDecimal = true,
  showDisplay = true,
  displayPrefix = 'R$ ',
  displaySuffix,
  size = 'md',
  className,
}: NumericKeypadProps) {
  const handleKeyPress = (key: string) => {
    let newValue = value;

    if (key === 'backspace') {
      newValue = value.slice(0, -1);
    } else if (key === 'clear') {
      newValue = '';
    } else if (key === 'decimal') {
      if (!allowDecimal) return;
      if (value.includes(',')) return;
      newValue = value ? value + ',' : '0,';
    } else if (key === 'confirm') {
      onConfirm?.();
      return;
    } else if (key === 'cancel') {
      onCancel?.();
      return;
    } else {
      // Handle number keys
      const cleanValue = value.replace(',', '');
      if (cleanValue.length >= maxLength) return;

      // Check decimal places
      if (value.includes(',')) {
        const [, decimals] = value.split(',');
        if (decimals && decimals.length >= decimalPlaces) return;
      }

      newValue = value + key;
    }

    onChange(newValue);
  };

  const formatDisplay = (val: string): string => {
    if (!val) return '0,00';

    // Ensure proper decimal format
    if (!val.includes(',')) {
      const num = parseInt(val, 10);
      return new Intl.NumberFormat('pt-BR', {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
      }).format(num / 100);
    }

    const [integer, decimal = ''] = val.split(',');
    const formattedInt = new Intl.NumberFormat('pt-BR').format(parseInt(integer || '0', 10));
    return `${formattedInt},${decimal.padEnd(2, '0')}`;
  };

  const sizeClasses = {
    sm: { grid: 'gap-1', button: 'h-10 text-lg', display: 'text-2xl' },
    md: { grid: 'gap-2', button: 'h-12 text-xl', display: 'text-3xl' },
    lg: { grid: 'gap-3', button: 'h-16 text-2xl', display: 'text-4xl' },
  };

  const sizes = sizeClasses[size];

  const keys = [
    ['1', '2', '3'],
    ['4', '5', '6'],
    ['7', '8', '9'],
    [allowDecimal ? 'decimal' : 'clear', '0', 'backspace'],
  ];

  return (
    <div className={cn('space-y-4', className)}>
      {/* Display */}
      {showDisplay && (
        <div className="bg-muted rounded-lg p-4 text-right">
          <AnimatePresence mode="wait">
            <motion.div
              key={value}
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 10 }}
              className={cn('font-mono font-bold', sizes.display)}
            >
              {displayPrefix}
              {formatDisplay(value)}
              {displaySuffix}
            </motion.div>
          </AnimatePresence>
        </div>
      )}

      {/* Keypad Grid */}
      <div className={cn('grid grid-cols-3', sizes.grid)}>
        {keys.flat().map((key) => (
          <KeypadButton
            key={key}
            keyValue={key}
            onPress={handleKeyPress}
            className={sizes.button}
          />
        ))}
      </div>

      {/* Action buttons */}
      {(onCancel || onConfirm) && (
        <div className="flex gap-2">
          {onCancel && (
            <Button
              variant="outline"
              className="flex-1"
              onClick={() => handleKeyPress('cancel')}
            >
              <X className="h-4 w-4 mr-1" />
              Cancelar
            </Button>
          )}
          {onConfirm && (
            <Button
              className="flex-1"
              onClick={() => handleKeyPress('confirm')}
            >
              <Check className="h-4 w-4 mr-1" />
              Confirmar
            </Button>
          )}
        </div>
      )}
    </div>
  );
}

// =============================================================================
// KEYPAD BUTTON
// =============================================================================

function KeypadButton({
  keyValue,
  onPress,
  className,
}: {
  keyValue: string;
  onPress: (key: string) => void;
  className?: string;
}) {
  const content = (() => {
    switch (keyValue) {
      case 'decimal':
        return ',';
      case 'backspace':
        return <Delete className="h-5 w-5" />;
      case 'clear':
        return 'C';
      default:
        return keyValue;
    }
  })();

  const variant = keyValue === 'backspace' ? 'outline' : keyValue === 'clear' ? 'destructive' : 'secondary';

  return (
    <motion.div whileTap={{ scale: 0.95 }}>
      <Button
        variant={variant}
        className={cn('w-full font-semibold', className)}
        onClick={() => onPress(keyValue)}
      >
        {content}
      </Button>
    </motion.div>
  );
}

// =============================================================================
// NUMERIC KEYPAD DIALOG
// =============================================================================

export function NumericKeypadDialog({
  value,
  onChange,
  onConfirm,
  open,
  onOpenChange,
  title = 'Digite o valor',
  ...keypadProps
}: NumericKeypadProps & {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  title?: string;
}) {
  const handleConfirm = () => {
    onConfirm?.();
    onOpenChange(false);
  };

  const handleCancel = () => {
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-sm">
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
        </DialogHeader>
        <NumericKeypad
          value={value}
          onChange={onChange}
          onConfirm={handleConfirm}
          onCancel={handleCancel}
          {...keypadProps}
        />
      </DialogContent>
    </Dialog>
  );
}

// =============================================================================
// QUANTITY KEYPAD
// =============================================================================

export function QuantityKeypad({
  value,
  onChange,
  min = 0,
  max = 9999,
  onConfirm,
  onCancel,
  className,
}: {
  value: number;
  onChange: (value: number) => void;
  min?: number;
  max?: number;
  onConfirm?: () => void;
  onCancel?: () => void;
  className?: string;
}) {
  const [inputValue, setInputValue] = React.useState(value.toString());

  const handleChange = (newValue: string) => {
    const numValue = parseInt(newValue, 10) || 0;
    if (numValue >= min && numValue <= max) {
      setInputValue(newValue);
      onChange(numValue);
    }
  };

  const handleIncrement = (amount: number) => {
    const newValue = Math.min(max, Math.max(min, value + amount));
    setInputValue(newValue.toString());
    onChange(newValue);
  };

  return (
    <div className={cn('space-y-4', className)}>
      {/* Display */}
      <div className="bg-muted rounded-lg p-4 text-center">
        <AnimatePresence mode="wait">
          <motion.div
            key={value}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 1.1 }}
            className="text-4xl font-bold font-mono"
          >
            {value}
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Quick adjust buttons */}
      <div className="flex gap-2">
        <Button
          variant="outline"
          className="flex-1"
          onClick={() => handleIncrement(-10)}
          disabled={value - 10 < min}
        >
          -10
        </Button>
        <Button
          variant="outline"
          className="flex-1"
          onClick={() => handleIncrement(-1)}
          disabled={value - 1 < min}
        >
          -1
        </Button>
        <Button
          variant="outline"
          className="flex-1"
          onClick={() => handleIncrement(1)}
          disabled={value + 1 > max}
        >
          +1
        </Button>
        <Button
          variant="outline"
          className="flex-1"
          onClick={() => handleIncrement(10)}
          disabled={value + 10 > max}
        >
          +10
        </Button>
      </div>

      {/* Keypad */}
      <NumericKeypad
        value={inputValue}
        onChange={handleChange}
        onConfirm={onConfirm}
        onCancel={onCancel}
        allowDecimal={false}
        showDisplay={false}
        size="sm"
      />
    </div>
  );
}

// =============================================================================
// PIN KEYPAD
// =============================================================================

export function PinKeypad({
  length = 4,
  value,
  onChange,
  onComplete,
  masked = true,
  className,
}: {
  length?: number;
  value: string;
  onChange: (value: string) => void;
  onComplete?: (pin: string) => void;
  masked?: boolean;
  className?: string;
}) {
  const handleKeyPress = (key: string) => {
    if (key === 'backspace') {
      onChange(value.slice(0, -1));
    } else if (key === 'clear') {
      onChange('');
    } else if (value.length < length) {
      const newValue = value + key;
      onChange(newValue);
      if (newValue.length === length) {
        onComplete?.(newValue);
      }
    }
  };

  const keys = [
    ['1', '2', '3'],
    ['4', '5', '6'],
    ['7', '8', '9'],
    ['clear', '0', 'backspace'],
  ];

  return (
    <div className={cn('space-y-6', className)}>
      {/* PIN dots display */}
      <div className="flex justify-center gap-3">
        {Array.from({ length }).map((_, index) => (
          <motion.div
            key={index}
            initial={false}
            animate={{
              scale: index < value.length ? 1.1 : 1,
              backgroundColor: index < value.length ? 'hsl(var(--primary))' : 'hsl(var(--muted))',
            }}
            className={cn(
              'w-4 h-4 rounded-full border-2',
              index < value.length
                ? 'border-primary bg-primary'
                : 'border-muted-foreground/30 bg-muted'
            )}
          >
            {!masked && index < value.length && (
              <span className="flex items-center justify-center h-full text-[10px] text-primary-foreground font-bold">
                {value[index]}
              </span>
            )}
          </motion.div>
        ))}
      </div>

      {/* Keypad Grid */}
      <div className="grid grid-cols-3 gap-3 max-w-[240px] mx-auto">
        {keys.flat().map((key) => {
          const content = (() => {
            if (key === 'backspace') return <Delete className="h-5 w-5" />;
            if (key === 'clear') return <X className="h-5 w-5" />;
            return key;
          })();

          return (
            <motion.div key={key} whileTap={{ scale: 0.9 }}>
              <Button
                variant={key === 'clear' ? 'ghost' : 'outline'}
                className="w-full h-14 text-xl font-semibold rounded-full"
                onClick={() => handleKeyPress(key)}
              >
                {content}
              </Button>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}
