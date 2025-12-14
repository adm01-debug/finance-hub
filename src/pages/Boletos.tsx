import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MainLayout } from '@/components/layout/MainLayout';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Separator } from '@/components/ui/separator';
import { 
  FileText, 
  Download, 
  Eye, 
  Plus, 
  Search, 
  Copy, 
  Check,
  Printer,
  Mail,
  Calendar,
  Building2,
  Barcode,
  CreditCard,
  Clock,
  CheckCircle2,
  XCircle,
  AlertCircle,
  RefreshCw
} from 'lucide-react';
import { formatCurrency, formatDate } from '@/lib/formatters';
import { mockContasBancarias, mockCNPJs, mockContasReceber } from '@/data/mockData';
import { toast } from 'sonner';

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.1 }
  }
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 }
};

interface Boleto {
  id: string;
  numero: string;
  valor: number;
  vencimento: string;
  sacado: string;
  sacadoCpfCnpj: string;
  cedente: string;
  cedenteCnpj: string;
  banco: string;
  agencia: string;
  conta: string;
  linhaDigitavel: string;
  codigoBarras: string;
  status: 'gerado' | 'enviado' | 'pago' | 'vencido' | 'cancelado';
  dataCriacao: string;
  contaReceberRef?: string;
}

// Mock boletos data
const mockBoletos: Boleto[] = [
  {
    id: '1',
    numero: '00001',
    valor: 15750.00,
    vencimento: '2024-02-15',
    sacado: 'Tech Solutions Ltda',
    sacadoCpfCnpj: '12.345.678/0001-90',
    cedente: 'Promo Brindes Ltda',
    cedenteCnpj: '98.765.432/0001-10',
    banco: 'Banco do Brasil',
    agencia: '1234-5',
    conta: '12345-6',
    linhaDigitavel: '00190.00009 01234.567890 12345.678901 1 99990000015750',
    codigoBarras: '00191999900000157500000001234567890123456789',
    status: 'gerado',
    dataCriacao: '2024-01-20'
  },
  {
    id: '2',
    numero: '00002',
    valor: 8500.00,
    vencimento: '2024-02-10',
    sacado: 'Marketing Digital SA',
    sacadoCpfCnpj: '23.456.789/0001-01',
    cedente: 'Promo Brindes Ltda',
    cedenteCnpj: '98.765.432/0001-10',
    banco: 'Itaú',
    agencia: '5678-9',
    conta: '67890-1',
    linhaDigitavel: '34191.79001 01234.567890 12345.678902 2 99980000008500',
    codigoBarras: '34192999800000085001790001234567890123456789',
    status: 'enviado',
    dataCriacao: '2024-01-18'
  },
  {
    id: '3',
    numero: '00003',
    valor: 25000.00,
    vencimento: '2024-01-25',
    sacado: 'Eventos Premium Ltda',
    sacadoCpfCnpj: '34.567.890/0001-12',
    cedente: 'Promo Brindes Ltda',
    cedenteCnpj: '98.765.432/0001-10',
    banco: 'Banco do Brasil',
    agencia: '1234-5',
    conta: '12345-6',
    linhaDigitavel: '00190.00009 01234.567890 12345.678903 3 99970000025000',
    codigoBarras: '00193999700000250000000001234567890123456789',
    status: 'pago',
    dataCriacao: '2024-01-10'
  },
  {
    id: '4',
    numero: '00004',
    valor: 12300.00,
    vencimento: '2024-01-05',
    sacado: 'Distribuidora Central',
    sacadoCpfCnpj: '45.678.901/0001-23',
    cedente: 'Promo Brindes Ltda',
    cedenteCnpj: '98.765.432/0001-10',
    banco: 'Santander',
    agencia: '9012-3',
    conta: '01234-5',
    linhaDigitavel: '03399.12345 67890.123456 78901.234567 4 99960000012300',
    codigoBarras: '03394999600000123001234567890123456789012345',
    status: 'vencido',
    dataCriacao: '2023-12-20'
  }
];

const statusConfig = {
  gerado: { label: 'Gerado', color: 'bg-blue-500/10 text-blue-500 border-blue-500/20', icon: FileText },
  enviado: { label: 'Enviado', color: 'bg-amber-500/10 text-amber-500 border-amber-500/20', icon: Mail },
  pago: { label: 'Pago', color: 'bg-emerald-500/10 text-emerald-500 border-emerald-500/20', icon: CheckCircle2 },
  vencido: { label: 'Vencido', color: 'bg-red-500/10 text-red-500 border-red-500/20', icon: XCircle },
  cancelado: { label: 'Cancelado', color: 'bg-muted text-muted-foreground border-muted', icon: AlertCircle }
};

