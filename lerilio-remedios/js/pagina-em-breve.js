// Lerílio — página das partes ainda em construção
// © 2026 Dalila Cristina Ferreira. Todos os direitos reservados.

import './aviso.js';
import { ligarOuvir } from './ui.js';

const parte = new URLSearchParams(location.search).get('parte');
if (parte) document.getElementById('titulo-parte').textContent = `${parte}: em construção`;
ligarOuvir();
