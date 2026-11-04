// Lerílio — leitura em voz alta (RF13 e RF20)
// © 2026 Dalila Cristina Ferreira. Todos os direitos reservados.
//
// Usa a "Web Speech API", que já vem no navegador do celular.
// Não precisa instalar nada.

// Responde se o navegador consegue falar.
export function vozDisponivel() {
  return 'speechSynthesis' in window;
}

// Procura uma voz em português (a lista pode demorar a carregar).
function vozEmPortugues() {
  return window.speechSynthesis
      .getVoices()
      .find((voz) => voz.lang && voz.lang.toLowerCase().startsWith('pt'));
}

// Fala o texto em português. Devolve false se o aparelho não tiver voz.
export function falar(texto) {
  if (!vozDisponivel()) return false;
  const sintese = window.speechSynthesis;

  // Só para uma leitura anterior se houver uma em andamento.
  if (sintese.speaking || sintese.pending) sintese.cancel();

  const fala = new SpeechSynthesisUtterance(texto);
  fala.lang = 'pt-BR';
  fala.rate = 0.9; // um pouco mais devagar, para facilitar o entendimento
  const voz = vozEmPortugues();
  if (voz) fala.voice = voz;

  // O Chrome às vezes ignora a fala pedida logo depois de parar outra;
  // esperar um instante evita esse problema.
  setTimeout(() => {
    sintese.resume(); // destrava a voz, se o navegador a deixou pausada
    sintese.speak(fala);
  }, 150);
  return true;
}

// Para a leitura (UC06: tocar em Ouvir de novo para parar).
export function parar() {
  if (vozDisponivel()) window.speechSynthesis.cancel();
}

// Responde se está lendo neste momento.
export function estaFalando() {
  return vozDisponivel() && window.speechSynthesis.speaking;
}

// Pede a lista de vozes cedo, para ela já estar pronta no primeiro toque.
if (vozDisponivel()) {
  window.speechSynthesis.getVoices();
  window.speechSynthesis.addEventListener?.('voiceschanged', () => {});
}