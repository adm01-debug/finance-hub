import * as React from 'react';
import { motion } from 'framer-motion';
import { Skeleton } from '@/components/ui/skeleton';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { cn } from '@/lib/utils';

// =============================================================================
// BASE SKELETON COMPONENTS
// =============================================================================

/** Shimmer effect para skeleton */
export function SkeletonShimmer({ className }: { className?: string }) {
  return (
    <div
      className={cn(
        'absolute inset-0 -translate-x-full animate-[shimmer_2s_infinite]',
        'bg-gradient-to-r from-transparent via-white/10 to-transparent',
        className
      )}
    />
  );
}

/** Skeleton com efeito shimmer */
export function ShimmerSkeleton({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div className={cn('relative overflow-hidden', className)} {...props}>
      <Skeleton className="h-full w-full" />
      <SkeletonShimmer />
    </div>
  );
}

// =============================================================================
// KPI CARD SKELETON
// =============================================================================

export function KPICardSkeleton({ size = 'md' }: { size?: 'sm' | 'md' | 'lg' }) {
  const sizes = {
    sm: { card: 'p-3', icon: 'h-8 w-8', title: 'w-16 h-3', value: 'w-20 h-5' },
    md: { card: 'p-4', icon: 'h-10 w-10', title: 'w-20 h-3', value: 'w-24 h-7' },
    lg: { card: 'p-5', icon: 'h-12 w-12', title: 'w-24 h-4', value: 'w-28 h-8' },
  };

  const s = sizes[size];

  return (
    <Card className={cn('relative overflow-hidden', s.card)}>
      <CardContent className="p-0">
        <div className="flex items-start gap-3">
          <ShimmerSkeleton className={cn('rounded-lg', s.icon)} />
          <div className="flex-1 space-y-2">
            <Skeleton className={s.title} />
            <Skeleton className={s.value} />
          </div>
        </div>
        <div className="flex items-center gap-2 mt-3">
          <Skeleton className="h-3 w-12" />
          <Skeleton className="h-3 w-24" />
        </div>
      </CardContent>
    </Card>
  );
}

/** Grid de KPI Cards skeleton */
export function KPIGridSkeleton({
  count = 4,
  columns = 4,
}: {
  count?: number;
  columns?: number;
}) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className={cn(
        'grid gap-4',
        columns === 2 && 'grid-cols-2',
        columns === 3 && 'grid-cols-3',
        columns === 4 && 'grid-cols-2 md:grid-cols-4',
        columns === 5 && 'grid-cols-2 md:grid-cols-5'
      )}
    >
      {Array.from({ length: count }).map((_, i) => (
        <motion.div
          key={i}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: i * 0.05 }}
        >
          <KPICardSkeleton />
        </motion.div>
      ))}
    </motion.div>
  );
}

// =============================================================================
// TABLE SKELETON
// =============================================================================

export function TableRowSkeleton({ columns = 5 }: { columns?: number }) {
  return (
    <div className="flex items-center gap-4 p-4 border-b border-border">
      <Skeleton className="h-4 w-4" /> {/* Checkbox */}
      {Array.from({ length: columns }).map((_, i) => (
        <Skeleton
          key={i}
          className={cn(
            'h-4',
            i === 0 && 'w-32',
            i === 1 && 'w-48',
            i === 2 && 'w-24',
            i === 3 && 'w-20',
            i >= 4 && 'w-16'
          )}
        />
      ))}
    </div>
  );
}

export function TableSkeleton({
  rows = 5,
  columns = 5,
  showHeader = true,
}: {
  rows?: number;
  columns?: number;
  showHeader?: boolean;
}) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="rounded-lg border border-border overflow-hidden"
    >
      {/* Header */}
      {showHeader && (
        <div className="flex items-center gap-4 p-4 bg-muted/50 border-b border-border">
          <Skeleton className="h-4 w-4" />
          {Array.from({ length: columns }).map((_, i) => (
            <Skeleton key={i} className="h-4 w-20" />
          ))}
        </div>
      )}

      {/* Rows */}
      {Array.from({ length: rows }).map((_, i) => (
        <motion.div
          key={i}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: i * 0.03 }}
        >
          <TableRowSkeleton columns={columns} />
        </motion.div>
      ))}
    </motion.div>
  );
}

