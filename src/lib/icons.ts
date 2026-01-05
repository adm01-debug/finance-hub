/**
 * Sistema de Ícones Semântico - Finance Hub
 *
 * Este arquivo centraliza todos os ícones usados no sistema,
 * garantindo consistência visual e facilitando manutenção.
 */

import {
  // Ações Primárias
  Plus,
  Pencil,
  Trash2,
  Save,
  X,
  Check,
  Download,
  Upload,
  Copy,
  Share2,
  ExternalLink,
  Printer,
  Mail,
  Send,
  RefreshCw,
  RotateCcw,
  Search,
  Filter,
  SlidersHorizontal,
  MoreHorizontal,
  MoreVertical,
  Maximize2,
  Minimize2,
  Eye,
  EyeOff,
  Lock,
  Unlock,

  // Status e Feedback
  CheckCircle,
  CheckCircle2,
  XCircle,
  AlertTriangle,
  AlertCircle,
  Info,
  HelpCircle,
  Clock,
  Timer,
  Loader2,
  Ban,
  ShieldAlert,
  ShieldCheck,

  // Navegação
  ArrowLeft,
  ArrowRight,
  ArrowUp,
  ArrowDown,
  ChevronLeft,
  ChevronRight,
  ChevronUp,
  ChevronDown,
  ChevronsLeft,
  ChevronsRight,
  Home,
  Menu,

  // Financeiro
  TrendingUp,
  TrendingDown,
  Wallet,
  CreditCard,
  Banknote,
  DollarSign,
  PiggyBank,
  Receipt,
  FileText,
  Calculator,
  Percent,
  Scale,
  BarChart,
  BarChart2,
  BarChart3,
  LineChart,
  PieChart,
  Activity,

  // Entidades
  User,
  Users,
  UserPlus,
  UserMinus,
  UserCheck,
  Building,
  Building2,
  Landmark,
  Store,
  Truck,
  Package,

  // Documentos
  File,
  FileCheck,
  FilePlus,
  FileSearch,
  FileSpreadsheet,
  FileArchive,
  FolderOpen,
  FolderClosed,
  Paperclip,
  ClipboardList,
  ClipboardCheck,

  // Comunicação
  MessageSquare,
  MessageCircle,
  Bell,
  BellRing,
  BellOff,
  Phone,

  // Tempo e Data
  Calendar,
  CalendarDays,
  CalendarClock,
  CalendarCheck,
  CalendarX,

  // Configurações e Sistema
  Settings,
  Settings2,
  Cog,
  Wrench,
  Database,
  Server,
  Cloud,
  CloudOff,
  Wifi,
  WifiOff,
  Zap,
  ZapOff,
  Power,

  // Outros
  Star,
  StarOff,
  Heart,
  Bookmark,
  Flag,
  Tag,
  Tags,
  Hash,
  Link,
  Link2,
  Unlink,
  QrCode,
  Scan,
  Camera,
  Image,

  // Tipos Lucide
  type LucideIcon,
} from 'lucide-react';

// =============================================================================
// MAPEAMENTO SEMÂNTICO DE ÍCONES
// =============================================================================

/**
 * Ícones para ações do usuário
 */
export const ActionIcons = {
  // CRUD
  add: Plus,
  create: Plus,
  edit: Pencil,
  delete: Trash2,
  remove: Trash2,
  save: Save,
  cancel: X,
  close: X,
  confirm: Check,

  // Visualização
  view: Eye,
  hide: EyeOff,
  expand: Maximize2,
  collapse: Minimize2,

  // Transferência
  download: Download,
  export: Download,
  upload: Upload,
  import: Upload,
  copy: Copy,
  share: Share2,
  print: Printer,
  email: Mail,
  send: Send,
  link: ExternalLink,

  // Controle
  refresh: RefreshCw,
  undo: RotateCcw,
  search: Search,
  filter: Filter,
  settings: SlidersHorizontal,
  more: MoreHorizontal,
  moreVertical: MoreVertical,

  // Segurança
  lock: Lock,
  unlock: Unlock,
} as const;

/**
 * Ícones para estados e feedback
 */
export const StatusIcons = {
  // Resultados
  success: CheckCircle,
  successFilled: CheckCircle2,
  error: XCircle,
  warning: AlertTriangle,
  danger: AlertCircle,
  info: Info,
  help: HelpCircle,

  // Tempo
  pending: Clock,
  processing: Loader2,
  timer: Timer,

  // Bloqueio
  blocked: Ban,
  forbidden: ShieldAlert,
  approved: ShieldCheck,
  verified: ShieldCheck,
} as const;

