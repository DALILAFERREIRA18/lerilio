# Lerílio — versão de teste

© 2026 Dalila Cristina Ferreira. Todos os direitos reservados.

O Lerílio é um aplicativo web simples para ajudar adultos com 50 anos ou mais a
lembrar dos remédios e das consultas, com letras grandes e leitura em voz alta.
Projeto da disciplina Atividade Extensionista II do Curso Superior de Tecnologia
em Banco de Dados do Centro Universitário Internacional UNINTER.

## Como testar

Abra o link do GitHub Pages no celular: `https://SEU-USUARIO.github.io/lerilio/`
(substitua pelo link real depois de publicar). Não é preciso instalar nada.

Nos testes, use apenas dados fictícios, como "Remédio de teste A".

## Estrutura

| Arquivo | Para que serve |
| --- | --- |
| `index.html` | Página do app |
| `css/estilo.css` | Cores, letras e botões (guia de estilo do projeto) |
| `js/app.js` | Liga os botões da página às funções |
| `js/voz.js` | Leitura em voz alta (Web Speech API do navegador) |
| `js/acessos.js` | Registro de acessos no Firebase, com reenvio sem internet |
| `js/firebase-config.js` | Configuração do projeto no Firebase |
| `firestore.rules` | Regras do banco: só permite gravar acessos |

## Tecnologias

- HTML, CSS e JavaScript, sem frameworks.
- GitHub Pages, para publicar o app.
- Firebase Cloud Firestore (plano gratuito), só para o registro de acessos.
  O SDK do Firebase é distribuído pelo Google sob a licença Apache 2.0.
- Fonte Nunito, do Google Fonts, sob a licença SIL Open Font License.

Remédios, consultas e contatos ficam salvos apenas no celular de quem usa.
Na nuvem ficam só o primeiro nome e o horário de acesso.

## Licença

Todos os direitos reservados. O código está público apenas para avaliação
acadêmica. Veja o arquivo `LICENSE`.