// =============================================================================
// CHART SKELETON
// =============================================================================

export function ChartSkeleton({
  type = 'bar',
  height = 300,
}: {
  type?: 'bar' | 'line' | 'pie' | 'area';
  height?: number;
}) {
  return (
    <Card>
      <CardHeader className="pb-2">
        <Skeleton className="h-5 w-32" />
        <Skeleton className="h-3 w-48 mt-1" />
      </CardHeader>
      <CardContent>
        <div
          className="relative flex items-end justify-center gap-2 pt-4"
          style={{ height }}
        >
          {type === 'bar' && (
            <>
              {Array.from({ length: 7 }).map((_, i) => (
                <motion.div
                  key={i}
                  initial={{ height: 0 }}
                  animate={{ height: `${30 + Math.random() * 60}%` }}
                  transition={{ delay: i * 0.05, duration: 0.3 }}
                  className="w-8 bg-muted rounded-t"
                />
              ))}
            </>
          )}

          {type === 'line' && (
            <div className="absolute inset-4 flex items-center justify-center">
              <svg className="w-full h-full" viewBox="0 0 100 50">
                <motion.path
                  d="M 0,40 Q 20,20 40,30 T 80,20 T 100,35"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  className="text-muted"
                  initial={{ pathLength: 0 }}
                  animate={{ pathLength: 1 }}
                  transition={{ duration: 1 }}
                />
              </svg>
            </div>
          )}

          {type === 'pie' && (
            <div className="flex items-center justify-center">
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: 'spring' }}
                className="w-40 h-40 rounded-full bg-muted"
              />
            </div>
          )}

          {type === 'area' && (
            <div className="absolute inset-4 flex items-end">
              {Array.from({ length: 12 }).map((_, i) => (
                <motion.div
                  key={i}
                  initial={{ height: 0 }}
                  animate={{ height: `${20 + Math.random() * 70}%` }}
                  transition={{ delay: i * 0.03 }}
                  className="flex-1 bg-muted/50 first:rounded-bl last:rounded-br"
                  style={{ marginTop: 'auto' }}
                />
              ))}
            </div>
          )}
        </div>

        {/* Legend */}
        <div className="flex items-center justify-center gap-4 mt-4">
          <div className="flex items-center gap-2">
            <Skeleton className="h-3 w-3 rounded" />
            <Skeleton className="h-3 w-16" />
          </div>
          <div className="flex items-center gap-2">
            <Skeleton className="h-3 w-3 rounded" />
            <Skeleton className="h-3 w-16" />
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

// =============================================================================
// FORM SKELETON
// =============================================================================

export function FormFieldSkeleton() {
  return (
    <div className="space-y-2">
      <Skeleton className="h-4 w-24" />
      <Skeleton className="h-10 w-full" />
    </div>
  );
}

export function FormSkeleton({ fields = 4 }: { fields?: number }) {
  return (
    <div className="space-y-4">
      {Array.from({ length: fields }).map((_, i) => (
        <motion.div
          key={i}
          initial={{ opacity: 0, x: -10 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: i * 0.05 }}
        >
          <FormFieldSkeleton />
        </motion.div>
      ))}
      <div className="flex gap-2 pt-4">
        <Skeleton className="h-10 w-24" />
        <Skeleton className="h-10 w-20" />
      </div>
    </div>
  );
}

// =============================================================================
// PAGE SKELETONS
// =============================================================================

