// Lerílio — leitura em voz alta (RF13 e RF20)
// © 2026 Dalila Cristina Ferreira. Todos os direitos reservados.
//
// Usa a "Web Speech API", que já vem no navegador do celular.
// Não precisa instalar nada.

// Responde se o navegador consegue falar.
export function vozDisponivel() {
  return 'speechSynthesis' in window;
}

// Fala o texto em português. Devolve false se o aparelho não tiver voz.
export function falar(texto) {
  if (!vozDisponivel()) return false;
  window.speechSynthesis.cancel(); // para qualquer leitura anterior
  const fala = new SpeechSynthesisUtterance(texto);
  fala.lang = 'pt-BR';
  fala.rate = 0.9; // um pouco mais devagar, para facilitar o entendimento
  const vozPortugues = window.speechSynthesis
    .getVoices()
    .find((voz) => voz.lang && voz.lang.toLowerCase().startsWith('pt'));
  if (vozPortugues) fala.voice = vozPortugues;
  window.speechSynthesis.speak(fala);
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
