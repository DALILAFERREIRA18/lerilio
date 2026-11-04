// Lerílio — dados guardados no celular (localStorage)
// © 2026 Dalila Cristina Ferreira. Todos os direitos reservados.
//
// Remédios, registros do dia e preferências ficam SÓ neste aparelho (RNF09).
// Nada daqui vai para a internet.

const CHAVE_REMEDIOS = 'lerilio-remedios';
const CHAVE_REGISTROS = 'lerilio-registros';
const CHAVE_ADIAMENTOS = 'lerilio-adiamentos';
const CHAVE_CONFIG = 'lerilio-config';
const CHAVE_NOME = 'lerilio-nome';

function ler(chave, padrao) {
  try {
    const valor = localStorage.getItem(chave);
    return valor ? JSON.parse(valor) : padrao;
  } catch (erro) {
    return padrao;
  }
}

// Devolve false se o celular não tiver espaço (por exemplo, fotos demais).
function gravar(chave, valor) {
  try {
    localStorage.setItem(chave, JSON.stringify(valor));
    return true;
  } catch (erro) {
    console.warn('Não foi possível salvar:', erro.message);
    return false;
  }
}

// ---------- Datas e horários ----------

// Data de hoje no formato 2026-11-04 (horário do celular).
export function chaveDoDia(data = new Date()) {
  const ano = data.getFullYear();
  const mes = String(data.getMonth() + 1).padStart(2, '0');
  const dia = String(data.getDate()).padStart(2, '0');
  return `${ano}-${mes}-${dia}`;
}

// "20:00" vira um horário de hoje.
export function horarioDeHoje(horario) {
  const [h, m] = horario.split(':').map(Number);
  const data = new Date();
  data.setHours(h, m, 0, 0);
  return data;
}

// "20:00" → "20h"; "08:30" → "8h30" (para ler na tela).
export function horarioTexto(horario) {
  const [h, m] = horario.split(':').map(Number);
  return m === 0 ? `${h}h` : `${h}h${String(m).padStart(2, '0')}`;
}

// "20:00" → "20 horas"; "08:30" → "8 horas e 30 minutos" (para a voz).
export function horarioFala(horario) {
  const [h, m] = horario.split(':').map(Number);
  const horas = `${h} ${h === 1 ? 'hora' : 'horas'}`;
  return m === 0 ? horas : `${horas} e ${m} minutos`;
}

// Uma data qualquer → "8h05".
export function horaTexto(data) {
  return `${data.getHours()}h${String(data.getMinutes()).padStart(2, '0')}`;
}

// ---------- Remédios (RF04) ----------

export function listarRemedios() {
  return ler(CHAVE_REMEDIOS, []).sort((a, b) => a.horario.localeCompare(b.horario));
}

export function obterRemedio(id) {
  return listarRemedios().find((r) => r.id === id) || null;
}

// Cria (sem id) ou atualiza (com id). Devolve o remédio salvo, ou null se faltar espaço.
export function salvarRemedio({ id, nome, horario, foto }) {
  const lista = ler(CHAVE_REMEDIOS, []);
  const remedio = {
    id: id || Date.now().toString(36) + Math.random().toString(36).slice(2, 6),
    nome: nome.trim(),
    horario,
    foto: foto || null
  };
  const posicao = lista.findIndex((r) => r.id === remedio.id);
  if (posicao >= 0) lista[posicao] = remedio;
  else lista.push(remedio);
  return gravar(CHAVE_REMEDIOS, lista) ? remedio : null;
}

export function excluirRemedio(id) {
  gravar(CHAVE_REMEDIOS, ler(CHAVE_REMEDIOS, []).filter((r) => r.id !== id));
  limparAdiamento(id);
  const registros = ler(CHAVE_REGISTROS, {});
  for (const dia of Object.keys(registros)) delete registros[dia][id];
  gravar(CHAVE_REGISTROS, registros);
}

// Mesmo nome (sem diferenciar maiúsculas) e mesmo horário (UC02, exceção).
export function remedioRepetido(nome, horario, ignorarId) {
  const nomeLimpo = nome.trim().toLowerCase();
  return listarRemedios().find(
    (r) => r.id !== ignorarId && r.horario === horario && r.nome.toLowerCase() === nomeLimpo
  ) || null;
}

// ---------- Registros do dia (RF05, RF07, RF17) ----------

// Guarda só os últimos 7 dias, para não ocupar espaço à toa.
function limparDiasAntigos(registros) {
  const dias = Object.keys(registros).sort();
  while (dias.length > 7) delete registros[dias.shift()];
  return registros;
}

export function registrarTomado(id, quando = new Date()) {
  const registros = ler(CHAVE_REGISTROS, {});
  const dia = chaveDoDia();
  registros[dia] = registros[dia] || {};
  registros[dia][id] = quando.toISOString();
  gravar(CHAVE_REGISTROS, limparDiasAntigos(registros));
}

export function desfazerRegistro(id) {
  const registros = ler(CHAVE_REGISTROS, {});
  const dia = chaveDoDia();
  if (registros[dia]) delete registros[dia][id];
  gravar(CHAVE_REGISTROS, registros);
}

// Devolve a hora em que foi registrado hoje, ou null.
export function registroDeHoje(id) {
  const dia = ler(CHAVE_REGISTROS, {})[chaveDoDia()] || {};
  return dia[id] ? new Date(dia[id]) : null;
}

// 'registrado', 'pendente' (já passou do horário) ou 'proximo' (ainda não chegou).
// Nunca "não tomado": só "ainda não confirmado" (RN01).
export function situacao(remedio, agora = new Date()) {
  if (registroDeHoje(remedio.id)) return 'registrado';
  return agora >= horarioDeHoje(remedio.horario) ? 'pendente' : 'proximo';
}

// ---------- "Lembrar mais tarde" (RF08) ----------

export function adiar(id, minutos = 10) {
  const adiamentos = ler(CHAVE_ADIAMENTOS, {});
  adiamentos[id] = Date.now() + minutos * 60 * 1000;
  gravar(CHAVE_ADIAMENTOS, adiamentos);
}

export function adiadoAte(id) {
  return ler(CHAVE_ADIAMENTOS, {})[id] || null;
}

export function limparAdiamento(id) {
  const adiamentos = ler(CHAVE_ADIAMENTOS, {});
  delete adiamentos[id];
  gravar(CHAVE_ADIAMENTOS, adiamentos);
}

// ---------- Preferências e nome ----------

export function configuracoes() {
  return { vozAutomatica: true, ...ler(CHAVE_CONFIG, {}) };
}

export function salvarConfiguracoes(mudancas) {
  gravar(CHAVE_CONFIG, { ...configuracoes(), ...mudancas });
}

export function nomeDaPessoa() {
  try {
    return localStorage.getItem(CHAVE_NOME) || '';
  } catch (erro) {
    return '';
  }
}