/** Skeleton para página de listagem */
export function ListPageSkeleton({
  kpiCount = 4,
  tableRows = 8,
}: {
  kpiCount?: number;
  tableRows?: number;
}) {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="space-y-2">
          <Skeleton className="h-8 w-48" />
          <Skeleton className="h-4 w-64" />
        </div>
        <div className="flex gap-2">
          <Skeleton className="h-10 w-24" />
          <Skeleton className="h-10 w-32" />
        </div>
      </div>

      {/* KPIs */}
      <KPIGridSkeleton count={kpiCount} />

      {/* Filters */}
      <div className="flex items-center gap-4">
        <Skeleton className="h-10 flex-1 max-w-sm" />
        <Skeleton className="h-10 w-32" />
        <Skeleton className="h-10 w-32" />
      </div>

      {/* Table */}
      <TableSkeleton rows={tableRows} />

      {/* Pagination */}
      <div className="flex items-center justify-between">
        <Skeleton className="h-4 w-32" />
        <div className="flex gap-1">
          {Array.from({ length: 5 }).map((_, i) => (
            <Skeleton key={i} className="h-8 w-8" />
          ))}
        </div>
      </div>
    </div>
  );
}

/** Skeleton para página de dashboard */
export function DashboardPageSkeleton() {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <Skeleton className="h-8 w-48" />
        <div className="flex gap-2">
          <Skeleton className="h-10 w-32" />
          <Skeleton className="h-10 w-24" />
        </div>
      </div>

      {/* KPIs */}
      <KPIGridSkeleton count={5} columns={5} />

      {/* Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <ChartSkeleton type="bar" />
        <ChartSkeleton type="line" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <ChartSkeleton type="pie" height={250} />
        <div className="lg:col-span-2">
          <ChartSkeleton type="area" />
        </div>
      </div>
    </div>
  );
}

/** Skeleton para página de detalhe */
export function DetailPageSkeleton() {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Skeleton className="h-12 w-12 rounded-full" />
          <div className="space-y-2">
            <Skeleton className="h-6 w-48" />
            <Skeleton className="h-4 w-32" />
          </div>
        </div>
        <div className="flex gap-2">
          <Skeleton className="h-10 w-24" />
          <Skeleton className="h-10 w-24" />
        </div>
      </div>

      {/* Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <Card>
            <CardHeader>
              <Skeleton className="h-5 w-32" />
            </CardHeader>
            <CardContent>
              <FormSkeleton fields={6} />
            </CardContent>
          </Card>
        </div>

        <div className="space-y-6">
          <Card>
            <CardHeader>
              <Skeleton className="h-5 w-24" />
            </CardHeader>
            <CardContent className="space-y-4">
              {Array.from({ length: 4 }).map((_, i) => (
                <div key={i} className="flex justify-between">
                  <Skeleton className="h-4 w-20" />
                  <Skeleton className="h-4 w-16" />
                </div>
              ))}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <Skeleton className="h-5 w-28" />
            </CardHeader>
            <CardContent className="space-y-3">
              {Array.from({ length: 3 }).map((_, i) => (
                <div key={i} className="flex items-center gap-3">
                  <Skeleton className="h-8 w-8 rounded-full" />
                  <div className="flex-1 space-y-1">
                    <Skeleton className="h-3 w-full" />
                    <Skeleton className="h-3 w-2/3" />
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}

// =============================================================================
// INLINE SKELETONS
// =============================================================================

/** Skeleton inline para texto */
export function TextSkeleton({
  width = 'w-24',
  className,
}: {
  width?: string;
  className?: string;
}) {
  return <Skeleton className={cn('h-4', width, className)} />;
}

/** Skeleton inline para avatar */
export function AvatarSkeleton({ size = 'md' }: { size?: 'sm' | 'md' | 'lg' }) {
  const sizes = {
    sm: 'h-6 w-6',
    md: 'h-8 w-8',
    lg: 'h-10 w-10',
  };

  return <Skeleton className={cn('rounded-full', sizes[size])} />;
}

/** Skeleton inline para badge */
export function BadgeSkeleton() {
  return <Skeleton className="h-5 w-16 rounded-full" />;
}
