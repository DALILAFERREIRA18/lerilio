// Lerílio — cadastrar, editar e excluir remédio (UC02: RF04, RF21)
// © 2026 Dalila Cristina Ferreira. Todos os direitos reservados.

import './aviso.js';
import { obterRemedio, salvarRemedio, excluirRemedio, remedioRepetido, horarioTexto } from './dados.js';
import { reduzirFoto } from './foto.js';
import { ligarOuvir, confirmar, mostrarMensagem, mensagemNaProximaPagina } from './ui.js';

const id = new URLSearchParams(location.search).get('id');
const existente = id ? obterRemedio(id) : null;

const campoNome = document.getElementById('nome');
const campoHorario = document.getElementById('horario');
const campoFoto = document.getElementById('foto');
const previa = document.getElementById('previa');
const removerFoto = document.getElementById('remover-foto');
const textoFoto = document.getElementById('texto-foto');
const repetido = document.getElementById('repetido');

let foto = null;
let alterado = false; // para perguntar "Quer sair sem salvar?"

function mostrarFoto(dados) {
  foto = dados;
  previa.hidden = !dados;
  removerFoto.hidden = !dados;
  if (dados) previa.src = dados;
  textoFoto.textContent = dados ? 'Trocar a foto' : 'Foto da caixa (opcional)';
}

// Modo edição: preenche o formulário com o remédio escolhido.
if (existente) {
  document.getElementById('titulo').textContent = 'Mudar remédio';
  document.title = 'Mudar remédio — Lerílio';
  campoNome.value = existente.nome;
  campoHorario.value = existente.horario;
  mostrarFoto(existente.foto);
  document.getElementById('excluir').hidden = false;
} else if (id) {
  mensagemNaProximaPagina('Esse remédio não foi encontrado.');
  location.replace('remedios.html');
}

document.getElementById('formulario').addEventListener('input', () => {
  alterado = true;
});

campoFoto.addEventListener('change', async () => {
  const arquivo = campoFoto.files[0];
  if (!arquivo) return;
  try {
    mostrarFoto(await reduzirFoto(arquivo));
    alterado = true;
  } catch (erro) {
    mostrarMensagem(erro.message);
  }
  campoFoto.value = '';
});

removerFoto.addEventListener('click', () => {
  mostrarFoto(null);
  alterado = true;
});

function marcarErro(campo, idErro, texto) {
  document.getElementById(idErro).textContent = texto;
  campo.setAttribute('aria-invalid', texto ? 'true' : 'false');
}

document.getElementById('formulario').addEventListener('submit', (evento) => {
  evento.preventDefault();
  const nome = campoNome.value.trim();
  const horario = campoHorario.value;
  marcarErro(campoNome, 'erro-nome', nome ? '' : 'Digite o nome do remédio.');
  marcarErro(campoHorario, 'erro-horario', horario ? '' : 'Escolha o horário.');
  repetido.hidden = true;
  if (!nome) return campoNome.focus();
  if (!horario) return campoHorario.focus();

  // Exceção do UC02: mesmo nome e horário já cadastrados.
  const igual = remedioRepetido(nome, horario, existente?.id);
  if (igual) {
    repetido.innerHTML = '<p style="margin: 0 0 10px; font-weight: 700">Esse remédio já está na lista.</p>';
    const link = document.createElement('a');
    link.href = `remedio.html?id=${encodeURIComponent(igual.id)}`;
    link.className = 'botao botao-contorno botao-pequeno';
    link.textContent = 'Mudar o que já existe';
    repetido.append(link);
    repetido.hidden = false;
    return link.focus();
  }

  const salvo = salvarRemedio({ id: existente?.id, nome, horario, foto });
  if (!salvo) {
    mostrarMensagem('Não coube no celular. Tente salvar sem a foto.');
    return;
  }
  mensagemNaProximaPagina(`${salvo.nome}, às ${horarioTexto(salvo.horario)}, salvo.`);
  location.href = 'remedios.html';
});

// Voltar e Cancelar: se algo foi digitado, pergunta antes de descartar (regra 2 de como voltar).
async function sair(evento) {
  evento?.preventDefault();
  if (alterado) {
    const sim = await confirmar('Quer sair sem salvar?', 'O que você digitou nesta tela será perdido.', 'Sair sem salvar', 'Continuar editando');
    if (!sim) return;
  }
  location.href = 'remedios.html';
}
document.getElementById('voltar').addEventListener('click', sair);
document.getElementById('cancelar').addEventListener('click', sair);

document.getElementById('excluir').addEventListener('click', async () => {
  const sim = await confirmar(`Quer mesmo excluir o ${existente.nome}?`, 'Ele sai da lista e não avisa mais.', 'Excluir', 'Cancelar');
  if (!sim) return;
  excluirRemedio(existente.id);
  mensagemNaProximaPagina(`${existente.nome} excluído.`);
  location.href = 'remedios.html';
});

ligarOuvir();
