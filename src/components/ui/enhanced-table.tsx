import * as React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ChevronDown,
  ChevronUp,
  ChevronsUpDown,
  MoreHorizontal,
  ArrowUpDown,
  Eye,
  Pencil,
  Trash2,
  Copy,
  Check,
  Download,
  Filter,
  X,
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
} from 'lucide-react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { cn } from '@/lib/utils';

// =============================================================================
// TYPES
// =============================================================================

export type SortDirection = 'asc' | 'desc' | null;

export interface ColumnDef<T> {
  id: string;
  header: string | React.ReactNode;
  accessorKey?: keyof T;
  accessorFn?: (row: T) => any;
  cell?: (row: T, value: any) => React.ReactNode;
  sortable?: boolean;
  filterable?: boolean;
  align?: 'left' | 'center' | 'right';
  width?: string | number;
  minWidth?: string | number;
  sticky?: boolean;
  hidden?: boolean;
}

export interface TableAction<T> {
  label: string;
  icon?: React.ElementType;
  onClick: (row: T) => void;
  variant?: 'default' | 'destructive';
  disabled?: (row: T) => boolean;
  hidden?: (row: T) => boolean;
}

export interface EnhancedTableProps<T> {
  /** Dados da tabela */
  data: T[];
  /** Definição das colunas */
  columns: ColumnDef<T>[];
  /** Key única de cada row */
  getRowId: (row: T) => string;
  /** Ações por row */
  actions?: TableAction<T>[];
  /** Permitir seleção */
  selectable?: boolean;
  /** Rows selecionadas */
  selectedRows?: string[];
  /** Callback ao selecionar */
  onSelectionChange?: (selectedIds: string[]) => void;
  /** Sorting atual */
  sorting?: { id: string; direction: SortDirection };
  /** Callback ao ordenar */
  onSortingChange?: (sorting: { id: string; direction: SortDirection } | null) => void;
  /** Loading state */
  loading?: boolean;
  /** Callback ao clicar na row */
  onRowClick?: (row: T) => void;
  /** Row destacada */
  highlightedRowId?: string;
  /** Mostrar bordas */
  bordered?: boolean;
  /** Tamanho compacto */
  compact?: boolean;
  /** Rows por página */
  pageSize?: number;
  /** Classes adicionais */
  className?: string;
}

// =============================================================================
// COMPONENT
// =============================================================================

