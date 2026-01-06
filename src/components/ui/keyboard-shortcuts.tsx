import * as React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Keyboard, Command, Search, X } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { cn } from '@/lib/utils';

// =============================================================================
// TYPES
// =============================================================================

export interface KeyboardShortcut {
  id: string;
  keys: string[];
  description: string;
  category: string;
  action?: () => void;
}

export interface ShortcutCategory {
  id: string;
  label: string;
  shortcuts: KeyboardShortcut[];
}

// =============================================================================
// DEFAULT SHORTCUTS
// =============================================================================

export const defaultShortcuts: ShortcutCategory[] = [
  {
    id: 'navigation',
    label: 'Navegação',
    shortcuts: [
      { id: 'cmd-k', keys: ['⌘', 'K'], description: 'Abrir busca rápida', category: 'navigation' },
      { id: 'g-d', keys: ['G', 'D'], description: 'Ir para Dashboard', category: 'navigation' },
      { id: 'g-p', keys: ['G', 'P'], description: 'Ir para Contas a Pagar', category: 'navigation' },
      { id: 'g-r', keys: ['G', 'R'], description: 'Ir para Contas a Receber', category: 'navigation' },
      { id: 'g-c', keys: ['G', 'C'], description: 'Ir para Clientes', category: 'navigation' },
      { id: 'g-f', keys: ['G', 'F'], description: 'Ir para Fornecedores', category: 'navigation' },
    ],
  },
  {
    id: 'actions',
    label: 'Ações',
    shortcuts: [
      { id: 'n', keys: ['N'], description: 'Novo registro', category: 'actions' },
      { id: 'e', keys: ['E'], description: 'Editar registro selecionado', category: 'actions' },
      { id: 'del', keys: ['Del'], description: 'Excluir registro selecionado', category: 'actions' },
      { id: 'cmd-s', keys: ['⌘', 'S'], description: 'Salvar', category: 'actions' },
      { id: 'cmd-enter', keys: ['⌘', 'Enter'], description: 'Salvar e fechar', category: 'actions' },
      { id: 'esc', keys: ['Esc'], description: 'Cancelar / Fechar', category: 'actions' },
    ],
  },
  {
    id: 'table',
    label: 'Tabela',
    shortcuts: [
      { id: 'up', keys: ['↑'], description: 'Linha anterior', category: 'table' },
      { id: 'down', keys: ['↓'], description: 'Próxima linha', category: 'table' },
      { id: 'space', keys: ['Space'], description: 'Selecionar linha', category: 'table' },
      { id: 'cmd-a', keys: ['⌘', 'A'], description: 'Selecionar tudo', category: 'table' },
      { id: 'cmd-shift-a', keys: ['⌘', '⇧', 'A'], description: 'Desselecionar tudo', category: 'table' },
    ],
  },
  {
    id: 'view',
    label: 'Visualização',
    shortcuts: [
      { id: 'cmd-plus', keys: ['⌘', '+'], description: 'Aumentar zoom', category: 'view' },
      { id: 'cmd-minus', keys: ['⌘', '-'], description: 'Diminuir zoom', category: 'view' },
      { id: 'cmd-0', keys: ['⌘', '0'], description: 'Zoom padrão', category: 'view' },
      { id: 'f11', keys: ['F11'], description: 'Tela cheia', category: 'view' },
      { id: 'cmd-b', keys: ['⌘', 'B'], description: 'Recolher sidebar', category: 'view' },
    ],
  },
  {
    id: 'help',
    label: 'Ajuda',
    shortcuts: [
      { id: 'question', keys: ['?'], description: 'Mostrar atalhos', category: 'help' },
      { id: 'f1', keys: ['F1'], description: 'Abrir ajuda', category: 'help' },
    ],
  },
];

// =============================================================================
// KEYBOARD KEY COMPONENT
// =============================================================================

