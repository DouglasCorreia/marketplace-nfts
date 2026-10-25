# Arquitetura e limitações

Este documento descreve o código que está no repositório hoje. Requisitos do desafio ainda não implementados são identificados como pendentes para não sugerir que a demo os atende.

## Camadas

- `src/app`: composição dos providers, rotas e listener global de Socket.IO.
- `src/components`: layout compartilhado e componentes de interface.
- `src/domain`: tipos e regras puras de catálogo, cálculo de ETH, carrinho e pedidos.
- `src/features`: telas, acesso Axios e hooks TanStack Query agrupados por fluxo.
- `src/lib`: cliente HTTP, cliente Socket.IO e armazenamento de sessão/chave de checkout.
- `src/mocks`: handlers MSW e fixture estática de NFTs.
- `src/styles`: Tailwind CSS e tokens visuais.
- `tests/e2e`: fluxos Playwright atuais.

Axios envia as requisições REST para `/api`. Em desenvolvimento o MSW intercepta a rede; `build:demo` também ativa os mocks. O catálogo usa fixtures estáticas. TanStack Router armazena busca, filtros e ordenação no endereço. TanStack Query armazena dados remotos e invalida o carrinho após mutations.

## Sessão e estado

O mock de sessão e token, contas registradas, carrinho e pedidos usa `sessionStorage`. A sessão é consultada em `/api/session`; o interceptor HTTP envia `Authorization: Bearer <token>`. Logout limpa o cache TanStack Query. Não há expiração, renovação, isolamento robusto de dados do mock por usuário ou sincronização de perfil entre abas.

Favoritos são uma exceção: os IDs ficam em `localStorage` sob `kurio:favorites:v1`, compartilhados pelo navegador e não associados ao ID da conta. Não existe API de favoritos. Perfil e carteiras têm telas/formulários, porém não salvam no backend. Carrinho e pedidos são persistentes apenas na aba/sessão do navegador; não há backend durável.

O carrinho é buscado em `['cart']`; inclusão, alteração e remoção invalidam essa query. O pedido concluído é posto em `['order', id]`; uma confirmação invalida o carrinho. A chave de idempotência é guardada em `sessionStorage` enquanto a tentativa está em curso. O mock retorna imediatamente um estado terminal confirmado/recusado. Não há estado pendente recuperável nem atualização otimista.

Política padrão de query: `staleTime: 30_000`, `refetchOnWindowFocus: false`, `retry: 1`. Consulta de sessão usa `staleTime: 0` e sem retry; consulta de detalhe também desativa retry.

## REST e mocks

Os endpoints efetivamente implementados, formatos e limitações estão em [`API.md`](API.md). Em resumo: catálogo/detalhe, sessão/login/cadastro/logout, carrinho e pedidos existem. Favoritos, perfil, carteiras, cotação/cupom e alteração de catálogo não possuem endpoints. Os handlers de pedido exigem bearer token mock; a maioria dos demais handlers não associa os registros a um usuário.

Credencial fictícia: `collector@gallery.test` / `Gallery2026!`. O mock de senha usa SHA-256 sem salt somente para demonstração, e armazenamento client-side não deve ser considerado uma arquitetura segura de autenticação. Não usar dados reais.

`src/mocks/fixtures/nfts.ts` contém nove itens estáticos. Não há seletor geral de cenários, atraso variável, falha de rede, timeout nem estado compartilhado de mutação de catálogo. O checkout desktop oferece decisão local aprovar/recusar; esse controle não existe em mobile.

## Socket.IO e reconciliação

Há um cliente Socket.IO WebSocket na origem, path `/socket.io`. O cliente emite `catalog:subscribe`; o mock responde com `catalog:update` contendo somente `{ version, updatedAt }`. A atualização invalida consultas de catálogo, deixando REST como fonte. Após conexão, o catálogo também é invalidado. O ciclo de vida remove os handlers e desconecta o socket.

Isto não implementa o contrato requerido de `nft.updated` ou `order.updated`. Não há identidade estável/event ID, recurso NFT ou pedido no payload, associação ao usuário/sessão, guarda contra evento de sessão anterior, atualização de detalhe/carrinho/pedido, nem reconciliação de recursos ativos via REST após reconexão. A versão máxima é mantida numa variável local ao listener e reinicia ao remontar; portanto deduplicação é limitada. Uma função de domínio para ignorar versões antigas de pedido existe, mas não está ligada ao socket.

Contrato e lacunas estão detalhados em [`EVENTS.md`](EVENTS.md).

## Referência visual, UX e desvios do Figma

Referência: screenshots fornecidos pelo usuário e cópia do arquivo [Frontend Challenge no Figma](https://www.figma.com/design/tqAqUwFixkfhFB86cjrRGW/Frontend-Challenge--Copy-?node-id=0-1). As telas seguem a paleta espresso/âmbar, textos em português, fonte Roboto, Tailwind e as ilustrações de macacos. Os quatro assets em `public/assets/nfts/` são recortes rasterizados das capturas disponíveis, não exports das layers originais.

O Figma MCP atingiu o limite do plano Starter e a leitura pública do arquivo não ficou disponível. Logo, as dimensões e estados foram reproduzidos a partir das screenshots, sem inspeção direta de nodes, tokens ou componentes no arquivo. As páginas Perfil do colecionador e Carteiras foram montadas a partir das imagens enviadas; são formulários visuais sem persistência. A confirmação usa o estado do pedido; a imagem de referência da confirmação estava em branco. Responsividade de telas sem screenshot mobile foi inferida pelo padrão das demais telas.

Limitações de UX conhecidas:

- Atividade, Ofertas, Arquivos baixados e Suporte são links visuais sem páginas funcionais.
- Favoritos permanecem no mesmo navegador, sem sincronização entre contas/dispositivos.
- Checkout de demonstração usa uma decisão local no desktop; carteira e rede não conectam a provedores reais.
- Cupom, cotação, edição de perfil/avatar/senha e cadastro de carteiras não persistem.
- Skeletons são simples; não há shimmer configurado globalmente nem auditoria de CLS/Lighthouse entregue.

## Build, auditoria e publicação

`npm run build:demo` cria uma build Vite autocontida com mocks. Não há configuração de hosting ou aplicação publicada neste checkout. Para publicar, a plataforma precisa entregar SPA fallback para `index.html`, assets em mesma origem e suporte ao path `/socket.io` via Service Worker do MSW.

Scripts `lint` e `lighthouse` constam no `package.json`, mas ESLint, `@lhci/cli` e configurações respectivas não estão presentes. `test:visual` aponta para uma pasta inexistente; não existem snapshots visuais. Relatórios/medições Lighthouse e metas não foram produzidos. A suíte E2E atual cobre somente os fluxos listados em [`TESTING.md`](TESTING.md).
