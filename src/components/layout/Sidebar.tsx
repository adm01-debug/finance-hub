import { useState, useMemo } from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  LayoutDashboard,
  ArrowDownCircle,
  ArrowUpCircle,
  Landmark,
  FileText,
  PieChart,
  Bell,
  Settings,
  ChevronLeft,
  ChevronRight,
  ChevronDown,
  Building2,
  CreditCard,
  BarChart3,
  Receipt,
  RefreshCcw,
  Users,
  Zap,
  ScrollText,
  User,
  Truck,
  FileSpreadsheet,
  ShieldCheck,
  Bot,
  Shield,
  Scale,
  TrendingUp,
  Wallet,
  FolderKanban,
  Link2,
  LucideIcon,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { Badge } from '@/components/ui/badge';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';
import { useAprovacoesPendentesCount } from '@/hooks/useAprovacoesPendentesCount';

interface NavItem {
  label: string;
  icon: LucideIcon;
  href: string;
  badge?: number;
  badgeKey?: string;
  highlight?: boolean;
}

interface NavGroup {
  id: string;
  label: string;
  icon: LucideIcon;
  items: NavItem[];
  defaultOpen?: boolean;
}

// Grupos de navegação organizados logicamente
const navGroups: NavGroup[] = [
  {
    id: 'dashboards',
    label: 'Dashboards',
    icon: LayoutDashboard,
    defaultOpen: true,
    items: [
      { label: 'Dashboard Principal', icon: LayoutDashboard, href: '/' },
      { label: 'BI Gestão', icon: BarChart3, href: '/bi', highlight: true },
      { label: 'Dashboard Empresa', icon: Building2, href: '/dashboard-empresa' },
      { label: 'Dashboard Recebíveis', icon: TrendingUp, href: '/dashboard-receber', highlight: true },
      { label: 'EXPERT (IA)', icon: Bot, href: '/expert', highlight: true },
    ],
  },
  {
    id: 'contas',
    label: 'Contas',
    icon: Wallet,
    defaultOpen: true,
    items: [
      { label: 'Contas a Receber', icon: ArrowDownCircle, href: '/contas-receber' },
      { label: 'Contas a Pagar', icon: ArrowUpCircle, href: '/contas-pagar' },
      { label: 'Boletos', icon: CreditCard, href: '/boletos' },
      { label: 'Pagtos Recorrentes', icon: RefreshCcw, href: '/pagamentos-recorrentes' },
    ],
  },
  {
    id: 'operacional',
    label: 'Operacional',
    icon: FolderKanban,
    defaultOpen: false,
    items: [
      { label: 'Fluxo de Caixa', icon: BarChart3, href: '/fluxo-caixa' },
      { label: 'Conciliação Bancária', icon: RefreshCcw, href: '/conciliacao' },
      { label: 'Cobrança', icon: Receipt, href: '/cobrancas' },
      { label: 'Notas Fiscais', icon: FileText, href: '/notas-fiscais' },
    ],
  },
  {
    id: 'relatorios',
    label: 'Relatórios',
    icon: FileSpreadsheet,
    defaultOpen: false,
    items: [
      { label: 'Relatórios', icon: FileText, href: '/relatorios' },
      { label: 'Demonstrativos', icon: FileSpreadsheet, href: '/demonstrativos' },
      { label: 'Reforma Tributária', icon: Scale, href: '/reforma-tributaria', highlight: true },
    ],
  },
  {
    id: 'cadastros',
    label: 'Cadastros',
    icon: Users,
    defaultOpen: false,
    items: [
      { label: 'Clientes', icon: User, href: '/clientes' },
      { label: 'Fornecedores', icon: Truck, href: '/fornecedores' },
      { label: 'Empresas (CNPJs)', icon: Building2, href: '/empresas' },
      { label: 'Contas Bancárias', icon: Landmark, href: '/contas-bancarias' },
      { label: 'Centro de Custos', icon: PieChart, href: '/centro-custos' },
    ],
  },
  {
    id: 'admin',
    label: 'Administração',
    icon: ShieldCheck,
    defaultOpen: false,
    items: [
      { label: 'Aprovações', icon: ShieldCheck, href: '/aprovacoes', badgeKey: 'aprovacoes' },
      { label: 'Usuários', icon: Users, href: '/usuarios' },
      { label: 'Logs de Auditoria', icon: ScrollText, href: '/audit-logs' },
    ],
  },
  {
    id: 'integracoes',
    label: 'Integrações',
    icon: Link2,
    defaultOpen: false,
    items: [
      { label: 'Bitrix24', icon: Zap, href: '/bitrix24' },
    ],
  },
];

