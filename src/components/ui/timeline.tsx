import * as React from 'react';
import { motion } from 'framer-motion';
import { format, formatDistanceToNow, isToday, isYesterday } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import {
  Circle,
  CheckCircle,
  XCircle,
  AlertCircle,
  Clock,
  User,
  MessageSquare,
  DollarSign,
  FileText,
  Settings,
  type LucideIcon,
} from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Card } from '@/components/ui/card';
import { cn } from '@/lib/utils';

// =============================================================================
// TYPES
// =============================================================================

export type TimelineItemType =
  | 'default'
  | 'success'
  | 'error'
  | 'warning'
  | 'info'
  | 'payment'
  | 'comment'
  | 'system';

export interface TimelineItem {
  id: string;
  type?: TimelineItemType;
  icon?: LucideIcon;
  title: string;
  description?: string;
  timestamp: Date;
  user?: {
    name: string;
    avatar?: string;
  };
  metadata?: Record<string, string | number>;
  content?: React.ReactNode;
}

export interface TimelineProps {
  items: TimelineItem[];
  variant?: 'simple' | 'detailed' | 'compact';
  showConnector?: boolean;
  groupByDate?: boolean;
  animated?: boolean;
  className?: string;
}

// =============================================================================
// TYPE CONFIG
// =============================================================================

const typeConfig: Record<TimelineItemType, { icon: LucideIcon; color: string; bg: string }> = {
  default: {
    icon: Circle,
    color: 'text-muted-foreground',
    bg: 'bg-muted',
  },
  success: {
    icon: CheckCircle,
    color: 'text-success',
    bg: 'bg-success/10',
  },
  error: {
    icon: XCircle,
    color: 'text-destructive',
    bg: 'bg-destructive/10',
  },
  warning: {
    icon: AlertCircle,
    color: 'text-warning',
    bg: 'bg-warning/10',
  },
  info: {
    icon: Clock,
    color: 'text-primary',
    bg: 'bg-primary/10',
  },
  payment: {
    icon: DollarSign,
    color: 'text-success',
    bg: 'bg-success/10',
  },
  comment: {
    icon: MessageSquare,
    color: 'text-primary',
    bg: 'bg-primary/10',
  },
  system: {
    icon: Settings,
    color: 'text-muted-foreground',
    bg: 'bg-muted',
  },
};

// =============================================================================
// TIMELINE
// =============================================================================

export function Timeline({
  items,
  variant = 'simple',
  showConnector = true,
  groupByDate = false,
  animated = true,
  className,
}: TimelineProps) {
  // Group items by date if needed
  const groupedItems = React.useMemo(() => {
    if (!groupByDate) return { ungrouped: items };

    return items.reduce((groups, item) => {
      const dateKey = format(item.timestamp, 'yyyy-MM-dd');
      if (!groups[dateKey]) {
        groups[dateKey] = [];
      }
      groups[dateKey].push(item);
      return groups;
    }, {} as Record<string, TimelineItem[]>);
  }, [items, groupByDate]);

  const formatDateGroup = (dateKey: string) => {
    const date = new Date(dateKey);
    if (isToday(date)) return 'Hoje';
    if (isYesterday(date)) return 'Ontem';
    return format(date, "d 'de' MMMM", { locale: ptBR });
  };

  const renderItem = (item: TimelineItem, index: number, isLast: boolean) => {
    if (variant === 'compact') {
      return (
        <CompactTimelineItem
          key={item.id}
          item={item}
          isLast={isLast}
          showConnector={showConnector}
          animated={animated}
          index={index}
        />
      );
    }

    if (variant === 'detailed') {
      return (
        <DetailedTimelineItem
          key={item.id}
          item={item}
          isLast={isLast}
          showConnector={showConnector}
          animated={animated}
          index={index}
        />
      );
    }

    return (
      <SimpleTimelineItem
        key={item.id}
        item={item}
        isLast={isLast}
        showConnector={showConnector}
        animated={animated}
        index={index}
      />
    );
  };

  return (
    <div className={cn('space-y-6', className)}>
      {groupByDate ? (
        Object.entries(groupedItems).map(([dateKey, dateItems]) => (
          <div key={dateKey}>
            <h3 className="text-sm font-medium text-muted-foreground mb-4 sticky top-0 bg-background py-2">
              {formatDateGroup(dateKey)}
            </h3>
            <div className="space-y-0">
              {dateItems.map((item, index) =>
                renderItem(item, index, index === dateItems.length - 1)
              )}
            </div>
          </div>
        ))
      ) : (
        <div className="space-y-0">
          {items.map((item, index) =>
            renderItem(item, index, index === items.length - 1)
          )}
        </div>
      )}
    </div>
  );
}

// =============================================================================
// SIMPLE TIMELINE ITEM
// =============================================================================

