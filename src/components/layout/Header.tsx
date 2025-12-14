import { useState } from 'react';
import { motion } from 'framer-motion';
import {
  Bell,
  Search,
  Moon,
  Sun,
  ChevronDown,
  Building2,
  LogOut,
  User,
  Settings,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { mockCNPJs, mockAlertas } from '@/data/mockData';
import { cn } from '@/lib/utils';

interface HeaderProps {
  sidebarCollapsed?: boolean;
}

export const Header = ({ sidebarCollapsed }: HeaderProps) => {
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [selectedCNPJ, setSelectedCNPJ] = useState(mockCNPJs[0]);
  const unreadAlerts = mockAlertas.filter((a) => !a.lido).length;

  const toggleDarkMode = () => {
    setIsDarkMode(!isDarkMode);
    document.documentElement.classList.toggle('dark');
  };

  return (
    <header
      className={cn(
        'fixed top-0 right-0 z-30 h-16 bg-card/80 backdrop-blur-xl border-b border-border transition-all duration-300',
        sidebarCollapsed ? 'left-[72px]' : 'left-[260px]'
      )}
      style={{ boxShadow: 'var(--header-shadow)' }}
    >
      <div className="h-full flex items-center justify-between px-6">
        {/* Left: Search */}
        <div className="flex items-center gap-4 flex-1 max-w-xl">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Buscar transações, clientes, fornecedores..."
              className="pl-10 bg-muted/50 border-transparent focus:bg-card focus:border-border h-10"
            />
          </div>
        </div>

        {/* Right: Actions */}
        <div className="flex items-center gap-3">
          {/* CNPJ Selector */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="outline"
                className="h-10 gap-2 bg-card hover:bg-muted"
              >
                <Building2 className="h-4 w-4 text-primary" />
                <span className="hidden sm:inline text-sm font-medium">
                  {selectedCNPJ.nomeFantasia}
                </span>
                <ChevronDown className="h-3.5 w-3.5 text-muted-foreground" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-64">
              <DropdownMenuLabel>Selecionar Empresa</DropdownMenuLabel>
              <DropdownMenuSeparator />
              {mockCNPJs.map((cnpj) => (
                <DropdownMenuItem
                  key={cnpj.id}
                  onClick={() => setSelectedCNPJ(cnpj)}
                  className={cn(
                    'flex flex-col items-start gap-0.5 cursor-pointer',
                    selectedCNPJ.id === cnpj.id && 'bg-primary/10'
                  )}
                >
                  <span className="font-medium">{cnpj.nomeFantasia}</span>
                  <span className="text-xs text-muted-foreground">
                    {cnpj.cnpj}
                  </span>
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>

          {/* Dark Mode Toggle */}
          <Button
            variant="ghost"
            size="icon"
            onClick={toggleDarkMode}
            className="h-10 w-10"
          >
            <motion.div
              initial={false}
              animate={{ rotate: isDarkMode ? 180 : 0 }}
              transition={{ duration: 0.3 }}
            >
              {isDarkMode ? (
                <Moon className="h-5 w-5" />
              ) : (
                <Sun className="h-5 w-5" />
              )}
            </motion.div>
          </Button>

          {/* Notifications */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="h-10 w-10 relative">
                <Bell className="h-5 w-5" />
                {unreadAlerts > 0 && (
                  <span className="absolute -top-0.5 -right-0.5 h-5 w-5 bg-destructive text-destructive-foreground rounded-full text-[10px] flex items-center justify-center font-bold animate-pulse">
                    {unreadAlerts}
                  </span>
                )}
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-80">
              <DropdownMenuLabel className="flex items-center justify-between">
                <span>Notificações</span>
                <Badge variant="secondary">{unreadAlerts} novas</Badge>
              </DropdownMenuLabel>
              <DropdownMenuSeparator />
              {mockAlertas.slice(0, 4).map((alerta) => (
                <DropdownMenuItem
                  key={alerta.id}
                  className={cn(
                    'flex flex-col items-start gap-1 p-3 cursor-pointer',
                    !alerta.lido && 'bg-primary/5'
                  )}
                >
                  <div className="flex items-center gap-2 w-full">
                    <span
                      className={cn(
                        'h-2 w-2 rounded-full',
                        alerta.prioridade === 'critica' && 'bg-destructive',
                        alerta.prioridade === 'alta' && 'bg-warning',
                        alerta.prioridade === 'media' && 'bg-secondary',
                        alerta.prioridade === 'baixa' && 'bg-muted-foreground'
                      )}
                    />
                    <span className="font-medium text-sm flex-1 truncate">
                      {alerta.titulo}
                    </span>
                  </div>
                  <p className="text-xs text-muted-foreground line-clamp-2 pl-4">
                    {alerta.mensagem}
                  </p>
                </DropdownMenuItem>
              ))}
              <DropdownMenuSeparator />
              <DropdownMenuItem className="text-center text-primary font-medium cursor-pointer justify-center">
                Ver todas as notificações
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

          {/* User Menu */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="ghost"
                className="h-10 gap-2 pl-2 pr-3 hover:bg-muted"
              >
                <Avatar className="h-7 w-7">
                  <AvatarImage src="/avatar.png" />
                  <AvatarFallback className="bg-primary text-primary-foreground text-xs font-bold">
                    PB
                  </AvatarFallback>
                </Avatar>
                <span className="hidden sm:inline text-sm font-medium">
                  Admin
                </span>
                <ChevronDown className="h-3.5 w-3.5 text-muted-foreground" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-48">
              <DropdownMenuLabel>Minha Conta</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem className="cursor-pointer">
                <User className="h-4 w-4 mr-2" />
                Perfil
              </DropdownMenuItem>
              <DropdownMenuItem className="cursor-pointer">
                <Settings className="h-4 w-4 mr-2" />
                Configurações
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem className="cursor-pointer text-destructive focus:text-destructive">
                <LogOut className="h-4 w-4 mr-2" />
                Sair
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </header>
  );
};
