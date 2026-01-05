import * as React from 'react';
import { useNavigate } from 'react-router-dom';
import {
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
  CommandShortcut,
} from '@/components/ui/command';
import {
  LayoutDashboard,
  ArrowDownCircle,
  ArrowUpCircle,
  Users,
  Truck,
  Building2,
  FileText,
  Settings,
  PlusCircle,
  Search,
  Calculator,
  BarChart3,
  RefreshCcw,
  Receipt,
  CreditCard,
  Bell,
  Shield,
  Bot,
  Scale,
  Landmark,
  PieChart,
  ShieldCheck,
  ScrollText,
  Zap,
  FileSpreadsheet,
  Moon,
  Sun,
  Monitor,
  LogOut,
  type LucideIcon,
} from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { useTheme } from '@/components/theme/ThemeProvider';
import { toast } from 'sonner';

// =============================================================================
// TYPES
// =============================================================================

interface CommandItem {
  id: string;
  label: string;
  icon: LucideIcon;
  shortcut?: string;
  href?: string;
  action?: () => void;
  keywords?: string[];
}

interface CommandGroup {
  heading: string;
  items: CommandItem[];
}

// =============================================================================
// COMMAND DATA
// =============================================================================

const navigationCommands: CommandItem[] = [
  { id: 'nav-dashboard', label: 'Dashboard Principal', icon: LayoutDashboard, href: '/', keywords: ['home', 'início'] },
  { id: 'nav-bi', label: 'BI Gestão', icon: BarChart3, href: '/bi', keywords: ['analytics', 'relatórios'] },
  { id: 'nav-dashboard-empresa', label: 'Dashboard Empresa', icon: Building2, href: '/dashboard-empresa' },
  { id: 'nav-dashboard-receber', label: 'Dashboard Recebíveis', icon: ArrowDownCircle, href: '/dashboard-receber' },
  { id: 'nav-expert', label: 'EXPERT (IA)', icon: Bot, href: '/expert', keywords: ['inteligência', 'ai'] },
  { id: 'nav-contas-receber', label: 'Contas a Receber', icon: ArrowDownCircle, href: '/contas-receber', shortcut: 'G R' },
  { id: 'nav-contas-pagar', label: 'Contas a Pagar', icon: ArrowUpCircle, href: '/contas-pagar', shortcut: 'G P' },
  { id: 'nav-boletos', label: 'Boletos', icon: CreditCard, href: '/boletos' },
  { id: 'nav-fluxo-caixa', label: 'Fluxo de Caixa', icon: BarChart3, href: '/fluxo-caixa', shortcut: 'G F' },
  { id: 'nav-conciliacao', label: 'Conciliação Bancária', icon: RefreshCcw, href: '/conciliacao' },
  { id: 'nav-cobrancas', label: 'Cobrança', icon: Receipt, href: '/cobrancas' },
  { id: 'nav-notas-fiscais', label: 'Notas Fiscais', icon: FileText, href: '/notas-fiscais' },
  { id: 'nav-relatorios', label: 'Relatórios', icon: FileText, href: '/relatorios' },
  { id: 'nav-demonstrativos', label: 'Demonstrativos', icon: FileSpreadsheet, href: '/demonstrativos' },
  { id: 'nav-reforma-tributaria', label: 'Reforma Tributária', icon: Scale, href: '/reforma-tributaria' },
  { id: 'nav-clientes', label: 'Clientes', icon: Users, href: '/clientes' },
  { id: 'nav-fornecedores', label: 'Fornecedores', icon: Truck, href: '/fornecedores' },
  { id: 'nav-empresas', label: 'Empresas (CNPJs)', icon: Building2, href: '/empresas' },
  { id: 'nav-contas-bancarias', label: 'Contas Bancárias', icon: Landmark, href: '/contas-bancarias' },
  { id: 'nav-centro-custos', label: 'Centro de Custos', icon: PieChart, href: '/centro-custos' },
  { id: 'nav-aprovacoes', label: 'Aprovações', icon: ShieldCheck, href: '/aprovacoes' },
  { id: 'nav-usuarios', label: 'Usuários', icon: Users, href: '/usuarios' },
  { id: 'nav-audit-logs', label: 'Logs de Auditoria', icon: ScrollText, href: '/audit-logs' },
  { id: 'nav-bitrix24', label: 'Bitrix24', icon: Zap, href: '/bitrix24' },
  { id: 'nav-seguranca', label: 'Segurança', icon: Shield, href: '/seguranca' },
  { id: 'nav-alertas', label: 'Alertas', icon: Bell, href: '/alertas' },
  { id: 'nav-configuracoes', label: 'Configurações', icon: Settings, href: '/configuracoes' },
];

