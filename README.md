# Onde Parei? (Mangás e Animes)

Extensão para Google Chrome que permite salvar links de obras e acompanhar **manualmente** capítulos de mangás lidos e episódios de animes assistidos.

## Idiomas

Português (Brasil), inglês e espanhol. A linguagem é detectada conforme a interface do Chrome e pode ser alterada em **Dados → Idioma**. A preferência é salva localmente; campos inseridos ou extraídos dos sites não são traduzidos. O Manifest usa os catálogos nativos de `_locales/`.

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

## Extração de informações da aba

No formulário **Nova obra**, clique em **Extrair dados da página** para consultar o DOM da aba ativa somente naquele momento. Na primeira utilização, o Chrome pode solicitar permissão para ler o site aberto. A extensão tenta preencher título, URL, sinopse, capa, tags, tipo e total (quando indicado em dados estruturados), e lista links candidatos de capítulos e episódios. Revise os campos antes de salvar: dados extraídos podem estar incompletos ou incorretos. Os links encontrados (até 200) ficam disponíveis em **Links extraídos**, na biblioteca, após salvar a obra. O progresso continua inteiramente manual. A extração não funciona em páginas internas do Chrome ou sites restritos; não contorna proteções nem anúncios.

## Como usar

1. Clique no ícone da extensão para abrir o **painel lateral** e escolha **+ Nova obra**.
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

A extensão não lê conteúdos de páginas, não monitora vídeo ou leitura, não baixa mídia e não ignora publicidade. O painel lateral permanece aberto enquanto você navega, seleciona e copia informações de um site para preencher o formulário manualmente. A URL/título da aba só é consultada ao clicar no botão correspondente. O armazenamento é local ao perfil do Chrome, portanto **não há sincronização entre aparelhos**. O progresso é uma sequência numérica por obra; futuras versões podem organizar temporadas, volumes e links individuais.

## Desenvolvimento

Este MVP não utiliza gerenciador de pacotes nem etapa de build. Modifique os arquivos e recarregue a extensão em `chrome://extensions`.

## Licença

Nenhuma licença de uso ou redistribuição foi concedida neste repositório.
