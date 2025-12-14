import { useState } from 'react';
import { motion } from 'framer-motion';
import {
  TrendingUp,
  TrendingDown,
  Wallet,
  ArrowDownCircle,
  ArrowUpCircle,
  AlertTriangle,
  Clock,
  CheckCircle2,
  Building2,
  CreditCard,
  Users,
  Calendar,
  BarChart3,
  PieChart as PieChartIcon,
  Activity,
  Target,
  Zap,
  ArrowRight,
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { mockDashboardKPIs, mockContasBancarias, mockCNPJs } from '@/data/mockData';
import { formatCurrency, formatPercentage } from '@/lib/formatters';
import { cn } from '@/lib/utils';
import { 
  AreaChart, 
  Area, 
  XAxis, 
  YAxis, 
  Tooltip, 
  ResponsiveContainer, 
  BarChart, 
  Bar, 
  PieChart, 
  Pie, 
  Cell,
  LineChart,
  Line,
  ComposedChart,
  Legend,
  RadialBarChart,
  RadialBar
} from 'recharts';
import { Link } from 'react-router-dom';

const containerVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.06 } },
} as const;

const itemVariants = {
  hidden: { opacity: 0, y: 20, scale: 0.95 },
  visible: { opacity: 1, y: 0, scale: 1, transition: { type: 'spring' as const, stiffness: 260, damping: 20 } },
};

const COLORS = ['hsl(24, 95%, 46%)', 'hsl(215, 90%, 42%)', 'hsl(150, 70%, 32%)', 'hsl(275, 75%, 48%)', 'hsl(42, 95%, 48%)'];

// Mock data adicional para novos gráficos
const receitasPorMes = [
  { mes: 'Jul', receitas: 85000, despesas: 62000, lucro: 23000 },
  { mes: 'Ago', receitas: 92000, despesas: 71000, lucro: 21000 },
  { mes: 'Set', receitas: 78000, despesas: 58000, lucro: 20000 },
  { mes: 'Out', receitas: 105000, despesas: 75000, lucro: 30000 },
  { mes: 'Nov', receitas: 118000, despesas: 82000, lucro: 36000 },
  { mes: 'Dez', receitas: 145000, despesas: 95000, lucro: 50000 },
];

const statusContas = [
  { name: 'Pagas', value: 45, fill: 'hsl(150, 70%, 42%)' },
  { name: 'Pendentes', value: 30, fill: 'hsl(42, 95%, 48%)' },
  { name: 'Vencidas', value: 15, fill: 'hsl(0, 78%, 55%)' },
  { name: 'Parciais', value: 10, fill: 'hsl(215, 90%, 52%)' },
];

const metasMensais = [
  { name: 'Receitas', atual: 145000, meta: 150000, percentual: 96.7 },
  { name: 'Cobranças', atual: 42, meta: 50, percentual: 84 },
  { name: 'Inadimplência', atual: 4.2, meta: 5, percentual: 84, inverso: true },
  { name: 'Conciliação', atual: 95, meta: 100, percentual: 95 },
];

const cobrancasPorCanal = [
  { canal: 'E-mail', enviados: 120, respondidos: 45, pagos: 32 },
  { canal: 'WhatsApp', enviados: 85, respondidos: 62, pagos: 48 },
  { canal: 'SMS', enviados: 45, respondidos: 18, pagos: 12 },
  { canal: 'Telefone', enviados: 30, respondidos: 25, pagos: 20 },
];

