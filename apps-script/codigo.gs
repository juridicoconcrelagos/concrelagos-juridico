// ============================================================
// CONCRELAGOS — Integração Google Sheets → Site Jurídico
// Cole este código em: Planilha > Extensões > Apps Script
// ============================================================

var SHEET_ID  = '1OnzOEyW_GERdtevflkSCDYC8f-5VLSqy';
var TAB_NAME  = 'DADOS TRABALHISTA';

function doGet() {
  try {
    var ss    = SpreadsheetApp.openById(SHEET_ID);
    var sheet = ss.getSheetByName(TAB_NAME);

    if (!sheet) {
      return json({ error: 'Aba não encontrada: ' + TAB_NAME });
    }

    var data = sheet.getDataRange().getValues();
    if (data.length < 2) return json({ processos: [] });

    var headers = data[0].map(function(h){ return limpar(h); });
    var processos = [];

    for (var i = 1; i < data.length; i++) {
      var row = data[i];
      if (!row[0] && !row[1]) continue; // pula linhas vazias

      var r = {};
      headers.forEach(function(h, j){ r[h] = row[j]; });

      processos.push({
        id:                          String(col(r, ['ID','Nº','N']) || ('TRB-' + pad(i))),
        numero_cnj:                  String(col(r, ['Número CNJ','CNJ','Numero CNJ','Processo','Nº Processo']) || ''),
        empresa:                     String(col(r, ['Empresa','Razão Social']) || ''),
        unidade:                     String(col(r, ['Unidade','Filial','Local']) || ''),
        escritorio:                  String(col(r, ['Escritório','Escritorio']) || ''),
        data_distribuicao:           formatDate(col(r, ['Data Distribuição','Data de Distribuição','Distribuição','Data Dist']) || ''),
        reclamante:                  String(col(r, ['Reclamante','Nome','Nome Reclamante']) || ''),
        cpf:                         String(col(r, ['CPF']) || ''),
        vinculo:                     String(col(r, ['Vínculo','Vinculo','Tipo Vínculo','Tipo de Vínculo']) || 'CLT'),
        cargo:                       String(col(r, ['Cargo','Função','Funcao']) || ''),
        periodo:                     String(col(r, ['Período','Periodo','Período Trabalhado']) || ''),
        adv_reclamante:              String(col(r, ['Advogado Reclamante','Adv Reclamante','Advogado do Reclamante']) || ''),
        uf:                          String(col(r, ['UF','Estado']) || ''),
        trt:                         String(col(r, ['TRT']) || ''),
        vara:                        String(col(r, ['Vara','Vara do Trabalho']) || ''),
        cidade:                      String(col(r, ['Cidade']) || ''),
        fase:                        String(col(r, ['Fase','Fase Processual']) || 'Inicial'),
        fase_display:                String(col(r, ['Fase Display','Fase Detalhada','Fase Completa','Fase Display']) || col(r, ['Fase','Fase Processual']) || ''),
        status:                      String(col(r, ['Status','Situação','Situacao']) || 'Ativo'),
        instancia:                   String(col(r, ['Instância','Instancia']) || '1ª Instância'),
        valor_causa:                 parseVal(col(r, ['Valor da Causa','Valor Causa','Causa']) || 0),
        valor_provisao:              parseVal(col(r, ['Provisão','Valor Provisão','Valor Provisao','Provisao']) || 0),
        valor_condenacao:            parseVal(col(r, ['Condenação','Valor Condenação','Valor Condenacao'] ) || 0),
        valor_acordo:                parseVal(col(r, ['Acordo','Valor Acordo']) || 0),
        valor_pago:                  parseVal(col(r, ['Valor Pago','Pago']) || 0),
        risco:                       String(col(r, ['Risco','Nível de Risco','Nivel de Risco','Nível Risco']) || 'Médio'),
        data_audiencia:              String(col(r, ['Data Audiência','Data Audiencia']) || ''),
        tipo_audiencia:              String(col(r, ['Tipo Audiência','Tipo de Audiência','Tipo Audiencia']) || ''),
        data_proxima_audiencia:      formatDateOrNull(col(r, ['Próxima Audiência','Proxima Audiencia','Próx Audiência']) || null),
        prazo_vencimento:            formatDateOrNull(col(r, ['Prazo','Prazo Vencimento','Vencimento']) || null),
        resultado:                   col(r, ['Resultado']) || null,
        pedidos:                     parsePedidos(col(r, ['Pedidos','Pedidos da Causa']) || ''),
        recurso:                     String(col(r, ['Recurso','Tipo Recurso']) || ''),
        advogado_responsavel_interno:String(col(r, ['Advogado Interno','Advogado Responsável','Adv Interno']) || ''),
        observacoes_internas:        String(col(r, ['Observações','Observacoes','Obs','Notas']) || ''),
      });
    }

    return json({ processos: processos, total: processos.length, atualizadoEm: new Date().toISOString() });

  } catch(e) {
    return json({ error: e.message, stack: e.stack });
  }
}

// ---- helpers ----

function col(r, nomes) {
  for (var i = 0; i < nomes.length; i++) {
    var val = r[limpar(nomes[i])];
    if (val !== undefined && val !== '') return val;
  }
  return null;
}

function limpar(s) {
  return String(s).trim().toLowerCase()
    .normalize('NFD').replace(/[̀-ͯ]/g, ''); // remove acentos
}

function pad(n) {
  return String(n).padStart(4, '0');
}

function formatDate(val) {
  if (!val) return '';
  if (val instanceof Date) {
    var d = String(val.getDate()).padStart(2,'0');
    var m = String(val.getMonth()+1).padStart(2,'0');
    return d + '/' + m + '/' + val.getFullYear();
  }
  return String(val);
}

function formatDateOrNull(val) {
  if (!val) return null;
  if (val instanceof Date) return formatDate(val);
  var s = String(val).trim();
  return s || null;
}

function parseVal(val) {
  if (typeof val === 'number') return val;
  var s = String(val).replace(/[R$\s]/g,'').replace(/\./g,'').replace(',','.');
  return parseFloat(s) || 0;
}

function parsePedidos(val) {
  if (!val) return [];
  return String(val).split(/[;,|\/]/).map(function(s){ return s.trim(); }).filter(Boolean);
}

function json(data) {
  var output = ContentService.createTextOutput(JSON.stringify(data));
  output.setMimeType(ContentService.MimeType.JSON);
  return output;
}
