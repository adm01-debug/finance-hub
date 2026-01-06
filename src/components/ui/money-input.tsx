import * as React from 'react';
import { cn } from '@/lib/utils';
import { Input } from '@/components/ui/input';

// =============================================================================
// TYPES
// =============================================================================

export interface MoneyInputProps
  extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'value' | 'onChange'> {
  /** Valor em centavos (integer) */
  value?: number;
  /** Callback com valor em centavos */
  onChange?: (value: number) => void;
  /** Símbolo da moeda */
  currency?: string;
  /** Locale para formatação */
  locale?: string;
  /** Permitir valores negativos */
  allowNegative?: boolean;
  /** Número de casas decimais */
  decimalPlaces?: number;
  /** Placeholder */
  placeholder?: string;
}

// =============================================================================
// UTILS
// =============================================================================

function formatCurrency(
  valueInCents: number,
  locale: string = 'pt-BR',
  currency: string = 'BRL',
  decimalPlaces: number = 2
): string {
  const value = valueInCents / Math.pow(10, decimalPlaces);
  return new Intl.NumberFormat(locale, {
    style: 'currency',
    currency,
    minimumFractionDigits: decimalPlaces,
    maximumFractionDigits: decimalPlaces,
  }).format(value);
}

function parseCurrencyInput(
  input: string,
  decimalPlaces: number = 2,
  allowNegative: boolean = false
): number {
  // Remove tudo exceto números, vírgula, ponto e sinal negativo
  let cleaned = input.replace(/[^\d,.\-]/g, '');

  // Handle negative
  const isNegative = allowNegative && cleaned.startsWith('-');
  cleaned = cleaned.replace(/-/g, '');

  // Substitui vírgula por ponto
  cleaned = cleaned.replace(',', '.');

  // Se tiver mais de um ponto, mantém apenas o último como decimal
  const parts = cleaned.split('.');
  if (parts.length > 2) {
    cleaned = parts.slice(0, -1).join('') + '.' + parts[parts.length - 1];
  }

  // Parse para número
  let value = parseFloat(cleaned) || 0;

  // Aplica sinal negativo
  if (isNegative) value = -value;

  // Converte para centavos
  return Math.round(value * Math.pow(10, decimalPlaces));
}

// =============================================================================
// COMPONENT
// =============================================================================

export const MoneyInput = React.forwardRef<HTMLInputElement, MoneyInputProps>(
  (
    {
      value = 0,
      onChange,
      currency = 'BRL',
      locale = 'pt-BR',
      allowNegative = false,
      decimalPlaces = 2,
      placeholder = 'R$ 0,00',
      className,
      onFocus,
      onBlur,
      ...props
    },
    ref
  ) => {
    const [displayValue, setDisplayValue] = React.useState('');
    const [isFocused, setIsFocused] = React.useState(false);
    const inputRef = React.useRef<HTMLInputElement>(null);

    // Sync display value with prop value when not focused
    React.useEffect(() => {
      if (!isFocused) {
        if (value === 0) {
          setDisplayValue('');
        } else {
          setDisplayValue(formatCurrency(value, locale, currency, decimalPlaces));
        }
      }
    }, [value, isFocused, locale, currency, decimalPlaces]);

    const handleFocus = (e: React.FocusEvent<HTMLInputElement>) => {
      setIsFocused(true);
      // Mostra valor numérico limpo para edição
      if (value !== 0) {
        const numericValue = value / Math.pow(10, decimalPlaces);
        setDisplayValue(numericValue.toFixed(decimalPlaces).replace('.', ','));
      }
      onFocus?.(e);
    };

    const handleBlur = (e: React.FocusEvent<HTMLInputElement>) => {
      setIsFocused(false);
      // Formata o valor ao sair
      const parsed = parseCurrencyInput(displayValue, decimalPlaces, allowNegative);
      onChange?.(parsed);
      if (parsed === 0) {
        setDisplayValue('');
      } else {
        setDisplayValue(formatCurrency(parsed, locale, currency, decimalPlaces));
      }
      onBlur?.(e);
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      const input = e.target.value;

      // Permite digitar livremente durante edição
      setDisplayValue(input);

      // Parse e notifica mudança
      const parsed = parseCurrencyInput(input, decimalPlaces, allowNegative);
      onChange?.(parsed);
    };

    const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
      // Permite: backspace, delete, tab, escape, enter, ponto, vírgula
      const allowedKeys = [
        'Backspace',
        'Delete',
        'Tab',
        'Escape',
        'Enter',
        '.',
        ',',
        'ArrowLeft',
        'ArrowRight',
        'ArrowUp',
        'ArrowDown',
        'Home',
        'End',
      ];

      if (allowNegative) {
        allowedKeys.push('-');
      }

      // Ctrl+A, Ctrl+C, Ctrl+V, Ctrl+X
      if (
        e.ctrlKey &&
        ['a', 'c', 'v', 'x'].includes(e.key.toLowerCase())
      ) {
        return;
      }

      // Permite números
      if (/^\d$/.test(e.key)) {
        return;
      }

      // Permite teclas especiais
      if (allowedKeys.includes(e.key)) {
        return;
      }

      // Bloqueia outras teclas
      e.preventDefault();
    };

    return (
      <div className="relative">
        <Input
          ref={ref || inputRef}
          type="text"
          inputMode="decimal"
          value={displayValue}
          onChange={handleChange}
          onFocus={handleFocus}
          onBlur={handleBlur}
          onKeyDown={handleKeyDown}
          placeholder={placeholder}
          className={cn('text-right font-mono', className)}
          {...props}
        />
      </div>
    );
  }
);