export const Dashboard = () => {
  const kpis = mockDashboardKPIs;
  const [periodoFluxo, setPeriodoFluxo] = useState('30');

  const statsCards = [
    { title: 'Saldo Total', value: kpis.saldoTotal, variation: kpis.saldoTotalVariacao, icon: Wallet, color: 'primary', href: '/contas-bancarias' },
    { title: 'Receitas do Mês', value: kpis.receitasMes, variation: kpis.receitasMesVariacao, icon: ArrowDownCircle, color: 'success', href: '/contas-receber' },
    { title: 'Despesas do Mês', value: kpis.despesasMes, variation: kpis.despesasMesVariacao, icon: ArrowUpCircle, color: 'destructive', href: '/contas-pagar' },
    { title: 'Inadimplência', value: kpis.inadimplencia, variation: kpis.inadimplenciaVariacao, icon: AlertTriangle, color: 'warning', isPercentage: true, href: '/cobrancas' },
  ];

  const saldoPorBanco = mockContasBancarias.map(conta => ({
    banco: conta.banco,
    saldo: conta.saldoAtual,
    disponivel: conta.saldoDisponivel
  }));

  const totalSaldoBancos = saldoPorBanco.reduce((acc, b) => acc + b.saldo, 0);

  return (
    <motion.div variants={containerVariants} initial="hidden" animate="visible" className="space-y-6">
      {/* Page Header */}
      <motion.div variants={itemVariants} className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Dashboard Financeiro</h1>
          <p className="text-muted-foreground mt-1">Visão geral das finanças da Promo Brindes</p>
        </div>
        <div className="flex items-center gap-2">
          <Badge variant="outline" className="h-8 px-3 gap-2">
            <span className="h-2 w-2 rounded-full bg-green-500 animate-pulse" />
            Atualizado agora
          </Badge>
          <Button variant="outline" size="sm" asChild>
            <Link to="/alertas">
              <AlertTriangle className="h-4 w-4 mr-2" />
              5 Alertas
            </Link>
          </Button>
        </div>
      </motion.div>

      {/* KPI Cards Principais */}
      <motion.div variants={itemVariants} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {statsCards.map((stat) => (
          <Link key={stat.title} to={stat.href}>
            <Card className="overflow-hidden group hover:shadow-lg transition-all cursor-pointer">
              <CardContent className="p-5">
                <div className="flex items-start justify-between">
                  <div className="space-y-2">
                    <p className="text-sm font-medium text-muted-foreground">{stat.title}</p>
                    <p className="text-2xl font-bold">
                      {stat.isPercentage ? `${stat.value.toFixed(1)}%` : formatCurrency(stat.value)}
                    </p>
                    <div className={cn('flex items-center gap-1 text-sm font-medium', stat.variation >= 0 ? 'text-green-600' : 'text-red-500')}>
                      {stat.variation >= 0 ? <TrendingUp className="h-4 w-4" /> : <TrendingDown className="h-4 w-4" />}
                      {formatPercentage(stat.variation)} vs mês anterior
                    </div>
                  </div>
                  <div className={cn('h-12 w-12 rounded-xl flex items-center justify-center transition-transform group-hover:scale-110',
                    stat.color === 'primary' && 'bg-primary/10 text-primary',
                    stat.color === 'success' && 'bg-green-100 dark:bg-green-900/30 text-green-600',
                    stat.color === 'destructive' && 'bg-red-100 dark:bg-red-900/30 text-red-500',
                    stat.color === 'warning' && 'bg-orange-100 dark:bg-orange-900/30 text-orange-500'
                  )}>
                    <stat.icon className="h-6 w-6" />
                  </div>
                </div>
              </CardContent>
              <div className={cn('h-1 w-full',
                stat.color === 'primary' && 'bg-gradient-to-r from-primary to-primary/50',
                stat.color === 'success' && 'bg-gradient-to-r from-green-500 to-green-500/50',
                stat.color === 'destructive' && 'bg-gradient-to-r from-red-500 to-red-500/50',
                stat.color === 'warning' && 'bg-gradient-to-r from-orange-500 to-orange-500/50'
              )} />
            </Card>
          </Link>
        ))}
      </motion.div>

      {/* KPIs Secundários */}
      <motion.div variants={itemVariants} className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
        <Card className="p-4">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-blue-100 dark:bg-blue-900/30">
              <Building2 className="h-4 w-4 text-blue-600" />
            </div>
            <div>
              <p className="text-xs text-muted-foreground">Empresas</p>
              <p className="text-lg font-bold">{mockCNPJs.length}</p>
            </div>
          </div>
        </Card>
        <Card className="p-4">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-purple-100 dark:bg-purple-900/30">
              <CreditCard className="h-4 w-4 text-purple-600" />
            </div>
            <div>
              <p className="text-xs text-muted-foreground">Contas Bancárias</p>
              <p className="text-lg font-bold">{mockContasBancarias.length}</p>
            </div>
          </div>
        </Card>
        <Card className="p-4">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-green-100 dark:bg-green-900/30">
              <CheckCircle2 className="h-4 w-4 text-green-600" />
            </div>
            <div>
              <p className="text-xs text-muted-foreground">Receber Hoje</p>
              <p className="text-lg font-bold">{kpis.contasReceberHoje}</p>
            </div>
          </div>
        </Card>
        <Card className="p-4">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-orange-100 dark:bg-orange-900/30">
              <Clock className="h-4 w-4 text-orange-500" />
            </div>
            <div>
              <p className="text-xs text-muted-foreground">Pagar Hoje</p>
              <p className="text-lg font-bold">{kpis.contasPagarHoje}</p>
            </div>
          </div>
        </Card>
        <Card className="p-4">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-red-100 dark:bg-red-900/30">
              <AlertTriangle className="h-4 w-4 text-red-500" />
            </div>
            <div>
              <p className="text-xs text-muted-foreground">Vencidas Receber</p>
              <p className="text-lg font-bold text-red-500">{kpis.contasReceberVencidas}</p>
            </div>
          </div>
        </Card>
        <Card className="p-4">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-red-100 dark:bg-red-900/30">
              <AlertTriangle className="h-4 w-4 text-red-500" />
            </div>
            <div>
              <p className="text-xs text-muted-foreground">Vencidas Pagar</p>
              <p className="text-lg font-bold text-red-500">{kpis.contasPagarVencidas}</p>
            </div>
          </div>
        </Card>
      </motion.div>

      {/* Gráficos Principais - Linha 1 */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Fluxo de Caixa Projetado */}
        <motion.div variants={itemVariants} className="lg:col-span-2">
          <Card className="h-[400px]">
            <CardHeader className="pb-2">
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="text-lg flex items-center gap-2">
                    <Activity className="h-5 w-5 text-primary" />
                    Fluxo de Caixa Projetado
                  </CardTitle>
                  <CardDescription>Receitas vs Despesas nos próximos dias</CardDescription>
                </div>
                <Tabs value={periodoFluxo} onValueChange={setPeriodoFluxo}>
                  <TabsList className="h-8">
                    <TabsTrigger value="7" className="text-xs">7d</TabsTrigger>
                    <TabsTrigger value="15" className="text-xs">15d</TabsTrigger>
                    <TabsTrigger value="30" className="text-xs">30d</TabsTrigger>
                  </TabsList>
                </Tabs>
              </div>
            </CardHeader>
            <CardContent className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <ComposedChart data={kpis.fluxoCaixaProjetado.slice(0, parseInt(periodoFluxo))}>
                  <defs>
                    <linearGradient id="colorReceitas" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="hsl(150, 70%, 42%)" stopOpacity={0.3}/>
                      <stop offset="95%" stopColor="hsl(150, 70%, 42%)" stopOpacity={0}/>
                    </linearGradient>
                    <linearGradient id="colorDespesas" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="hsl(0, 78%, 55%)" stopOpacity={0.3}/>
                      <stop offset="95%" stopColor="hsl(0, 78%, 55%)" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <XAxis dataKey="data" tickFormatter={(v) => v.slice(8)} stroke="hsl(var(--muted-foreground))" fontSize={11} />
                  <YAxis tickFormatter={(v) => `${(v/1000).toFixed(0)}K`} stroke="hsl(var(--muted-foreground))" fontSize={11} />
                  <Tooltip 
                    formatter={(v: number) => formatCurrency(v)} 
                    labelFormatter={(l) => `Data: ${l}`}
                    contentStyle={{ backgroundColor: 'hsl(var(--popover))', border: '1px solid hsl(var(--border))', borderRadius: '8px' }}
                  />
                  <Legend />
                  <Area type="monotone" dataKey="receitas" name="Receitas" stroke="hsl(150, 70%, 42%)" fill="url(#colorReceitas)" strokeWidth={2} />
                  <Area type="monotone" dataKey="despesas" name="Despesas" stroke="hsl(0, 78%, 55%)" fill="url(#colorDespesas)" strokeWidth={2} />
                  <Line type="monotone" dataKey="saldo" name="Saldo" stroke="hsl(215, 90%, 52%)" strokeWidth={2} dot={false} />
                </ComposedChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </motion.div>

        {/* Saldo por Banco */}
        <motion.div variants={itemVariants}>
          <Card className="h-[400px]">
            <CardHeader className="pb-2">
              <CardTitle className="text-lg flex items-center gap-2">
                <CreditCard className="h-5 w-5 text-purple-500" />
                Saldo por Banco
              </CardTitle>
              <CardDescription>Distribuição entre contas</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {saldoPorBanco.map((banco, index) => {
                const percentual = (banco.saldo / totalSaldoBancos) * 100;
                return (
                  <div key={banco.banco} className="space-y-2">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <div className="h-3 w-3 rounded-full" style={{ backgroundColor: COLORS[index % COLORS.length] }} />
                        <span className="text-sm font-medium">{banco.banco}</span>
                      </div>
                      <span className="text-sm font-bold">{formatCurrency(banco.saldo)}</span>
                    </div>
                    <Progress value={percentual} className="h-2" />
                  </div>
                );
              })}
              <div className="pt-4 border-t">
                <div className="flex items-center justify-between">
                  <span className="font-medium">Total Consolidado</span>
                  <span className="text-lg font-bold text-primary">{formatCurrency(totalSaldoBancos)}</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>

      {/* Gráficos Secundários - Linha 2 */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {/* Evolução Mensal */}
        <motion.div variants={itemVariants} className="lg:col-span-2">
          <Card className="h-[320px]">
            <CardHeader className="pb-2">
              <CardTitle className="text-lg flex items-center gap-2">
                <BarChart3 className="h-5 w-5 text-blue-500" />
                Evolução Mensal
              </CardTitle>
            </CardHeader>
            <CardContent className="h-[240px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={receitasPorMes}>
                  <XAxis dataKey="mes" stroke="hsl(var(--muted-foreground))" fontSize={11} />
                  <YAxis tickFormatter={(v) => `${(v/1000).toFixed(0)}K`} stroke="hsl(var(--muted-foreground))" fontSize={11} />
                  <Tooltip 
                    formatter={(v: number) => formatCurrency(v)}
                    contentStyle={{ backgroundColor: 'hsl(var(--popover))', border: '1px solid hsl(var(--border))', borderRadius: '8px' }}
                  />
                  <Legend />
                  <Bar dataKey="receitas" name="Receitas" fill="hsl(150, 70%, 42%)" radius={[4, 4, 0, 0]} />
                  <Bar dataKey="despesas" name="Despesas" fill="hsl(0, 78%, 55%)" radius={[4, 4, 0, 0]} />
                  <Bar dataKey="lucro" name="Lucro" fill="hsl(215, 90%, 52%)" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </motion.div>

        {/* Status das Contas */}
        <motion.div variants={itemVariants}>
          <Card className="h-[320px]">
            <CardHeader className="pb-2">
              <CardTitle className="text-lg flex items-center gap-2">
                <PieChartIcon className="h-5 w-5 text-orange-500" />
                Status Contas
              </CardTitle>
            </CardHeader>
            <CardContent className="h-[220px]">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie 
                    data={statusContas} 
                    dataKey="value" 
                    nameKey="name" 
                    cx="50%" 
                    cy="50%" 
                    innerRadius={45} 
                    outerRadius={70} 
                    paddingAngle={3}
                  >
                    {statusContas.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.fill} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
              <div className="flex flex-wrap gap-2 justify-center">
                {statusContas.map((item) => (
                  <Badge key={item.name} variant="outline" className="text-xs gap-1">
                    <span className="h-2 w-2 rounded-full" style={{ backgroundColor: item.fill }} />
                    {item.name}: {item.value}%
                  </Badge>
                ))}
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Metas do Mês */}
        <motion.div variants={itemVariants}>
          <Card className="h-[320px]">
            <CardHeader className="pb-2">
              <CardTitle className="text-lg flex items-center gap-2">
                <Target className="h-5 w-5 text-green-500" />
                Metas do Mês
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {metasMensais.map((meta) => (
                <div key={meta.name} className="space-y-1">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">{meta.name}</span>
                    <span className={cn(
                      "font-medium",
                      meta.percentual >= 90 ? "text-green-600" : 
                      meta.percentual >= 70 ? "text-orange-500" : "text-red-500"
                    )}>
                      {meta.percentual.toFixed(0)}%
                    </span>
                  </div>
                  <Progress 
                    value={meta.percentual} 
                    className={cn(
                      "h-2",
                      meta.percentual >= 90 ? "[&>div]:bg-green-500" : 
                      meta.percentual >= 70 ? "[&>div]:bg-orange-500" : "[&>div]:bg-red-500"
                    )}
                  />
                </div>
              ))}
            </CardContent>
          </Card>
        </motion.div>
      </div>

      {/* Linha 3 - Centro de Custos, Top Devedores, Cobranças */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Centro de Custos */}
        <motion.div variants={itemVariants}>
          <Card className="h-[380px]">
            <CardHeader className="pb-2">
              <CardTitle className="text-lg flex items-center gap-2">
                <PieChartIcon className="h-5 w-5 text-purple-500" />
                Centro de Custos
              </CardTitle>
            </CardHeader>
            <CardContent className="h-[280px]">
              <ResponsiveContainer width="100%" height="80%">
                <PieChart>
                  <Pie 
                    data={kpis.distribuicaoCentroCusto} 
                    dataKey="valor" 
                    nameKey="nome" 
                    cx="50%" 
                    cy="50%" 
                    innerRadius={50} 
                    outerRadius={80} 
                    paddingAngle={2}
                  >
                    {kpis.distribuicaoCentroCusto.map((_, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip formatter={(v: number) => formatCurrency(v)} />
                </PieChart>
              </ResponsiveContainer>
              <div className="flex flex-wrap gap-2 justify-center">
                {kpis.distribuicaoCentroCusto.slice(0, 4).map((item, i) => (
                  <Badge key={item.nome} variant="outline" className="text-xs">
                    <span className="h-2 w-2 rounded-full mr-1" style={{ background: COLORS[i] }} />
                    {item.nome}
                  </Badge>
                ))}
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Top Devedores */}
        <motion.div variants={itemVariants}>
          <Card className="h-[380px]">
            <CardHeader className="pb-2">
              <div className="flex items-center justify-between">
                <CardTitle className="text-lg flex items-center gap-2">
                  <AlertTriangle className="h-5 w-5 text-orange-500" />
                  Top Devedores
                </CardTitle>
                <Button variant="ghost" size="sm" asChild>
                  <Link to="/cobrancas">
                    Ver todos
                    <ArrowRight className="h-4 w-4 ml-1" />
                  </Link>
                </Button>
              </div>
            </CardHeader>
            <CardContent className="space-y-3">
              {kpis.topDevedores.map((devedor, i) => (
                <div key={devedor.cliente} className="flex items-center justify-between p-3 rounded-lg bg-muted/50 hover:bg-muted transition-colors">
                  <div className="flex items-center gap-3">
                    <span className="h-8 w-8 rounded-full bg-red-100 dark:bg-red-900/30 text-red-500 flex items-center justify-center text-sm font-bold">{i + 1}</span>
                    <div>
                      <p className="font-medium text-sm">{devedor.cliente}</p>
                      <p className="text-xs text-muted-foreground">{devedor.diasAtraso} dias em atraso</p>
                    </div>
                  </div>
                  <span className="font-bold text-red-500">{formatCurrency(devedor.valor)}</span>
                </div>
              ))}
            </CardContent>
          </Card>
        </motion.div>

        {/* Performance de Cobranças */}
        <motion.div variants={itemVariants}>
          <Card className="h-[380px]">
            <CardHeader className="pb-2">
              <CardTitle className="text-lg flex items-center gap-2">
                <Zap className="h-5 w-5 text-blue-500" />
                Cobranças por Canal
              </CardTitle>
            </CardHeader>
            <CardContent className="h-[280px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={cobrancasPorCanal} layout="vertical">
                  <XAxis type="number" stroke="hsl(var(--muted-foreground))" fontSize={11} />
                  <YAxis dataKey="canal" type="category" stroke="hsl(var(--muted-foreground))" fontSize={11} width={70} />
                  <Tooltip 
                    contentStyle={{ backgroundColor: 'hsl(var(--popover))', border: '1px solid hsl(var(--border))', borderRadius: '8px' }}
                  />
                  <Legend />
                  <Bar dataKey="enviados" name="Enviados" fill="hsl(215, 90%, 52%)" radius={[0, 4, 4, 0]} />
                  <Bar dataKey="pagos" name="Pagos" fill="hsl(150, 70%, 42%)" radius={[0, 4, 4, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </motion.div>
      </div>

      {/* Quick Actions */}
      <motion.div variants={itemVariants}>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg">Ações Rápidas</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-3">
              {[
                { label: 'Nova Receita', icon: ArrowDownCircle, href: '/contas-receber', color: 'text-green-600' },
                { label: 'Nova Despesa', icon: ArrowUpCircle, href: '/contas-pagar', color: 'text-red-500' },
                { label: 'Conciliação', icon: CheckCircle2, href: '/conciliacao', color: 'text-blue-600' },
                { label: 'Cobranças', icon: Zap, href: '/cobrancas', color: 'text-purple-600' },
                { label: 'Fluxo de Caixa', icon: Activity, href: '/fluxo-caixa', color: 'text-orange-500' },
                { label: 'Relatórios', icon: BarChart3, href: '/centro-custos', color: 'text-primary' },
              ].map((action) => (
                <Link key={action.label} to={action.href}>
                  <Button variant="outline" className="w-full h-auto py-4 flex-col gap-2 hover:shadow-md transition-all">
                    <action.icon className={cn("h-5 w-5", action.color)} />
                    <span className="text-xs">{action.label}</span>
                  </Button>
                </Link>
              ))}
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </motion.div>
  );
};