function SimpleTimelineItem({
  item,
  isLast,
  showConnector,
  animated,
  index,
}: {
  item: TimelineItem;
  isLast: boolean;
  showConnector: boolean;
  animated: boolean;
  index: number;
}) {
  const config = typeConfig[item.type || 'default'];
  const Icon = item.icon || config.icon;
  const timeAgo = formatDistanceToNow(item.timestamp, { addSuffix: true, locale: ptBR });

  const content = (
    <div className="flex gap-3 pb-6">
      {/* Icon and connector */}
      <div className="flex flex-col items-center">
        <div
          className={cn(
            'flex items-center justify-center h-8 w-8 rounded-full shrink-0',
            config.bg
          )}
        >
          <Icon className={cn('h-4 w-4', config.color)} />
        </div>
        {showConnector && !isLast && (
          <div className="flex-1 w-px bg-border mt-2" />
        )}
      </div>

      {/* Content */}
      <div className="flex-1 pt-1">
        <div className="flex items-start justify-between gap-2">
          <div>
            <p className="text-sm font-medium">{item.title}</p>
            {item.description && (
              <p className="text-sm text-muted-foreground mt-0.5">
                {item.description}
              </p>
            )}
          </div>
          <span className="text-xs text-muted-foreground whitespace-nowrap">
            {timeAgo}
          </span>
        </div>

        {item.content && <div className="mt-2">{item.content}</div>}
      </div>
    </div>
  );

  if (animated) {
    return (
      <motion.div
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: index * 0.05 }}
      >
        {content}
      </motion.div>
    );
  }

  return content;
}

// =============================================================================
// DETAILED TIMELINE ITEM
// =============================================================================

function DetailedTimelineItem({
  item,
  isLast,
  showConnector,
  animated,
  index,
}: {
  item: TimelineItem;
  isLast: boolean;
  showConnector: boolean;
  animated: boolean;
  index: number;
}) {
  const config = typeConfig[item.type || 'default'];
  const Icon = item.icon || config.icon;
  const formattedTime = format(item.timestamp, "HH:mm", { locale: ptBR });
  const formattedDate = format(item.timestamp, "d 'de' MMMM", { locale: ptBR });

  const content = (
    <div className="flex gap-4 pb-6">
      {/* Icon and connector */}
      <div className="flex flex-col items-center">
        <div
          className={cn(
            'flex items-center justify-center h-10 w-10 rounded-full shrink-0 border-2',
            config.bg,
            config.color
          )}
        >
          <Icon className="h-5 w-5" />
        </div>
        {showConnector && !isLast && (
          <div className="flex-1 w-0.5 bg-border mt-2" />
        )}
      </div>

      {/* Content Card */}
      <Card className="flex-1 p-4">
        <div className="flex items-start justify-between gap-2 mb-2">
          <div>
            <p className="font-medium">{item.title}</p>
            {item.description && (
              <p className="text-sm text-muted-foreground mt-1">
                {item.description}
              </p>
            )}
          </div>

          {/* User avatar */}
          {item.user && (
            <div className="flex items-center gap-2 shrink-0">
              <span className="text-xs text-muted-foreground">{item.user.name}</span>
              <Avatar className="h-6 w-6">
                <AvatarImage src={item.user.avatar} />
                <AvatarFallback className="text-[10px]">
                  {item.user.name.split(' ').map((n) => n[0]).join('')}
                </AvatarFallback>
              </Avatar>
            </div>
          )}
        </div>

        {/* Metadata */}
        {item.metadata && (
          <div className="flex flex-wrap gap-2 mt-3 pt-3 border-t">
            {Object.entries(item.metadata).map(([key, value]) => (
              <Badge key={key} variant="secondary" className="text-xs">
                {key}: {value}
              </Badge>
            ))}
          </div>
        )}

        {/* Custom content */}
        {item.content && <div className="mt-3">{item.content}</div>}

        {/* Timestamp */}
        <div className="flex items-center gap-2 mt-3 text-xs text-muted-foreground">
          <Clock className="h-3 w-3" />
          {formattedTime} · {formattedDate}
        </div>
      </Card>
    </div>
  );

  if (animated) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: index * 0.08 }}
      >
        {content}
      </motion.div>
    );
  }

  return content;
}

// =============================================================================
// COMPACT TIMELINE ITEM
// =============================================================================

