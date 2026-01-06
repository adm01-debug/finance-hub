import * as React from 'react';
import { cn } from '@/lib/utils';

// =============================================================================
// TYPES
// =============================================================================

type Breakpoint = 'sm' | 'md' | 'lg' | 'xl' | '2xl';
type ResponsiveValue<T> = T | { [K in Breakpoint]?: T };

// =============================================================================
// RESPONSIVE CONTAINER
// =============================================================================

export interface ResponsiveContainerProps {
  children: React.ReactNode;
  /** Largura máxima (sm, md, lg, xl, 2xl, full) */
  maxWidth?: 'sm' | 'md' | 'lg' | 'xl' | '2xl' | 'full';
  /** Padding horizontal */
  padding?: 'none' | 'sm' | 'md' | 'lg';
  /** Centralizar */
  centered?: boolean;
  /** Classes adicionais */
  className?: string;
}

export function ResponsiveContainer({
  children,
  maxWidth = 'xl',
  padding = 'md',
  centered = true,
  className,
}: ResponsiveContainerProps) {
  const maxWidthClasses = {
    sm: 'max-w-screen-sm',
    md: 'max-w-screen-md',
    lg: 'max-w-screen-lg',
    xl: 'max-w-screen-xl',
    '2xl': 'max-w-screen-2xl',
    full: 'max-w-full',
  };

  const paddingClasses = {
    none: 'px-0',
    sm: 'px-4',
    md: 'px-4 sm:px-6 lg:px-8',
    lg: 'px-4 sm:px-8 lg:px-12',
  };

  return (
    <div
      className={cn(
        'w-full',
        maxWidthClasses[maxWidth],
        paddingClasses[padding],
        centered && 'mx-auto',
        className
      )}
    >
      {children}
    </div>
  );
}

// =============================================================================
// RESPONSIVE GRID
// =============================================================================

export interface ResponsiveGridProps {
  children: React.ReactNode;
  /** Colunas por breakpoint */
  columns?: ResponsiveValue<1 | 2 | 3 | 4 | 5 | 6 | 12>;
  /** Espaçamento */
  gap?: 'none' | 'sm' | 'md' | 'lg' | 'xl';
  /** Classes adicionais */
  className?: string;
}

export function ResponsiveGrid({
  children,
  columns = { sm: 1, md: 2, lg: 3 },
  gap = 'md',
  className,
}: ResponsiveGridProps) {
  const gapClasses = {
    none: 'gap-0',
    sm: 'gap-2',
    md: 'gap-4',
    lg: 'gap-6',
    xl: 'gap-8',
  };

  const getColumnClasses = () => {
    if (typeof columns === 'number') {
      return `grid-cols-${columns}`;
    }

    const classes: string[] = [];
    if (columns.sm) classes.push(`grid-cols-${columns.sm}`);
    if (columns.md) classes.push(`sm:grid-cols-${columns.md}`);
    if (columns.lg) classes.push(`lg:grid-cols-${columns.lg}`);
    if (columns.xl) classes.push(`xl:grid-cols-${columns.xl}`);
    if (columns['2xl']) classes.push(`2xl:grid-cols-${columns['2xl']}`);
    return classes.join(' ');
  };

  return (
    <div className={cn('grid', getColumnClasses(), gapClasses[gap], className)}>
      {children}
    </div>
  );
}

// =============================================================================
// RESPONSIVE STACK
// =============================================================================

export interface ResponsiveStackProps {
  children: React.ReactNode;
  /** Direção */
  direction?: ResponsiveValue<'row' | 'col'>;
  /** Espaçamento */
  gap?: 'none' | 'sm' | 'md' | 'lg' | 'xl';
  /** Alinhamento */
  align?: 'start' | 'center' | 'end' | 'stretch' | 'baseline';
  /** Justificação */
  justify?: 'start' | 'center' | 'end' | 'between' | 'around' | 'evenly';
  /** Wrap */
  wrap?: boolean;
  /** Classes adicionais */
  className?: string;
}

