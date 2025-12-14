// Gerenciamento de modo de contingência para NF-e
// Suporta emissão offline quando SEFAZ está indisponível

export type ContingencyMode = 
  | 'normal'      // Emissão normal - SEFAZ disponível
  | 'SCAN'        // Sistema de Contingência do Ambiente Nacional
  | 'DPEC'        // Declaração Prévia de Emissão em Contingência
  | 'FSDA'        // Formulário de Segurança para Impressão de Documento Auxiliar
  | 'SVCAN'       // SEFAZ Virtual de Contingência - Ambiente Nacional
  | 'SVCRS'       // SEFAZ Virtual de Contingência - Rio Grande do Sul
  | 'offline';    // Modo offline local

export interface ContingencyState {
  mode: ContingencyMode;
  reason: string;
  activatedAt: Date | null;
  activatedBy: string;
  estimatedReturn: Date | null;
  autoActivated: boolean;
  failureCount: number;
  lastFailure: Date | null;
  pendingNFes: PendingNFe[];
}

export interface PendingNFe {
  id: string;
  numero: string;
  serie: string;
  chaveAcesso: string;
  dataEmissao: Date;
  valorTotal: number;
  destinatario: string;
  xmlContingencia: string;
  status: 'pendente' | 'transmitindo' | 'autorizada' | 'rejeitada';
  tentativas: number;
  ultimaTentativa: Date | null;
  erro?: string;
}

export interface SefazHealthStatus {
  online: boolean;
  latency: number;
  lastCheck: Date;
  consecutiveFailures: number;
  averageResponseTime: number;
}

// Códigos de tipo de emissão (tpEmis) da NF-e
export const TIPO_EMISSAO = {
  normal: { code: '1', label: 'Normal', description: 'Emissão normal com autorização SEFAZ' },
  SCAN: { code: '3', label: 'SCAN', description: 'Sistema de Contingência do Ambiente Nacional' },
  DPEC: { code: '4', label: 'DPEC', description: 'Declaração Prévia de Emissão em Contingência' },
  FSDA: { code: '5', label: 'FS-DA', description: 'Formulário de Segurança para Impressão de Documento Auxiliar' },
  SVCAN: { code: '6', label: 'SVC-AN', description: 'SEFAZ Virtual de Contingência - Ambiente Nacional' },
  SVCRS: { code: '7', label: 'SVC-RS', description: 'SEFAZ Virtual de Contingência - Rio Grande do Sul' },
  offline: { code: '9', label: 'Offline', description: 'Contingência offline para posterior transmissão' },
} as const;

// Motivos comuns para ativação de contingência
export const MOTIVOS_CONTINGENCIA = [
  'SEFAZ indisponível - manutenção programada',
  'SEFAZ indisponível - problemas técnicos',
  'Problemas de conectividade local',
  'Timeout na comunicação com SEFAZ',
  'Erro de certificado digital',
  'Falha no webservice da SEFAZ',
  'Contingência preventiva - evento especial',
  'Outro motivo',
] as const;

// Estado inicial
const initialState: ContingencyState = {
  mode: 'normal',
  reason: '',
  activatedAt: null,
  activatedBy: '',
  estimatedReturn: null,
  autoActivated: false,
  failureCount: 0,
  lastFailure: null,
  pendingNFes: [],
};

// Armazenamento local
const STORAGE_KEY = 'sefaz_contingency_state';
const HEALTH_KEY = 'sefaz_health_status';

// Obter estado atual da contingência
export function getContingencyState(): ContingencyState {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      const parsed = JSON.parse(stored);
      return {
        ...parsed,
        activatedAt: parsed.activatedAt ? new Date(parsed.activatedAt) : null,
        estimatedReturn: parsed.estimatedReturn ? new Date(parsed.estimatedReturn) : null,
        lastFailure: parsed.lastFailure ? new Date(parsed.lastFailure) : null,
        pendingNFes: parsed.pendingNFes.map((nfe: any) => ({
          ...nfe,
          dataEmissao: new Date(nfe.dataEmissao),
          ultimaTentativa: nfe.ultimaTentativa ? new Date(nfe.ultimaTentativa) : null,
        })),
      };
    }
  } catch (error) {
    console.error('[Contingência] Erro ao carregar estado:', error);
  }
  return initialState;
}

// Salvar estado da contingência
function saveContingencyState(state: ContingencyState): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  } catch (error) {
    console.error('[Contingência] Erro ao salvar estado:', error);
  }
}

// Ativar modo de contingência
export function activateContingency(
  mode: ContingencyMode,
  reason: string,
  activatedBy: string,
  estimatedReturn?: Date,
  autoActivated = false
): ContingencyState {
  const state: ContingencyState = {
    ...getContingencyState(),
    mode,
    reason,
    activatedAt: new Date(),
    activatedBy,
    estimatedReturn: estimatedReturn || null,
    autoActivated,
  };
  
  saveContingencyState(state);
  console.log('[Contingência] Modo ativado:', mode, 'Motivo:', reason);
  
  return state;
}

// Desativar modo de contingência
export function deactivateContingency(): ContingencyState {
  const state: ContingencyState = {
    ...getContingencyState(),
    mode: 'normal',
    reason: '',
    activatedAt: null,
    activatedBy: '',
    estimatedReturn: null,
    autoActivated: false,
    failureCount: 0,
  };
  
  saveContingencyState(state);
  console.log('[Contingência] Modo desativado');
  
  return state;
}

