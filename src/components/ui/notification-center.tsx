import * as React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Bell,
  Check,
  CheckCheck,
  Trash2,
  Settings,
  X,
  AlertCircle,
  Info,
  CheckCircle,
  AlertTriangle,
  Clock,
  DollarSign,
  Users,
  FileText,
  type LucideIcon,
} from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { Button } from '@/components/ui/button';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { cn } from '@/lib/utils';

// =============================================================================
// TYPES
// =============================================================================

export type NotificationType = 'info' | 'success' | 'warning' | 'error';
export type NotificationCategory = 'all' | 'payments' | 'system' | 'alerts';

export interface Notification {
  id: string;
  type: NotificationType;
  category: NotificationCategory;
  title: string;
  message: string;
  timestamp: Date;
  read: boolean;
  href?: string;
  icon?: LucideIcon;
  actionLabel?: string;
  onAction?: () => void;
}

export interface NotificationCenterProps {
  notifications: Notification[];
  onMarkAsRead: (id: string) => void;
  onMarkAllAsRead: () => void;
  onDelete: (id: string) => void;
  onClearAll: () => void;
  onNotificationClick?: (notification: Notification) => void;
  className?: string;
}

// =============================================================================
// NOTIFICATION ICON BUTTON
// =============================================================================

export function NotificationBell({
  unreadCount,
  onClick,
  className,
}: {
  unreadCount: number;
  onClick?: () => void;
  className?: string;
}) {
  return (
    <Button
      variant="ghost"
      size="icon"
      className={cn('relative', className)}
      onClick={onClick}
    >
      <Bell className="h-5 w-5" />
      <AnimatePresence>
        {unreadCount > 0 && (
          <motion.span
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            exit={{ scale: 0 }}
            className="absolute -top-1 -right-1 h-5 w-5 flex items-center justify-center bg-destructive text-destructive-foreground text-[10px] font-bold rounded-full"
          >
            {unreadCount > 99 ? '99+' : unreadCount}
          </motion.span>
        )}
      </AnimatePresence>
      <span className="sr-only">
        {unreadCount > 0 ? `${unreadCount} notificações não lidas` : 'Notificações'}
      </span>
    </Button>
  );
}

// =============================================================================
// NOTIFICATION ITEM
// =============================================================================

function NotificationItem({
  notification,
  onMarkAsRead,
  onDelete,
  onClick,
}: {
  notification: Notification;
  onMarkAsRead: (id: string) => void;
  onDelete: (id: string) => void;
  onClick?: (notification: Notification) => void;
}) {
  const { type, title, message, timestamp, read, icon: CustomIcon } = notification;

  const typeConfig = {
    info: {
      icon: Info,
      color: 'text-primary',
      bg: 'bg-primary/10',
    },
    success: {
      icon: CheckCircle,
      color: 'text-success',
      bg: 'bg-success/10',
    },
    warning: {
      icon: AlertTriangle,
      color: 'text-warning',
      bg: 'bg-warning/10',
    },
    error: {
      icon: AlertCircle,
      color: 'text-destructive',
      bg: 'bg-destructive/10',
    },
  };

  const config = typeConfig[type];
  const Icon = CustomIcon || config.icon;
  const timeAgo = formatDistanceToNow(timestamp, { addSuffix: true, locale: ptBR });

  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: 20, height: 0 }}
      className={cn(
        'flex gap-3 p-3 border-b last:border-b-0 transition-colors cursor-pointer',
        read ? 'bg-background' : 'bg-muted/50',
        'hover:bg-muted/80'
      )}
      onClick={() => onClick?.(notification)}
    >
      {/* Icon */}
      <div className={cn('shrink-0 h-8 w-8 rounded-full flex items-center justify-center', config.bg)}>
        <Icon className={cn('h-4 w-4', config.color)} />
      </div>

      {/* Content */}
      <div className="flex-1 min-w-0">
        <div className="flex items-start justify-between gap-2">
          <div>
            <p className={cn('text-sm font-medium truncate', !read && 'text-foreground')}>
              {title}
            </p>
            <p className="text-xs text-muted-foreground line-clamp-2 mt-0.5">
              {message}
            </p>
          </div>

          {/* Actions */}
          <div className="flex items-center gap-1 shrink-0">
            {!read && (
              <Button
                variant="ghost"
                size="icon"
                className="h-6 w-6"
                onClick={(e) => {
                  e.stopPropagation();
                  onMarkAsRead(notification.id);
                }}
              >
                <Check className="h-3 w-3" />
                <span className="sr-only">Marcar como lida</span>
              </Button>
            )}
            <Button
              variant="ghost"
              size="icon"
              className="h-6 w-6 text-muted-foreground hover:text-destructive"
              onClick={(e) => {
                e.stopPropagation();
                onDelete(notification.id);
              }}
            >
              <X className="h-3 w-3" />
              <span className="sr-only">Remover</span>
            </Button>
          </div>
        </div>

        {/* Time and action */}
        <div className="flex items-center justify-between mt-1.5">
          <span className="text-[10px] text-muted-foreground flex items-center gap-1">
            <Clock className="h-3 w-3" />
            {timeAgo}
          </span>

          {notification.actionLabel && (
            <Button
              variant="link"
              size="sm"
              className="h-auto p-0 text-xs"
              onClick={(e) => {
                e.stopPropagation();
                notification.onAction?.();
              }}
            >
              {notification.actionLabel}
            </Button>
          )}
        </div>
      </div>

      {/* Unread indicator */}
      {!read && (
        <span className="absolute left-1 top-1/2 -translate-y-1/2 h-2 w-2 rounded-full bg-primary" />
      )}
    </motion.div>
  );
}

