import * as React from 'react';
import { format, subDays, startOfMonth, endOfMonth, startOfYear, subMonths } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { Calendar as CalendarIcon, ChevronDown } from 'lucide-react';
import { DateRange } from 'react-day-picker';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';

// =============================================================================
// TYPES
// =============================================================================

export interface DateRangePickerProps {
  /** Range selecionado */
  value?: DateRange;
  /** Callback de mudança */
  onChange?: (range: DateRange | undefined) => void;
  /** Placeholder */
  placeholder?: string;
  /** Presets rápidos */
  showPresets?: boolean;
  /** Alinhamento do popover */
  align?: 'start' | 'center' | 'end';
  /** Classes */
  className?: string;
  /** Desabilitado */
  disabled?: boolean;
}

interface DatePreset {
  label: string;
  getValue: () => DateRange;
}

// =============================================================================
// PRESETS
// =============================================================================

const datePresets: DatePreset[] = [
  {
    label: 'Hoje',
    getValue: () => {
      const today = new Date();
      return { from: today, to: today };
    },
  },
  {
    label: 'Últimos 7 dias',
    getValue: () => ({
      from: subDays(new Date(), 6),
      to: new Date(),
    }),
  },
  {
    label: 'Últimos 15 dias',
    getValue: () => ({
      from: subDays(new Date(), 14),
      to: new Date(),
    }),
  },
  {
    label: 'Últimos 30 dias',
    getValue: () => ({
      from: subDays(new Date(), 29),
      to: new Date(),
    }),
  },
  {
    label: 'Este mês',
    getValue: () => ({
      from: startOfMonth(new Date()),
      to: new Date(),
    }),
  },
  {
    label: 'Mês passado',
    getValue: () => {
      const lastMonth = subMonths(new Date(), 1);
      return {
        from: startOfMonth(lastMonth),
        to: endOfMonth(lastMonth),
      };
    },
  },
  {
    label: 'Últimos 3 meses',
    getValue: () => ({
      from: subMonths(new Date(), 3),
      to: new Date(),
    }),
  },
  {
    label: 'Este ano',
    getValue: () => ({
      from: startOfYear(new Date()),
      to: new Date(),
    }),
  },
];

// =============================================================================
// COMPONENT
// =============================================================================

export function DateRangePicker({
  value,
  onChange,
  placeholder = 'Selecione um período',
  showPresets = true,
  align = 'start',
  className,
  disabled = false,
}: DateRangePickerProps) {
  const [open, setOpen] = React.useState(false);

  const handlePresetClick = (preset: DatePreset) => {
    onChange?.(preset.getValue());
    setOpen(false);
  };

  const handleClear = () => {
    onChange?.(undefined);
  };

  const formatDateRange = (range: DateRange | undefined): string => {
    if (!range?.from) return placeholder;

    if (!range.to) {
      return format(range.from, "dd 'de' MMM, yyyy", { locale: ptBR });
    }

    // Mesmo dia
    if (format(range.from, 'yyyy-MM-dd') === format(range.to, 'yyyy-MM-dd')) {
      return format(range.from, "dd 'de' MMM, yyyy", { locale: ptBR });
    }

    // Mesmo mês
    if (format(range.from, 'yyyy-MM') === format(range.to, 'yyyy-MM')) {
      return `${format(range.from, 'dd')} - ${format(range.to, "dd 'de' MMM, yyyy", { locale: ptBR })}`;
    }

    // Mesmo ano
    if (format(range.from, 'yyyy') === format(range.to, 'yyyy')) {
      return `${format(range.from, "dd 'de' MMM", { locale: ptBR })} - ${format(range.to, "dd 'de' MMM, yyyy", { locale: ptBR })}`;
    }

    // Anos diferentes
    return `${format(range.from, "dd/MM/yy", { locale: ptBR })} - ${format(range.to, "dd/MM/yy", { locale: ptBR })}`;
  };

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          disabled={disabled}
          className={cn(
            'justify-between text-left font-normal min-w-[240px]',
            !value && 'text-muted-foreground',
            className
          )}
        >
          <div className="flex items-center gap-2">
            <CalendarIcon className="h-4 w-4" />
            <span className="truncate">{formatDateRange(value)}</span>
          </div>
          <ChevronDown className="h-4 w-4 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-auto p-0" align={align}>
        <div className="flex">
          {/* Presets */}
          {showPresets && (
            <div className="border-r border-border p-2 space-y-1 w-40">
              <p className="text-xs font-medium text-muted-foreground px-2 py-1">
                Períodos rápidos
              </p>
              {datePresets.map((preset) => (
                <Button
                  key={preset.label}
                  variant="ghost"
                  size="sm"
                  className="w-full justify-start text-sm h-8"
                  onClick={() => handlePresetClick(preset)}
                >
                  {preset.label}
                </Button>
              ))}
              {value && (
                <>
                  <div className="border-t border-border my-2" />
                  <Button
                    variant="ghost"
                    size="sm"
                    className="w-full justify-start text-sm h-8 text-muted-foreground"
                    onClick={handleClear}
                  >
                    Limpar
                  </Button>
                </>
              )}
            </div>
          )}

          {/* Calendar */}
          <div className="p-3">
            <Calendar
              mode="range"
              defaultMonth={value?.from}
              selected={value}
              onSelect={onChange}
              numberOfMonths={2}
              locale={ptBR}
              className="rounded-md"
            />
          </div>
        </div>
      </PopoverContent>
    </Popover>
  );
}