// =============================================================================
// COMPONENT
// =============================================================================

export function CommandPalette() {
  const [open, setOpen] = React.useState(false);
  const navigate = useNavigate();
  const { signOut } = useAuth();
  const { theme, setTheme } = useTheme();

  // Keyboard shortcut to open
  React.useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (e.key === 'k' && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        setOpen((open) => !open);
      }
    };

    document.addEventListener('keydown', down);
    return () => document.removeEventListener('keydown', down);
  }, []);

  const runCommand = React.useCallback((command: () => void) => {
    setOpen(false);
    command();
  }, []);

  // Action commands (dynamic based on context)
  const actionCommands: CommandItem[] = React.useMemo(() => [
    {
      id: 'action-new-pagar',
      label: 'Nova Conta a Pagar',
      icon: PlusCircle,
      action: () => {
        navigate('/contas-pagar');
        toast.info('Abra o formulário de nova conta a pagar');
      },
      keywords: ['criar', 'adicionar', 'despesa'],
    },
    {
      id: 'action-new-receber',
      label: 'Nova Conta a Receber',
      icon: PlusCircle,
      action: () => {
        navigate('/contas-receber');
        toast.info('Abra o formulário de nova conta a receber');
      },
      keywords: ['criar', 'adicionar', 'receita'],
    },
    {
      id: 'action-new-cliente',
      label: 'Novo Cliente',
      icon: PlusCircle,
      action: () => {
        navigate('/clientes');
        toast.info('Abra o formulário de novo cliente');
      },
      keywords: ['criar', 'adicionar'],
    },
    {
      id: 'action-new-fornecedor',
      label: 'Novo Fornecedor',
      icon: PlusCircle,
      action: () => {
        navigate('/fornecedores');
        toast.info('Abra o formulário de novo fornecedor');
      },
      keywords: ['criar', 'adicionar'],
    },
    {
      id: 'action-importar-extrato',
      label: 'Importar Extrato Bancário',
      icon: RefreshCcw,
      action: () => {
        navigate('/conciliacao');
        toast.info('Acesse a conciliação para importar extrato');
      },
      keywords: ['ofx', 'banco', 'upload'],
    },
  ], [navigate]);

  // Theme commands
  const themeCommands: CommandItem[] = React.useMemo(() => [
    {
      id: 'theme-light',
      label: 'Tema Claro',
      icon: Sun,
      action: () => setTheme('light'),
      keywords: ['light', 'branco'],
    },
    {
      id: 'theme-dark',
      label: 'Tema Escuro',
      icon: Moon,
      action: () => setTheme('dark'),
      keywords: ['dark', 'preto', 'noite'],
    },
    {
      id: 'theme-system',
      label: 'Tema do Sistema',
      icon: Monitor,
      action: () => setTheme('system'),
      keywords: ['automático', 'auto'],
    },
  ], [setTheme]);

  // System commands
  const systemCommands: CommandItem[] = React.useMemo(() => [
    {
      id: 'system-logout',
      label: 'Sair do Sistema',
      icon: LogOut,
      action: async () => {
        await signOut();
        navigate('/auth');
        toast.success('Você saiu do sistema');
      },
      keywords: ['logout', 'desconectar'],
    },
  ], [signOut, navigate]);

  return (
    <CommandDialog open={open} onOpenChange={setOpen}>
      <CommandInput placeholder="Buscar páginas, ações, configurações..." />
      <CommandList>
        <CommandEmpty>
          <div className="py-6 text-center">
            <Search className="mx-auto h-10 w-10 text-muted-foreground/50 mb-3" />
            <p className="text-sm text-muted-foreground">Nenhum resultado encontrado.</p>
            <p className="text-xs text-muted-foreground mt-1">
              Tente buscar por páginas, ações ou configurações.
            </p>
          </div>
        </CommandEmpty>

        {/* Quick Actions */}
        <CommandGroup heading="Ações Rápidas">
          {actionCommands.map((item) => (
            <CommandItem
              key={item.id}
              value={`${item.label} ${item.keywords?.join(' ') || ''}`}
              onSelect={() => runCommand(() => item.action?.())}
            >
              <item.icon className="mr-2 h-4 w-4" />
              <span>{item.label}</span>
              {item.shortcut && <CommandShortcut>{item.shortcut}</CommandShortcut>}
            </CommandItem>
          ))}
        </CommandGroup>

        <CommandSeparator />

        {/* Navigation */}
        <CommandGroup heading="Navegação">
          {navigationCommands.slice(0, 10).map((item) => (
            <CommandItem
              key={item.id}
              value={`${item.label} ${item.keywords?.join(' ') || ''}`}
              onSelect={() => runCommand(() => navigate(item.href!))}
            >
              <item.icon className="mr-2 h-4 w-4" />
              <span>{item.label}</span>
              {item.shortcut && <CommandShortcut>{item.shortcut}</CommandShortcut>}
            </CommandItem>
          ))}
        </CommandGroup>

        {/* More Navigation */}
        <CommandGroup heading="Cadastros e Configurações">
          {navigationCommands.slice(10).map((item) => (
            <CommandItem
              key={item.id}
              value={`${item.label} ${item.keywords?.join(' ') || ''}`}
              onSelect={() => runCommand(() => navigate(item.href!))}
            >
              <item.icon className="mr-2 h-4 w-4" />
              <span>{item.label}</span>
              {item.shortcut && <CommandShortcut>{item.shortcut}</CommandShortcut>}
            </CommandItem>
          ))}
        </CommandGroup>

        <CommandSeparator />

        {/* Theme */}
        <CommandGroup heading="Aparência">
          {themeCommands.map((item) => (
            <CommandItem
              key={item.id}
              value={`${item.label} ${item.keywords?.join(' ') || ''}`}
              onSelect={() => runCommand(() => item.action?.())}
            >
              <item.icon className="mr-2 h-4 w-4" />
              <span>{item.label}</span>
              {theme === item.id.replace('theme-', '') && (
                <span className="ml-auto text-xs text-muted-foreground">Ativo</span>
              )}
            </CommandItem>
          ))}
        </CommandGroup>

        <CommandSeparator />

        {/* System */}
        <CommandGroup heading="Sistema">
          {systemCommands.map((item) => (
            <CommandItem
              key={item.id}
              value={`${item.label} ${item.keywords?.join(' ') || ''}`}
              onSelect={() => runCommand(() => item.action?.())}
              className="text-destructive"
            >
              <item.icon className="mr-2 h-4 w-4" />
              <span>{item.label}</span>
            </CommandItem>
          ))}
        </CommandGroup>
      </CommandList>

      {/* Footer with hint */}
      <div className="border-t border-border px-3 py-2 text-xs text-muted-foreground flex items-center justify-between">
        <span>
          <kbd className="pointer-events-none inline-flex h-5 select-none items-center gap-1 rounded border bg-muted px-1.5 font-mono text-[10px] font-medium text-muted-foreground">
            ↑↓
          </kbd>
          {' '}para navegar
        </span>
        <span>
          <kbd className="pointer-events-none inline-flex h-5 select-none items-center gap-1 rounded border bg-muted px-1.5 font-mono text-[10px] font-medium text-muted-foreground">
            Enter
          </kbd>
          {' '}para selecionar
        </span>
        <span>
          <kbd className="pointer-events-none inline-flex h-5 select-none items-center gap-1 rounded border bg-muted px-1.5 font-mono text-[10px] font-medium text-muted-foreground">
            Esc
          </kbd>
          {' '}para fechar
        </span>
      </div>
    </CommandDialog>
  );
}

// =============================================================================
// HOOK
// =============================================================================

export function useCommandPalette() {
  const [isOpen, setIsOpen] = React.useState(false);

  const open = React.useCallback(() => setIsOpen(true), []);
  const close = React.useCallback(() => setIsOpen(false), []);
  const toggle = React.useCallback(() => setIsOpen((prev) => !prev), []);

  return { isOpen, open, close, toggle };
}
