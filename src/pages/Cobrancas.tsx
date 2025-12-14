import { useState } from 'react';
import { motion } from 'framer-motion';
import {
  Send,
  Mail,
  MessageSquare,
  Phone,
  Smartphone,
  Target,
  TrendingUp,
  AlertTriangle,
  CheckCircle2,
  Clock,
  DollarSign,
  Filter,
  Plus,
  Settings,
  BarChart3,
  Eye,
  RefreshCcw,
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { mockContasReceber, mockTopDevedores } from '@/data/mockData';
import { formatCurrency, formatDate, calculateOverdueDays } from '@/lib/formatters';
import { cn } from '@/lib/utils';
import { MainLayout } from '@/components/layout/MainLayout';
import { 
  ResponsiveContainer, 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  Tooltip,
  PieChart,
  Pie,
  Cell,
} from 'recharts';

const containerVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.08 } },
} as const;

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { type: 'spring', stiffness: 300, damping: 24 } },
} as const;

// Régua de Cobrança - 5 Etapas
const etapasRegua = [
  { 
    id: 1, 
    nome: 'Preventiva', 
    dias: -3, 
    descricao: 'Lembrete 3 dias antes do vencimento',
    canal: 'Email',
    icon: Mail,
    cor: 'bg-secondary/10 text-secondary border-secondary/20',
  },
  { 
    id: 2, 
    nome: 'Vencimento', 
    dias: 0, 
    descricao: 'No dia do vencimento',
    canal: 'WhatsApp',
    icon: MessageSquare,
    cor: 'bg-warning/10 text-warning border-warning/20',
  },
  { 
    id: 3, 
    nome: 'Cobrança', 
    dias: 7, 
    descricao: '7 dias após vencimento',
    canal: 'Email + WhatsApp',
    icon: Send,
    cor: 'bg-primary/10 text-primary border-primary/20',
  },
  { 
    id: 4, 
    nome: 'Intensiva', 
    dias: 15, 
    descricao: '15 dias após vencimento',
    canal: 'Telefone',
    icon: Phone,
    cor: 'bg-destructive/10 text-destructive border-destructive/20',
  },
  { 
    id: 5, 
    nome: 'Jurídico', 
    dias: 30, 
    descricao: '30 dias após - Escalação',
    canal: 'Jurídico',
    icon: AlertTriangle,
    cor: 'bg-destructive/10 text-destructive border-destructive/20',
  },
];

// Métricas de canal mockadas
const metricsCanal = [
  { canal: 'Email', enviados: 150, abertos: 95, pagos: 45, taxaConversao: 30 },
  { canal: 'WhatsApp', enviados: 120, abertos: 110, pagos: 55, taxaConversao: 45.8 },
  { canal: 'SMS', enviados: 80, abertos: 72, pagos: 28, taxaConversao: 35 },
  { canal: 'Telefone', enviados: 50, abertos: 50, pagos: 32, taxaConversao: 64 },
];

const COLORS = ['hsl(215, 90%, 42%)', 'hsl(150, 70%, 32%)', 'hsl(42, 95%, 48%)', 'hsl(24, 95%, 46%)'];

