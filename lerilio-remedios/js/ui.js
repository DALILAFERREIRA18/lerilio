// Lerílio — peças de tela usadas em todas as páginas
// © 2026 Dalila Cristina Ferreira. Todos os direitos reservados.

import { falar, parar, estaFalando, vozDisponivel } from './voz.js';

// Mensagem curta no rodapé da tela, com um botão opcional (ex.: Desfazer).
// O leitor de tela anuncia a mensagem (RNF16).
export function mostrarMensagem(texto, { acao, aoAgir, duracao = 6000 } = {}) {
  document.querySelector('.mensagem-flutuante')?.remove();
  const caixa = document.createElement('div');
  caixa.className = 'mensagem-flutuante';
  caixa.setAttribute('role', 'status');
  const p = document.createElement('p');
  p.textContent = texto;
  caixa.append(p);
  if (acao) {
    const botao = document.createElement('button');
    botao.type = 'button';
    botao.textContent = acao;
    botao.addEventListener('click', () => {
      caixa.remove();
      aoAgir?.();
    });
    caixa.append(botao);
  }
  document.body.append(caixa);
  setTimeout(() => caixa.remove(), duracao);
}

// Pergunta de confirmação acessível. Devolve uma Promise com true (sim) ou false.
// Usada antes de excluir, apagar e sair sem salvar (RNF08).
export function confirmar(titulo, texto, textoSim = 'Sim', textoNao = 'Cancelar') {
  return new Promise((resolver) => {
    const fundo = document.createElement('div');
    fundo.className = 'dialogo-fundo';
    fundo.innerHTML = `
      <div class="dialogo" role="alertdialog" aria-modal="true" aria-labelledby="dialogo-titulo" aria-describedby="dialogo-texto">
        <h2 id="dialogo-titulo"></h2>
        <p id="dialogo-texto"></p>
        <button type="button" class="botao" data-resposta="sim"></button>
        <button type="button" class="botao botao-contorno" data-resposta="nao"></button>
      </div>`;
    fundo.querySelector('h2').textContent = titulo;
    fundo.querySelector('p').textContent = texto;
    fundo.querySelector('[data-resposta="sim"]').textContent = textoSim;
    fundo.querySelector('[data-resposta="nao"]').textContent = textoNao;
    const fechar = (resposta) => {
      fundo.remove();
      resolver(resposta);
    };
    fundo.querySelector('[data-resposta="sim"]').addEventListener('click', () => fechar(true));
    fundo.querySelector('[data-resposta="nao"]').addEventListener('click', () => fechar(false));
    fundo.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') fechar(false);
    });
    document.body.append(fundo);
    fundo.querySelector('[data-resposta="nao"]').focus(); // o mais seguro fica em foco
  });
}

// Liga o botão Ouvir da página: lê o conteúdo marcado com id="leitura" (RF13).
let avisouSilencioso = false;
export function ligarOuvir() {
  const botao = document.getElementById('ouvir');
  const area = document.getElementById('leitura');
  if (!botao || !area) return;
  botao.addEventListener('click', () => {
    if (estaFalando()) {
      parar();
      return;
    }
    if (!vozDisponivel()) {
      mostrarMensagem('A leitura em voz não está disponível neste aparelho.');
      return;
    }
    falar(area.innerText);
    if (!avisouSilencioso) {
      avisouSilencioso = true;
      mostrarMensagem('Se não ouvir, confira se o celular não está no silencioso e aumente o volume.');
    }
  });
}

// Guarda uma mensagem para mostrar na próxima página (ex.: depois de salvar).
export function mensagemNaProximaPagina(texto) {
  try { sessionStorage.setItem('lerilio-mensagem', texto); } catch (erro) { /* ignora */ }
}

export function mostrarMensagemGuardada() {
  try {
    const texto = sessionStorage.getItem('lerilio-mensagem');
    if (texto) {
      sessionStorage.removeItem('lerilio-mensagem');
      mostrarMensagem(texto);
    }
  } catch (erro) { /* ignora */ }
}