// =============================================================================
// NOTIFICATION CENTER
// =============================================================================

export function NotificationCenter({
  notifications,
  onMarkAsRead,
  onMarkAllAsRead,
  onDelete,
  onClearAll,
  onNotificationClick,
  className,
}: NotificationCenterProps) {
  const [activeTab, setActiveTab] = React.useState<NotificationCategory>('all');
  const [isOpen, setIsOpen] = React.useState(false);

  const unreadCount = notifications.filter((n) => !n.read).length;

  const filteredNotifications = React.useMemo(() => {
    if (activeTab === 'all') return notifications;
    return notifications.filter((n) => n.category === activeTab);
  }, [notifications, activeTab]);

  const getCategoryCount = (category: NotificationCategory) => {
    if (category === 'all') {
      return notifications.filter((n) => !n.read).length;
    }
    return notifications.filter((n) => n.category === category && !n.read).length;
  };

  return (
    <Popover open={isOpen} onOpenChange={setIsOpen}>
      <PopoverTrigger asChild>
        <NotificationBell unreadCount={unreadCount} className={className} />
      </PopoverTrigger>

      <PopoverContent align="end" className="w-[400px] p-0">
        {/* Header */}
        <div className="flex items-center justify-between px-4 py-3 border-b">
          <div className="flex items-center gap-2">
            <h3 className="font-semibold">Notificações</h3>
            {unreadCount > 0 && (
              <Badge variant="secondary" className="text-[10px]">
                {unreadCount} não lidas
              </Badge>
            )}
          </div>

          <div className="flex items-center gap-1">
            {unreadCount > 0 && (
              <Button
                variant="ghost"
                size="sm"
                className="h-7 text-xs"
                onClick={onMarkAllAsRead}
              >
                <CheckCheck className="h-3.5 w-3.5 mr-1" />
                Marcar todas
              </Button>
            )}
          </div>
        </div>

        {/* Tabs */}
        <Tabs value={activeTab} onValueChange={(v) => setActiveTab(v as NotificationCategory)}>
          <TabsList className="w-full justify-start rounded-none border-b bg-transparent h-9 px-2">
            <TabsTrigger value="all" className="text-xs h-7 px-2">
              Todas
              {getCategoryCount('all') > 0 && (
                <Badge variant="secondary" className="ml-1 h-4 px-1 text-[9px]">
                  {getCategoryCount('all')}
                </Badge>
              )}
            </TabsTrigger>
            <TabsTrigger value="payments" className="text-xs h-7 px-2">
              <DollarSign className="h-3 w-3 mr-1" />
              Pagamentos
            </TabsTrigger>
            <TabsTrigger value="alerts" className="text-xs h-7 px-2">
              <AlertTriangle className="h-3 w-3 mr-1" />
              Alertas
            </TabsTrigger>
            <TabsTrigger value="system" className="text-xs h-7 px-2">
              <Settings className="h-3 w-3 mr-1" />
              Sistema
            </TabsTrigger>
          </TabsList>

          <TabsContent value={activeTab} className="m-0">
            <ScrollArea className="h-[400px]">
              <AnimatePresence mode="popLayout">
                {filteredNotifications.length === 0 ? (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="flex flex-col items-center justify-center py-12 text-center"
                  >
                    <div className="h-12 w-12 rounded-full bg-muted flex items-center justify-center mb-3">
                      <Bell className="h-6 w-6 text-muted-foreground" />
                    </div>
                    <p className="text-sm font-medium">Nenhuma notificação</p>
                    <p className="text-xs text-muted-foreground mt-1">
                      Você está em dia!
                    </p>
                  </motion.div>
                ) : (
                  <div className="relative">
                    {filteredNotifications.map((notification) => (
                      <NotificationItem
                        key={notification.id}
                        notification={notification}
                        onMarkAsRead={onMarkAsRead}
                        onDelete={onDelete}
                        onClick={onNotificationClick}
                      />
                    ))}
                  </div>
                )}
              </AnimatePresence>
            </ScrollArea>
          </TabsContent>
        </Tabs>

        {/* Footer */}
        {notifications.length > 0 && (
          <div className="flex items-center justify-between px-4 py-2 border-t bg-muted/50">
            <Button
              variant="ghost"
              size="sm"
              className="h-7 text-xs text-destructive hover:text-destructive"
              onClick={onClearAll}
            >
              <Trash2 className="h-3.5 w-3.5 mr-1" />
              Limpar todas
            </Button>

            <Button variant="ghost" size="sm" className="h-7 text-xs">
              <Settings className="h-3.5 w-3.5 mr-1" />
              Configurações
            </Button>
          </div>
        )}
      </PopoverContent>
    </Popover>
  );
}

