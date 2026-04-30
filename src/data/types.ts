export type TipoVinculo = 'CLT' | 'Terceirizado' | 'Autônomo PJ' | 'Cooperado' | 'Eventual';
export type StatusProcesso = 'Ativo' | 'Suspenso' | 'Acordo' | 'Encerrado' | 'Arquivado' | 'Recurso';
export type FaseProcessual = 'Inicial' | 'Instrução' | 'Sentença' | 'Recurso Ordinário' | 'TST' | 'Execução' | 'Encerrado';
export type ResultadoProcesso = 'Procedente' | 'Improcedente' | 'Parcialmente Procedente' | 'Acordo' | 'Arquivado' | null;
export type NivelRisco = 'Alto' | 'Médio' | 'Baixo' | 'Provisionado';

export interface Processo {
  id: string;
  numero_cnj: string;
  empresa: string;
  unidade: string;
  escritorio: string;
  data_distribuicao: string;
  reclamante: string;
  cpf: string;
  vinculo: TipoVinculo;
  cargo: string;
  periodo: string;
  adv_reclamante: string;
  uf: string;
  trt: string;
  vara: string;
  cidade: string;
  fase: FaseProcessual;
  fase_display: string;
  status: StatusProcesso;
  instancia: string;
  valor_causa: number;
  valor_provisao: number;
  valor_condenacao: number;
  valor_acordo: number;
  valor_pago: number;
  risco: NivelRisco;
  data_audiencia: string;
  tipo_audiencia: string;
  data_proxima_audiencia: string | null;
  prazo_vencimento: string | null;
  resultado: ResultadoProcesso;
  pedidos: string[];
  recurso: string;
  advogado_responsavel_interno: string;
  observacoes_internas: string;
}

export interface FiltrosAtivos {
  empresas: string[];
  vinculos: TipoVinculo[];
  status: StatusProcesso[];
  fases: FaseProcessual[];
  riscos: NivelRisco[];
  ufs: string[];
  searchTerm: string;
  valorCausaMin: number;
  valorCausaMax: number;
  temAudiencia: boolean;
  temPrazo: boolean;
}
