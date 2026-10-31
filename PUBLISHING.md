# Publicação da extensão na Chrome Web Store

## 1. Validar o pacote

1. Teste a extensão descompactada em `chrome://extensions`.
2. Valide cadastro, edição, exclusão, progresso, histórico, backup e importação.
3. Teste a extração em uma página HTTPS e confirme o diálogo de permissões.
4. Configure a constante `SUPPORT_URL` no começo de `popup.js` com a URL real de apoio. Enquanto estiver vazia, o link de doação fica oculto.
5. Confira a versão do `manifest.json` e verifique o funcionamento dos ícones.

## 2. Preparar o ZIP

Crie um arquivo ZIP **com os arquivos da extensão na raiz** (não com uma pasta extra por fora): `manifest.json`, `popup.html`, `popup.js`, `styles.css`, `background.js`, `assets/`. Os arquivos de documentação não são necessários no pacote. Não inclua segredos, arquivos locais ou conteúdo do site de terceiros.

## 3. Registrar e enviar

1. Acesse https://chrome.google.com/webstore/devconsole.
2. Faça o cadastro de desenvolvedor e conclua a taxa única, se ainda não possuir conta.
3. Escolha adicionar novo item e envie o ZIP da extensão.
4. Use os textos de STORE_LISTING.md.
5. Forneça capturas reais de tela da extensão.
6. Preencha a aba **Privacy practices**, justificando cada permissão e informando uma URL pública para a política descrita em PRIVACY.md.
7. Revise distribuição, visibilidade e divulgações de monetização aplicáveis.
8. Envie para revisão da Google.

## 4. Depois da aprovação

Copie a URL pública da extensão e inclua no README. Para atualizações futuras, aumente `version` no Manifest e envie um novo ZIP.

Referências oficiais:
- https://developer.chrome.com/docs/webstore/
- https://developer.chrome.com/docs/webstore/register/
- https://developer.chrome.com/docs/webstore/cws-dashboard-privacy/

## Observações

Este repositório contém uma versão implementada, porém a revisão humana dos dados da listagem, a conta de desenvolvedor, a aceitação dos termos e a submissão pública dependem do mantenedor.