// =============================================================================
// NOTIFICATION CONTEXT
// =============================================================================

interface NotificationContextValue {
  notifications: Notification[];
  addNotification: (notification: Omit<Notification, 'id' | 'timestamp' | 'read'>) => void;
  removeNotification: (id: string) => void;
  markAsRead: (id: string) => void;
  markAllAsRead: () => void;
  clearAll: () => void;
  unreadCount: number;
}

const NotificationContext = React.createContext<NotificationContextValue | null>(null);

export function NotificationProvider({ children }: { children: React.ReactNode }) {
  const [notifications, setNotifications] = React.useState<Notification[]>([]);

  const addNotification = React.useCallback(
    (notification: Omit<Notification, 'id' | 'timestamp' | 'read'>) => {
      const newNotification: Notification = {
        ...notification,
        id: crypto.randomUUID(),
        timestamp: new Date(),
        read: false,
      };
      setNotifications((prev) => [newNotification, ...prev]);
    },
    []
  );

  const removeNotification = React.useCallback((id: string) => {
    setNotifications((prev) => prev.filter((n) => n.id !== id));
  }, []);

  const markAsRead = React.useCallback((id: string) => {
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, read: true } : n))
    );
  }, []);

  const markAllAsRead = React.useCallback(() => {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
  }, []);

  const clearAll = React.useCallback(() => {
    setNotifications([]);
  }, []);

  const unreadCount = notifications.filter((n) => !n.read).length;

  return (
    <NotificationContext.Provider
      value={{
        notifications,
        addNotification,
        removeNotification,
        markAsRead,
        markAllAsRead,
        clearAll,
        unreadCount,
      }}
    >
      {children}
    </NotificationContext.Provider>
  );
}

export function useNotifications() {
  const context = React.useContext(NotificationContext);
  if (!context) {
    throw new Error('useNotifications must be used within a NotificationProvider');
  }
  return context;
}

// =============================================================================
// QUICK NOTIFICATION HELPERS
// =============================================================================

export function useNotify() {
  const { addNotification } = useNotifications();

  return React.useMemo(
    () => ({
      info: (title: string, message: string, options?: Partial<Notification>) =>
        addNotification({ type: 'info', category: 'system', title, message, ...options }),
      success: (title: string, message: string, options?: Partial<Notification>) =>
        addNotification({ type: 'success', category: 'system', title, message, ...options }),
      warning: (title: string, message: string, options?: Partial<Notification>) =>
        addNotification({ type: 'warning', category: 'alerts', title, message, ...options }),
      error: (title: string, message: string, options?: Partial<Notification>) =>
        addNotification({ type: 'error', category: 'alerts', title, message, ...options }),
      payment: (title: string, message: string, options?: Partial<Notification>) =>
        addNotification({ type: 'info', category: 'payments', title, message, icon: DollarSign, ...options }),
    }),
    [addNotification]
  );
}
