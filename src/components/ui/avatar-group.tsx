import * as React from 'react';
import { motion } from 'framer-motion';
import { Plus, User } from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { cn } from '@/lib/utils';

// =============================================================================
// TYPES
// =============================================================================

export interface AvatarUser {
  id: string;
  name: string;
  avatar?: string;
  email?: string;
  status?: 'online' | 'offline' | 'busy' | 'away';
}

export interface AvatarGroupProps {
  /** Lista de usuários */
  users: AvatarUser[];
  /** Máximo de avatars visíveis */
  max?: number;
  /** Tamanho dos avatars */
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
  /** Espaçamento entre avatars */
  spacing?: 'tight' | 'normal' | 'loose';
  /** Mostrar tooltip com nomes */
  showTooltip?: boolean;
  /** Callback ao clicar em avatar */
  onAvatarClick?: (user: AvatarUser) => void;
  /** Botão de adicionar */
  onAdd?: () => void;
  /** Mostrar indicador de status */
  showStatus?: boolean;
  /** Classes adicionais */
  className?: string;
}

// =============================================================================
// AVATAR GROUP
// =============================================================================

export function AvatarGroup({
  users,
  max = 5,
  size = 'md',
  spacing = 'normal',
  showTooltip = true,
  onAvatarClick,
  onAdd,
  showStatus = false,
  className,
}: AvatarGroupProps) {
  const visibleUsers = users.slice(0, max);
  const remainingCount = users.length - max;
  const hasOverflow = remainingCount > 0;

  // Size classes
  const sizeClasses = {
    xs: { avatar: 'h-6 w-6', text: 'text-[9px]', status: 'h-1.5 w-1.5' },
    sm: { avatar: 'h-8 w-8', text: 'text-[10px]', status: 'h-2 w-2' },
    md: { avatar: 'h-10 w-10', text: 'text-xs', status: 'h-2.5 w-2.5' },
    lg: { avatar: 'h-12 w-12', text: 'text-sm', status: 'h-3 w-3' },
    xl: { avatar: 'h-14 w-14', text: 'text-base', status: 'h-3.5 w-3.5' },
  };

  const spacingClasses = {
    tight: '-space-x-3',
    normal: '-space-x-2',
    loose: '-space-x-1',
  };

  const statusColors = {
    online: 'bg-success',
    offline: 'bg-muted-foreground',
    busy: 'bg-destructive',
    away: 'bg-warning',
  };

  const sizes = sizeClasses[size];

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map((n) => n[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  const renderAvatar = (user: AvatarUser, index: number) => {
    const avatar = (
      <motion.div
        key={user.id}
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: index * 0.05 }}
        className="relative"
      >
        <Avatar
          className={cn(
            sizes.avatar,
            'ring-2 ring-background',
            onAvatarClick && 'cursor-pointer hover:ring-primary transition-all'
          )}
          onClick={() => onAvatarClick?.(user)}
        >
          <AvatarImage src={user.avatar} alt={user.name} />
          <AvatarFallback className={sizes.text}>{getInitials(user.name)}</AvatarFallback>
        </Avatar>

        {/* Status indicator */}
        {showStatus && user.status && (
          <span
            className={cn(
              'absolute bottom-0 right-0 rounded-full ring-2 ring-background',
              statusColors[user.status],
              sizes.status
            )}
          />
        )}
      </motion.div>
    );

    if (showTooltip) {
      return (
        <Tooltip key={user.id}>
          <TooltipTrigger asChild>{avatar}</TooltipTrigger>
          <TooltipContent>
            <p className="font-medium">{user.name}</p>
            {user.email && <p className="text-xs text-muted-foreground">{user.email}</p>}
          </TooltipContent>
        </Tooltip>
      );
    }

    return avatar;
  };

  return (
    <div className={cn('flex items-center', spacingClasses[spacing], className)}>
      {visibleUsers.map((user, index) => renderAvatar(user, index))}

      {/* Overflow count */}
      {hasOverflow && (
        <Popover>
          <PopoverTrigger asChild>
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: max * 0.05 }}
            >
              <Avatar
                className={cn(
                  sizes.avatar,
                  'ring-2 ring-background cursor-pointer bg-muted hover:bg-muted/80 transition-colors'
                )}
              >
                <AvatarFallback className={cn(sizes.text, 'bg-muted text-muted-foreground')}>
                  +{remainingCount}
                </AvatarFallback>
              </Avatar>
            </motion.div>
          </PopoverTrigger>
          <PopoverContent className="w-64 p-2">
            <p className="text-xs font-medium text-muted-foreground px-2 py-1">
              +{remainingCount} mais
            </p>
            <div className="space-y-1 mt-1">
              {users.slice(max).map((user) => (
                <button
                  key={user.id}
                  className="w-full flex items-center gap-2 px-2 py-1.5 rounded-md hover:bg-muted transition-colors"
                  onClick={() => onAvatarClick?.(user)}
                >
                  <Avatar className="h-6 w-6">
                    <AvatarImage src={user.avatar} alt={user.name} />
                    <AvatarFallback className="text-[9px]">
                      {getInitials(user.name)}
                    </AvatarFallback>
                  </Avatar>
                  <span className="text-sm">{user.name}</span>
                </button>
              ))}
            </div>
          </PopoverContent>
        </Popover>
      )}

      {/* Add button */}
      {onAdd && (
        <Tooltip>
          <TooltipTrigger asChild>
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: (max + (hasOverflow ? 1 : 0)) * 0.05 }}
            >
              <Button
                variant="outline"
                size="icon"
                className={cn(sizes.avatar, 'rounded-full ring-2 ring-background')}
                onClick={onAdd}
              >
                <Plus className="h-4 w-4" />
              </Button>
            </motion.div>
          </TooltipTrigger>
          <TooltipContent>Adicionar</TooltipContent>
        </Tooltip>
      )}
    </div>
  );
}