export function KeyboardKey({
  children,
  size = 'md',
  className,
}: {
  children: React.ReactNode;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}) {
  const sizeClasses = {
    sm: 'min-w-[18px] h-5 px-1 text-[9px]',
    md: 'min-w-[24px] h-6 px-1.5 text-[10px]',
    lg: 'min-w-[32px] h-8 px-2 text-xs',
  };

  return (
    <kbd
      className={cn(
        'inline-flex items-center justify-center font-mono font-medium',
        'bg-muted border border-border rounded shadow-sm',
        'text-muted-foreground',
        sizeClasses[size],
        className
      )}
    >
      {children}
    </kbd>
  );
}

// =============================================================================
// SHORTCUT KEYS DISPLAY
// =============================================================================

export function ShortcutKeys({
  keys,
  size = 'md',
  className,
}: {
  keys: string[];
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}) {
  return (
    <div className={cn('flex items-center gap-1', className)}>
      {keys.map((key, index) => (
        <React.Fragment key={index}>
          <KeyboardKey size={size}>{key}</KeyboardKey>
          {index < keys.length - 1 && <span className="text-muted-foreground text-xs">+</span>}
        </React.Fragment>
      ))}
    </div>
  );
}

// =============================================================================
// SHORTCUTS DIALOG
// =============================================================================

export function KeyboardShortcutsDialog({
  shortcuts = defaultShortcuts,
  trigger,
  open,
  onOpenChange,
}: {
  shortcuts?: ShortcutCategory[];
  trigger?: React.ReactNode;
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
}) {
  const [searchQuery, setSearchQuery] = React.useState('');

  const filteredCategories = React.useMemo(() => {
    if (!searchQuery) return shortcuts;

    const query = searchQuery.toLowerCase();
    return shortcuts
      .map((category) => ({
        ...category,
        shortcuts: category.shortcuts.filter(
          (shortcut) =>
            shortcut.description.toLowerCase().includes(query) ||
            shortcut.keys.join(' ').toLowerCase().includes(query)
        ),
      }))
      .filter((category) => category.shortcuts.length > 0);
  }, [shortcuts, searchQuery]);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      {trigger && <DialogTrigger asChild>{trigger}</DialogTrigger>}
      <DialogContent className="max-w-2xl max-h-[80vh] p-0">
        <DialogHeader className="p-4 pb-2 border-b">
          <DialogTitle className="flex items-center gap-2">
            <Keyboard className="h-5 w-5" />
            Atalhos de Teclado
          </DialogTitle>
          <div className="relative mt-2">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Buscar atalho..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-9"
            />
            {searchQuery && (
              <Button
                variant="ghost"
                size="icon"
                className="absolute right-1 top-1/2 -translate-y-1/2 h-7 w-7"
                onClick={() => setSearchQuery('')}
              >
                <X className="h-4 w-4" />
              </Button>
            )}
          </div>
        </DialogHeader>

        <ScrollArea className="max-h-[60vh]">
          <div className="p-4 space-y-6">
            {filteredCategories.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">
                <Keyboard className="h-8 w-8 mx-auto mb-2 opacity-50" />
                <p>Nenhum atalho encontrado</p>
              </div>
            ) : (
              filteredCategories.map((category) => (
                <div key={category.id}>
                  <h3 className="text-sm font-semibold text-muted-foreground mb-3">
                    {category.label}
                  </h3>
                  <div className="space-y-2">
                    {category.shortcuts.map((shortcut) => (
                      <motion.div
                        key={shortcut.id}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="flex items-center justify-between py-2 px-3 rounded-lg hover:bg-muted/50 transition-colors"
                      >
                        <span className="text-sm">{shortcut.description}</span>
                        <ShortcutKeys keys={shortcut.keys} size="sm" />
                      </motion.div>
                    ))}
                  </div>
                </div>
              ))
            )}
          </div>
        </ScrollArea>

        <div className="p-3 border-t bg-muted/50 text-center">
          <p className="text-xs text-muted-foreground">
            Pressione <KeyboardKey size="sm">?</KeyboardKey> a qualquer momento para ver esta lista
          </p>
        </div>
      </DialogContent>
    </Dialog>
  );
}

