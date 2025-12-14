import { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  Zap,
  RefreshCw,
  CheckCircle2,
  XCircle,
  Clock,
  AlertTriangle,
  ArrowRight,
  ArrowLeftRight,
  Settings,
  Play,
  Pause,
  History,
  Database,
  Users,
  FileText,
  DollarSign,
  Building2,
  Link2,
  Unlink,
  ChevronRight,
  ExternalLink,
  Filter,
  Download
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Separator } from '@/components/ui/separator';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { ScrollArea } from '@/components/ui/scroll-area';
import { cn } from '@/lib/utils';
import { useToast } from '@/hooks/use-toast';
import { formatCurrency } from '@/lib/formatters';

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.05 }
  }
};

const itemVariants = {
  hidden: { opacity: 0, y: 10 },
  visible: { opacity: 1, y: 0 }
};

interface SyncLog {
  id: string;
  timestamp: Date;
  tipo: 'entrada' | 'saida' | 'alteracao';
  entidade: string;
  status: 'sucesso' | 'erro' | 'parcial';
  registros: number;
  erros: number;
  mensagem: string;
}

interface Deal {
  id: string;
  bitrixId: string;
  titulo: string;
  valor: number;
  etapa: string;
  responsavel: string;
  empresa: string;
  dataCriacao: Date;
  sincronizado: boolean;
  contaReceberId?: string;
}

interface FieldMapping {
  id: string;
  campoOrigem: string;
  campoDestino: string;
  transformacao?: string;
  ativo: boolean;
}

const mockSyncLogs: SyncLog[] = [
  { id: '1', timestamp: new Date(Date.now() - 300000), tipo: 'entrada', entidade: 'Deals', status: 'sucesso', registros: 15, erros: 0, mensagem: 'Sincronização concluída com sucesso' },
  { id: '2', timestamp: new Date(Date.now() - 900000), tipo: 'saida', entidade: 'Pagamentos', status: 'sucesso', registros: 8, erros: 0, mensagem: 'Status de pagamentos atualizados' },
  { id: '3', timestamp: new Date(Date.now() - 1800000), tipo: 'entrada', entidade: 'Contatos', status: 'parcial', registros: 45, erros: 3, mensagem: '3 contatos com dados incompletos' },
  { id: '4', timestamp: new Date(Date.now() - 3600000), tipo: 'alteracao', entidade: 'Deals', status: 'erro', registros: 0, erros: 1, mensagem: 'Erro de conexão com API' },
  { id: '5', timestamp: new Date(Date.now() - 7200000), tipo: 'entrada', entidade: 'Empresas', status: 'sucesso', registros: 12, erros: 0, mensagem: 'Sincronização concluída' },
];

const mockDeals: Deal[] = [
  { id: '1', bitrixId: 'D-1001', titulo: 'Brindes Corporativos - Empresa ABC', valor: 15000, etapa: 'Proposta Enviada', responsavel: 'João Silva', empresa: 'ABC Ltda', dataCriacao: new Date(Date.now() - 86400000 * 2), sincronizado: true, contaReceberId: 'CR001' },
  { id: '2', bitrixId: 'D-1002', titulo: 'Material Promocional - XYZ Corp', valor: 8500, etapa: 'Negociação', responsavel: 'Maria Santos', empresa: 'XYZ Corp', dataCriacao: new Date(Date.now() - 86400000 * 5), sincronizado: true, contaReceberId: 'CR002' },
  { id: '3', bitrixId: 'D-1003', titulo: 'Kits Executivos - Tech Solutions', valor: 25000, etapa: 'Fechado/Ganho', responsavel: 'Pedro Costa', empresa: 'Tech Solutions', dataCriacao: new Date(Date.now() - 86400000 * 10), sincronizado: true, contaReceberId: 'CR003' },
  { id: '4', bitrixId: 'D-1004', titulo: 'Uniformes - Global Services', valor: 12000, etapa: 'Qualificação', responsavel: 'Ana Lima', empresa: 'Global Services', dataCriacao: new Date(Date.now() - 86400000), sincronizado: false },
  { id: '5', bitrixId: 'D-1005', titulo: 'Brindes Natal - Mega Store', valor: 45000, etapa: 'Proposta Enviada', responsavel: 'João Silva', empresa: 'Mega Store', dataCriacao: new Date(Date.now() - 86400000 * 3), sincronizado: false },
];