// =============================================================================
// SINGLE AVATAR WITH BADGE
// =============================================================================

export function AvatarWithBadge({
  user,
  badge,
  badgePosition = 'bottom-right',
  size = 'md',
  className,
}: {
  user: AvatarUser;
  badge?: React.ReactNode;
  badgePosition?: 'top-right' | 'top-left' | 'bottom-right' | 'bottom-left';
  size?: 'sm' | 'md' | 'lg' | 'xl';
  className?: string;
}) {
  const sizeClasses = {
    sm: 'h-8 w-8',
    md: 'h-10 w-10',
    lg: 'h-12 w-12',
    xl: 'h-16 w-16',
  };

  const badgePositions = {
    'top-right': '-top-1 -right-1',
    'top-left': '-top-1 -left-1',
    'bottom-right': '-bottom-1 -right-1',
    'bottom-left': '-bottom-1 -left-1',
  };

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map((n) => n[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  return (
    <div className={cn('relative inline-block', className)}>
      <Avatar className={sizeClasses[size]}>
        <AvatarImage src={user.avatar} alt={user.name} />
        <AvatarFallback>{getInitials(user.name)}</AvatarFallback>
      </Avatar>

      {badge && (
        <div className={cn('absolute', badgePositions[badgePosition])}>{badge}</div>
      )}
    </div>
  );
}

// =============================================================================
// USER LIST ITEM
// =============================================================================

export function UserListItem({
  user,
  subtitle,
  action,
  selected,
  onClick,
  className,
}: {
  user: AvatarUser;
  subtitle?: string;
  action?: React.ReactNode;
  selected?: boolean;
  onClick?: () => void;
  className?: string;
}) {
  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map((n) => n[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  const statusColors = {
    online: 'bg-success',
    offline: 'bg-muted-foreground',
    busy: 'bg-destructive',
    away: 'bg-warning',
  };

  return (
    <div
      className={cn(
        'flex items-center gap-3 p-2 rounded-lg transition-colors',
        onClick && 'cursor-pointer hover:bg-muted',
        selected && 'bg-primary/10',
        className
      )}
      onClick={onClick}
    >
      <div className="relative">
        <Avatar className="h-10 w-10">
          <AvatarImage src={user.avatar} alt={user.name} />
          <AvatarFallback>{getInitials(user.name)}</AvatarFallback>
        </Avatar>
        {user.status && (
          <span
            className={cn(
              'absolute bottom-0 right-0 h-2.5 w-2.5 rounded-full ring-2 ring-background',
              statusColors[user.status]
            )}
          />
        )}
      </div>

      <div className="flex-1 min-w-0">
        <p className="text-sm font-medium truncate">{user.name}</p>
        {(subtitle || user.email) && (
          <p className="text-xs text-muted-foreground truncate">
            {subtitle || user.email}
          </p>
        )}
      </div>

      {action && <div className="shrink-0">{action}</div>}
    </div>
  );
}

// =============================================================================
// USER SELECT
// =============================================================================

export function UserSelect({
  users,
  value,
  onChange,
  placeholder = 'Selecionar usuário',
  multiple = false,
  className,
}: {
  users: AvatarUser[];
  value?: string | string[];
  onChange?: (value: string | string[]) => void;
  placeholder?: string;
  multiple?: boolean;
  className?: string;
}) {
  const [isOpen, setIsOpen] = React.useState(false);
  const [searchQuery, setSearchQuery] = React.useState('');

  const selectedUsers = React.useMemo(() => {
    if (!value) return [];
    const ids = Array.isArray(value) ? value : [value];
    return users.filter((u) => ids.includes(u.id));
  }, [users, value]);

  const filteredUsers = React.useMemo(() => {
    if (!searchQuery) return users;
    const query = searchQuery.toLowerCase();
    return users.filter(
      (u) =>
        u.name.toLowerCase().includes(query) ||
        u.email?.toLowerCase().includes(query)
    );
  }, [users, searchQuery]);

  const handleSelect = (user: AvatarUser) => {
    if (multiple) {
      const currentIds = Array.isArray(value) ? value : [];
      if (currentIds.includes(user.id)) {
        onChange?.(currentIds.filter((id) => id !== user.id));
      } else {
        onChange?.([...currentIds, user.id]);
      }
    } else {
      onChange?.(user.id);
      setIsOpen(false);
    }
  };

  const isSelected = (userId: string) => {
    if (!value) return false;
    return Array.isArray(value) ? value.includes(userId) : value === userId;
  };

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map((n) => n[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  return (
    <Popover open={isOpen} onOpenChange={setIsOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={isOpen}
          className={cn('w-full justify-start', className)}
        >
          {selectedUsers.length > 0 ? (
            <div className="flex items-center gap-2">
              {selectedUsers.length === 1 ? (
                <>
                  <Avatar className="h-5 w-5">
                    <AvatarImage src={selectedUsers[0].avatar} />
                    <AvatarFallback className="text-[8px]">
                      {getInitials(selectedUsers[0].name)}
                    </AvatarFallback>
                  </Avatar>
                  <span>{selectedUsers[0].name}</span>
                </>
              ) : (
                <>
                  <AvatarGroup users={selectedUsers} max={3} size="xs" showTooltip={false} />
                  <span>{selectedUsers.length} selecionados</span>
                </>
              )}
            </div>
          ) : (
            <div className="flex items-center gap-2 text-muted-foreground">
              <User className="h-4 w-4" />
              {placeholder}
            </div>
          )}
        </Button>
      </PopoverTrigger>

      <PopoverContent className="w-64 p-2">
        <input
          type="text"
          placeholder="Buscar..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full px-3 py-2 text-sm border rounded-md mb-2 focus:outline-none focus:ring-2 focus:ring-primary"
        />

        <div className="max-h-60 overflow-y-auto space-y-1">
          {filteredUsers.length === 0 ? (
            <p className="text-sm text-muted-foreground text-center py-4">
              Nenhum usuário encontrado
            </p>
          ) : (
            filteredUsers.map((user) => (
              <UserListItem
                key={user.id}
                user={user}
                selected={isSelected(user.id)}
                onClick={() => handleSelect(user)}
              />
            ))
          )}
        </div>
      </PopoverContent>
    </Popover>
  );
}
