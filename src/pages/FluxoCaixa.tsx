import { useState } from 'react';
import { motion } from 'framer-motion';
import {
  Calendar,
  TrendingUp,
  TrendingDown,
  ArrowUpCircle,
  ArrowDownCircle,
  Wallet,
  AlertTriangle,
  BarChart3,
  LineChart as LineChartIcon,
  Filter,
  Download,
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { mockFluxoCaixaProjetado, mockDashboardKPIs } from '@/data/mockData';
import { formatCurrency } from '@/lib/formatters';
import { cn } from '@/lib/utils';
import { MainLayout } from '@/components/layout/MainLayout';
import { 
  ResponsiveContainer, 
  AreaChart, 
  Area, 
  XAxis, 
  YAxis, 
  Tooltip, 
  CartesianGrid,
  ComposedChart,
  Bar,
  Line,
  Legend,
} from 'recharts';

const containerVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.08 } },
} as const;

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { type: 'spring', stiffness: 300, damping: 24 } },
} as const;

export default function FluxoCaixa() {
  const [periodo, setPeriodo] = useState('30d');
  const fluxo = mockFluxoCaixaProjetado;
  const kpis = mockDashboardKPIs;

  // Calcular totais
  const totalReceitas = fluxo.reduce((sum, f) => sum + f.receitas, 0);
  const totalDespesas = fluxo.reduce((sum, f) => sum + f.despesas, 0);
  const saldoFinal = fluxo[fluxo.length - 1]?.saldo || 0;
  const saldoInicial = fluxo[0]?.saldo - fluxo[0]?.receitas + fluxo[0]?.despesas || 0;
  const variacao = saldoFinal - saldoInicial;

  // Identificar dias críticos (saldo negativo ou baixo)
  const diasCriticos = fluxo.filter(f => f.saldo < 100000).length;

  // Dados para gráfico de barras
  const barData = fluxo.map(f => ({
    ...f,
    data: f.data.slice(5), // Remove ano para exibição
    liquido: f.receitas - f.despesas,
  }));

  return (
    <MainLayout>
      <motion.div variants={containerVariants} initial="hidden" animate="visible" className="space-y-6">
        {/* Page Header */}
        <motion.div variants={itemVariants} className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div>
            <h1 className="text-display-md text-foreground">Fluxo de Caixa</h1>
            <p className="text-muted-foreground mt-1">Projeção financeira e análise de liquidez</p>
          </div>
          <div className="flex items-center gap-3">
            <Tabs value={periodo} onValueChange={setPeriodo}>
              <TabsList className="h-9">
                <TabsTrigger value="7d" className="text-xs px-3">7 dias</TabsTrigger>
                <TabsTrigger value="15d" className="text-xs px-3">15 dias</TabsTrigger>
                <TabsTrigger value="30d" className="text-xs px-3">30 dias</TabsTrigger>
                <TabsTrigger value="90d" className="text-xs px-3">90 dias</TabsTrigger>
              </TabsList>
            </Tabs>
            <Button variant="outline" size="sm" className="gap-2">
              <Download className="h-4 w-4" />
              Exportar
            </Button>
          </div>
        </motion.div>

        {/* KPI Cards */}
        <motion.div variants={itemVariants} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
          <Card className="stat-card group">
            <CardContent className="p-5">
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Saldo Atual</p>
                  <p className="text-xl font-bold font-display mt-1">{formatCurrency(kpis.saldoTotal)}</p>
                </div>
                <div className="h-10 w-10 rounded-xl bg-primary/10 text-primary flex items-center justify-center transition-transform group-hover:scale-110">
                  <Wallet className="h-5 w-5" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="stat-card group">
            <CardContent className="p-5">
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Entradas</p>
                  <p className="text-xl font-bold font-display mt-1 text-success">{formatCurrency(totalReceitas)}</p>
                </div>
                <div className="h-10 w-10 rounded-xl bg-success/10 text-success flex items-center justify-center transition-transform group-hover:scale-110">
                  <ArrowDownCircle className="h-5 w-5" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="stat-card group">
            <CardContent className="p-5">
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Saídas</p>
                  <p className="text-xl font-bold font-display mt-1 text-destructive">{formatCurrency(totalDespesas)}</p>
                </div>
                <div className="h-10 w-10 rounded-xl bg-destructive/10 text-destructive flex items-center justify-center transition-transform group-hover:scale-110">
                  <ArrowUpCircle className="h-5 w-5" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="stat-card group">
            <CardContent className="p-5">
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Saldo Projetado</p>
                  <p className="text-xl font-bold font-display mt-1">{formatCurrency(saldoFinal)}</p>
                  <div className={cn("flex items-center gap-1 text-xs font-medium mt-1", variacao >= 0 ? "text-success" : "text-destructive")}>
                    {variacao >= 0 ? <TrendingUp className="h-3 w-3" /> : <TrendingDown className="h-3 w-3" />}
                    {formatCurrency(variacao)}
                  </div>
                </div>
                <div className={cn(
                  "h-10 w-10 rounded-xl flex items-center justify-center transition-transform group-hover:scale-110",
                  variacao >= 0 ? "bg-success/10 text-success" : "bg-destructive/10 text-destructive"
                )}>
                  {variacao >= 0 ? <TrendingUp className="h-5 w-5" /> : <TrendingDown className="h-5 w-5" />}
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className={cn("stat-card group", diasCriticos > 0 && "border-warning")}>
            <CardContent className="p-5">
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Dias Críticos</p>
                  <p className="text-xl font-bold font-display mt-1">{diasCriticos}</p>
                  <p className="text-xs text-muted-foreground mt-1">Saldo &lt; R$ 100k</p>
                </div>
                <div className={cn(
                  "h-10 w-10 rounded-xl flex items-center justify-center transition-transform group-hover:scale-110",
                  diasCriticos > 0 ? "bg-warning/10 text-warning" : "bg-success/10 text-success"
                )}>
                  {diasCriticos > 0 ? <AlertTriangle className="h-5 w-5" /> : <Calendar className="h-5 w-5" />}
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Charts */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Área Chart - Fluxo Acumulado */}
          <motion.div variants={itemVariants}>
            <Card className="card-elevated h-[400px]">
              <CardHeader className="pb-2">
                <CardTitle className="text-lg font-display flex items-center gap-2">
                  <LineChartIcon className="h-5 w-5 text-primary" />
                  Saldo Projetado
                </CardTitle>
              </CardHeader>
              <CardContent className="h-[320px]">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={fluxo}>
                    <defs>
                      <linearGradient id="colorSaldo" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="hsl(24, 95%, 46%)" stopOpacity={0.3}/>
                        <stop offset="95%" stopColor="hsl(24, 95%, 46%)" stopOpacity={0}/>
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                    <XAxis 
                      dataKey="data" 
                      tickFormatter={(v) => v.slice(5)} 
                      stroke="hsl(var(--muted-foreground))" 
                      fontSize={12} 
                    />
                    <YAxis 
                      tickFormatter={(v) => `${(v/1000).toFixed(0)}K`} 
                      stroke="hsl(var(--muted-foreground))" 
                      fontSize={12} 
                    />
                    <Tooltip 
                      formatter={(v: number) => formatCurrency(v)} 
                      labelFormatter={(l) => `Data: ${l}`}
                      contentStyle={{
                        background: 'hsl(var(--card))',
                        border: '1px solid hsl(var(--border))',
                        borderRadius: '8px',
                      }}
                    />
                    <Area 
                      type="monotone" 
                      dataKey="saldo" 
                      stroke="hsl(24, 95%, 46%)" 
                      fill="url(#colorSaldo)" 
                      strokeWidth={2}
                      name="Saldo"
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </motion.div>

          {/* Composed Chart - Entradas x Saídas */}
          <motion.div variants={itemVariants}>
            <Card className="card-elevated h-[400px]">
              <CardHeader className="pb-2">
                <CardTitle className="text-lg font-display flex items-center gap-2">
                  <BarChart3 className="h-5 w-5 text-primary" />
                  Entradas vs Saídas
                </CardTitle>
              </CardHeader>
              <CardContent className="h-[320px]">
                <ResponsiveContainer width="100%" height="100%">
                  <ComposedChart data={barData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                    <XAxis 
                      dataKey="data" 
                      stroke="hsl(var(--muted-foreground))" 
                      fontSize={12} 
                    />
                    <YAxis 
                      tickFormatter={(v) => `${(v/1000).toFixed(0)}K`} 
                      stroke="hsl(var(--muted-foreground))" 
                      fontSize={12} 
                    />
                    <Tooltip 
                      formatter={(v: number) => formatCurrency(v)}
                      contentStyle={{
                        background: 'hsl(var(--card))',
                        border: '1px solid hsl(var(--border))',
                        borderRadius: '8px',
                      }}
                    />
                    <Legend />
                    <Bar dataKey="receitas" fill="hsl(150, 70%, 32%)" name="Receitas" radius={[4, 4, 0, 0]} />
                    <Bar dataKey="despesas" fill="hsl(0, 78%, 45%)" name="Despesas" radius={[4, 4, 0, 0]} />
                    <Line type="monotone" dataKey="liquido" stroke="hsl(24, 95%, 46%)" strokeWidth={2} name="Líquido" dot={false} />
                  </ComposedChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </motion.div>
        </div>

        {/* Tabela de Projeção Diária */}
        <motion.div variants={itemVariants}>
          <Card className="card-elevated">
            <CardHeader>
              <CardTitle className="text-lg font-display flex items-center gap-2">
                <Calendar className="h-5 w-5 text-primary" />
                Projeção Diária
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3">
                {fluxo.slice(0, 15).map((dia, index) => {
                  const liquido = dia.receitas - dia.despesas;
                  const isPositivo = liquido >= 0;
                  
                  return (
                    <motion.div
                      key={dia.data}
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ delay: index * 0.03 }}
                      className={cn(
                        "p-3 rounded-xl border transition-all hover:shadow-md",
                        isPositivo ? "bg-success/5 border-success/20" : "bg-destructive/5 border-destructive/20"
                      )}
                    >
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-xs text-muted-foreground font-medium">
                          {new Date(dia.data).toLocaleDateString('pt-BR', { weekday: 'short', day: '2-digit' })}
                        </span>
                        <Badge variant="outline" className={cn("text-xs h-5 px-1.5", isPositivo ? "text-success" : "text-destructive")}>
                          {isPositivo ? '+' : ''}{formatCurrency(liquido).replace('R$', '')}
                        </Badge>
                      </div>
                      <div className="space-y-1">
                        <div className="flex justify-between text-xs">
                          <span className="text-success">+ {formatCurrency(dia.receitas).replace('R$', '')}</span>
                        </div>
                        <div className="flex justify-between text-xs">
                          <span className="text-destructive">- {formatCurrency(dia.despesas).replace('R$', '')}</span>
                        </div>
                      </div>
                      <div className="mt-2 pt-2 border-t border-border/50">
                        <p className="text-xs text-muted-foreground">Saldo</p>
                        <p className="text-sm font-semibold">{formatCurrency(dia.saldo)}</p>
                      </div>
                    </motion.div>
                  );
                })}
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </motion.div>
    </MainLayout>
  );
}
