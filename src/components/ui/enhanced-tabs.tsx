import * as React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { type LucideIcon } from 'lucide-react';
import * as TabsPrimitive from '@radix-ui/react-tabs';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';

// =============================================================================
// TYPES
// =============================================================================

export interface TabItem {
  id: string;
  label: string;
  icon?: LucideIcon;
  badge?: string | number;
  badgeVariant?: 'default' | 'secondary' | 'destructive' | 'outline';
  disabled?: boolean;
  content?: React.ReactNode;
}

export interface EnhancedTabsProps {
  tabs: TabItem[];
  defaultValue?: string;
  value?: string;
  onValueChange?: (value: string) => void;
  variant?: 'default' | 'pills' | 'underline' | 'segment';
  size?: 'sm' | 'md' | 'lg';
  fullWidth?: boolean;
  animated?: boolean;
  className?: string;
  tabsListClassName?: string;
  contentClassName?: string;
}

// =============================================================================
// ENHANCED TABS
// =============================================================================

export function EnhancedTabs({
  tabs,
  defaultValue,
  value,
  onValueChange,
  variant = 'default',
  size = 'md',
  fullWidth = false,
  animated = true,
  className,
  tabsListClassName,
  contentClassName,
}: EnhancedTabsProps) {
  const [activeTab, setActiveTab] = React.useState(value || defaultValue || tabs[0]?.id);
  const tabsRef = React.useRef<HTMLDivElement>(null);
  const [indicatorStyle, setIndicatorStyle] = React.useState({ left: 0, width: 0 });

  // Update indicator position
  React.useEffect(() => {
    if (!tabsRef.current || variant === 'pills') return;

    const activeElement = tabsRef.current.querySelector(
      `[data-state="active"]`
    ) as HTMLElement;

    if (activeElement) {
      setIndicatorStyle({
        left: activeElement.offsetLeft,
        width: activeElement.offsetWidth,
      });
    }
  }, [activeTab, variant]);

  const handleValueChange = (newValue: string) => {
    setActiveTab(newValue);
    onValueChange?.(newValue);
  };

  // Size styles
  const sizeStyles = {
    sm: {
      trigger: 'text-xs px-2.5 py-1.5 gap-1',
      icon: 'h-3 w-3',
      badge: 'text-[9px] px-1',
    },
    md: {
      trigger: 'text-sm px-3 py-2 gap-1.5',
      icon: 'h-4 w-4',
      badge: 'text-[10px] px-1.5',
    },
    lg: {
      trigger: 'text-base px-4 py-2.5 gap-2',
      icon: 'h-5 w-5',
      badge: 'text-xs px-2',
    },
  };

  // Variant styles
  const variantStyles = {
    default: {
      list: 'bg-muted p-1 rounded-lg',
      trigger: 'rounded-md data-[state=active]:bg-background data-[state=active]:shadow-sm',
      indicator: false,
    },
    pills: {
      list: 'gap-2',
      trigger: 'rounded-full border data-[state=active]:bg-primary data-[state=active]:text-primary-foreground data-[state=active]:border-primary',
      indicator: false,
    },
    underline: {
      list: 'border-b gap-1',
      trigger: 'border-b-2 border-transparent rounded-none pb-2 -mb-px data-[state=active]:border-primary',
      indicator: true,
    },
    segment: {
      list: 'border rounded-lg p-0.5',
      trigger: 'rounded-md data-[state=active]:bg-primary data-[state=active]:text-primary-foreground',
      indicator: false,
    },
  };

  const sizes = sizeStyles[size];
  const styles = variantStyles[variant];

  return (
    <TabsPrimitive.Root
      value={value ?? activeTab}
      onValueChange={handleValueChange}
      className={className}
    >
      <TabsPrimitive.List
        ref={tabsRef}
        className={cn(
          'flex items-center relative',
          fullWidth && 'w-full',
          styles.list,
          tabsListClassName
        )}
      >
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = (value ?? activeTab) === tab.id;

          return (
            <TabsPrimitive.Trigger
              key={tab.id}
              value={tab.id}
              disabled={tab.disabled}
              className={cn(
                'inline-flex items-center justify-center font-medium transition-all',
                'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring',
                'disabled:pointer-events-none disabled:opacity-50',
                fullWidth && 'flex-1',
                sizes.trigger,
                styles.trigger
              )}
            >
              {Icon && <Icon className={sizes.icon} />}
              <span>{tab.label}</span>
              {tab.badge !== undefined && (
                <Badge
                  variant={tab.badgeVariant || 'secondary'}
                  className={cn(sizes.badge, 'ml-1')}
                >
                  {tab.badge}
                </Badge>
              )}
            </TabsPrimitive.Trigger>
          );
        })}

        {/* Animated indicator for underline variant */}
        {variant === 'underline' && animated && (
          <motion.div
            className="absolute bottom-0 h-0.5 bg-primary rounded-full"
            initial={false}
            animate={{
              left: indicatorStyle.left,
              width: indicatorStyle.width,
            }}
            transition={{ type: 'spring', stiffness: 500, damping: 30 }}
          />
        )}
      </TabsPrimitive.List>

      {/* Tab Contents */}
      {tabs.map((tab) => (
        <TabsPrimitive.Content
          key={tab.id}
          value={tab.id}
          className={cn('mt-4 focus-visible:outline-none', contentClassName)}
        >
          {animated ? (
            <AnimatePresence mode="wait">
              {(value ?? activeTab) === tab.id && (
                <motion.div
                  key={tab.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.15 }}
                >
                  {tab.content}
                </motion.div>
              )}
            </AnimatePresence>
          ) : (
            tab.content
          )}
        </TabsPrimitive.Content>
      ))}
    </TabsPrimitive.Root>
  );
}

