import * as React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, X, Loader2, Command } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

// =============================================================================
// TYPES
// =============================================================================

export interface SearchInputProps
  extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'onChange'> {
  /** Valor atual */
  value?: string;
  /** Callback com valor (pode ser debounced) */
  onChange?: (value: string) => void;
  /** Callback imediato (sem debounce) */
  onChangeImmediate?: (value: string) => void;
  /** Tempo de debounce em ms */
  debounce?: number;
  /** Mostrar indicador de loading */
  loading?: boolean;
  /** Mostrar atalho Ctrl+K */
  showShortcut?: boolean;
  /** Callback ao pressionar Enter */
  onSearch?: (value: string) => void;
  /** Callback ao limpar */
  onClear?: () => void;
  /** Tamanho do input */
  inputSize?: 'sm' | 'md' | 'lg';
  /** Classes adicionais */
  className?: string;
}

// =============================================================================
// HOOK - useDebounce
// =============================================================================

function useDebounce<T>(value: T, delay: number): T {
  const [debouncedValue, setDebouncedValue] = React.useState<T>(value);

  React.useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => {
      clearTimeout(handler);
    };
  }, [value, delay]);

  return debouncedValue;
}

// =============================================================================
// COMPONENT
// =============================================================================

export const SearchInput = React.forwardRef<HTMLInputElement, SearchInputProps>(
  (
    {
      value: controlledValue,
      onChange,
      onChangeImmediate,
      debounce = 300,
      loading = false,
      showShortcut = false,
      onSearch,
      onClear,
      inputSize = 'md',
      className,
      placeholder = 'Buscar...',
      ...props
    },
    ref
  ) => {
    const [internalValue, setInternalValue] = React.useState(controlledValue || '');
    const inputRef = React.useRef<HTMLInputElement>(null);

    // Sync with controlled value
    React.useEffect(() => {
      if (controlledValue !== undefined) {
        setInternalValue(controlledValue);
      }
    }, [controlledValue]);

    // Debounced value
    const debouncedValue = useDebounce(internalValue, debounce);

    // Call onChange when debounced value changes
    React.useEffect(() => {
      if (debouncedValue !== controlledValue) {
        onChange?.(debouncedValue);
      }
    }, [debouncedValue, onChange, controlledValue]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      const newValue = e.target.value;
      setInternalValue(newValue);
      onChangeImmediate?.(newValue);
    };

    const handleClear = () => {
      setInternalValue('');
      onChange?.('');
      onClear?.();
      inputRef.current?.focus();
    };

    const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
      if (e.key === 'Enter') {
        onSearch?.(internalValue);
      }
      if (e.key === 'Escape') {
        handleClear();
      }
    };

    // Size classes
    const sizeClasses = {
      sm: {
        input: 'h-8 text-sm pl-8 pr-8',
        icon: 'h-3.5 w-3.5 left-2.5',
        clear: 'h-6 w-6 right-1',
        clearIcon: 'h-3 w-3',
      },
      md: {
        input: 'h-10 pl-10 pr-10',
        icon: 'h-4 w-4 left-3',
        clear: 'h-7 w-7 right-1.5',
        clearIcon: 'h-3.5 w-3.5',
      },
      lg: {
        input: 'h-12 text-lg pl-12 pr-12',
        icon: 'h-5 w-5 left-4',
        clear: 'h-8 w-8 right-2',
        clearIcon: 'h-4 w-4',
      },
    };

    const sizes = sizeClasses[inputSize];

    return (
      <div className={cn('relative', className)}>
        {/* Search Icon or Loading */}
        <div
          className={cn(
            'absolute top-1/2 -translate-y-1/2 text-muted-foreground',
            sizes.icon
          )}
        >
          <AnimatePresence mode="wait">
            {loading ? (
              <motion.div
                key="loading"
                initial={{ opacity: 0, rotate: -180 }}
                animate={{ opacity: 1, rotate: 0 }}
                exit={{ opacity: 0, rotate: 180 }}
              >
                <Loader2 className={cn(sizes.icon, 'animate-spin')} />
              </motion.div>
            ) : (
              <motion.div
                key="search"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
              >
                <Search className={sizes.icon} />
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Input */}
        <Input
          ref={ref || inputRef}
          type="text"
          value={internalValue}
          onChange={handleChange}
          onKeyDown={handleKeyDown}
          placeholder={placeholder}
          className={cn(sizes.input, 'pr-20')}
          {...props}
        />

        {/* Right side: Clear button + Shortcut */}
        <div className="absolute right-2 top-1/2 -translate-y-1/2 flex items-center gap-1">
          {/* Clear button */}
          <AnimatePresence>
            {internalValue && (
              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.8 }}
              >
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  className={cn(sizes.clear, 'text-muted-foreground hover:text-foreground')}
                  onClick={handleClear}
                  aria-label="Limpar busca"
                >
                  <X className={sizes.clearIcon} />
                </Button>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Keyboard shortcut hint */}
          {showShortcut && !internalValue && (
            <kbd className="pointer-events-none hidden sm:inline-flex h-5 select-none items-center gap-1 rounded border bg-muted px-1.5 font-mono text-[10px] font-medium text-muted-foreground">
              <Command className="h-3 w-3" />K
            </kbd>
          )}
        </div>
      </div>
    );
  }
);