export default function Cobrancas() {
  const [activeTab, setActiveTab] = useState('regua');
  
  const contasVencidas = mockContasReceber.filter(c => c.status === 'vencido');
  const devedores = mockTopDevedores;

  // KPIs
  const totalVencido = contasVencidas.reduce((sum, c) => sum + c.valor - (c.valorRecebido || 0), 0);
  const taxaRecuperacao = 32.5; // Mock
  const valorRecuperado = totalVencido * (taxaRecuperacao / 100);
  const cobrancasEnviadas = 350; // Mock
  const taxaAbertura = 78.5; // Mock

  // Dados para gráfico de aging
  const agingData = [
    { faixa: '1-7d', valor: 45000, qtd: 8 },
    { faixa: '8-15d', valor: 32000, qtd: 5 },
    { faixa: '16-30d', valor: 28000, qtd: 4 },
    { faixa: '31-60d', valor: 18000, qtd: 2 },
    { faixa: '60+d', valor: 15000, qtd: 1 },
  ];

  return (
    <MainLayout>
      <motion.div variants={containerVariants} initial="hidden" animate="visible" className="space-y-6">
        {/* Page Header */}
        <motion.div variants={itemVariants} className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div>
            <h1 className="text-display-md text-foreground">Cobrança</h1>
            <p className="text-muted-foreground mt-1">Régua de cobrança automatizada e gestão de inadimplência</p>
          </div>
          <div className="flex items-center gap-3">
            <Button variant="outline" size="sm" className="gap-2">
              <Settings className="h-4 w-4" />
              Configurar Régua
            </Button>
            <Button size="sm" className="gap-2 bg-gradient-to-r from-primary to-primary/80 hover:from-primary/90 hover:to-primary/70 shadow-lg shadow-primary/25">
              <Send className="h-4 w-4" />
              Enviar Cobranças
            </Button>
          </div>
        </motion.div>

        {/* KPI Cards */}
        <motion.div variants={itemVariants} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
          <Card className="stat-card group">
            <CardContent className="p-5">
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Total Vencido</p>
                  <p className="text-xl font-bold font-display mt-1 text-destructive">{formatCurrency(totalVencido)}</p>
                </div>
                <div className="h-10 w-10 rounded-xl bg-destructive/10 text-destructive flex items-center justify-center transition-transform group-hover:scale-110">
                  <DollarSign className="h-5 w-5" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="stat-card group">
            <CardContent className="p-5">
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Recuperado</p>
                  <p className="text-xl font-bold font-display mt-1 text-success">{formatCurrency(valorRecuperado)}</p>
                </div>
                <div className="h-10 w-10 rounded-xl bg-success/10 text-success flex items-center justify-center transition-transform group-hover:scale-110">
                  <CheckCircle2 className="h-5 w-5" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="stat-card group">
            <CardContent className="p-5">
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Taxa Recuperação</p>
                  <p className="text-xl font-bold font-display mt-1">{taxaRecuperacao}%</p>
                  <Progress value={taxaRecuperacao} className="h-1.5 mt-2" />
                </div>
                <div className="h-10 w-10 rounded-xl bg-primary/10 text-primary flex items-center justify-center transition-transform group-hover:scale-110">
                  <Target className="h-5 w-5" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="stat-card group">
            <CardContent className="p-5">
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Cobranças Enviadas</p>
                  <p className="text-xl font-bold font-display mt-1">{cobrancasEnviadas}</p>
                  <p className="text-xs text-muted-foreground mt-1">Últimos 30 dias</p>
                </div>
                <div className="h-10 w-10 rounded-xl bg-secondary/10 text-secondary flex items-center justify-center transition-transform group-hover:scale-110">
                  <Send className="h-5 w-5" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="stat-card group">
            <CardContent className="p-5">
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Taxa Abertura</p>
                  <p className="text-xl font-bold font-display mt-1">{taxaAbertura}%</p>
                  <p className="text-xs text-success mt-1 flex items-center gap-1">
                    <TrendingUp className="h-3 w-3" /> +5.2%
                  </p>
                </div>
                <div className="h-10 w-10 rounded-xl bg-accent/10 text-accent flex items-center justify-center transition-transform group-hover:scale-110">
                  <Eye className="h-5 w-5" />
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Régua de Cobrança Visual */}
        <motion.div variants={itemVariants}>
          <Card className="card-elevated">
            <CardHeader>
              <CardTitle className="text-lg font-display flex items-center gap-2">
                <RefreshCcw className="h-5 w-5 text-primary" />
                Régua de Cobrança Automática
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between overflow-x-auto pb-4">
                {etapasRegua.map((etapa, index) => {
                  const EtapaIcon = etapa.icon;
                  return (
                    <div key={etapa.id} className="flex items-center">
                      <motion.div
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: index * 0.1 }}
                        className={cn(
                          "flex flex-col items-center p-4 rounded-xl border min-w-[140px] transition-all hover:shadow-md cursor-pointer",
                          etapa.cor
                        )}
                      >
                        <div className="h-12 w-12 rounded-full bg-background flex items-center justify-center mb-2">
                          <EtapaIcon className="h-6 w-6" />
                        </div>
                        <h4 className="font-semibold text-sm">{etapa.nome}</h4>
                        <p className="text-xs text-muted-foreground mt-1 text-center">{etapa.descricao}</p>
                        <Badge variant="outline" className="mt-2 text-xs">
                          {etapa.canal}
                        </Badge>
                      </motion.div>
                      {index < etapasRegua.length - 1 && (
                        <div className="w-8 h-0.5 bg-border mx-2 hidden lg:block" />
                      )}
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Charts e Devedores */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Aging Chart */}
          <motion.div variants={itemVariants} className="lg:col-span-2">
            <Card className="card-elevated h-[380px]">
              <CardHeader className="pb-2">
                <CardTitle className="text-lg font-display flex items-center gap-2">
                  <BarChart3 className="h-5 w-5 text-primary" />
                  Aging de Inadimplência
                </CardTitle>
              </CardHeader>
              <CardContent className="h-[300px]">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={agingData}>
                    <XAxis dataKey="faixa" stroke="hsl(var(--muted-foreground))" fontSize={12} />
                    <YAxis tickFormatter={(v) => `${(v/1000).toFixed(0)}K`} stroke="hsl(var(--muted-foreground))" fontSize={12} />
                    <Tooltip 
                      formatter={(v: number, name) => [formatCurrency(v), name === 'valor' ? 'Valor' : 'Qtd']}
                      contentStyle={{
                        background: 'hsl(var(--card))',
                        border: '1px solid hsl(var(--border))',
                        borderRadius: '8px',
                      }}
                    />
                    <Bar dataKey="valor" fill="hsl(0, 78%, 45%)" radius={[4, 4, 0, 0]} name="Valor" />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </motion.div>

          {/* Top Devedores */}
          <motion.div variants={itemVariants}>
            <Card className="card-elevated h-[380px]">
              <CardHeader className="pb-2">
                <CardTitle className="text-lg font-display flex items-center gap-2">
                  <AlertTriangle className="h-5 w-5 text-destructive" />
                  Top Devedores
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3 overflow-y-auto max-h-[300px]">
                {devedores.map((devedor, index) => (
                  <motion.div
                    key={devedor.cliente}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.08 }}
                    className="flex items-center justify-between p-3 rounded-lg bg-destructive/5 border border-destructive/10 hover:bg-destructive/10 transition-colors cursor-pointer"
                  >
                    <div className="flex items-center gap-3">
                      <span className="h-8 w-8 rounded-full bg-destructive/20 text-destructive flex items-center justify-center text-sm font-bold">
                        {index + 1}
                      </span>
                      <div>
                        <p className="font-medium text-sm">{devedor.cliente}</p>
                        <p className="text-xs text-muted-foreground">{devedor.diasAtraso} dias</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="font-bold text-destructive text-sm">{formatCurrency(devedor.valor)}</p>
                      <Badge variant="outline" className={cn("text-xs mt-1",
                        devedor.score >= 700 ? "text-success" : devedor.score >= 500 ? "text-warning" : "text-destructive"
                      )}>
                        Score: {devedor.score}
                      </Badge>
                    </div>
                  </motion.div>
                ))}
              </CardContent>
            </Card>
          </motion.div>
        </div>

        {/* Métricas por Canal */}
        <motion.div variants={itemVariants}>
          <Card className="card-elevated">
            <CardHeader>
              <CardTitle className="text-lg font-display flex items-center gap-2">
                <BarChart3 className="h-5 w-5 text-primary" />
                Performance por Canal
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                {metricsCanal.map((canal, index) => (
                  <motion.div
                    key={canal.canal}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className="p-4 rounded-xl border border-border hover:border-primary/30 transition-colors"
                  >
                    <div className="flex items-center gap-2 mb-3">
                      {canal.canal === 'Email' && <Mail className="h-5 w-5 text-secondary" />}
                      {canal.canal === 'WhatsApp' && <MessageSquare className="h-5 w-5 text-success" />}
                      {canal.canal === 'SMS' && <Smartphone className="h-5 w-5 text-warning" />}
                      {canal.canal === 'Telefone' && <Phone className="h-5 w-5 text-primary" />}
                      <span className="font-semibold">{canal.canal}</span>
                    </div>
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span className="text-muted-foreground">Enviados</span>
                        <span className="font-medium">{canal.enviados}</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-muted-foreground">Abertos</span>
                        <span className="font-medium">{canal.abertos}</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-muted-foreground">Pagos</span>
                        <span className="font-medium text-success">{canal.pagos}</span>
                      </div>
                      <div className="pt-2 border-t border-border">
                        <div className="flex justify-between items-center">
                          <span className="text-sm text-muted-foreground">Conversão</span>
                          <Badge className={cn(
                            canal.taxaConversao >= 50 ? "bg-success text-success-foreground" :
                            canal.taxaConversao >= 35 ? "bg-warning text-warning-foreground" :
                            "bg-destructive text-destructive-foreground"
                          )}>
                            {canal.taxaConversao}%
                          </Badge>
                        </div>
                        <Progress value={canal.taxaConversao} className="h-1.5 mt-2" />
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </motion.div>
    </MainLayout>
  );
}