export function EnhancedTable<T>({
  data,
  columns,
  getRowId,
  actions,
  selectable = false,
  selectedRows = [],
  onSelectionChange,
  sorting,
  onSortingChange,
  loading = false,
  onRowClick,
  highlightedRowId,
  bordered = false,
  compact = false,
  className,
}: EnhancedTableProps<T>) {
  const visibleColumns = columns.filter((col) => !col.hidden);
  const allSelected = data.length > 0 && selectedRows.length === data.length;
  const someSelected = selectedRows.length > 0 && selectedRows.length < data.length;

  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      onSelectionChange?.(data.map(getRowId));
    } else {
      onSelectionChange?.([]);
    }
  };

  const handleSelectRow = (rowId: string, checked: boolean) => {
    if (checked) {
      onSelectionChange?.([...selectedRows, rowId]);
    } else {
      onSelectionChange?.(selectedRows.filter((id) => id !== rowId));
    }
  };

  const handleSort = (columnId: string) => {
    if (!onSortingChange) return;

    if (sorting?.id === columnId) {
      if (sorting.direction === 'asc') {
        onSortingChange({ id: columnId, direction: 'desc' });
      } else if (sorting.direction === 'desc') {
        onSortingChange(null);
      } else {
        onSortingChange({ id: columnId, direction: 'asc' });
      }
    } else {
      onSortingChange({ id: columnId, direction: 'asc' });
    }
  };

  const getCellValue = (row: T, column: ColumnDef<T>) => {
    if (column.accessorFn) {
      return column.accessorFn(row);
    }
    if (column.accessorKey) {
      return row[column.accessorKey];
    }
    return null;
  };

  const renderCell = (row: T, column: ColumnDef<T>) => {
    const value = getCellValue(row, column);
    if (column.cell) {
      return column.cell(row, value);
    }
    return value;
  };

  const getSortIcon = (columnId: string) => {
    if (sorting?.id !== columnId) {
      return <ChevronsUpDown className="h-4 w-4 opacity-50" />;
    }
    if (sorting.direction === 'asc') {
      return <ChevronUp className="h-4 w-4" />;
    }
    return <ChevronDown className="h-4 w-4" />;
  };

  return (
    <div className={cn('rounded-lg border overflow-hidden', className)}>
      <Table>
        <TableHeader>
          <TableRow className={cn(bordered && 'border-b-2')}>
            {/* Selection Checkbox */}
            {selectable && (
              <TableHead className="w-12">
                <Checkbox
                  checked={allSelected}
                  indeterminate={someSelected}
                  onCheckedChange={handleSelectAll}
                  aria-label="Selecionar todos"
                />
              </TableHead>
            )}

            {/* Columns */}
            {visibleColumns.map((column) => (
              <TableHead
                key={column.id}
                className={cn(
                  column.align === 'center' && 'text-center',
                  column.align === 'right' && 'text-right',
                  column.sticky && 'sticky left-0 bg-background z-10',
                  compact ? 'py-2' : 'py-3'
                )}
                style={{
                  width: column.width,
                  minWidth: column.minWidth,
                }}
              >
                {column.sortable ? (
                  <Button
                    variant="ghost"
                    size="sm"
                    className="-ml-3 h-8 data-[state=open]:bg-accent"
                    onClick={() => handleSort(column.id)}
                  >
                    {column.header}
                    {getSortIcon(column.id)}
                  </Button>
                ) : (
                  column.header
                )}
              </TableHead>
            ))}

            {/* Actions Column */}
            {actions && actions.length > 0 && (
              <TableHead className="w-12 text-right">
                <span className="sr-only">Ações</span>
              </TableHead>
            )}
          </TableRow>
        </TableHeader>

        <TableBody>
          {loading ? (
            // Loading skeleton
            Array.from({ length: 5 }).map((_, index) => (
              <TableRow key={`skeleton-${index}`}>
                {selectable && (
                  <TableCell>
                    <Skeleton className="h-4 w-4" />
                  </TableCell>
                )}
                {visibleColumns.map((column) => (
                  <TableCell key={column.id}>
                    <Skeleton className="h-4 w-full" />
                  </TableCell>
                ))}
                {actions && (
                  <TableCell>
                    <Skeleton className="h-8 w-8 ml-auto" />
                  </TableCell>
                )}
              </TableRow>
            ))
          ) : data.length === 0 ? (
            // Empty state
            <TableRow>
              <TableCell
                colSpan={visibleColumns.length + (selectable ? 1 : 0) + (actions ? 1 : 0)}
                className="h-24 text-center"
              >
                <span className="text-muted-foreground">Nenhum registro encontrado</span>
              </TableCell>
            </TableRow>
          ) : (
            // Data rows
            <AnimatePresence mode="popLayout">
              {data.map((row, index) => {
                const rowId = getRowId(row);
                const isSelected = selectedRows.includes(rowId);
                const isHighlighted = highlightedRowId === rowId;

                return (
                  <motion.tr
                    key={rowId}
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    transition={{ delay: index * 0.02 }}
                    className={cn(
                      'border-b transition-colors',
                      bordered && 'border-b',
                      isSelected && 'bg-primary/5',
                      isHighlighted && 'bg-warning/10',
                      onRowClick && 'cursor-pointer hover:bg-muted/50'
                    )}
                    onClick={() => onRowClick?.(row)}
                  >
                    {/* Selection */}
                    {selectable && (
                      <TableCell className={compact ? 'py-2' : 'py-3'}>
                        <Checkbox
                          checked={isSelected}
                          onCheckedChange={(checked) =>
                            handleSelectRow(rowId, checked as boolean)
                          }
                          onClick={(e) => e.stopPropagation()}
                          aria-label="Selecionar linha"
                        />
                      </TableCell>
                    )}

                    {/* Data cells */}
                    {visibleColumns.map((column) => (
                      <TableCell
                        key={column.id}
                        className={cn(
                          column.align === 'center' && 'text-center',
                          column.align === 'right' && 'text-right',
                          column.sticky && 'sticky left-0 bg-background z-10',
                          compact ? 'py-2' : 'py-3'
                        )}
                      >
                        {renderCell(row, column)}
                      </TableCell>
                    ))}

                    {/* Actions */}
                    {actions && actions.length > 0 && (
                      <TableCell className={cn('text-right', compact ? 'py-2' : 'py-3')}>
                        <RowActions row={row} actions={actions} />
                      </TableCell>
                    )}
                  </motion.tr>
                );
              })}
            </AnimatePresence>
          )}
        </TableBody>
      </Table>
    </div>
  );
}

