// Lerílio — aviso na hora do remédio (RF06, RF07, RF08, RF17, RF20, RF23, RNF16)
// © 2026 Dalila Cristina Ferreira. Todos os direitos reservados.
//
// Este arquivo entra em TODAS as páginas. A cada 20 segundos ele confere se
// chegou a hora de algum remédio e, se chegou, mostra o aviso em tela cheia.
// Limitação desta versão: o aviso só aparece com o app aberto.

import {
  listarRemedios, registroDeHoje, horarioDeHoje, horarioTexto, horarioFala,
  adiar, adiadoAte, limparAdiamento, registrarTomado, desfazerRegistro, configuracoes
} from './dados.js';
import { falar, parar } from './voz.js';
import { mostrarMensagem } from './ui.js';

const JANELA_DO_AVISO = 60 * 60 * 1000; // avisa até 1 hora depois do horário
const fila = [];
let emTela = null;

// Avisa as outras partes da página que os dados mudaram (para atualizar listas).
export function avisarMudanca() {
  document.dispatchEvent(new CustomEvent('lerilio:mudou'));
}

function estaNaHora(remedio, agora) {
  if (registroDeHoje(remedio.id)) return false;
  const adiado = adiadoAte(remedio.id);
  if (adiado) return agora >= adiado; // "Lembrar mais tarde"
  const horario = horarioDeHoje(remedio.horario).getTime();
  return agora >= horario && agora - horario <= JANELA_DO_AVISO;
}

function verificar() {
  const agora = Date.now();
  for (const remedio of listarRemedios()) {
    const jaNaFila = fila.some((r) => r.id === remedio.id) || emTela?.id === remedio.id;
    if (!jaNaFila && estaNaHora(remedio, agora)) fila.push(remedio);
  }
  if (!emTela && fila.length) mostrar(fila.shift()); // vários no mesmo horário: um por vez
}

// Dois bipes curtos. O navegador só libera o som depois do primeiro toque no app.
function tocarSom() {
  try {
    const audio = new (window.AudioContext || window.webkitAudioContext)();
    [0, 0.45].forEach((inicio) => {
      const tom = audio.createOscillator();
      const volume = audio.createGain();
      tom.frequency.value = 880;
      volume.gain.value = 0.2;
      tom.connect(volume).connect(audio.destination);
      tom.start(audio.currentTime + inicio);
      tom.stop(audio.currentTime + inicio + 0.3);
    });
  } catch (erro) {
    /* sem som neste aparelho: o aviso continua na tela */
  }
}

function mostrar(remedio) {
  emTela = remedio;
  const vozLigada = configuracoes().vozAutomatica;
  const frase = `Hora do remédio ${remedio.nome}, das ${horarioFala(remedio.horario)}.`;

  const fundo = document.createElement('div');
  fundo.className = 'aviso-fundo';
  fundo.innerHTML = `
    <div class="aviso" role="alertdialog" aria-modal="true" aria-labelledby="aviso-titulo" aria-describedby="aviso-texto">
      <div class="aviso-imagem"></div>
      <h2 id="aviso-titulo">Hora do remédio</h2>
      <p id="aviso-texto" class="aviso-nome"></p>
      <button type="button" class="botao botao-verde" data-acao="tomei">Já tomei</button>
      <button type="button" class="botao botao-contorno" data-acao="depois">Lembrar mais tarde</button>
      <button type="button" class="botao-ouvir" data-acao="ouvir">Ouvir de novo</button>
      <p class="apoio">“Lembrar mais tarde” avisa de novo em 10 minutos.</p>
    </div>`;
  const imagem = fundo.querySelector('.aviso-imagem');
  if (remedio.foto) {
    const foto = document.createElement('img');
    foto.src = remedio.foto;
    foto.alt = `Foto da caixa do remédio ${remedio.nome}`;
    imagem.append(foto);
  } else {
    imagem.innerHTML = '<svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><g transform="rotate(-35 12 12)"><rect x="3" y="8.5" width="18" height="7" rx="3.5"/><path d="M12 8.5v7"/></g></svg>';
  }
  const nome = fundo.querySelector('#aviso-texto');
  nome.append(remedio.nome, document.createElement('br'), horarioTexto(remedio.horario));

  fundo.querySelector('[data-acao="tomei"]').addEventListener('click', () => {
    registrarTomado(remedio.id);
    limparAdiamento(remedio.id);
    fechar();
    mostrarMensagem(`${remedio.nome} registrado.`, {
      acao: 'Desfazer',
      duracao: 10000, // RF17: 10 segundos para desfazer
      aoAgir: () => {
        desfazerRegistro(remedio.id);
        avisarMudanca();
        mostrarMensagem(`${remedio.nome} voltou para "ainda não confirmado".`);
      }
    });
  });
  fundo.querySelector('[data-acao="depois"]').addEventListener('click', () => {
    adiar(remedio.id, 10);
    fechar();
    mostrarMensagem('Combinado. Aviso de novo em 10 minutos.');
  });
  fundo.querySelector('[data-acao="ouvir"]').addEventListener('click', () => falar(frase));

  document.body.append(fundo);
  fundo.querySelector('[data-acao="tomei"]').focus(); // RNF16: foco no botão principal
  tocarSom();
  if (navigator.vibrate) navigator.vibrate([400, 200, 400]); // RF23 (Android)
  if (vozLigada) setTimeout(() => falar(frase), 900); // RF20, depois dos bipes
}

function fechar() {
  parar();
  document.querySelector('.aviso-fundo')?.remove();
  emTela = null;
  avisarMudanca();
  setTimeout(verificar, 300); // mostra o próximo, se houver
}

verificar();
setInterval(verificar, 20000);
document.addEventListener('visibilitychange', () => {
  if (!document.hidden) verificar();
});
