# Onde Parei? (Mangás e Animes)

Extensão para Google Chrome que permite salvar links de obras e acompanhar **manualmente** capítulos de mangás lidos e episódios de animes assistidos.

## Recursos

- Cadastro de obras com título, tipo, URL, tags, notas e status.
- Progresso numérico com botões +1/−1 ou edição direta.
- Busca e filtros por status e tipo.
- Histórico de alterações, favoritos organizados por tags.
- Captura da URL e do título da aba atual **somente por ação do usuário**.
- Backup JSON exportável/importável.
- Dados armazenados localmente, sem servidor, scraping ou player integrado.

## Instalação

1. Baixe e extraia o ZIP deste repositório.
2. Abra `chrome://extensions` no Chrome.
3. Habilite **Modo do desenvolvedor**.
4. Clique em **Carregar sem compactação**.
5. Selecione a pasta extraída contendo `manifest.json`.

Mais informações em [INSTALL.md](INSTALL.md).

## Como usar

1. Abra o popup e escolha **+ Nova obra**.
2. Preencha o título e o link da página principal (ou clique **Usar aba atual**).
3. Escolha anime ou mangá, defina status e, se souber, total de episódios ou capítulos.
4. Use **✓ + 1** quando terminar um episódio/capítulo, **− 1** para corrigir ou **Editar** para ajustar diretamente o número.
5. Em **Dados**, exporte regularmente seu backup JSON.

## Estrutura

- `manifest.json` — Manifest V3 e permissões mínimas (`storage`, `activeTab`).
- `popup.html` — interface.
- `styles.css` — estilo.
- `popup.js` — interface, validação e persistência.
- `INSTALL.md` — instruções.

## Privacidade e limitações

A extensão não lê conteúdos de páginas, não monitora vídeo ou leitura, não baixa mídia e não ignora publicidade. A URL/título da aba só é consultada ao clicar no botão correspondente. O armazenamento é local ao perfil do Chrome, portanto **não há sincronização entre aparelhos**. O progresso é uma sequência numérica por obra; futuras versões podem organizar temporadas, volumes e links individuais.

## Desenvolvimento

Este MVP não utiliza gerenciador de pacotes nem etapa de build. Modifique os arquivos e recarregue a extensão em `chrome://extensions`.

## Licença

Nenhuma licença de uso ou redistribuição foi concedida neste repositório.