const mockFieldMappings: FieldMapping[] = [
  { id: '1', campoOrigem: 'TITLE', campoDestino: 'descricao', ativo: true },
  { id: '2', campoOrigem: 'OPPORTUNITY', campoDestino: 'valor', transformacao: 'number', ativo: true },
  { id: '3', campoOrigem: 'COMPANY_ID', campoDestino: 'clienteId', ativo: true },
  { id: '4', campoOrigem: 'CLOSEDATE', campoDestino: 'dataVencimento', transformacao: 'date', ativo: true },
  { id: '5', campoOrigem: 'STAGE_ID', campoDestino: 'status', transformacao: 'mapStage', ativo: true },
  { id: '6', campoOrigem: 'ASSIGNED_BY_ID', campoDestino: 'responsavelId', ativo: false },
  { id: '7', campoOrigem: 'UF_CRM_PAYMENT_TYPE', campoDestino: 'tipoCobranca', transformacao: 'mapPayment', ativo: true },
];

export default function Bitrix24() {
  const [isConnected, setIsConnected] = useState(true);
  const [isSyncing, setIsSyncing] = useState(false);
  const [syncProgress, setSyncProgress] = useState(0);
  const [autoSync, setAutoSync] = useState(true);
  const [syncInterval, setSyncInterval] = useState('15');
  const [fieldMappings, setFieldMappings] = useState<FieldMapping[]>(mockFieldMappings);
  const { toast } = useToast();

  const handleSync = () => {
    setIsSyncing(true);
    setSyncProgress(0);
    
    const interval = setInterval(() => {
      setSyncProgress(prev => {
        if (prev >= 100) {
          clearInterval(interval);
          setIsSyncing(false);
          toast({
            title: "Sincronização concluída",
            description: "Todos os dados foram atualizados com sucesso.",
          });
          return 100;
        }
        return prev + 10;
      });
    }, 300);
  };

  const handleConnect = () => {
    setIsConnected(!isConnected);
    toast({
      title: isConnected ? "Desconectado" : "Conectado",
      description: isConnected ? "Integração com Bitrix24 desativada" : "Integração com Bitrix24 ativada com sucesso",
    });
  };

  const toggleFieldMapping = (id: string) => {
    setFieldMappings(prev => prev.map(f => 
      f.id === id ? { ...f, ativo: !f.ativo } : f
    ));
  };

  const formatRelativeTime = (date: Date) => {
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    
    if (diffMins < 60) return `${diffMins}min atrás`;
    if (diffHours < 24) return `${diffHours}h atrás`;
    return date.toLocaleDateString('pt-BR');
  };

  const syncStats = {
    ultimaSync: new Date(Date.now() - 300000),
    totalSincronizados: 156,
    dealsImportados: mockDeals.filter(d => d.sincronizado).length,
    pendentes: mockDeals.filter(d => !d.sincronizado).length,
    errosHoje: 1
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="p-3 rounded-xl bg-gradient-to-br from-blue-500 to-blue-600 shadow-lg">
            <Zap className="h-6 w-6 text-white" />
          </div>
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Bitrix24</h1>
            <p className="text-muted-foreground">
              Integração e sincronização de dados
            </p>
          </div>
        </div>
        <div className="flex gap-2">
          <Button 
            variant="outline" 
            onClick={handleConnect}
            className={cn(
              isConnected ? "border-green-500 text-green-600" : "border-destructive text-destructive"
            )}
          >
            {isConnected ? (
              <>
                <Link2 className="h-4 w-4 mr-2" />
                Conectado
              </>
            ) : (
              <>
                <Unlink className="h-4 w-4 mr-2" />
                Desconectado
              </>
            )}
          </Button>
          <Button onClick={handleSync} disabled={isSyncing || !isConnected}>
            <RefreshCw className={cn("h-4 w-4 mr-2", isSyncing && "animate-spin")} />
            {isSyncing ? 'Sincronizando...' : 'Sincronizar Agora'}
          </Button>
        </div>
      </div>

      {/* Progress Bar (durante sync) */}
      {isSyncing && (
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-4">
              <RefreshCw className="h-5 w-5 animate-spin text-primary" />
              <div className="flex-1">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium">Sincronizando dados...</span>
                  <span className="text-sm text-muted-foreground">{syncProgress}%</span>
                </div>
                <Progress value={syncProgress} className="h-2" />
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* KPIs */}
      <motion.div 
        className="grid grid-cols-2 lg:grid-cols-5 gap-4"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        <motion.div variants={itemVariants}>
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className={cn(
                  "p-2 rounded-lg",
                  isConnected ? "bg-green-100 dark:bg-green-900/30" : "bg-red-100 dark:bg-red-900/30"
                )}>
                  {isConnected ? (
                    <CheckCircle2 className="h-5 w-5 text-green-600" />
                  ) : (
                    <XCircle className="h-5 w-5 text-red-500" />
                  )}
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">Status</p>
                  <p className={cn(
                    "font-semibold",
                    isConnected ? "text-green-600" : "text-red-500"
                  )}>
                    {isConnected ? 'Online' : 'Offline'}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div variants={itemVariants}>
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-blue-100 dark:bg-blue-900/30">
                  <Clock className="h-5 w-5 text-blue-600" />
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">Última Sync</p>
                  <p className="font-semibold">{formatRelativeTime(syncStats.ultimaSync)}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div variants={itemVariants}>
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-purple-100 dark:bg-purple-900/30">
                  <Database className="h-5 w-5 text-purple-600" />
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">Sincronizados</p>
                  <p className="font-semibold">{syncStats.totalSincronizados}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div variants={itemVariants}>
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-orange-100 dark:bg-orange-900/30">
                  <AlertTriangle className="h-5 w-5 text-orange-500" />
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">Pendentes</p>
                  <p className="font-semibold">{syncStats.pendentes}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div variants={itemVariants}>
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-red-100 dark:bg-red-900/30">
                  <XCircle className="h-5 w-5 text-red-500" />
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">Erros Hoje</p>
                  <p className="font-semibold">{syncStats.errosHoje}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </motion.div>

      <Tabs defaultValue="deals" className="space-y-6">
        <TabsList>
          <TabsTrigger value="deals" className="gap-2">
            <DollarSign className="h-4 w-4" />
            Deals Importados
          </TabsTrigger>
          <TabsTrigger value="mapping" className="gap-2">
            <ArrowLeftRight className="h-4 w-4" />
            Mapeamento
          </TabsTrigger>
          <TabsTrigger value="logs" className="gap-2">
            <History className="h-4 w-4" />
            Histórico
          </TabsTrigger>
          <TabsTrigger value="config" className="gap-2">
            <Settings className="h-4 w-4" />
            Configuração
          </TabsTrigger>
        </TabsList>

        {/* Deals Importados */}
        <TabsContent value="deals">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>Deals do Bitrix24</CardTitle>
                  <CardDescription>
                    Negócios sincronizados e vinculados a contas a receber
                  </CardDescription>
                </div>
                <div className="flex gap-2">
                  <Button variant="outline" size="sm">
                    <Filter className="h-4 w-4 mr-2" />
                    Filtrar
                  </Button>
                  <Button variant="outline" size="sm">
                    <Download className="h-4 w-4 mr-2" />
                    Exportar
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>ID Bitrix</TableHead>
                    <TableHead>Título</TableHead>
                    <TableHead>Empresa</TableHead>
                    <TableHead>Etapa</TableHead>
                    <TableHead className="text-right">Valor</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="w-12"></TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {mockDeals.map((deal) => (
                    <TableRow key={deal.id}>
                      <TableCell>
                        <Badge variant="outline" className="font-mono">
                          {deal.bitrixId}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <div>
                          <p className="font-medium">{deal.titulo}</p>
                          <p className="text-xs text-muted-foreground">{deal.responsavel}</p>
                        </div>
                      </TableCell>
                      <TableCell>{deal.empresa}</TableCell>
                      <TableCell>
                        <Badge variant="secondary">{deal.etapa}</Badge>
                      </TableCell>
                      <TableCell className="text-right font-medium">
                        {formatCurrency(deal.valor)}
                      </TableCell>
                      <TableCell>
                        {deal.sincronizado ? (
                          <Badge className="bg-green-500 gap-1">
                            <CheckCircle2 className="h-3 w-3" />
                            Vinculado
                          </Badge>
                        ) : (
                          <Badge variant="outline" className="text-orange-500 border-orange-500 gap-1">
                            <Clock className="h-3 w-3" />
                            Pendente
                          </Badge>
                        )}
                      </TableCell>
                      <TableCell>
                        <Button variant="ghost" size="icon">
                          <ExternalLink className="h-4 w-4" />
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Mapeamento de Campos */}
        <TabsContent value="mapping">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>Mapeamento de Campos</CardTitle>
                  <CardDescription>
                    Configure como os campos do Bitrix24 são convertidos para o sistema financeiro
                  </CardDescription>
                </div>
                <Button>
                  <Settings className="h-4 w-4 mr-2" />
                  Novo Mapeamento
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {fieldMappings.map((mapping) => (
                  <motion.div 
                    key={mapping.id}
                    variants={itemVariants}
                    className={cn(
                      "flex items-center gap-4 p-4 rounded-lg border transition-all",
                      mapping.ativo ? "bg-card" : "bg-muted/50 opacity-60"
                    )}
                  >
                    <div className="flex-1 grid grid-cols-3 gap-4 items-center">
                      <div className="p-3 rounded-lg bg-blue-100 dark:bg-blue-900/30">
                        <p className="text-xs text-muted-foreground mb-1">Bitrix24</p>
                        <code className="font-mono text-sm font-medium">{mapping.campoOrigem}</code>
                      </div>
                      
                      <div className="flex items-center justify-center">
                        <div className="flex items-center gap-2">
                          <div className="h-px w-8 bg-border" />
                          {mapping.transformacao ? (
                            <Badge variant="outline" className="text-xs">
                              {mapping.transformacao}
                            </Badge>
                          ) : (
                            <ArrowRight className="h-4 w-4 text-muted-foreground" />
                          )}
                          <div className="h-px w-8 bg-border" />
                        </div>
                      </div>

                      <div className="p-3 rounded-lg bg-green-100 dark:bg-green-900/30">
                        <p className="text-xs text-muted-foreground mb-1">Sistema Financeiro</p>
                        <code className="font-mono text-sm font-medium">{mapping.campoDestino}</code>
                      </div>
                    </div>

                    <Switch 
                      checked={mapping.ativo}
                      onCheckedChange={() => toggleFieldMapping(mapping.id)}
                    />
                  </motion.div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Histórico de Sincronização */}
        <TabsContent value="logs">
          <Card>
            <CardHeader>
              <CardTitle>Histórico de Sincronização</CardTitle>
              <CardDescription>
                Logs das últimas operações de sincronização
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ScrollArea className="h-[400px]">
                <div className="space-y-3">
                  {mockSyncLogs.map((log) => (
                    <motion.div 
                      key={log.id}
                      variants={itemVariants}
                      className="flex items-start gap-4 p-4 rounded-lg border"
                    >
                      <div className={cn(
                        "p-2 rounded-lg",
                        log.status === 'sucesso' && "bg-green-100 dark:bg-green-900/30",
                        log.status === 'erro' && "bg-red-100 dark:bg-red-900/30",
                        log.status === 'parcial' && "bg-yellow-100 dark:bg-yellow-900/30"
                      )}>
                        {log.status === 'sucesso' && <CheckCircle2 className="h-5 w-5 text-green-600" />}
                        {log.status === 'erro' && <XCircle className="h-5 w-5 text-red-500" />}
                        {log.status === 'parcial' && <AlertTriangle className="h-5 w-5 text-yellow-600" />}
                      </div>

                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <Badge variant={
                            log.tipo === 'entrada' ? 'default' :
                            log.tipo === 'saida' ? 'secondary' : 'outline'
                          }>
                            {log.tipo === 'entrada' ? 'Entrada' : 
                             log.tipo === 'saida' ? 'Saída' : 'Alteração'}
                          </Badge>
                          <span className="font-medium">{log.entidade}</span>
                          <span className="text-xs text-muted-foreground">
                            {formatRelativeTime(log.timestamp)}
                          </span>
                        </div>
                        <p className="text-sm text-muted-foreground">{log.mensagem}</p>
                        <div className="flex items-center gap-4 mt-2 text-xs">
                          <span className="text-green-600">{log.registros} registros</span>
                          {log.erros > 0 && (
                            <span className="text-red-500">{log.erros} erros</span>
                          )}
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </ScrollArea>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Configuração */}
        <TabsContent value="config">
          <div className="grid gap-6 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>Conexão API</CardTitle>
                <CardDescription>
                  Configurações de conexão com o Bitrix24
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid gap-2">
                  <Label>URL do Portal</Label>
                  <Input 
                    placeholder="https://suaempresa.bitrix24.com.br" 
                    defaultValue="https://promobrindes.bitrix24.com.br"
                  />
                </div>
                <div className="grid gap-2">
                  <Label>Webhook Token</Label>
                  <Input 
                    type="password" 
                    defaultValue="••••••••••••••••"
                  />
                </div>
                <Button className="w-full">
                  <CheckCircle2 className="h-4 w-4 mr-2" />
                  Testar Conexão
                </Button>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Sincronização Automática</CardTitle>
                <CardDescription>
                  Configure a frequência de sincronização
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium">Sync Automática</p>
                    <p className="text-sm text-muted-foreground">Sincronizar dados automaticamente</p>
                  </div>
                  <Switch 
                    checked={autoSync}
                    onCheckedChange={setAutoSync}
                  />
                </div>
                <Separator />
                <div className="grid gap-2">
                  <Label>Intervalo de Sincronização</Label>
                  <Select value={syncInterval} onValueChange={setSyncInterval}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="5">A cada 5 minutos</SelectItem>
                      <SelectItem value="15">A cada 15 minutos</SelectItem>
                      <SelectItem value="30">A cada 30 minutos</SelectItem>
                      <SelectItem value="60">A cada 1 hora</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="grid gap-2">
                  <Label>Entidades para Sincronizar</Label>
                  <div className="space-y-2">
                    {['Deals', 'Contatos', 'Empresas', 'Pagamentos'].map(entity => (
                      <div key={entity} className="flex items-center justify-between p-2 rounded-lg bg-muted/50">
                        <span className="text-sm">{entity}</span>
                        <Switch defaultChecked />
                      </div>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
