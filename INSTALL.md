# Instalação local

1. Baixe o repositório como ZIP no GitHub e extraia os arquivos.
2. Abra `chrome://extensions` no Google Chrome.
3. Ative **Modo do desenvolvedor**.
4. Clique em **Carregar sem compactação** e selecione a pasta que contém `manifest.json`.
5. Fixe **Onde Parei?** na barra de ferramentas e clique no ícone para abrir o **painel lateral**, que permanece disponível enquanto navega pelo site.

## Como usar

- Clique em **+ Nova obra** e informe título, tipo e link da página da obra.
- Use **Usar aba atual** para preencher o link do site que está aberto.
- Marque manualmente **+ 1** ao concluir o próximo episódio/capítulo, ou **− 1** para corrigir.
- Em **Editar**, informe diretamente o último capítulo/episódio concluído ou outros dados.
- Use **Biblioteca** para buscar, filtrar e abrir links; **Histórico** para consultar marcações; **Dados** para exportar/importar backup.

## Privacidade

Os dados ficam em `chrome.storage.local`, no perfil local do Chrome. A extensão não acessa o conteúdo dos sites, não monitora páginas ou players, não tem servidores e só lê URL/título da aba ativa quando você clica **Usar aba atual**. Links e títulos são inseridos pelo usuário. A extensão não armazena nem disponibiliza mídia.

## Limites

- Sem sincronização entre dispositivos: faça backups JSON.
- Um endereço principal por obra; não é necessário cadastrar cada episódio.
- Progresso é manual e numérico; episódios especiais e temporadas distintas podem ser registrados como obras separadas.
