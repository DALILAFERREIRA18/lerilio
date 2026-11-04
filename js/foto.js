// Lerílio — foto da caixa do remédio (RF21)
// © 2026 Dalila Cristina Ferreira. Todos os direitos reservados.
//
// Diminui a foto antes de guardar, para caber no celular sem pesar.

export function reduzirFoto(arquivo, ladoMaximo = 320) {
  return new Promise((resolver, rejeitar) => {
    const leitor = new FileReader();
    leitor.onerror = () => rejeitar(new Error('Não foi possível ler a foto.'));
    leitor.onload = () => {
      const imagem = new Image();
      imagem.onerror = () => rejeitar(new Error('Este arquivo não parece ser uma foto.'));
      imagem.onload = () => {
        const escala = Math.min(1, ladoMaximo / Math.max(imagem.width, imagem.height));
        const tela = document.createElement('canvas');
        tela.width = Math.round(imagem.width * escala);
        tela.height = Math.round(imagem.height * escala);
        tela.getContext('2d').drawImage(imagem, 0, 0, tela.width, tela.height);
        resolver(tela.toDataURL('image/jpeg', 0.7));
      };
      imagem.src = leitor.result;
    };
    leitor.readAsDataURL(arquivo);
  });
}
