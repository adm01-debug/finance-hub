import { Link, useLocation } from 'react-router-dom';
import { ChevronRight, Home } from 'lucide-react';
import { cn } from '@/lib/utils';

interface BreadcrumbItem {
  label: string;
  href?: string;
}

interface PageBreadcrumbProps {
  items?: BreadcrumbItem[];
  className?: string;
}

// Mapeamento de rotas para labels amigáveis
const routeLabels: Record<string, string> = {
  '/': 'Dashboard',
  '/bi': 'BI Gestão',
  '/dashboard-empresa': 'Dashboard Empresa',
  '/dashboard-receber': 'Dashboard Recebíveis',
  '/expert': 'EXPERT (IA)',
  '/contas-receber': 'Contas a Receber',
  '/contas-pagar': 'Contas a Pagar',
  '/boletos': 'Boletos',
  '/pagamentos-recorrentes': 'Pagamentos Recorrentes',
  '/fluxo-caixa': 'Fluxo de Caixa',
  '/conciliacao': 'Conciliação Bancária',
  '/cobrancas': 'Cobrança',
  '/notas-fiscais': 'Notas Fiscais',
  '/relatorios': 'Relatórios',
  '/demonstrativos': 'Demonstrativos',
  '/reforma-tributaria': 'Reforma Tributária',
  '/clientes': 'Clientes',
  '/fornecedores': 'Fornecedores',
  '/empresas': 'Empresas',
  '/contas-bancarias': 'Contas Bancárias',
  '/centro-custos': 'Centro de Custos',
  '/aprovacoes': 'Aprovações',
  '/usuarios': 'Usuários',
  '/audit-logs': 'Logs de Auditoria',
  '/bitrix24': 'Bitrix24',
  '/seguranca': 'Segurança',
  '/alertas': 'Alertas',
  '/configuracoes': 'Configurações',
};

// Mapeamento de categorias para agrupamento
const routeCategories: Record<string, string> = {
  '/bi': 'Dashboards',
  '/dashboard-empresa': 'Dashboards',
  '/dashboard-receber': 'Dashboards',
  '/expert': 'Dashboards',
  '/contas-receber': 'Contas',
  '/contas-pagar': 'Contas',
  '/boletos': 'Contas',
  '/pagamentos-recorrentes': 'Contas',
  '/fluxo-caixa': 'Operacional',
  '/conciliacao': 'Operacional',
  '/cobrancas': 'Operacional',
  '/notas-fiscais': 'Operacional',
  '/relatorios': 'Relatórios',
  '/demonstrativos': 'Relatórios',
  '/reforma-tributaria': 'Relatórios',
  '/clientes': 'Cadastros',
  '/fornecedores': 'Cadastros',
  '/empresas': 'Cadastros',
  '/contas-bancarias': 'Cadastros',
  '/centro-custos': 'Cadastros',
  '/aprovacoes': 'Administração',
  '/usuarios': 'Administração',
  '/audit-logs': 'Administração',
  '/bitrix24': 'Integrações',
  '/seguranca': 'Sistema',
  '/alertas': 'Sistema',
  '/configuracoes': 'Sistema',
};

/**
 * Gera breadcrumbs automaticamente baseado na rota atual
 */
function generateBreadcrumbs(pathname: string): BreadcrumbItem[] {
  const items: BreadcrumbItem[] = [];

  // Sempre começa com Home (exceto se já estiver na home)
  if (pathname !== '/') {
    items.push({ label: 'Dashboard', href: '/' });

    // Adiciona categoria se existir
    const category = routeCategories[pathname];
    if (category) {
      items.push({ label: category });
    }

    // Adiciona a página atual
    const label = routeLabels[pathname] || pathname.replace(/^\//, '').replace(/-/g, ' ');
    items.push({ label });
  }

  return items;
}

export function PageBreadcrumb({ items, className }: PageBreadcrumbProps) {
  const location = useLocation();

  // Usa items passados ou gera automaticamente
  const breadcrumbItems = items || generateBreadcrumbs(location.pathname);

  // Não renderiza se estiver na home ou sem items
  if (breadcrumbItems.length === 0) {
    return null;
  }

  return (
    <nav
      aria-label="Breadcrumb"
      className={cn('flex items-center text-sm text-muted-foreground', className)}
    >
      <ol className="flex items-center gap-1.5">
        {breadcrumbItems.map((item, index) => {
          const isLast = index === breadcrumbItems.length - 1;
          const isFirst = index === 0;

          return (
            <li key={index} className="flex items-center gap-1.5">
              {index > 0 && (
                <ChevronRight className="h-3.5 w-3.5 text-muted-foreground/50" aria-hidden="true" />
              )}

              {item.href && !isLast ? (
                <Link
                  to={item.href}
                  className={cn(
                    'flex items-center gap-1.5 hover:text-foreground transition-colors',
                    'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 rounded'
                  )}
                >
                  {isFirst && <Home className="h-3.5 w-3.5" aria-hidden="true" />}
                  <span>{item.label}</span>
                </Link>
              ) : (
                <span
                  className={cn(
                    'flex items-center gap-1.5',
                    isLast ? 'text-foreground font-medium' : ''
                  )}
                  aria-current={isLast ? 'page' : undefined}
                >
                  {isFirst && <Home className="h-3.5 w-3.5" aria-hidden="true" />}
                  <span>{item.label}</span>
                </span>
              )}
            </li>
          );
        })}
      </ol>
    </nav>
  );
}

/**
 * Hook para usar breadcrumbs customizados
 */
export function useBreadcrumb() {
  const location = useLocation();
  return {
    pathname: location.pathname,
    label: routeLabels[location.pathname] || '',
    category: routeCategories[location.pathname] || '',
  };
}

export { routeLabels, routeCategories };