/**
 * Ícones para navegação
 */
export const NavigationIcons = {
  // Direções
  back: ArrowLeft,
  forward: ArrowRight,
  up: ArrowUp,
  down: ArrowDown,

  // Chevrons
  left: ChevronLeft,
  right: ChevronRight,
  expandDown: ChevronDown,
  expandUp: ChevronUp,
  first: ChevronsLeft,
  last: ChevronsRight,

  // Locais
  home: Home,
  menu: Menu,
} as const;

/**
 * Ícones para contexto financeiro
 */
export const FinanceIcons = {
  // Fluxo
  income: TrendingUp,
  revenue: TrendingUp,
  expense: TrendingDown,
  payment: TrendingDown,

  // Dinheiro
  wallet: Wallet,
  card: CreditCard,
  cash: Banknote,
  money: DollarSign,
  savings: PiggyBank,

  // Documentos
  invoice: Receipt,
  bill: FileText,
  receipt: Receipt,

  // Análise
  calculator: Calculator,
  percent: Percent,
  balance: Scale,

  // Gráficos
  barChart: BarChart3,
  lineChart: LineChart,
  pieChart: PieChart,
  activity: Activity,
  analytics: BarChart2,

  // Status financeiro
  profit: TrendingUp,
  loss: TrendingDown,
  neutral: Activity,
} as const;

/**
 * Ícones para entidades do sistema
 */
export const EntityIcons = {
  // Pessoas
  user: User,
  users: Users,
  userAdd: UserPlus,
  userRemove: UserMinus,
  userVerified: UserCheck,
  client: User,
  customer: User,

  // Organizações
  company: Building2,
  enterprise: Building,
  bank: Landmark,
  store: Store,

  // Fornecedores
  supplier: Truck,
  vendor: Truck,

  // Produtos
  product: Package,
} as const;

/**
 * Ícones para documentos e arquivos
 */
export const DocumentIcons = {
  // Arquivos
  file: File,
  fileNew: FilePlus,
  fileVerified: FileCheck,
  fileSearch: FileSearch,
  spreadsheet: FileSpreadsheet,
  archive: FileArchive,

  // Pastas
  folder: FolderClosed,
  folderOpen: FolderOpen,

  // Anexos
  attachment: Paperclip,

  // Listas
  checklist: ClipboardList,
  checklistDone: ClipboardCheck,
} as const;

/**
 * Ícones para notificações e alertas
 */
export const NotificationIcons = {
  bell: Bell,
  bellActive: BellRing,
  bellOff: BellOff,
  message: MessageSquare,
  chat: MessageCircle,
  phone: Phone,
} as const;

/**
 * Ícones para datas e tempo
 */
export const DateIcons = {
  calendar: Calendar,
  calendarDays: CalendarDays,
  calendarTime: CalendarClock,
  calendarCheck: CalendarCheck,
  calendarCancel: CalendarX,
  clock: Clock,
} as const;

/**
 * Ícones para sistema e configurações
 */
export const SystemIcons = {
  settings: Settings,
  config: Settings2,
  gear: Cog,
  tools: Wrench,

  // Infraestrutura
  database: Database,
  server: Server,
  cloud: Cloud,
  cloudOff: CloudOff,

  // Conexão
  online: Wifi,
  offline: WifiOff,
  connected: Zap,
  disconnected: ZapOff,
  power: Power,
} as const;

/**
 * Ícones para marcação e organização
 */
export const OrganizationIcons = {
  star: Star,
  starOff: StarOff,
  favorite: Heart,
  bookmark: Bookmark,
  flag: Flag,
  tag: Tag,
  tags: Tags,
  hash: Hash,
  link: Link,
  linkAlt: Link2,
  unlink: Unlink,
} as const;

/**
 * Ícones para mídia e captura
 */
export const MediaIcons = {
  qrCode: QrCode,
  scan: Scan,
  camera: Camera,
  image: Image,
} as const;

// =============================================================================
// MAPEAMENTOS ESPECÍFICOS POR CONTEXTO
// =============================================================================

/**
 * Ícones por status de transação
 */