MoneyInput.displayName = 'MoneyInput';

// =============================================================================
// VARIANTS
// =============================================================================

/** Input para valores em Reais (BRL) */
export const BRLInput = React.forwardRef<
  HTMLInputElement,
  Omit<MoneyInputProps, 'currency' | 'locale'>
>((props, ref) => (
  <MoneyInput ref={ref} currency="BRL" locale="pt-BR" {...props} />
));

BRLInput.displayName = 'BRLInput';

/** Input para valores em Dólares (USD) */
export const USDInput = React.forwardRef<
  HTMLInputElement,
  Omit<MoneyInputProps, 'currency' | 'locale'>
>((props, ref) => (
  <MoneyInput ref={ref} currency="USD" locale="en-US" {...props} />
));

USDInput.displayName = 'USDInput';

// =============================================================================
// DISPLAY COMPONENT
// =============================================================================

export interface MoneyDisplayProps {
  /** Valor em centavos */
  value: number;
  /** Símbolo da moeda */
  currency?: string;
  /** Locale */
  locale?: string;
  /** Casas decimais */
  decimalPlaces?: number;
  /** Mostrar sinal de positivo */
  showPositiveSign?: boolean;
  /** Colorir baseado no valor */
  colorize?: boolean;
  /** Tamanho */
  size?: 'sm' | 'md' | 'lg' | 'xl';
  /** Classes */
  className?: string;
}

export function MoneyDisplay({
  value,
  currency = 'BRL',
  locale = 'pt-BR',
  decimalPlaces = 2,
  showPositiveSign = false,
  colorize = false,
  size = 'md',
  className,
}: MoneyDisplayProps) {
  const formatted = formatCurrency(Math.abs(value), locale, currency, decimalPlaces);
  const isNegative = value < 0;
  const isPositive = value > 0;

  const sizeClasses = {
    sm: 'text-sm',
    md: 'text-base',
    lg: 'text-lg font-medium',
    xl: 'text-2xl font-bold',
  };

  const colorClasses = colorize
    ? isNegative
      ? 'text-destructive'
      : isPositive
        ? 'text-success'
        : 'text-muted-foreground'
    : '';

  return (
    <span
      className={cn(
        'font-mono tabular-nums',
        sizeClasses[size],
        colorClasses,
        className
      )}
    >
      {isNegative && '-'}
      {showPositiveSign && isPositive && '+'}
      {formatted}
    </span>
  );
}