const bottomNavItems: NavItem[] = [
  { label: 'Segurança', icon: Shield, href: '/seguranca', highlight: true },
  { label: 'Alertas', icon: Bell, href: '/alertas' },
  { label: 'Configurações', icon: Settings, href: '/configuracoes' },
];

export const Sidebar = () => {
  const [collapsed, setCollapsed] = useState(false);
  const [expandedGroups, setExpandedGroups] = useState<Record<string, boolean>>(() => {
    const initial: Record<string, boolean> = {};
    navGroups.forEach(group => {
      initial[group.id] = group.defaultOpen ?? false;
    });
    return initial;
  });
  const location = useLocation();
  const { count: aprovacoesPendentes } = useAprovacoesPendentesCount();

  // Auto-expand group containing active route
  useMemo(() => {
    navGroups.forEach(group => {
      const hasActiveItem = group.items.some(item => item.href === location.pathname);
      if (hasActiveItem && !expandedGroups[group.id]) {
        setExpandedGroups(prev => ({ ...prev, [group.id]: true }));
      }
    });
  }, [location.pathname]);

  const toggleGroup = (groupId: string) => {
    if (collapsed) return;
    setExpandedGroups(prev => ({ ...prev, [groupId]: !prev[groupId] }));
  };

  // Merge dynamic badge counts into nav items
  const getItemWithBadge = (item: NavItem): NavItem => {
    if (item.badgeKey === 'aprovacoes' && aprovacoesPendentes > 0) {
      return { ...item, badge: aprovacoesPendentes };
    }
    return item;
  };

  const NavItemComponent = ({ item }: { item: NavItem }) => {
    const isActive = location.pathname === item.href;
    const itemWithBadge = getItemWithBadge(item);
    const Icon = itemWithBadge.icon;

    const content = (
      <NavLink
        to={itemWithBadge.href}
        className={cn(
          'flex items-center gap-3 px-3 py-2 rounded-lg transition-all duration-200 group relative',
          isActive
            ? 'bg-primary text-primary-foreground shadow-glow-primary'
            : itemWithBadge.highlight
              ? 'bg-gradient-to-r from-accent/20 to-primary/20 text-accent-foreground hover:from-accent/30 hover:to-primary/30 border border-accent/30'
              : 'text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground'
        )}
        {...(itemWithBadge.href === '/expert' ? { 'data-tour': 'expert' } : {})}
      >
        <Icon
          className={cn(
            'h-4 w-4 flex-shrink-0 transition-transform duration-200',
            !isActive && 'group-hover:scale-110',
            itemWithBadge.highlight && !isActive && 'text-accent'
          )}
        />
        <AnimatePresence mode="wait">
          {!collapsed && (
            <motion.span
              initial={{ opacity: 0, width: 0 }}
              animate={{ opacity: 1, width: 'auto' }}
              exit={{ opacity: 0, width: 0 }}
              className="font-medium text-sm whitespace-nowrap overflow-hidden"
            >
              {itemWithBadge.label}
            </motion.span>
          )}
        </AnimatePresence>
        {itemWithBadge.badge && !collapsed && (
          <Badge
            variant="secondary"
            className={cn(
              'ml-auto text-xs',
              isActive ? 'bg-primary-foreground/20 text-primary-foreground' : ''
            )}
          >
            {itemWithBadge.badge}
          </Badge>
        )}
        {itemWithBadge.badge && collapsed && (
          <span className="absolute -top-1 -right-1 h-4 w-4 bg-destructive text-destructive-foreground rounded-full text-[10px] flex items-center justify-center font-bold">
            {itemWithBadge.badge > 9 ? '9+' : itemWithBadge.badge}
          </span>
        )}
      </NavLink>
    );

    if (collapsed) {
      return (
        <Tooltip delayDuration={0}>
          <TooltipTrigger asChild>{content}</TooltipTrigger>
          <TooltipContent side="right" className="flex items-center gap-2">
            {itemWithBadge.label}
            {itemWithBadge.badge && (
              <Badge variant="secondary" className="text-xs">
                {itemWithBadge.badge}
              </Badge>
            )}
          </TooltipContent>
        </Tooltip>
      );
    }

    return content;
  };

  const NavGroupComponent = ({ group }: { group: NavGroup }) => {
    const isExpanded = expandedGroups[group.id];
    const GroupIcon = group.icon;
    const hasActiveItem = group.items.some(item => item.href === location.pathname);

    if (collapsed) {
      // When collapsed, show items directly with tooltips
      return (
        <div className="space-y-0.5">
          {group.items.map((item) => (
            <NavItemComponent key={item.href} item={item} />
          ))}
        </div>
      );
    }

    return (
      <div className="space-y-0.5">
        {/* Group Header */}
        <button
          onClick={() => toggleGroup(group.id)}
          className={cn(
            'flex items-center gap-2 w-full px-3 py-2 rounded-lg transition-all duration-200',
            'text-muted-foreground hover:text-foreground hover:bg-sidebar-accent/50',
            hasActiveItem && 'text-foreground'
          )}
        >
          <GroupIcon className="h-4 w-4" />
          <span className="font-semibold text-xs uppercase tracking-wider flex-1 text-left">
            {group.label}
          </span>
          <motion.div
            animate={{ rotate: isExpanded ? 180 : 0 }}
            transition={{ duration: 0.2 }}
          >
            <ChevronDown className="h-3 w-3" />
          </motion.div>
        </button>

        {/* Group Items */}
        <AnimatePresence initial={false}>
          {isExpanded && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.2, ease: 'easeInOut' }}
              className="overflow-hidden"
            >
              <div className="pl-2 space-y-0.5">
                {group.items.map((item) => (
                  <NavItemComponent key={item.href} item={item} />
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    );
  };

  return (
    <motion.aside
      initial={false}
      animate={{ width: collapsed ? 72 : 280 }}
      transition={{ duration: 0.3, ease: [0.4, 0, 0.2, 1] }}
      className={cn(
        'fixed left-0 top-0 z-40 h-screen bg-sidebar border-r border-sidebar-border flex flex-col'
      )}
      data-tour="sidebar"
    >
      {/* Logo */}
      <div className="h-16 flex items-center justify-between px-4 border-b border-sidebar-border">
        <AnimatePresence mode="wait">
          {!collapsed && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="flex items-center gap-2"
            >
              <div className="h-9 w-9 rounded-xl bg-gradient-to-br from-primary to-primary/80 flex items-center justify-center shadow-glow-primary">
                <CreditCard className="h-5 w-5 text-primary-foreground" />
              </div>
              <div className="flex flex-col">
                <span className="font-display font-bold text-lg text-foreground leading-tight">
                  Promo
                </span>
                <span className="text-[10px] text-muted-foreground leading-tight uppercase tracking-wider">
                  Financeiro
                </span>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {collapsed && (
          <div className="h-9 w-9 rounded-xl bg-gradient-to-br from-primary to-primary/80 flex items-center justify-center shadow-glow-primary mx-auto">
            <CreditCard className="h-5 w-5 text-primary-foreground" />
          </div>
        )}
      </div>

      {/* Navigation Groups */}
      <nav className="flex-1 overflow-y-auto py-3 px-2 space-y-2 scrollbar-thin">
        {navGroups.map((group) => (
          <NavGroupComponent key={group.id} group={group} />
        ))}
      </nav>

      {/* Bottom Navigation */}
      <div className="py-3 px-2 space-y-0.5 border-t border-sidebar-border">
        {bottomNavItems.map((item) => (
          <NavItemComponent key={item.href} item={item} />
        ))}
      </div>

      {/* Collapse Button */}
      <button
        onClick={() => setCollapsed(!collapsed)}
        className="absolute -right-3 top-20 h-6 w-6 rounded-full bg-card border border-border flex items-center justify-center shadow-md hover:bg-muted transition-colors"
        aria-label={collapsed ? 'Expandir menu' : 'Recolher menu'}
      >
        {collapsed ? (
          <ChevronRight className="h-3.5 w-3.5 text-muted-foreground" />
        ) : (
          <ChevronLeft className="h-3.5 w-3.5 text-muted-foreground" />
        )}
      </button>
    </motion.aside>
  );
};
