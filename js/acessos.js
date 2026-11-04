// Lerílio — registro de acessos (RF02 e RF18)
// © 2026 Dalila Cristina Ferreira. Todos os direitos reservados.
//
// Como funciona:
// 1. Cada acesso é guardado primeiro no próprio celular (localStorage).
// 2. Depois, o app tenta enviar para o Firebase.
// 3. Se não houver internet, o registro continua guardado e é reenviado
//    na próxima vez que o app abrir com conexão. Assim nenhum acesso se perde.
//
// Na nuvem vão SÓ o primeiro nome e o horário (RNF09).

import { initializeApp } from 'https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js';
import {
  getFirestore,
  collection,
  addDoc,
  serverTimestamp,
  Timestamp
} from 'https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js';
import { firebaseConfig } from './firebase-config.js';

const CHAVE_PENDENTES = 'lerilio-acessos-pendentes';
let banco = null;

// Conecta ao Firebase só quando for usar.
function conectar() {
  if (!banco) banco = getFirestore(initializeApp(firebaseConfig));
  return banco;
}

function lerPendentes() {
  try {
    return JSON.parse(localStorage.getItem(CHAVE_PENDENTES)) || [];
  } catch (erro) {
    return [];
  }
}

function salvarPendentes(lista) {
  localStorage.setItem(CHAVE_PENDENTES, JSON.stringify(lista));
}

// Desiste de esperar depois de alguns segundos (internet muito lenta).
function comPrazo(promessa, milissegundos) {
  const prazo = new Promise((_, rejeitar) =>
    setTimeout(() => rejeitar(new Error('tempo esgotado')), milissegundos)
  );
  return Promise.race([promessa, prazo]);
}

// Guarda um acesso e tenta enviar. Chame ao abrir o app.
export async function registrarAcesso(nome) {
  const pendentes = lerPendentes();
  pendentes.push({ nome: String(nome).trim().slice(0, 30), registradoEm: Date.now() });
  salvarPendentes(pendentes);
  return enviarPendentes();
}

// Envia tudo o que ficou guardado. Devolve quantos foram e quantos faltam.
export async function enviarPendentes() {
  const lista = lerPendentes();
  if (!navigator.onLine) return { enviados: 0, pendentes: lista.length };

  const restantes = [];
  let enviados = 0;
  for (const item of lista) {
    try {
      await comPrazo(
        addDoc(collection(conectar(), 'acessos'), {
          nome: item.nome,
          dataHora: serverTimestamp(),
          registradoEm: Timestamp.fromMillis(item.registradoEm)
        }),
        8000
      );
      enviados++;
    } catch (erro) {
      console.warn('Acesso não enviado, fica guardado para depois:', erro.message);
      restantes.push(item);
    }
  }
  salvarPendentes(restantes);
  return { enviados, pendentes: restantes.length };
}
