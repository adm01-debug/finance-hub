import * as React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Filter,
  X,
  ChevronDown,
  ChevronUp,
  Plus,
  Trash2,
  Search,
  CalendarIcon,
  Check,
} from 'lucide-react';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Checkbox } from '@/components/ui/checkbox';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
  SheetFooter,
} from '@/components/ui/sheet';
import { Calendar } from '@/components/ui/calendar';
import { Card, CardContent } from '@/components/ui/card';
import { cn } from '@/lib/utils';

// =============================================================================
// TYPES
// =============================================================================

export type FilterOperator =
  | 'equals'
  | 'not_equals'
  | 'contains'
  | 'not_contains'
  | 'starts_with'
  | 'ends_with'
  | 'greater_than'
  | 'less_than'
  | 'between'
  | 'is_empty'
  | 'is_not_empty';

export type FilterType = 'text' | 'number' | 'date' | 'select' | 'multiselect' | 'boolean';

export interface FilterField {
  id: string;
  label: string;
  type: FilterType;
  operators?: FilterOperator[];
  options?: Array<{ value: string; label: string }>;
}

export interface FilterValue {
  field: string;
  operator: FilterOperator;
  value: any;
}

export interface FilterPanelProps {
  fields: FilterField[];
  filters: FilterValue[];
  onFiltersChange: (filters: FilterValue[]) => void;
  variant?: 'inline' | 'popover' | 'sheet';
  maxInlineFilters?: number;
  className?: string;
}

// =============================================================================
// OPERATOR OPTIONS
// =============================================================================

const operatorLabels: Record<FilterOperator, string> = {
  equals: 'É igual a',
  not_equals: 'Não é igual a',
  contains: 'Contém',
  not_contains: 'Não contém',
  starts_with: 'Começa com',
  ends_with: 'Termina com',
  greater_than: 'Maior que',
  less_than: 'Menor que',
  between: 'Entre',
  is_empty: 'Está vazio',
  is_not_empty: 'Não está vazio',
};

const defaultOperators: Record<FilterType, FilterOperator[]> = {
  text: ['contains', 'equals', 'not_equals', 'starts_with', 'ends_with', 'is_empty', 'is_not_empty'],
  number: ['equals', 'not_equals', 'greater_than', 'less_than', 'between'],
  date: ['equals', 'greater_than', 'less_than', 'between'],
  select: ['equals', 'not_equals'],
  multiselect: ['contains', 'not_contains'],
  boolean: ['equals'],
};

// =============================================================================
// FILTER PANEL
// =============================================================================