// Registrar falha de comunicação
export function registerCommunicationFailure(): ContingencyState {
  const state = getContingencyState();
  state.failureCount++;
  state.lastFailure = new Date();
  
  // Auto-ativar contingência após 3 falhas consecutivas
  if (state.failureCount >= 3 && state.mode === 'normal') {
    return activateContingency(
      'offline',
      'SEFAZ indisponível - múltiplas falhas de comunicação',
      'Sistema',
      undefined,
      true
    );
  }
  
  saveContingencyState(state);
  return state;
}

// Registrar sucesso de comunicação
export function registerCommunicationSuccess(): void {
  const state = getContingencyState();
  state.failureCount = 0;
  saveContingencyState(state);
}

// Adicionar NF-e pendente (emitida em contingência)
export function addPendingNFe(nfe: Omit<PendingNFe, 'status' | 'tentativas' | 'ultimaTentativa'>): ContingencyState {
  const state = getContingencyState();
  state.pendingNFes.push({
    ...nfe,
    status: 'pendente',
    tentativas: 0,
    ultimaTentativa: null,
  });
  
  saveContingencyState(state);
  console.log('[Contingência] NF-e pendente adicionada:', nfe.numero);
  
  return state;
}

// Atualizar status de NF-e pendente
export function updatePendingNFe(
  id: string, 
  updates: Partial<Pick<PendingNFe, 'status' | 'tentativas' | 'ultimaTentativa' | 'erro'>>
): ContingencyState {
  const state = getContingencyState();
  const nfeIndex = state.pendingNFes.findIndex(n => n.id === id);
  
  if (nfeIndex >= 0) {
    state.pendingNFes[nfeIndex] = {
      ...state.pendingNFes[nfeIndex],
      ...updates,
    };
    saveContingencyState(state);
  }
  
  return state;
}

// Remover NF-e pendente (após autorização bem-sucedida)
export function removePendingNFe(id: string): ContingencyState {
  const state = getContingencyState();
  state.pendingNFes = state.pendingNFes.filter(n => n.id !== id);
  saveContingencyState(state);
  
  return state;
}

// Verificar saúde da SEFAZ
export function getSefazHealthStatus(): SefazHealthStatus {
  try {
    const stored = localStorage.getItem(HEALTH_KEY);
    if (stored) {
      const parsed = JSON.parse(stored);
      return {
        ...parsed,
        lastCheck: new Date(parsed.lastCheck),
      };
    }
  } catch (error) {
    console.error('[Contingência] Erro ao carregar status de saúde:', error);
  }
  
  return {
    online: true,
    latency: 0,
    lastCheck: new Date(),
    consecutiveFailures: 0,
    averageResponseTime: 0,
  };
}

// Atualizar status de saúde da SEFAZ
export function updateSefazHealthStatus(status: Partial<SefazHealthStatus>): void {
  const current = getSefazHealthStatus();
  const updated = { ...current, ...status, lastCheck: new Date() };
  localStorage.setItem(HEALTH_KEY, JSON.stringify(updated));
}

// Simular verificação de saúde da SEFAZ
export async function checkSefazHealth(): Promise<SefazHealthStatus> {
  const startTime = Date.now();
  
  // Simula chamada ao webservice de status da SEFAZ
  await new Promise(resolve => setTimeout(resolve, 300 + Math.random() * 700));
  
  // 10% de chance de simular SEFAZ offline
  const isOnline = Math.random() > 0.1;
  const latency = Date.now() - startTime;
  
  const currentHealth = getSefazHealthStatus();
  const status: SefazHealthStatus = {
    online: isOnline,
    latency,
    lastCheck: new Date(),
    consecutiveFailures: isOnline ? 0 : currentHealth.consecutiveFailures + 1,
    averageResponseTime: isOnline 
      ? (currentHealth.averageResponseTime + latency) / 2 
      : currentHealth.averageResponseTime,
  };
  
  updateSefazHealthStatus(status);
  
  // Atualizar estado de contingência baseado na saúde
  if (!isOnline) {
    registerCommunicationFailure();
  } else {
    registerCommunicationSuccess();
  }
  
  return status;
}

// Obter estatísticas de contingência
export function getContingencyStats(): {
  totalPending: number;
  pendingValue: number;
  oldestPending: Date | null;
  transmissionAttempts: number;
} {
  const state = getContingencyState();
  const pending = state.pendingNFes.filter(n => n.status === 'pendente');
  
  return {
    totalPending: pending.length,
    pendingValue: pending.reduce((sum, n) => sum + n.valorTotal, 0),
    oldestPending: pending.length > 0 
      ? new Date(Math.min(...pending.map(n => n.dataEmissao.getTime())))
      : null,
    transmissionAttempts: pending.reduce((sum, n) => sum + n.tentativas, 0),
  };
}

// Gerar XML em contingência
export function generateContingencyXml(
  nfeData: any,
  mode: ContingencyMode,
  chaveAcesso: string
): string {
  const tpEmis = TIPO_EMISSAO[mode]?.code || '1';
  const dhCont = new Date().toISOString();
  
  return `<?xml version="1.0" encoding="UTF-8"?>
<NFe xmlns="http://www.portalfiscal.inf.br/nfe">
  <infNFe versao="4.00" Id="NFe${chaveAcesso}">
    <ide>
      <tpEmis>${tpEmis}</tpEmis>
      <dhCont>${dhCont}</dhCont>
      <xJust>Emissão em contingência - ${TIPO_EMISSAO[mode]?.description || 'Modo offline'}</xJust>
      <!-- Demais campos da NF-e -->
    </ide>
    <!-- Conteúdo completo da NF-e em contingência -->
  </infNFe>
</NFe>`;
}