// =============================================================================
// VERTICAL TABS
// =============================================================================

export function VerticalTabs({
  tabs,
  defaultValue,
  value,
  onValueChange,
  size = 'md',
  animated = true,
  className,
  tabsListClassName,
  contentClassName,
}: Omit<EnhancedTabsProps, 'variant' | 'fullWidth'>) {
  const [activeTab, setActiveTab] = React.useState(value || defaultValue || tabs[0]?.id);

  const handleValueChange = (newValue: string) => {
    setActiveTab(newValue);
    onValueChange?.(newValue);
  };

  const sizeStyles = {
    sm: {
      trigger: 'text-xs px-2.5 py-1.5 gap-1.5',
      icon: 'h-3 w-3',
    },
    md: {
      trigger: 'text-sm px-3 py-2 gap-2',
      icon: 'h-4 w-4',
    },
    lg: {
      trigger: 'text-base px-4 py-2.5 gap-2.5',
      icon: 'h-5 w-5',
    },
  };

  const sizes = sizeStyles[size];

  return (
    <TabsPrimitive.Root
      value={value ?? activeTab}
      onValueChange={handleValueChange}
      className={cn('flex gap-6', className)}
      orientation="vertical"
    >
      <TabsPrimitive.List
        className={cn(
          'flex flex-col gap-1 border-r pr-4 min-w-[200px]',
          tabsListClassName
        )}
      >
        {tabs.map((tab) => {
          const Icon = tab.icon;

          return (
            <TabsPrimitive.Trigger
              key={tab.id}
              value={tab.id}
              disabled={tab.disabled}
              className={cn(
                'inline-flex items-center justify-start font-medium transition-all',
                'rounded-md text-left',
                'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring',
                'disabled:pointer-events-none disabled:opacity-50',
                'hover:bg-muted',
                'data-[state=active]:bg-primary/10 data-[state=active]:text-primary',
                sizes.trigger
              )}
            >
              {Icon && <Icon className={sizes.icon} />}
              <span className="flex-1">{tab.label}</span>
              {tab.badge !== undefined && (
                <Badge variant={tab.badgeVariant || 'secondary'} className="text-[10px]">
                  {tab.badge}
                </Badge>
              )}
            </TabsPrimitive.Trigger>
          );
        })}
      </TabsPrimitive.List>

      <div className="flex-1">
        {tabs.map((tab) => (
          <TabsPrimitive.Content
            key={tab.id}
            value={tab.id}
            className={cn('focus-visible:outline-none', contentClassName)}
          >
            {animated ? (
              <AnimatePresence mode="wait">
                {(value ?? activeTab) === tab.id && (
                  <motion.div
                    key={tab.id}
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    transition={{ duration: 0.15 }}
                  >
                    {tab.content}
                  </motion.div>
                )}
              </AnimatePresence>
            ) : (
              tab.content
            )}
          </TabsPrimitive.Content>
        ))}
      </div>
    </TabsPrimitive.Root>
  );
}

// =============================================================================
// TAB CARD (Styled card for each tab content)
// =============================================================================

export function TabCard({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div className={cn('bg-card rounded-lg border p-4', className)}>
      {children}
    </div>
  );
}

// =============================================================================
// SCROLLABLE TABS (For many tabs)
// =============================================================================

