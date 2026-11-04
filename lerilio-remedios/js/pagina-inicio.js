// Lerílio — tela inicial
// © 2026 Dalila Cristina Ferreira. Todos os direitos reservados.

import './aviso.js';
import { listarRemedios, situacao, nomeDaPessoa } from './dados.js';
import { ligarOuvir, mostrarMensagemGuardada } from './ui.js';

const RELOGIO = '<svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#7A5A00" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 2"/></svg>';
const CERTO = '<svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#1F5E3A" stroke-width="2.6" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M5 12.5l4.5 4.5L19 7.5"/></svg>';

function atualizar() {
  const nome = nomeDaPessoa();
  document.getElementById('saudacao').textContent = nome ? `Olá, ${nome}!` : 'Olá!';

  const resumo = document.getElementById('resumo');
  const remedios = listarRemedios();
  const pendentes = remedios.filter((r) => situacao(r) === 'pendente').length;
  resumo.innerHTML = '';
  if (pendentes > 0) {
    resumo.innerHTML = `<a href="remedios.html" class="resumo resumo-pendente">${RELOGIO}<span><strong></strong>Toque para ver os remédios de hoje</span></a>`;
    resumo.querySelector('strong').textContent = pendentes === 1
      ? '1 remédio ainda não confirmado'
      : `${pendentes} remédios ainda não confirmados`;
  } else if (remedios.length > 0) {
    resumo.innerHTML = `<a href="remedios.html" class="resumo resumo-ok">${CERTO}<span><strong>Remédios de hoje em dia até agora</strong>Toque para ver a lista</span></a>`;
  }
}

atualizar();
ligarOuvir();
mostrarMensagemGuardada();
document.addEventListener('lerilio:mudou', atualizar);
setInterval(atualizar, 60000); // um remédio pode ficar pendente enquanto a tela está aberta