// =============================================================================
// ROW ACTIONS
// =============================================================================

function RowActions<T>({
  row,
  actions,
}: {
  row: T;
  actions: TableAction<T>[];
}) {
  const visibleActions = actions.filter((action) => !action.hidden?.(row));

  if (visibleActions.length === 0) return null;

  // If only 1-2 actions, show inline
  if (visibleActions.length <= 2) {
    return (
      <div className="flex items-center justify-end gap-1">
        {visibleActions.map((action, index) => {
          const Icon = action.icon;
          return (
            <Button
              key={index}
              variant="ghost"
              size="icon"
              className="h-8 w-8"
              disabled={action.disabled?.(row)}
              onClick={(e) => {
                e.stopPropagation();
                action.onClick(row);
              }}
            >
              {Icon && <Icon className="h-4 w-4" />}
              <span className="sr-only">{action.label}</span>
            </Button>
          );
        })}
      </div>
    );
  }

  // Otherwise show dropdown
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          size="icon"
          className="h-8 w-8"
          onClick={(e) => e.stopPropagation()}
        >
          <MoreHorizontal className="h-4 w-4" />
          <span className="sr-only">Abrir menu</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        {visibleActions.map((action, index) => {
          const Icon = action.icon;
          return (
            <DropdownMenuItem
              key={index}
              disabled={action.disabled?.(row)}
              className={cn(
                action.variant === 'destructive' && 'text-destructive focus:text-destructive'
              )}
              onClick={() => action.onClick(row)}
            >
              {Icon && <Icon className="h-4 w-4 mr-2" />}
              {action.label}
            </DropdownMenuItem>
          );
        })}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

// =============================================================================
// PAGINATION
// =============================================================================

export interface TablePaginationProps {
  currentPage: number;
  totalPages: number;
  pageSize: number;
  totalItems: number;
  onPageChange: (page: number) => void;
  onPageSizeChange?: (size: number) => void;
  pageSizeOptions?: number[];
  className?: string;
}

export function TablePagination({
  currentPage,
  totalPages,
  pageSize,
  totalItems,
  onPageChange,
  onPageSizeChange,
  pageSizeOptions = [10, 20, 50, 100],
  className,
}: TablePaginationProps) {
  const startItem = (currentPage - 1) * pageSize + 1;
  const endItem = Math.min(currentPage * pageSize, totalItems);

  return (
    <div
      className={cn(
        'flex items-center justify-between px-4 py-3 border-t',
        className
      )}
    >
      {/* Items info */}
      <div className="text-sm text-muted-foreground">
        Mostrando <span className="font-medium">{startItem}</span> a{' '}
        <span className="font-medium">{endItem}</span> de{' '}
        <span className="font-medium">{totalItems}</span> registros
      </div>

      <div className="flex items-center gap-4">
        {/* Page size selector */}
        {onPageSizeChange && (
          <div className="flex items-center gap-2">
            <span className="text-sm text-muted-foreground">Por página:</span>
            <Select
              value={String(pageSize)}
              onValueChange={(value) => onPageSizeChange(Number(value))}
            >
              <SelectTrigger className="h-8 w-[70px]">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {pageSizeOptions.map((size) => (
                  <SelectItem key={size} value={String(size)}>
                    {size}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        )}

        {/* Navigation */}
        <div className="flex items-center gap-1">
          <Button
            variant="outline"
            size="icon"
            className="h-8 w-8"
            disabled={currentPage === 1}
            onClick={() => onPageChange(1)}
          >
            <ChevronsLeft className="h-4 w-4" />
            <span className="sr-only">Primeira página</span>
          </Button>
          <Button
            variant="outline"
            size="icon"
            className="h-8 w-8"
            disabled={currentPage === 1}
            onClick={() => onPageChange(currentPage - 1)}
          >
            <ChevronLeft className="h-4 w-4" />
            <span className="sr-only">Página anterior</span>
          </Button>

          <span className="text-sm px-2">
            Página {currentPage} de {totalPages}
          </span>

          <Button
            variant="outline"
            size="icon"
            className="h-8 w-8"
            disabled={currentPage === totalPages}
            onClick={() => onPageChange(currentPage + 1)}
          >
            <ChevronRight className="h-4 w-4" />
            <span className="sr-only">Próxima página</span>
          </Button>
          <Button
            variant="outline"
            size="icon"
            className="h-8 w-8"
            disabled={currentPage === totalPages}
            onClick={() => onPageChange(totalPages)}
          >
            <ChevronsRight className="h-4 w-4" />
            <span className="sr-only">Última página</span>
          </Button>
        </div>
      </div>
    </div>
  );
}

// =============================================================================
// BULK ACTIONS BAR
// =============================================================================

export interface BulkAction {
  label: string;
  icon?: React.ElementType;
  onClick: (selectedIds: string[]) => void;
  variant?: 'default' | 'destructive';
}

export function BulkActionsBar({
  selectedCount,
  actions,
  onClearSelection,
  className,
}: {
  selectedCount: number;
  actions: BulkAction[];
  onClearSelection: () => void;
  className?: string;
}) {
  if (selectedCount === 0) return null;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 20 }}
      className={cn(
        'fixed bottom-6 left-1/2 -translate-x-1/2 z-50',
        'bg-card border shadow-lg rounded-lg px-4 py-3',
        'flex items-center gap-4',
        className
      )}
    >
      <div className="flex items-center gap-2">
        <Badge variant="secondary">{selectedCount}</Badge>
        <span className="text-sm text-muted-foreground">
          {selectedCount === 1 ? 'item selecionado' : 'itens selecionados'}
        </span>
      </div>

      <div className="h-6 w-px bg-border" />

      <div className="flex items-center gap-2">
        {actions.map((action, index) => {
          const Icon = action.icon;
          return (
            <Button
              key={index}
              variant={action.variant === 'destructive' ? 'destructive' : 'outline'}
              size="sm"
              onClick={() => action.onClick([])} // TODO: pass selected IDs
            >
              {Icon && <Icon className="h-4 w-4 mr-1" />}
              {action.label}
            </Button>
          );
        })}
      </div>

      <Button variant="ghost" size="icon" className="h-8 w-8" onClick={onClearSelection}>
        <X className="h-4 w-4" />
        <span className="sr-only">Limpar seleção</span>
      </Button>
    </motion.div>
  );
}

// =============================================================================
// COMMON COLUMN RENDERERS
// =============================================================================

export const ColumnRenderers = {
  /** Render money value */
  money: (value: number, currency = 'BRL') => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency,
    }).format(value);
  },

  /** Render date */
  date: (value: string | Date) => {
    return new Intl.DateTimeFormat('pt-BR').format(new Date(value));
  },

  /** Render datetime */
  datetime: (value: string | Date) => {
    return new Intl.DateTimeFormat('pt-BR', {
      dateStyle: 'short',
      timeStyle: 'short',
    }).format(new Date(value));
  },

  /** Render boolean */
  boolean: (value: boolean) => {
    return value ? (
      <Check className="h-4 w-4 text-success" />
    ) : (
      <X className="h-4 w-4 text-muted-foreground" />
    );
  },

  /** Render truncated text */
  truncate: (value: string, maxLength = 50) => {
    if (value.length <= maxLength) return value;
    return (
      <span title={value}>
        {value.slice(0, maxLength)}...
      </span>
    );
  },
};

// =============================================================================
// QUICK FILTERS
// =============================================================================

export interface QuickFilter {
  id: string;
  label: string;
  count?: number;
}

export function QuickFilters({
  filters,
  activeFilter,
  onFilterChange,
  className,
}: {
  filters: QuickFilter[];
  activeFilter: string;
  onFilterChange: (filterId: string) => void;
  className?: string;
}) {
  return (
    <div className={cn('flex items-center gap-2 flex-wrap', className)}>
      {filters.map((filter) => (
        <Button
          key={filter.id}
          variant={activeFilter === filter.id ? 'default' : 'outline'}
          size="sm"
          onClick={() => onFilterChange(filter.id)}
          className="h-8"
        >
          {filter.label}
          {filter.count !== undefined && (
            <Badge
              variant={activeFilter === filter.id ? 'secondary' : 'outline'}
              className="ml-1.5 px-1.5 py-0 text-[10px]"
            >
              {filter.count}
            </Badge>
          )}
        </Button>
      ))}
    </div>
  );
}
