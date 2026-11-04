// Lerílio — lista dos remédios de hoje (RF05)
// © 2026 Dalila Cristina Ferreira. Todos os direitos reservados.

import { avisarMudanca } from './aviso.js';
import {
  listarRemedios, situacao, registroDeHoje, horarioTexto, horaTexto,
  registrarTomado, desfazerRegistro, limparAdiamento
} from './dados.js';
import { ligarOuvir, mostrarMensagem, mostrarMensagemGuardada } from './ui.js';

const COMPRIMIDO = '<svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><g transform="rotate(-35 12 12)"><rect x="3" y="8.5" width="18" height="7" rx="3.5"/><path d="M12 8.5v7"/></g></svg>';
const ICONES = {
  registrado: '<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.6" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M5 12.5l4.5 4.5L19 7.5"/></svg>',
  pendente: '<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 2"/></svg>',
  proximo: '<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 2"/></svg>'
};

function textoSituacao(remedio, estado) {
  if (estado === 'registrado') return `Registrado às ${horaTexto(registroDeHoje(remedio.id))}`;
  if (estado === 'pendente') return 'Ainda não confirmado';
  return `Próximo: às ${horarioTexto(remedio.horario)}`;
}

function marcarTomado(remedio) {
  registrarTomado(remedio.id);
  limparAdiamento(remedio.id);
  avisarMudanca();
  mostrarMensagem(`${remedio.nome} registrado.`, {
    acao: 'Desfazer',
    duracao: 10000,
    aoAgir: () => {
      desfazerRegistro(remedio.id);
      avisarMudanca();
    }
  });
}

function desenhar() {
  const lista = document.getElementById('lista');
  lista.innerHTML = '';
  const remedios = listarRemedios();
  if (remedios.length === 0) {
    lista.innerHTML = '<li class="cartao"><p style="margin: 0">Nenhum remédio cadastrado ainda. Toque em “Adicionar remédio”.</p></li>';
    return;
  }
  for (const remedio of remedios) {
    const estado = situacao(remedio);
    const item = document.createElement('li');
    item.className = `cartao${estado === 'pendente' ? ' cartao-pendente' : ''}`;

    const link = document.createElement('a');
    link.className = 'cartao-link';
    link.href = `remedio.html?id=${encodeURIComponent(remedio.id)}`;
    link.setAttribute('aria-label', `${remedio.nome}, às ${horarioTexto(remedio.horario)}. Toque para mudar ou excluir.`);
    const mini = document.createElement('span');
    mini.className = 'miniatura';
    if (remedio.foto) {
      const foto = document.createElement('img');
      foto.src = remedio.foto;
      foto.alt = '';
      mini.append(foto);
    } else {
      mini.innerHTML = COMPRIMIDO;
    }
    const nome = document.createElement('span');
    nome.className = 'cartao-nome';
    nome.textContent = remedio.nome;
    const hora = document.createElement('span');
    hora.className = 'cartao-hora';
    hora.textContent = horarioTexto(remedio.horario);
    link.append(mini, nome, hora);

    const linha = document.createElement('p');
    linha.className = `situacao situacao-${estado}`;
    linha.innerHTML = ICONES[estado];
    linha.append(textoSituacao(remedio, estado));

    item.append(link, linha);
    if (estado === 'pendente') {
      const botao = document.createElement('button');
      botao.type = 'button';
      botao.className = 'botao botao-verde botao-pequeno';
      botao.textContent = 'Já tomei';
      botao.setAttribute('aria-label', `Já tomei o ${remedio.nome}`);
      botao.addEventListener('click', () => marcarTomado(remedio));
      item.append(botao);
    }
    lista.append(item);
  }
}

desenhar();
ligarOuvir();
mostrarMensagemGuardada();
document.addEventListener('lerilio:mudou', desenhar);
setInterval(desenhar, 60000);