// Barcode component
const BarcodeVisual = ({ code }: { code: string }) => {
  const bars = code.split('').map((char, i) => {
    const width = parseInt(char) % 2 === 0 ? 2 : 1;
    const isBlack = i % 2 === 0;
    return { width, isBlack };
  });

  return (
    <div className="flex items-end h-16 bg-white p-2 rounded">
      {bars.map((bar, i) => (
        <div
          key={i}
          className={bar.isBlack ? 'bg-black' : 'bg-white'}
          style={{ width: `${bar.width}px`, height: '100%' }}
        />
      ))}
    </div>
  );
};

// Boleto Preview Component
const BoletoPreview = ({ boleto }: { boleto: Boleto }) => {
  const [copied, setCopied] = useState(false);

  const handleCopyLinhaDigitavel = () => {
    navigator.clipboard.writeText(boleto.linhaDigitavel.replace(/\s/g, ''));
    setCopied(true);
    toast.success('Linha digitável copiada!');
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownloadPDF = () => {
    // Simulate PDF generation
    toast.success('PDF do boleto gerado com sucesso!');
  };

  const handlePrint = () => {
    window.print();
    toast.success('Enviado para impressão!');
  };

  const handleSendEmail = () => {
    toast.success('Boleto enviado por e-mail!');
  };

  return (
    <div className="space-y-6 p-4">
      {/* Header do Boleto */}
      <div className="bg-white text-black rounded-lg p-6 space-y-4 print:shadow-none">
        {/* Banco e Logo */}
        <div className="flex items-center justify-between border-b-2 border-black pb-4">
          <div className="flex items-center gap-4">
            <div className="w-20 h-10 bg-muted rounded flex items-center justify-center text-muted-foreground text-xs">
              Logo Banco
            </div>
            <div className="text-2xl font-bold">{boleto.banco}</div>
          </div>
          <div className="text-right">
            <div className="text-sm text-muted-foreground">Nosso Número</div>
            <div className="text-lg font-mono font-bold">{boleto.numero}</div>
          </div>
        </div>

        {/* Linha Digitável */}
        <div className="bg-muted/50 p-4 rounded-lg">
          <div className="text-xs text-muted-foreground mb-1">Linha Digitável</div>
          <div className="flex items-center gap-2">
            <code className="text-lg font-mono tracking-wider flex-1">
              {boleto.linhaDigitavel}
            </code>
            <Button
              variant="ghost"
              size="sm"
              onClick={handleCopyLinhaDigitavel}
              className="shrink-0"
            >
              {copied ? <Check className="h-4 w-4 text-emerald-500" /> : <Copy className="h-4 w-4" />}
            </Button>
          </div>
        </div>

        {/* Informações do Cedente e Sacado */}
        <div className="grid grid-cols-2 gap-6">
          <div className="space-y-4">
            <div>
              <div className="text-xs text-muted-foreground">Beneficiário (Cedente)</div>
              <div className="font-semibold">{boleto.cedente}</div>
              <div className="text-sm text-muted-foreground">{boleto.cedenteCnpj}</div>
            </div>
            <div>
              <div className="text-xs text-muted-foreground">Agência/Código do Beneficiário</div>
              <div className="font-mono">{boleto.agencia} / {boleto.conta}</div>
            </div>
          </div>
          <div className="space-y-4">
            <div>
              <div className="text-xs text-muted-foreground">Pagador (Sacado)</div>
              <div className="font-semibold">{boleto.sacado}</div>
              <div className="text-sm text-muted-foreground">{boleto.sacadoCpfCnpj}</div>
            </div>
            <div className="flex gap-6">
              <div>
                <div className="text-xs text-muted-foreground">Vencimento</div>
                <div className="font-semibold">{formatDate(boleto.vencimento)}</div>
              </div>
              <div>
                <div className="text-xs text-muted-foreground">Valor</div>
                <div className="font-semibold text-lg">{formatCurrency(boleto.valor)}</div>
              </div>
            </div>
          </div>
        </div>

        <Separator />

        {/* Código de Barras */}
        <div className="space-y-2">
          <div className="text-xs text-muted-foreground">Código de Barras</div>
          <BarcodeVisual code={boleto.codigoBarras} />
          <div className="text-xs font-mono text-center text-muted-foreground">
            {boleto.codigoBarras}
          </div>
        </div>
      </div>

      {/* Ações */}
      <div className="flex gap-2 print:hidden">
        <Button onClick={handleDownloadPDF} className="flex-1 gap-2">
          <Download className="h-4 w-4" />
          Download PDF
        </Button>
        <Button variant="outline" onClick={handlePrint} className="gap-2">
          <Printer className="h-4 w-4" />
          Imprimir
        </Button>
        <Button variant="outline" onClick={handleSendEmail} className="gap-2">
          <Mail className="h-4 w-4" />
          Enviar
        </Button>
      </div>
    </div>
  );
};

// Form para novo boleto
const NovoBoletoForm = ({ onClose }: { onClose: () => void }) => {
  const [formData, setFormData] = useState({
    sacado: '',
    sacadoCpfCnpj: '',
    valor: '',
    vencimento: '',
    contaBancaria: '',
    empresa: '',
    descricao: ''
  });

  const generateLinhaDigitavel = () => {
    // Simplified generation for demo
    const random = Math.floor(Math.random() * 100000000);
    return `00190.00009 ${random.toString().padStart(8, '0')} 12345.678901 1 9999${formData.valor.padStart(10, '0')}`;
  };

  const generateCodigoBarras = () => {
    const random = Math.floor(Math.random() * 10000000000);
    return `0019199990000${formData.valor.padStart(10, '0')}${random}`;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const novoBoleto: Boleto = {
      id: Date.now().toString(),
      numero: String(mockBoletos.length + 1).padStart(5, '0'),
      valor: parseFloat(formData.valor) || 0,
      vencimento: formData.vencimento,
      sacado: formData.sacado,
      sacadoCpfCnpj: formData.sacadoCpfCnpj,
      cedente: mockCNPJs.find(e => e.id === formData.empresa)?.razaoSocial || 'Promo Brindes Ltda',
      cedenteCnpj: mockCNPJs.find(e => e.id === formData.empresa)?.cnpj || '98.765.432/0001-10',
      banco: mockContasBancarias.find(c => c.id === formData.contaBancaria)?.banco || 'Banco do Brasil',
      agencia: mockContasBancarias.find(c => c.id === formData.contaBancaria)?.agencia || '0001',
      conta: mockContasBancarias.find(c => c.id === formData.contaBancaria)?.conta || '12345-6',
      linhaDigitavel: generateLinhaDigitavel(),
      codigoBarras: generateCodigoBarras(),
      status: 'gerado',
      dataCriacao: new Date().toISOString().split('T')[0]
    };

    mockBoletos.unshift(novoBoleto);
    toast.success('Boleto gerado com sucesso!');
    onClose();
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4 p-4">
      <div className="grid grid-cols-2 gap-4">
        <div className="col-span-2">
          <Label htmlFor="sacado">Pagador (Sacado)</Label>
          <Input
            id="sacado"
            value={formData.sacado}
            onChange={(e) => setFormData({ ...formData, sacado: e.target.value })}
            placeholder="Nome do pagador"
            required
          />
        </div>
        
        <div>
          <Label htmlFor="sacadoCpfCnpj">CPF/CNPJ do Pagador</Label>
          <Input
            id="sacadoCpfCnpj"
            value={formData.sacadoCpfCnpj}
            onChange={(e) => setFormData({ ...formData, sacadoCpfCnpj: e.target.value })}
            placeholder="00.000.000/0000-00"
            required
          />
        </div>

        <div>
          <Label htmlFor="valor">Valor</Label>
          <Input
            id="valor"
            type="number"
            step="0.01"
            value={formData.valor}
            onChange={(e) => setFormData({ ...formData, valor: e.target.value })}
            placeholder="0,00"
            required
          />
        </div>

        <div>
          <Label htmlFor="vencimento">Vencimento</Label>
          <Input
            id="vencimento"
            type="date"
            value={formData.vencimento}
            onChange={(e) => setFormData({ ...formData, vencimento: e.target.value })}
            required
          />
        </div>

        <div>
          <Label htmlFor="empresa">Empresa (Cedente)</Label>
          <Select
            value={formData.empresa}
            onValueChange={(value) => setFormData({ ...formData, empresa: value })}
          >
            <SelectTrigger>
              <SelectValue placeholder="Selecione a empresa" />
            </SelectTrigger>
            <SelectContent>
              {mockCNPJs.map((empresa) => (
                <SelectItem key={empresa.id} value={empresa.id}>
                  {empresa.razaoSocial}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div>
          <Label htmlFor="contaBancaria">Conta Bancária</Label>
          <Select
            value={formData.contaBancaria}
            onValueChange={(value) => setFormData({ ...formData, contaBancaria: value })}
          >
            <SelectTrigger>
              <SelectValue placeholder="Selecione a conta" />
            </SelectTrigger>
            <SelectContent>
              {mockContasBancarias.map((conta) => (
                <SelectItem key={conta.id} value={conta.id}>
                  {conta.banco} - {conta.agencia}/{conta.conta}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="col-span-2">
          <Label htmlFor="descricao">Descrição (opcional)</Label>
          <Input
            id="descricao"
            value={formData.descricao}
            onChange={(e) => setFormData({ ...formData, descricao: e.target.value })}
            placeholder="Descrição ou referência do boleto"
          />
        </div>
      </div>

      <div className="flex gap-2 pt-4">
        <Button type="submit" className="flex-1 gap-2">
          <Barcode className="h-4 w-4" />
          Gerar Boleto
        </Button>
        <Button type="button" variant="outline" onClick={onClose}>
          Cancelar
        </Button>
      </div>
    </form>
  );
};

export default function Boletos() {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('todos');
  const [selectedBoleto, setSelectedBoleto] = useState<Boleto | null>(null);
  const [showNovoBoleto, setShowNovoBoleto] = useState(false);
  const [boletos] = useState<Boleto[]>(mockBoletos);

  // Calculate KPIs
  const totalGerado = boletos.reduce((acc, b) => acc + b.valor, 0);
  const totalPago = boletos.filter(b => b.status === 'pago').reduce((acc, b) => acc + b.valor, 0);
  const totalVencido = boletos.filter(b => b.status === 'vencido').reduce((acc, b) => acc + b.valor, 0);
  const totalPendente = boletos.filter(b => ['gerado', 'enviado'].includes(b.status)).reduce((acc, b) => acc + b.valor, 0);

  const filteredBoletos = boletos.filter(boleto => {
    const matchesSearch = boleto.sacado.toLowerCase().includes(searchTerm.toLowerCase()) ||
      boleto.numero.includes(searchTerm) ||
      boleto.linhaDigitavel.includes(searchTerm);
    const matchesStatus = statusFilter === 'todos' || boleto.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const kpis = [
    { label: 'Total Gerado', value: totalGerado, icon: FileText, color: 'text-primary' },
    { label: 'Total Pago', value: totalPago, icon: CheckCircle2, color: 'text-emerald-500' },
    { label: 'Total Vencido', value: totalVencido, icon: XCircle, color: 'text-red-500' },
    { label: 'Pendente', value: totalPendente, icon: Clock, color: 'text-amber-500' }
  ];

  return (
    <MainLayout>
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="space-y-6"
      >
        {/* Header */}
        <motion.div variants={itemVariants} className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Emissão de Boletos</h1>
            <p className="text-muted-foreground mt-1">
              Gere e gerencie boletos bancários com código de barras
            </p>
          </div>
          <Dialog open={showNovoBoleto} onOpenChange={setShowNovoBoleto}>
            <DialogTrigger asChild>
              <Button className="gap-2">
                <Plus className="h-4 w-4" />
                Novo Boleto
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl">
              <DialogHeader>
                <DialogTitle className="flex items-center gap-2">
                  <Barcode className="h-5 w-5" />
                  Emitir Novo Boleto
                </DialogTitle>
              </DialogHeader>
              <NovoBoletoForm onClose={() => setShowNovoBoleto(false)} />
            </DialogContent>
          </Dialog>
        </motion.div>

        {/* KPIs */}
        <motion.div variants={itemVariants} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {kpis.map((kpi) => {
            const Icon = kpi.icon;
            return (
              <Card key={kpi.label} className="hover:shadow-lg transition-shadow">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-muted-foreground">{kpi.label}</p>
                      <p className={`text-2xl font-bold mt-1 ${kpi.color}`}>
                        {formatCurrency(kpi.value)}
                      </p>
                    </div>
                    <div className={`p-3 rounded-full bg-muted ${kpi.color}`}>
                      <Icon className="h-6 w-6" />
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </motion.div>

        {/* Filters */}
        <motion.div variants={itemVariants}>
          <Card>
            <CardContent className="p-4">
              <div className="flex flex-col md:flex-row gap-4">
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Buscar por pagador, número ou linha digitável..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                  />
                </div>
                <Select value={statusFilter} onValueChange={setStatusFilter}>
                  <SelectTrigger className="w-full md:w-48">
                    <SelectValue placeholder="Status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="todos">Todos os Status</SelectItem>
                    <SelectItem value="gerado">Gerado</SelectItem>
                    <SelectItem value="enviado">Enviado</SelectItem>
                    <SelectItem value="pago">Pago</SelectItem>
                    <SelectItem value="vencido">Vencido</SelectItem>
                    <SelectItem value="cancelado">Cancelado</SelectItem>
                  </SelectContent>
                </Select>
                <Button variant="outline" className="gap-2">
                  <RefreshCw className="h-4 w-4" />
                  Atualizar
                </Button>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Boletos List */}
        <motion.div variants={itemVariants}>
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <CreditCard className="h-5 w-5" />
                Boletos Emitidos
              </CardTitle>
              <CardDescription>
                {filteredBoletos.length} boleto(s) encontrado(s)
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <AnimatePresence mode="popLayout">
                  {filteredBoletos.map((boleto, index) => {
                    const StatusIcon = statusConfig[boleto.status].icon;
                    return (
                      <motion.div
                        key={boleto.id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -20 }}
                        transition={{ delay: index * 0.05 }}
                        className="border rounded-lg p-4 hover:bg-muted/50 transition-colors"
                      >
                        <div className="flex items-center justify-between gap-4">
                          <div className="flex items-center gap-4 flex-1 min-w-0">
                            <div className="p-3 rounded-full bg-primary/10 shrink-0">
                              <Barcode className="h-5 w-5 text-primary" />
                            </div>
                            <div className="min-w-0 flex-1">
                              <div className="flex items-center gap-2">
                                <span className="font-semibold">#{boleto.numero}</span>
                                <Badge 
                                  variant="outline" 
                                  className={statusConfig[boleto.status].color}
                                >
                                  <StatusIcon className="h-3 w-3 mr-1" />
                                  {statusConfig[boleto.status].label}
                                </Badge>
                              </div>
                              <p className="text-sm text-muted-foreground truncate">
                                {boleto.sacado}
                              </p>
                              <p className="text-xs text-muted-foreground font-mono mt-1">
                                {boleto.linhaDigitavel}
                              </p>
                            </div>
                          </div>
                          <div className="text-right shrink-0">
                            <p className="font-bold text-lg">{formatCurrency(boleto.valor)}</p>
                            <p className="text-sm text-muted-foreground flex items-center gap-1 justify-end">
                              <Calendar className="h-3 w-3" />
                              Venc: {formatDate(boleto.vencimento)}
                            </p>
                          </div>
                          <div className="flex gap-2 shrink-0">
                            <Dialog>
                              <DialogTrigger asChild>
                                <Button
                                  variant="ghost"
                                  size="icon"
                                  onClick={() => setSelectedBoleto(boleto)}
                                >
                                  <Eye className="h-4 w-4" />
                                </Button>
                              </DialogTrigger>
                              <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
                                <DialogHeader>
                                  <DialogTitle className="flex items-center gap-2">
                                    <FileText className="h-5 w-5" />
                                    Boleto #{boleto.numero}
                                  </DialogTitle>
                                </DialogHeader>
                                <BoletoPreview boleto={boleto} />
                              </DialogContent>
                            </Dialog>
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => {
                                navigator.clipboard.writeText(boleto.linhaDigitavel.replace(/\s/g, ''));
                                toast.success('Linha digitável copiada!');
                              }}
                            >
                              <Copy className="h-4 w-4" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => toast.success('PDF do boleto gerado!')}
                            >
                              <Download className="h-4 w-4" />
                            </Button>
                          </div>
                        </div>
                      </motion.div>
                    );
                  })}
                </AnimatePresence>

                {filteredBoletos.length === 0 && (
                  <div className="text-center py-12 text-muted-foreground">
                    <Barcode className="h-12 w-12 mx-auto mb-4 opacity-50" />
                    <p>Nenhum boleto encontrado</p>
                    <p className="text-sm">Tente ajustar os filtros ou emita um novo boleto</p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Quick Stats */}
        <motion.div variants={itemVariants} className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center gap-4">
                <div className="p-3 rounded-full bg-blue-500/10">
                  <Building2 className="h-6 w-6 text-blue-500" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Boletos Este Mês</p>
                  <p className="text-2xl font-bold">{boletos.length}</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center gap-4">
                <div className="p-3 rounded-full bg-emerald-500/10">
                  <CheckCircle2 className="h-6 w-6 text-emerald-500" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Taxa de Pagamento</p>
                  <p className="text-2xl font-bold">
                    {((boletos.filter(b => b.status === 'pago').length / boletos.length) * 100).toFixed(1)}%
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center gap-4">
                <div className="p-3 rounded-full bg-amber-500/10">
                  <Clock className="h-6 w-6 text-amber-500" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Tempo Médio Pagamento</p>
                  <p className="text-2xl font-bold">3 dias</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </motion.div>
    </MainLayout>
  );
}