SearchInput.displayName = 'SearchInput';

// =============================================================================
// SEARCH INPUT WITH SUGGESTIONS
// =============================================================================

export interface SearchSuggestion {
  id: string;
  label: string;
  description?: string;
  icon?: React.ElementType;
}

export interface SearchInputWithSuggestionsProps extends SearchInputProps {
  suggestions?: SearchSuggestion[];
  onSuggestionSelect?: (suggestion: SearchSuggestion) => void;
  showSuggestionsOnFocus?: boolean;
}

export function SearchInputWithSuggestions({
  suggestions = [],
  onSuggestionSelect,
  showSuggestionsOnFocus = true,
  value,
  onChange,
  ...props
}: SearchInputWithSuggestionsProps) {
  const [isOpen, setIsOpen] = React.useState(false);
  const [selectedIndex, setSelectedIndex] = React.useState(-1);
  const containerRef = React.useRef<HTMLDivElement>(null);

  const filteredSuggestions = React.useMemo(() => {
    if (!value) return suggestions;
    const search = value.toLowerCase();
    return suggestions.filter(
      (s) =>
        s.label.toLowerCase().includes(search) ||
        s.description?.toLowerCase().includes(search)
    );
  }, [suggestions, value]);

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (!isOpen || filteredSuggestions.length === 0) return;

    switch (e.key) {
      case 'ArrowDown':
        e.preventDefault();
        setSelectedIndex((prev) =>
          prev < filteredSuggestions.length - 1 ? prev + 1 : 0
        );
        break;
      case 'ArrowUp':
        e.preventDefault();
        setSelectedIndex((prev) =>
          prev > 0 ? prev - 1 : filteredSuggestions.length - 1
        );
        break;
      case 'Enter':
        if (selectedIndex >= 0) {
          e.preventDefault();
          onSuggestionSelect?.(filteredSuggestions[selectedIndex]);
          setIsOpen(false);
        }
        break;
      case 'Escape':
        setIsOpen(false);
        break;
    }
  };

  // Close on click outside
  React.useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div ref={containerRef} className="relative">
      <SearchInput
        value={value}
        onChange={onChange}
        onFocus={() => showSuggestionsOnFocus && setIsOpen(true)}
        onKeyDown={handleKeyDown}
        {...props}
      />

      <AnimatePresence>
        {isOpen && filteredSuggestions.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="absolute top-full left-0 right-0 mt-1 bg-popover border border-border rounded-lg shadow-lg overflow-hidden z-50"
          >
            <ul className="py-1">
              {filteredSuggestions.map((suggestion, index) => {
                const Icon = suggestion.icon;
                return (
                  <li
                    key={suggestion.id}
                    className={cn(
                      'px-3 py-2 cursor-pointer flex items-center gap-3',
                      index === selectedIndex
                        ? 'bg-primary/10 text-primary'
                        : 'hover:bg-muted'
                    )}
                    onClick={() => {
                      onSuggestionSelect?.(suggestion);
                      setIsOpen(false);
                    }}
                    onMouseEnter={() => setSelectedIndex(index)}
                  >
                    {Icon && <Icon className="h-4 w-4 shrink-0" />}
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium truncate">{suggestion.label}</p>
                      {suggestion.description && (
                        <p className="text-xs text-muted-foreground truncate">
                          {suggestion.description}
                        </p>
                      )}
                    </div>
                  </li>
                );
              })}
            </ul>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