function CompactTimelineItem({
  item,
  isLast,
  showConnector,
  animated,
  index,
}: {
  item: TimelineItem;
  isLast: boolean;
  showConnector: boolean;
  animated: boolean;
  index: number;
}) {
  const config = typeConfig[item.type || 'default'];
  const formattedTime = format(item.timestamp, 'HH:mm');

  const content = (
    <div className="flex items-center gap-3 py-2">
      {/* Dot */}
      <span className={cn('h-2 w-2 rounded-full shrink-0', config.bg.replace('/10', ''))} />

      {/* Time */}
      <span className="text-xs text-muted-foreground w-12 shrink-0">{formattedTime}</span>

      {/* Title */}
      <span className="text-sm flex-1 truncate">{item.title}</span>

      {/* User */}
      {item.user && (
        <span className="text-xs text-muted-foreground truncate max-w-[100px]">
          {item.user.name}
        </span>
      )}
    </div>
  );

  if (animated) {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: index * 0.03 }}
        className={cn(!isLast && showConnector && 'border-b border-border/50')}
      >
        {content}
      </motion.div>
    );
  }

  return (
    <div className={cn(!isLast && showConnector && 'border-b border-border/50')}>
      {content}
    </div>
  );
}

// =============================================================================
// ACTIVITY FEED
// =============================================================================

export interface ActivityItem {
  id: string;
  user: {
    name: string;
    avatar?: string;
  };
  action: string;
  target?: string;
  timestamp: Date;
  icon?: LucideIcon;
  iconColor?: string;
}

export function ActivityFeed({
  activities,
  maxItems,
  showLoadMore,
  onLoadMore,
  className,
}: {
  activities: ActivityItem[];
  maxItems?: number;
  showLoadMore?: boolean;
  onLoadMore?: () => void;
  className?: string;
}) {
  const displayedActivities = maxItems ? activities.slice(0, maxItems) : activities;

  return (
    <div className={cn('space-y-4', className)}>
      {displayedActivities.map((activity, index) => {
        const Icon = activity.icon || Circle;
        const timeAgo = formatDistanceToNow(activity.timestamp, {
          addSuffix: true,
          locale: ptBR,
        });

        return (
          <motion.div
            key={activity.id}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.05 }}
            className="flex items-start gap-3"
          >
            <Avatar className="h-8 w-8">
              <AvatarImage src={activity.user.avatar} />
              <AvatarFallback className="text-xs">
                {activity.user.name.split(' ').map((n) => n[0]).join('')}
              </AvatarFallback>
            </Avatar>

            <div className="flex-1 min-w-0">
              <p className="text-sm">
                <span className="font-medium">{activity.user.name}</span>{' '}
                <span className="text-muted-foreground">{activity.action}</span>
                {activity.target && (
                  <>
                    {' '}
                    <span className="font-medium">{activity.target}</span>
                  </>
                )}
              </p>
              <p className="text-xs text-muted-foreground mt-0.5">{timeAgo}</p>
            </div>

            <Icon
              className={cn('h-4 w-4 shrink-0', activity.iconColor || 'text-muted-foreground')}
            />
          </motion.div>
        );
      })}

      {showLoadMore && activities.length > (maxItems || 0) && (
        <button
          onClick={onLoadMore}
          className="w-full text-center text-sm text-primary hover:underline py-2"
        >
          Ver mais atividades
        </button>
      )}
    </div>
  );
}

// =============================================================================
// CHANGELOG
// =============================================================================

export interface ChangelogEntry {
  id: string;
  version: string;
  date: Date;
  title: string;
  description?: string;
  changes: Array<{
    type: 'added' | 'changed' | 'fixed' | 'removed';
    text: string;
  }>;
}

export function Changelog({
  entries,
  className,
}: {
  entries: ChangelogEntry[];
  className?: string;
}) {
  const changeTypeConfig = {
    added: { label: 'Novo', color: 'bg-success text-success-foreground' },
    changed: { label: 'Alterado', color: 'bg-primary text-primary-foreground' },
    fixed: { label: 'Corrigido', color: 'bg-warning text-warning-foreground' },
    removed: { label: 'Removido', color: 'bg-destructive text-destructive-foreground' },
  };

  return (
    <div className={cn('space-y-8', className)}>
      {entries.map((entry, index) => (
        <motion.div
          key={entry.id}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: index * 0.1 }}
        >
          <div className="flex items-center gap-3 mb-3">
            <Badge variant="outline" className="font-mono">
              {entry.version}
            </Badge>
            <span className="text-sm text-muted-foreground">
              {format(entry.date, "d 'de' MMMM 'de' yyyy", { locale: ptBR })}
            </span>
          </div>

          <h3 className="text-lg font-semibold mb-2">{entry.title}</h3>
          {entry.description && (
            <p className="text-muted-foreground mb-4">{entry.description}</p>
          )}

          <ul className="space-y-2">
            {entry.changes.map((change, changeIndex) => {
              const config = changeTypeConfig[change.type];
              return (
                <li key={changeIndex} className="flex items-start gap-2">
                  <Badge className={cn('text-[10px] px-1.5 shrink-0', config.color)}>
                    {config.label}
                  </Badge>
                  <span className="text-sm">{change.text}</span>
                </li>
              );
            })}
          </ul>
        </motion.div>
      ))}
    </div>
  );
}