export function ResponsiveStack({
  children,
  direction = 'col',
  gap = 'md',
  align,
  justify,
  wrap = false,
  className,
}: ResponsiveStackProps) {
  const gapClasses = {
    none: 'gap-0',
    sm: 'gap-2',
    md: 'gap-4',
    lg: 'gap-6',
    xl: 'gap-8',
  };

  const alignClasses = {
    start: 'items-start',
    center: 'items-center',
    end: 'items-end',
    stretch: 'items-stretch',
    baseline: 'items-baseline',
  };

  const justifyClasses = {
    start: 'justify-start',
    center: 'justify-center',
    end: 'justify-end',
    between: 'justify-between',
    around: 'justify-around',
    evenly: 'justify-evenly',
  };

  const getDirectionClasses = () => {
    if (typeof direction === 'string') {
      return direction === 'row' ? 'flex-row' : 'flex-col';
    }

    const classes: string[] = [];
    if (direction.sm) classes.push(direction.sm === 'row' ? 'flex-row' : 'flex-col');
    if (direction.md) classes.push(direction.md === 'row' ? 'sm:flex-row' : 'sm:flex-col');
    if (direction.lg) classes.push(direction.lg === 'row' ? 'lg:flex-row' : 'lg:flex-col');
    if (direction.xl) classes.push(direction.xl === 'row' ? 'xl:flex-row' : 'xl:flex-col');
    return classes.join(' ');
  };

  return (
    <div
      className={cn(
        'flex',
        getDirectionClasses(),
        gapClasses[gap],
        align && alignClasses[align],
        justify && justifyClasses[justify],
        wrap && 'flex-wrap',
        className
      )}
    >
      {children}
    </div>
  );
}

// =============================================================================
// RESPONSIVE HIDE
// =============================================================================

export interface ResponsiveHideProps {
  children: React.ReactNode;
  /** Esconder acima do breakpoint */
  above?: Breakpoint;
  /** Esconder abaixo do breakpoint */
  below?: Breakpoint;
  /** Classes adicionais */
  className?: string;
}

export function ResponsiveHide({
  children,
  above,
  below,
  className,
}: ResponsiveHideProps) {
  const aboveClasses = {
    sm: 'sm:hidden',
    md: 'md:hidden',
    lg: 'lg:hidden',
    xl: 'xl:hidden',
    '2xl': '2xl:hidden',
  };

  const belowClasses = {
    sm: 'hidden sm:block',
    md: 'hidden md:block',
    lg: 'hidden lg:block',
    xl: 'hidden xl:block',
    '2xl': 'hidden 2xl:block',
  };

  return (
    <div
      className={cn(
        above && aboveClasses[above],
        below && belowClasses[below],
        className
      )}
    >
      {children}
    </div>
  );
}

// =============================================================================
// RESPONSIVE SHOW (Opposite of Hide)
// =============================================================================

export function ResponsiveShow({
  children,
  above,
  below,
  className,
}: ResponsiveHideProps) {
  const aboveClasses = {
    sm: 'hidden sm:block',
    md: 'hidden md:block',
    lg: 'hidden lg:block',
    xl: 'hidden xl:block',
    '2xl': 'hidden 2xl:block',
  };

  const belowClasses = {
    sm: 'sm:hidden',
    md: 'md:hidden',
    lg: 'lg:hidden',
    xl: 'xl:hidden',
    '2xl': '2xl:hidden',
  };

  return (
    <div
      className={cn(
        above && aboveClasses[above],
        below && belowClasses[below],
        className
      )}
    >
      {children}
    </div>
  );
}

// =============================================================================
// SPLIT VIEW
// =============================================================================

export interface SplitViewProps {
  children: [React.ReactNode, React.ReactNode];
  /** Proporção (ex: [1, 2] ou [2, 1]) */
  ratio?: [number, number];
  /** Espaçamento */
  gap?: 'none' | 'sm' | 'md' | 'lg' | 'xl';
  /** Breakpoint para stack vertical */
  stackBelow?: Breakpoint;
  /** Direção em mobile */
  mobileOrder?: 'default' | 'reverse';
  /** Classes adicionais */
  className?: string;
}

