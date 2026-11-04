# Lerílio — versão de teste

© 2026 Dalila Cristina Ferreira. Todos os direitos reservados.

O Lerílio é um aplicativo web simples para ajudar adultos com 50 anos ou mais a
lembrar dos remédios e das consultas, com letras grandes e leitura em voz alta.
Projeto da disciplina Atividade Extensionista II do Curso Superior de Tecnologia
em Banco de Dados do Centro Universitário Internacional UNINTER.

## Como testar

Abra no celular: https://dalilaferreira18.github.io/lerilio/ (não é preciso instalar nada).

O protótipo das telas, usado na validação com os participantes, fica em
https://dalilaferreira18.github.io/lerilio/prototipo/

Nos testes, use apenas dados fictícios, como "Remédio de teste A".

## Estrutura

| Arquivo | Para que serve |
| --- | --- |
| `index.html` | Tela inicial |
| `remedios.html` | Lista dos remédios de hoje |
| `remedio.html` | Cadastrar, mudar ou excluir um remédio |
| `em-breve.html` | Partes ainda em construção |
| `css/estilo.css` | Cores, letras e botões (guia de estilo do projeto) |
| `js/dados.js` | Guarda remédios e registros no próprio celular |
| `js/aviso.js` | Aviso na hora do remédio, em todas as telas |
| `js/ui.js` | Mensagens, confirmações e botão Ouvir |
| `js/voz.js` | Leitura em voz alta (Web Speech API do navegador) |
| `js/foto.js` | Diminui a foto da caixa do remédio |
| `js/acessos.js` | Registro de acessos no Firebase, com reenvio sem internet |
| `js/firebase-config.js` | Configuração do projeto no Firebase |
| `js/pagina-*.js` | O que cada página faz |
| `firestore.rules` | Regras do banco: só permite gravar acessos |
| `prototipo/` | Protótipo navegável das telas, para a validação |

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