// =============================================================================
// USE KEYBOARD SHORTCUTS HOOK
// =============================================================================

interface UseKeyboardShortcutsOptions {
  shortcuts: Array<{
    keys: string[];
    action: () => void;
    enabled?: boolean;
  }>;
  enabled?: boolean;
}

export function useKeyboardShortcuts({
  shortcuts,
  enabled = true,
}: UseKeyboardShortcutsOptions) {
  React.useEffect(() => {
    if (!enabled) return;

    const pressedKeys = new Set<string>();

    const normalizeKey = (key: string): string => {
      const keyMap: Record<string, string> = {
        '⌘': 'Meta',
        'Cmd': 'Meta',
        'Command': 'Meta',
        'Ctrl': 'Control',
        '⇧': 'Shift',
        'Alt': 'Alt',
        '⌥': 'Alt',
        'Option': 'Alt',
        'Enter': 'Enter',
        'Esc': 'Escape',
        'Space': ' ',
        'Del': 'Delete',
        'Backspace': 'Backspace',
        'Tab': 'Tab',
        '↑': 'ArrowUp',
        '↓': 'ArrowDown',
        '←': 'ArrowLeft',
        '→': 'ArrowRight',
      };
      return keyMap[key] || key.toUpperCase();
    };

    const checkShortcut = (shortcutKeys: string[]): boolean => {
      const normalizedShortcut = shortcutKeys.map(normalizeKey);
      if (normalizedShortcut.length !== pressedKeys.size) return false;
      return normalizedShortcut.every((key) =>
        pressedKeys.has(key) || pressedKeys.has(key.toLowerCase())
      );
    };

    const handleKeyDown = (e: KeyboardEvent) => {
      // Don't trigger in input fields
      const target = e.target as HTMLElement;
      if (
        target.tagName === 'INPUT' ||
        target.tagName === 'TEXTAREA' ||
        target.isContentEditable
      ) {
        return;
      }

      pressedKeys.add(e.key);

      for (const shortcut of shortcuts) {
        if (shortcut.enabled === false) continue;
        if (checkShortcut(shortcut.keys)) {
          e.preventDefault();
          shortcut.action();
          break;
        }
      }
    };

    const handleKeyUp = (e: KeyboardEvent) => {
      pressedKeys.delete(e.key);
    };

    const handleBlur = () => {
      pressedKeys.clear();
    };

    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);
    window.addEventListener('blur', handleBlur);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
      window.removeEventListener('blur', handleBlur);
    };
  }, [shortcuts, enabled]);
}

// =============================================================================
// SHORTCUT HINT INLINE
// =============================================================================

export function ShortcutHint({
  keys,
  className,
}: {
  keys: string[];
  className?: string;
}) {
  return (
    <span className={cn('hidden sm:inline-flex items-center gap-0.5 ml-auto opacity-60', className)}>
      {keys.map((key, index) => (
        <KeyboardKey key={index} size="sm">
          {key}
        </KeyboardKey>
      ))}
    </span>
  );
}

// =============================================================================
// SHORTCUT HELP BUTTON (Floating)
// =============================================================================

export function ShortcutHelpButton({
  shortcuts = defaultShortcuts,
  className,
}: {
  shortcuts?: ShortcutCategory[];
  className?: string;
}) {
  const [isOpen, setIsOpen] = React.useState(false);

  // Listen for ? key
  React.useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (
        e.key === '?' &&
        !(e.target as HTMLElement).matches('input, textarea, [contenteditable]')
      ) {
        e.preventDefault();
        setIsOpen(true);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  return (
    <KeyboardShortcutsDialog
      shortcuts={shortcuts}
      open={isOpen}
      onOpenChange={setIsOpen}
      trigger={
        <Button
          variant="outline"
          size="icon"
          className={cn('h-8 w-8 rounded-full', className)}
        >
          <Keyboard className="h-4 w-4" />
        </Button>
      }
    />
  );
}