export function FilterPanel({
  fields,
  filters,
  onFiltersChange,
  variant = 'inline',
  maxInlineFilters = 3,
  className,
}: FilterPanelProps) {
  const [isOpen, setIsOpen] = React.useState(false);

  const addFilter = () => {
    const defaultField = fields[0];
    const defaultOperator = defaultField?.operators?.[0] || defaultOperators[defaultField.type][0];
    onFiltersChange([
      ...filters,
      { field: defaultField.id, operator: defaultOperator, value: '' },
    ]);
  };

  const updateFilter = (index: number, updates: Partial<FilterValue>) => {
    const newFilters = [...filters];
    newFilters[index] = { ...newFilters[index], ...updates };
    onFiltersChange(newFilters);
  };

  const removeFilter = (index: number) => {
    onFiltersChange(filters.filter((_, i) => i !== index));
  };

  const clearAllFilters = () => {
    onFiltersChange([]);
  };

  const activeFilterCount = filters.filter((f) => f.value !== '' && f.value != null).length;

  const renderFilterEditor = (filter: FilterValue, index: number) => {
    const field = fields.find((f) => f.id === filter.field);
    if (!field) return null;

    const operators = field.operators || defaultOperators[field.type];

    return (
      <motion.div
        key={index}
        initial={{ opacity: 0, height: 0 }}
        animate={{ opacity: 1, height: 'auto' }}
        exit={{ opacity: 0, height: 0 }}
        className="flex flex-wrap items-end gap-2 p-3 bg-muted/50 rounded-lg"
      >
        {/* Field selector */}
        <div className="min-w-[150px]">
          <Label className="text-xs text-muted-foreground">Campo</Label>
          <Select
            value={filter.field}
            onValueChange={(value) => updateFilter(index, { field: value, value: '' })}
          >
            <SelectTrigger className="h-9 mt-1">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {fields.map((f) => (
                <SelectItem key={f.id} value={f.id}>
                  {f.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Operator selector */}
        <div className="min-w-[140px]">
          <Label className="text-xs text-muted-foreground">Operador</Label>
          <Select
            value={filter.operator}
            onValueChange={(value) => updateFilter(index, { operator: value as FilterOperator })}
          >
            <SelectTrigger className="h-9 mt-1">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {operators.map((op) => (
                <SelectItem key={op} value={op}>
                  {operatorLabels[op]}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Value input */}
        {!['is_empty', 'is_not_empty'].includes(filter.operator) && (
          <div className="flex-1 min-w-[150px]">
            <Label className="text-xs text-muted-foreground">Valor</Label>
            <FilterValueInput
              field={field}
              value={filter.value}
              onChange={(value) => updateFilter(index, { value })}
            />
          </div>
        )}

        {/* Remove button */}
        <Button
          variant="ghost"
          size="icon"
          className="h-9 w-9 text-muted-foreground hover:text-destructive"
          onClick={() => removeFilter(index)}
        >
          <Trash2 className="h-4 w-4" />
        </Button>
      </motion.div>
    );
  };

  const filterContent = (
    <div className="space-y-3">
      <AnimatePresence mode="popLayout">
        {filters.map((filter, index) => renderFilterEditor(filter, index))}
      </AnimatePresence>

      <Button variant="outline" size="sm" className="w-full" onClick={addFilter}>
        <Plus className="h-4 w-4 mr-1" />
        Adicionar Filtro
      </Button>
    </div>
  );

  // Inline variant
  if (variant === 'inline') {
    return (
      <Card className={className}>
        <CardContent className="p-4">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <Filter className="h-4 w-4 text-muted-foreground" />
              <span className="font-medium text-sm">Filtros</span>
              {activeFilterCount > 0 && (
                <Badge variant="secondary">{activeFilterCount} ativos</Badge>
              )}
            </div>
            {filters.length > 0 && (
              <Button variant="ghost" size="sm" onClick={clearAllFilters}>
                Limpar
              </Button>
            )}
          </div>
          {filterContent}
        </CardContent>
      </Card>
    );
  }

  // Popover variant
  if (variant === 'popover') {
    return (
      <Popover open={isOpen} onOpenChange={setIsOpen}>
        <PopoverTrigger asChild>
          <Button variant="outline" size="sm" className={cn('gap-2', className)}>
            <Filter className="h-4 w-4" />
            Filtros
            {activeFilterCount > 0 && (
              <Badge variant="secondary" className="ml-1">
                {activeFilterCount}
              </Badge>
            )}
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-[500px] p-4" align="start">
          <div className="flex items-center justify-between mb-3">
            <span className="font-medium">Filtros</span>
            {filters.length > 0 && (
              <Button variant="ghost" size="sm" onClick={clearAllFilters}>
                Limpar tudo
              </Button>
            )}
          </div>
          {filterContent}
        </PopoverContent>
      </Popover>
    );
  }

  // Sheet variant
  return (
    <Sheet open={isOpen} onOpenChange={setIsOpen}>
      <SheetTrigger asChild>
        <Button variant="outline" size="sm" className={cn('gap-2', className)}>
          <Filter className="h-4 w-4" />
          Filtros
          {activeFilterCount > 0 && (
            <Badge variant="secondary" className="ml-1">
              {activeFilterCount}
            </Badge>
          )}
        </Button>
      </SheetTrigger>
      <SheetContent className="w-[400px] sm:w-[540px]">
        <SheetHeader>
          <SheetTitle>Filtros</SheetTitle>
        </SheetHeader>
        <div className="py-4">{filterContent}</div>
        <SheetFooter className="flex-row gap-2">
          <Button variant="outline" onClick={clearAllFilters}>
            Limpar
          </Button>
          <Button onClick={() => setIsOpen(false)}>Aplicar</Button>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
}

// =============================================================================
// FILTER VALUE INPUT
// =============================================================================

function FilterValueInput({
  field,
  value,
  onChange,
}: {
  field: FilterField;
  value: any;
  onChange: (value: any) => void;
}) {
  switch (field.type) {
    case 'number':
      return (
        <Input
          type="number"
          value={value || ''}
          onChange={(e) => onChange(e.target.value)}
          className="h-9 mt-1"
          placeholder="Valor"
        />
      );

    case 'date':
      return (
        <Popover>
          <PopoverTrigger asChild>
            <Button
              variant="outline"
              className={cn(
                'h-9 mt-1 w-full justify-start text-left font-normal',
                !value && 'text-muted-foreground'
              )}
            >
              <CalendarIcon className="mr-2 h-4 w-4" />
              {value ? format(new Date(value), 'dd/MM/yyyy') : 'Selecionar data'}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0">
            <Calendar
              mode="single"
              selected={value ? new Date(value) : undefined}
              onSelect={(date) => onChange(date?.toISOString())}
              locale={ptBR}
            />
          </PopoverContent>
        </Popover>
      );

    case 'select':
      return (
        <Select value={value || ''} onValueChange={onChange}>
          <SelectTrigger className="h-9 mt-1">
            <SelectValue placeholder="Selecionar" />
          </SelectTrigger>
          <SelectContent>
            {field.options?.map((option) => (
              <SelectItem key={option.value} value={option.value}>
                {option.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      );

    case 'multiselect':
      return (
        <MultiSelectInput
          options={field.options || []}
          value={value || []}
          onChange={onChange}
        />
      );

    case 'boolean':
      return (
        <Select value={value?.toString() || ''} onValueChange={(v) => onChange(v === 'true')}>
          <SelectTrigger className="h-9 mt-1">
            <SelectValue placeholder="Selecionar" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="true">Sim</SelectItem>
            <SelectItem value="false">Não</SelectItem>
          </SelectContent>
        </Select>
      );

    default:
      return (
        <Input
          type="text"
          value={value || ''}
          onChange={(e) => onChange(e.target.value)}
          className="h-9 mt-1"
          placeholder="Valor"
        />
      );
  }
}

// =============================================================================
// MULTI SELECT INPUT
// =============================================================================

function MultiSelectInput({
  options,
  value,
  onChange,
}: {
  options: Array<{ value: string; label: string }>;
  value: string[];
  onChange: (value: string[]) => void;
}) {
  const [isOpen, setIsOpen] = React.useState(false);

  const toggleOption = (optionValue: string) => {
    if (value.includes(optionValue)) {
      onChange(value.filter((v) => v !== optionValue));
    } else {
      onChange([...value, optionValue]);
    }
  };

  return (
    <Popover open={isOpen} onOpenChange={setIsOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          className="h-9 mt-1 w-full justify-start text-left font-normal"
        >
          {value.length > 0 ? (
            <span className="truncate">
              {value.length} selecionados
            </span>
          ) : (
            <span className="text-muted-foreground">Selecionar</span>
          )}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[200px] p-2">
        <div className="space-y-1">
          {options.map((option) => (
            <button
              key={option.value}
              className={cn(
                'w-full flex items-center gap-2 px-2 py-1.5 rounded text-sm text-left',
                'hover:bg-muted transition-colors',
                value.includes(option.value) && 'bg-primary/10'
              )}
              onClick={() => toggleOption(option.value)}
            >
              <Checkbox checked={value.includes(option.value)} />
              {option.label}
            </button>
          ))}
        </div>
      </PopoverContent>
    </Popover>
  );
}

// =============================================================================
// ACTIVE FILTERS DISPLAY
// =============================================================================

export function ActiveFilters({
  fields,
  filters,
  onRemove,
  onClearAll,
  className,
}: {
  fields: FilterField[];
  filters: FilterValue[];
  onRemove: (index: number) => void;
  onClearAll: () => void;
  className?: string;
}) {
  const activeFilters = filters.filter((f) => f.value !== '' && f.value != null);

  if (activeFilters.length === 0) return null;

  const getFilterLabel = (filter: FilterValue) => {
    const field = fields.find((f) => f.id === filter.field);
    if (!field) return '';

    let valueLabel = filter.value;
    if (field.type === 'select' || field.type === 'multiselect') {
      const option = field.options?.find((o) => o.value === filter.value);
      valueLabel = option?.label || filter.value;
    }
    if (field.type === 'date' && filter.value) {
      valueLabel = format(new Date(filter.value), 'dd/MM/yyyy');
    }
    if (field.type === 'boolean') {
      valueLabel = filter.value ? 'Sim' : 'Não';
    }

    return `${field.label} ${operatorLabels[filter.operator].toLowerCase()} "${valueLabel}"`;
  };

  return (
    <div className={cn('flex items-center gap-2 flex-wrap', className)}>
      <span className="text-sm text-muted-foreground">Filtros ativos:</span>
      {activeFilters.map((filter, index) => (
        <Badge
          key={index}
          variant="secondary"
          className="gap-1 pr-1"
        >
          {getFilterLabel(filter)}
          <button
            onClick={() => onRemove(filters.indexOf(filter))}
            className="ml-1 h-4 w-4 rounded-full hover:bg-muted-foreground/20 flex items-center justify-center"
          >
            <X className="h-3 w-3" />
          </button>
        </Badge>
      ))}
      <Button variant="ghost" size="sm" className="h-6 text-xs" onClick={onClearAll}>
        Limpar tudo
      </Button>
    </div>
  );
}

// =============================================================================
// QUICK FILTERS
// =============================================================================

export function QuickFilterBar({
  filters,
  activeFilters,
  onFilterToggle,
  className,
}: {
  filters: Array<{ id: string; label: string; value: FilterValue }>;
  activeFilters: string[];
  onFilterToggle: (filterId: string) => void;
  className?: string;
}) {
  return (
    <div className={cn('flex items-center gap-2 flex-wrap', className)}>
      {filters.map((filter) => {
        const isActive = activeFilters.includes(filter.id);
        return (
          <Button
            key={filter.id}
            variant={isActive ? 'default' : 'outline'}
            size="sm"
            onClick={() => onFilterToggle(filter.id)}
            className="h-8"
          >
            {isActive && <Check className="h-3 w-3 mr-1" />}
            {filter.label}
          </Button>
        );
      })}
    </div>
  );
}