export function ScrollableTabs({
  tabs,
  defaultValue,
  value,
  onValueChange,
  size = 'md',
  className,
}: Omit<EnhancedTabsProps, 'variant' | 'fullWidth' | 'animated'>) {
  const [activeTab, setActiveTab] = React.useState(value || defaultValue || tabs[0]?.id);
  const scrollRef = React.useRef<HTMLDivElement>(null);

  const handleValueChange = (newValue: string) => {
    setActiveTab(newValue);
    onValueChange?.(newValue);

    // Scroll active tab into view
    const activeElement = scrollRef.current?.querySelector(
      `[data-value="${newValue}"]`
    ) as HTMLElement;
    if (activeElement) {
      activeElement.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'center' });
    }
  };

  const sizeStyles = {
    sm: { trigger: 'text-xs px-2.5 py-1.5', icon: 'h-3 w-3' },
    md: { trigger: 'text-sm px-3 py-2', icon: 'h-4 w-4' },
    lg: { trigger: 'text-base px-4 py-2.5', icon: 'h-5 w-5' },
  };

  const sizes = sizeStyles[size];

  return (
    <TabsPrimitive.Root
      value={value ?? activeTab}
      onValueChange={handleValueChange}
      className={className}
    >
      <div className="relative">
        {/* Scroll shadows */}
        <div className="absolute left-0 top-0 bottom-0 w-8 bg-gradient-to-r from-background to-transparent pointer-events-none z-10" />
        <div className="absolute right-0 top-0 bottom-0 w-8 bg-gradient-to-l from-background to-transparent pointer-events-none z-10" />

        <div
          ref={scrollRef}
          className="overflow-x-auto scrollbar-hide"
          style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
        >
          <TabsPrimitive.List className="flex items-center gap-1 border-b pb-px min-w-max px-4">
            {tabs.map((tab) => {
              const Icon = tab.icon;

              return (
                <TabsPrimitive.Trigger
                  key={tab.id}
                  value={tab.id}
                  data-value={tab.id}
                  disabled={tab.disabled}
                  className={cn(
                    'inline-flex items-center justify-center gap-1.5 font-medium whitespace-nowrap',
                    'border-b-2 border-transparent -mb-px transition-colors',
                    'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring',
                    'disabled:pointer-events-none disabled:opacity-50',
                    'hover:text-foreground',
                    'data-[state=active]:border-primary data-[state=active]:text-primary',
                    sizes.trigger
                  )}
                >
                  {Icon && <Icon className={sizes.icon} />}
                  <span>{tab.label}</span>
                  {tab.badge !== undefined && (
                    <Badge variant="secondary" className="text-[9px] px-1 ml-1">
                      {tab.badge}
                    </Badge>
                  )}
                </TabsPrimitive.Trigger>
              );
            })}
          </TabsPrimitive.List>
        </div>
      </div>

      {/* Tab Contents */}
      {tabs.map((tab) => (
        <TabsPrimitive.Content
          key={tab.id}
          value={tab.id}
          className="mt-4 focus-visible:outline-none"
        >
          <AnimatePresence mode="wait">
            {(value ?? activeTab) === tab.id && (
              <motion.div
                key={tab.id}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.1 }}
              >
                {tab.content}
              </motion.div>
            )}
          </AnimatePresence>
        </TabsPrimitive.Content>
      ))}
    </TabsPrimitive.Root>
  );
}

// =============================================================================
// ICON ONLY TABS
// =============================================================================

export function IconTabs({
  tabs,
  defaultValue,
  value,
  onValueChange,
  size = 'md',
  className,
}: {
  tabs: Array<{ id: string; icon: LucideIcon; label: string; badge?: number }>;
  defaultValue?: string;
  value?: string;
  onValueChange?: (value: string) => void;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}) {
  const [activeTab, setActiveTab] = React.useState(value || defaultValue || tabs[0]?.id);

  const handleValueChange = (newValue: string) => {
    setActiveTab(newValue);
    onValueChange?.(newValue);
  };

  const sizeStyles = {
    sm: { button: 'h-8 w-8', icon: 'h-4 w-4' },
    md: { button: 'h-10 w-10', icon: 'h-5 w-5' },
    lg: { button: 'h-12 w-12', icon: 'h-6 w-6' },
  };

  const sizes = sizeStyles[size];

  return (
    <TabsPrimitive.Root
      value={value ?? activeTab}
      onValueChange={handleValueChange}
      className={className}
    >
      <TabsPrimitive.List className="flex items-center gap-1 bg-muted p-1 rounded-lg">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = (value ?? activeTab) === tab.id;

          return (
            <TabsPrimitive.Trigger
              key={tab.id}
              value={tab.id}
              className={cn(
                'relative inline-flex items-center justify-center rounded-md transition-all',
                'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring',
                'data-[state=active]:bg-background data-[state=active]:shadow-sm',
                sizes.button
              )}
              title={tab.label}
            >
              <Icon className={cn(sizes.icon, isActive ? 'text-primary' : 'text-muted-foreground')} />
              <span className="sr-only">{tab.label}</span>

              {tab.badge !== undefined && tab.badge > 0 && (
                <span className="absolute -top-1 -right-1 h-4 w-4 flex items-center justify-center bg-destructive text-destructive-foreground text-[9px] font-bold rounded-full">
                  {tab.badge > 9 ? '9+' : tab.badge}
                </span>
              )}
            </TabsPrimitive.Trigger>
          );
        })}
      </TabsPrimitive.List>
    </TabsPrimitive.Root>
  );
}
