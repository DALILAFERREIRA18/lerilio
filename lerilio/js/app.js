// Lerílio — página de teste da configuração (tarefa 5)
// © 2026 Dalila Cristina Ferreira. Todos os direitos reservados.
//
// Esta página só confere se a publicação, a voz e o registro de acessos
// funcionam. As telas do app entram depois da validação com os participantes.

import { falar, parar, estaFalando } from './voz.js';
import { registrarAcesso, enviarPendentes } from './acessos.js';

const botaoOuvir = document.getElementById('ouvir');
const botaoTestar = document.getElementById('testar');
const mensagem = document.getElementById('mensagem');
const conteudo = document.getElementById('conteudo');

function mostrar(texto) {
  mensagem.textContent = texto;
  mensagem.hidden = false;
}

// Botão Ouvir: lê o conteúdo da tela; um novo toque para a leitura.
botaoOuvir.addEventListener('click', () => {
  if (estaFalando()) {
    parar();
    return;
  }
  const conseguiu = falar(conteudo.innerText);
  if (!conseguiu) mostrar('A leitura em voz não está disponível neste aparelho.');
});

// Botão de teste: grava um acesso com o nome "Teste".
botaoTestar.addEventListener('click', async () => {
  mostrar('Enviando o registro...');
  const resultado = await registrarAcesso('Teste');
  if (resultado.enviados > 0) {
    mostrar('Registro enviado. Confira no Firebase, em Firestore, coleção "acessos".');
  } else {
    mostrar('O registro ficou guardado no celular. Ele será enviado quando houver internet e o Firebase estiver configurado.');
  }
});

// Quando a internet volta, envia o que ficou guardado (RF18).
window.addEventListener('online', () => enviarPendentes());
