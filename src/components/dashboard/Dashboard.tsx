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
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { mockDashboardKPIs } from '@/data/mockData';
import { formatCurrency, formatPercentage } from '@/lib/formatters';
import { cn } from '@/lib/utils';
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer, BarChart, Bar, PieChart, Pie, Cell } from 'recharts';

const containerVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.08 } },
} as const;

const itemVariants = {
  hidden: { opacity: 0, y: 20, scale: 0.95 },
  visible: { opacity: 1, y: 0, scale: 1, transition: { type: 'spring' as const, stiffness: 260, damping: 20 } },
};

const COLORS = ['hsl(24, 95%, 46%)', 'hsl(215, 90%, 42%)', 'hsl(150, 70%, 32%)', 'hsl(275, 75%, 48%)', 'hsl(42, 95%, 48%)'];

export const Dashboard = () => {
  const kpis = mockDashboardKPIs;

  const statsCards = [
    { title: 'Saldo Total', value: kpis.saldoTotal, variation: kpis.saldoTotalVariacao, icon: Wallet, color: 'primary' },
    { title: 'Receitas do Mês', value: kpis.receitasMes, variation: kpis.receitasMesVariacao, icon: ArrowDownCircle, color: 'success' },
    { title: 'Despesas do Mês', value: kpis.despesasMes, variation: kpis.despesasMesVariacao, icon: ArrowUpCircle, color: 'destructive' },
    { title: 'Inadimplência', value: kpis.inadimplencia, variation: kpis.inadimplenciaVariacao, icon: AlertTriangle, color: 'warning', isPercentage: true },
  ];

  return (
    <motion.div variants={containerVariants} initial="hidden" animate="visible" className="space-y-6">
      {/* Page Header */}
      <motion.div variants={itemVariants} className="flex items-center justify-between">
        <div>
          <h1 className="text-display-md text-foreground">Dashboard Financeiro</h1>
          <p className="text-muted-foreground mt-1">Visão geral das finanças da Promo Brindes</p>
        </div>
        <Badge variant="outline" className="h-8 px-3 gap-2">
          <span className="h-2 w-2 rounded-full bg-success animate-pulse" />
          Atualizado agora
        </Badge>
      </motion.div>

      {/* KPI Cards */}
      <motion.div variants={itemVariants} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {statsCards.map((stat, index) => (
          <Card key={stat.title} className="stat-card overflow-hidden group">
            <CardContent className="p-5">
              <div className="flex items-start justify-between">
                <div className="space-y-2">
                  <p className="text-sm font-medium text-muted-foreground">{stat.title}</p>
                  <p className="text-2xl font-bold font-display">
                    {stat.isPercentage ? `${stat.value.toFixed(1)}%` : formatCurrency(stat.value)}
                  </p>
                  <div className={cn('flex items-center gap-1 text-sm font-medium', stat.variation >= 0 ? 'text-success' : 'text-destructive')}>
                    {stat.variation >= 0 ? <TrendingUp className="h-4 w-4" /> : <TrendingDown className="h-4 w-4" />}
                    {formatPercentage(stat.variation)}
                  </div>
                </div>
                <div className={cn('h-12 w-12 rounded-xl flex items-center justify-center transition-transform group-hover:scale-110',
                  stat.color === 'primary' && 'bg-primary/10 text-primary',
                  stat.color === 'success' && 'bg-success/10 text-success',
                  stat.color === 'destructive' && 'bg-destructive/10 text-destructive',
                  stat.color === 'warning' && 'bg-warning/10 text-warning'
                )}>
                  <stat.icon className="h-6 w-6" />
                </div>
              </div>
            </CardContent>
            <div className={cn('h-1 w-full',
              stat.color === 'primary' && 'bg-gradient-to-r from-primary to-primary/50',
              stat.color === 'success' && 'bg-gradient-to-r from-success to-success/50',
              stat.color === 'destructive' && 'bg-gradient-to-r from-destructive to-destructive/50',
              stat.color === 'warning' && 'bg-gradient-to-r from-warning to-warning/50'
            )} />
          </Card>
        ))}
      </motion.div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Fluxo de Caixa */}
        <motion.div variants={itemVariants} className="lg:col-span-2">
          <Card className="card-elevated h-[380px]">
            <CardHeader className="pb-2">
              <CardTitle className="text-lg font-display">Fluxo de Caixa Projetado</CardTitle>
            </CardHeader>
            <CardContent className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={kpis.fluxoCaixaProjetado}>
                  <defs>
                    <linearGradient id="colorReceitas" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="hsl(150, 70%, 32%)" stopOpacity={0.3}/>
                      <stop offset="95%" stopColor="hsl(150, 70%, 32%)" stopOpacity={0}/>
                    </linearGradient>
                    <linearGradient id="colorDespesas" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="hsl(0, 78%, 45%)" stopOpacity={0.3}/>
                      <stop offset="95%" stopColor="hsl(0, 78%, 45%)" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <XAxis dataKey="data" tickFormatter={(v) => v.slice(5)} stroke="hsl(var(--muted-foreground))" fontSize={12} />
                  <YAxis tickFormatter={(v) => `${(v/1000).toFixed(0)}K`} stroke="hsl(var(--muted-foreground))" fontSize={12} />
                  <Tooltip formatter={(v: number) => formatCurrency(v)} labelFormatter={(l) => `Data: ${l}`} />
                  <Area type="monotone" dataKey="receitas" stroke="hsl(150, 70%, 32%)" fill="url(#colorReceitas)" strokeWidth={2} />
                  <Area type="monotone" dataKey="despesas" stroke="hsl(0, 78%, 45%)" fill="url(#colorDespesas)" strokeWidth={2} />
                </AreaChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </motion.div>

        {/* Centro de Custos */}
        <motion.div variants={itemVariants}>
          <Card className="card-elevated h-[380px]">
            <CardHeader className="pb-2">
              <CardTitle className="text-lg font-display">Centro de Custos</CardTitle>
            </CardHeader>
            <CardContent className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie data={kpis.distribuicaoCentroCusto} dataKey="valor" nameKey="nome" cx="50%" cy="50%" innerRadius={60} outerRadius={90} paddingAngle={2}>
                    {kpis.distribuicaoCentroCusto.map((_, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip formatter={(v: number) => formatCurrency(v)} />
                </PieChart>
              </ResponsiveContainer>
              <div className="flex flex-wrap gap-2 justify-center -mt-4">
                {kpis.distribuicaoCentroCusto.slice(0, 3).map((item, i) => (
                  <Badge key={item.nome} variant="outline" className="text-xs">
                    <span className="h-2 w-2 rounded-full mr-1" style={{ background: COLORS[i] }} />
                    {item.nome}
                  </Badge>
                ))}
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>

      {/* Bottom Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Top Devedores */}
        <motion.div variants={itemVariants}>
          <Card className="card-elevated">
            <CardHeader>
              <CardTitle className="text-lg font-display flex items-center gap-2">
                <AlertTriangle className="h-5 w-5 text-warning" />
                Top Devedores
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {kpis.topDevedores.map((devedor, i) => (
                <div key={devedor.cliente} className="flex items-center justify-between p-3 rounded-lg bg-muted/50 hover:bg-muted transition-colors">
                  <div className="flex items-center gap-3">
                    <span className="h-8 w-8 rounded-full bg-destructive/10 text-destructive flex items-center justify-center text-sm font-bold">{i + 1}</span>
                    <div>
                      <p className="font-medium text-sm">{devedor.cliente}</p>
                      <p className="text-xs text-muted-foreground">{devedor.diasAtraso} dias em atraso</p>
                    </div>
                  </div>
                  <span className="font-bold text-destructive">{formatCurrency(devedor.valor)}</span>
                </div>
              ))}
            </CardContent>
          </Card>
        </motion.div>

        {/* Quick Actions */}
        <motion.div variants={itemVariants}>
          <Card className="card-elevated">
            <CardHeader>
              <CardTitle className="text-lg font-display">Resumo do Dia</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="p-4 rounded-xl bg-success/10 border border-success/20">
                  <div className="flex items-center gap-2 mb-2">
                    <CheckCircle2 className="h-5 w-5 text-success" />
                    <span className="text-sm font-medium">A Receber Hoje</span>
                  </div>
                  <p className="text-2xl font-bold text-success">{kpis.contasReceberHoje}</p>
                </div>
                <div className="p-4 rounded-xl bg-warning/10 border border-warning/20">
                  <div className="flex items-center gap-2 mb-2">
                    <Clock className="h-5 w-5 text-warning" />
                    <span className="text-sm font-medium">A Pagar Hoje</span>
                  </div>
                  <p className="text-2xl font-bold text-warning">{kpis.contasPagarHoje}</p>
                </div>
                <div className="p-4 rounded-xl bg-destructive/10 border border-destructive/20">
                  <div className="flex items-center gap-2 mb-2">
                    <AlertTriangle className="h-5 w-5 text-destructive" />
                    <span className="text-sm font-medium">Receber Vencidas</span>
                  </div>
                  <p className="text-2xl font-bold text-destructive">{kpis.contasReceberVencidas}</p>
                </div>
                <div className="p-4 rounded-xl bg-destructive/10 border border-destructive/20">
                  <div className="flex items-center gap-2 mb-2">
                    <AlertTriangle className="h-5 w-5 text-destructive" />
                    <span className="text-sm font-medium">Pagar Vencidas</span>
                  </div>
                  <p className="text-2xl font-bold text-destructive">{kpis.contasPagarVencidas}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </motion.div>
  );
};