export const TransactionStatusIcons: Record<string, LucideIcon> = {
  pago: CheckCircle,
  paid: CheckCircle,
  recebido: CheckCircle,
  received: CheckCircle,
  pendente: Clock,
  pending: Clock,
  vencido: AlertTriangle,
  overdue: AlertTriangle,
  cancelado: XCircle,
  cancelled: XCircle,
  parcial: Timer,
  partial: Timer,
  aguardando: Clock,
  waiting: Clock,
  aprovado: ShieldCheck,
  approved: ShieldCheck,
  rejeitado: XCircle,
  rejected: XCircle,
};

/**
 * Ícones por tipo de conta
 */
export const AccountTypeIcons: Record<string, LucideIcon> = {
  receber: TrendingUp,
  receivable: TrendingUp,
  pagar: TrendingDown,
  payable: TrendingDown,
  transferencia: RefreshCw,
  transfer: RefreshCw,
};

/**
 * Ícones por módulo do sistema
 */
export const ModuleIcons: Record<string, LucideIcon> = {
  dashboard: Home,
  contasPagar: TrendingDown,
  contasReceber: TrendingUp,
  fluxoCaixa: Activity,
  conciliacao: RefreshCw,
  relatorios: BarChart3,
  clientes: Users,
  fornecedores: Truck,
  empresas: Building2,
  configuracoes: Settings,
  usuarios: Users,
  seguranca: ShieldCheck,
  alertas: Bell,
};

// =============================================================================
// HELPERS
// =============================================================================

/**
 * Retorna o ícone apropriado para um status de transação
 */
export function getStatusIcon(status: string): LucideIcon {
  const normalizedStatus = status.toLowerCase().trim();
  return TransactionStatusIcons[normalizedStatus] || Info;
}

/**
 * Retorna o ícone apropriado para um tipo de conta
 */
export function getAccountTypeIcon(type: string): LucideIcon {
  const normalizedType = type.toLowerCase().trim();
  return AccountTypeIcons[normalizedType] || FileText;
}

/**
 * Retorna o ícone apropriado para um módulo
 */
export function getModuleIcon(module: string): LucideIcon {
  const normalizedModule = module.toLowerCase().replace(/[^a-z]/g, '');
  return ModuleIcons[normalizedModule] || FileText;
}

/**
 * Retorna a cor CSS apropriada para um status
 */
export function getStatusColor(status: string): string {
  const normalizedStatus = status.toLowerCase().trim();
  const colorMap: Record<string, string> = {
    pago: 'text-success',
    paid: 'text-success',
    recebido: 'text-success',
    received: 'text-success',
    aprovado: 'text-success',
    approved: 'text-success',
    pendente: 'text-warning',
    pending: 'text-warning',
    aguardando: 'text-warning',
    waiting: 'text-warning',
    parcial: 'text-warning',
    partial: 'text-warning',
    vencido: 'text-destructive',
    overdue: 'text-destructive',
    cancelado: 'text-destructive',
    cancelled: 'text-destructive',
    rejeitado: 'text-destructive',
    rejected: 'text-destructive',
  };
  return colorMap[normalizedStatus] || 'text-muted-foreground';
}

/**
 * Retorna a cor de fundo apropriada para um status
 */
export function getStatusBgColor(status: string): string {
  const normalizedStatus = status.toLowerCase().trim();
  const colorMap: Record<string, string> = {
    pago: 'bg-success/10',
    paid: 'bg-success/10',
    recebido: 'bg-success/10',
    received: 'bg-success/10',
    aprovado: 'bg-success/10',
    approved: 'bg-success/10',
    pendente: 'bg-warning/10',
    pending: 'bg-warning/10',
    aguardando: 'bg-warning/10',
    waiting: 'bg-warning/10',
    parcial: 'bg-warning/10',
    partial: 'bg-warning/10',
    vencido: 'bg-destructive/10',
    overdue: 'bg-destructive/10',
    cancelado: 'bg-destructive/10',
    cancelled: 'bg-destructive/10',
    rejeitado: 'bg-destructive/10',
    rejected: 'bg-destructive/10',
  };
  return colorMap[normalizedStatus] || 'bg-muted';
}

// =============================================================================
// EXPORTS
// =============================================================================

export const Icons = {
  action: ActionIcons,
  status: StatusIcons,
  navigation: NavigationIcons,
  finance: FinanceIcons,
  entity: EntityIcons,
  document: DocumentIcons,
  notification: NotificationIcons,
  date: DateIcons,
  system: SystemIcons,
  organization: OrganizationIcons,
  media: MediaIcons,
} as const;

export type { LucideIcon };