export function SplitView({
  children,
  ratio = [1, 1],
  gap = 'md',
  stackBelow = 'lg',
  mobileOrder = 'default',
  className,
}: SplitViewProps) {
  const [left, right] = children;

  const gapClasses = {
    none: 'gap-0',
    sm: 'gap-2',
    md: 'gap-4',
    lg: 'gap-6',
    xl: 'gap-8',
  };

  const stackClasses = {
    sm: 'flex-col sm:flex-row',
    md: 'flex-col md:flex-row',
    lg: 'flex-col lg:flex-row',
    xl: 'flex-col xl:flex-row',
    '2xl': 'flex-col 2xl:flex-row',
  };

  const total = ratio[0] + ratio[1];
  const leftPercent = (ratio[0] / total) * 100;
  const rightPercent = (ratio[1] / total) * 100;

  return (
    <div
      className={cn(
        'flex',
        stackClasses[stackBelow],
        gapClasses[gap],
        className
      )}
    >
      <div
        className={cn(
          'flex-none',
          mobileOrder === 'reverse' && 'order-2',
          `${stackBelow}:order-none`
        )}
        style={{
          [`--split-width`]: `${leftPercent}%`,
        } as React.CSSProperties}
      >
        <div className={`w-full ${stackBelow}:w-[var(--split-width)]`}>{left}</div>
      </div>
      <div
        className={cn(
          'flex-1',
          mobileOrder === 'reverse' && 'order-1',
          `${stackBelow}:order-none`
        )}
      >
        {right}
      </div>
    </div>
  );
}

// =============================================================================
// MASONRY GRID (CSS-based)
// =============================================================================

export interface MasonryGridProps {
  children: React.ReactNode;
  columns?: ResponsiveValue<2 | 3 | 4 | 5 | 6>;
  gap?: 'sm' | 'md' | 'lg';
  className?: string;
}

export function MasonryGrid({
  children,
  columns = { sm: 2, lg: 3 },
  gap = 'md',
  className,
}: MasonryGridProps) {
  const gapSizes = {
    sm: '0.5rem',
    md: '1rem',
    lg: '1.5rem',
  };

  const getColumnCount = () => {
    if (typeof columns === 'number') return columns;
    return columns.lg || columns.md || columns.sm || 3;
  };

  return (
    <div
      className={cn('columns-1', className)}
      style={{
        columnCount: getColumnCount(),
        columnGap: gapSizes[gap],
      }}
    >
      {React.Children.map(children, (child, index) => (
        <div
          key={index}
          className="break-inside-avoid"
          style={{ marginBottom: gapSizes[gap] }}
        >
          {child}
        </div>
      ))}
    </div>
  );
}

// =============================================================================
// USE BREAKPOINT HOOK
// =============================================================================

export function useBreakpoint() {
  const [breakpoint, setBreakpoint] = React.useState<Breakpoint | 'xs'>('xs');

  React.useEffect(() => {
    const checkBreakpoint = () => {
      const width = window.innerWidth;
      if (width >= 1536) setBreakpoint('2xl');
      else if (width >= 1280) setBreakpoint('xl');
      else if (width >= 1024) setBreakpoint('lg');
      else if (width >= 768) setBreakpoint('md');
      else if (width >= 640) setBreakpoint('sm');
      else setBreakpoint('xs');
    };

    checkBreakpoint();
    window.addEventListener('resize', checkBreakpoint);
    return () => window.removeEventListener('resize', checkBreakpoint);
  }, []);

  return {
    breakpoint,
    isMobile: breakpoint === 'xs' || breakpoint === 'sm',
    isTablet: breakpoint === 'md',
    isDesktop: breakpoint === 'lg' || breakpoint === 'xl' || breakpoint === '2xl',
    isAbove: (bp: Breakpoint) => {
      const order: (Breakpoint | 'xs')[] = ['xs', 'sm', 'md', 'lg', 'xl', '2xl'];
      return order.indexOf(breakpoint) >= order.indexOf(bp);
    },
    isBelow: (bp: Breakpoint) => {
      const order: (Breakpoint | 'xs')[] = ['xs', 'sm', 'md', 'lg', 'xl', '2xl'];
      return order.indexOf(breakpoint) < order.indexOf(bp);
    },
  };
}

// =============================================================================
// USE MEDIA QUERY HOOK
// =============================================================================

export function useMediaQuery(query: string): boolean {
  const [matches, setMatches] = React.useState(false);

  React.useEffect(() => {
    const media = window.matchMedia(query);
    setMatches(media.matches);

    const listener = (e: MediaQueryListEvent) => setMatches(e.matches);
    media.addEventListener('change', listener);
    return () => media.removeEventListener('change', listener);
  }, [query]);

  return matches;
}