// =============================================================================
// QUICK DATE BUTTONS
// =============================================================================

export interface QuickDateButtonsProps {
  value?: DateRange;
  onChange?: (range: DateRange | undefined) => void;
  presets?: ('today' | '7d' | '15d' | '30d' | 'month' | 'year')[];
  className?: string;
}

export function QuickDateButtons({
  value,
  onChange,
  presets = ['7d', '15d', '30d', 'month'],
  className,
}: QuickDateButtonsProps) {
  const presetMap: Record<string, DatePreset> = {
    today: datePresets[0],
    '7d': datePresets[1],
    '15d': datePresets[2],
    '30d': datePresets[3],
    month: datePresets[4],
    year: datePresets[7],
  };

  const isSelected = (preset: DatePreset): boolean => {
    if (!value?.from || !value?.to) return false;
    const presetValue = preset.getValue();
    return (
      format(value.from, 'yyyy-MM-dd') === format(presetValue.from!, 'yyyy-MM-dd') &&
      format(value.to, 'yyyy-MM-dd') === format(presetValue.to!, 'yyyy-MM-dd')
    );
  };

  return (
    <div className={cn('flex items-center gap-1', className)}>
      {presets.map((key) => {
        const preset = presetMap[key];
        if (!preset) return null;
        const selected = isSelected(preset);
        return (
          <Button
            key={key}
            variant={selected ? 'default' : 'outline'}
            size="sm"
            className="h-8 text-xs"
            onClick={() => onChange?.(preset.getValue())}
          >
            {preset.label}
          </Button>
        );
      })}
    </div>
  );
}

// =============================================================================
// SINGLE DATE PICKER
// =============================================================================

export interface SingleDatePickerProps {
  value?: Date;
  onChange?: (date: Date | undefined) => void;
  placeholder?: string;
  align?: 'start' | 'center' | 'end';
  className?: string;
  disabled?: boolean;
}

export function SingleDatePicker({
  value,
  onChange,
  placeholder = 'Selecione uma data',
  align = 'start',
  className,
  disabled = false,
}: SingleDatePickerProps) {
  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          disabled={disabled}
          className={cn(
            'justify-start text-left font-normal w-[200px]',
            !value && 'text-muted-foreground',
            className
          )}
        >
          <CalendarIcon className="mr-2 h-4 w-4" />
          {value ? format(value, "dd 'de' MMM, yyyy", { locale: ptBR }) : placeholder}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-auto p-0" align={align}>
        <Calendar
          mode="single"
          selected={value}
          onSelect={onChange}
          locale={ptBR}
          initialFocus
        />
      </PopoverContent>
    </Popover>
  );
}
