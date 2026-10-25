# Kurio — Marketplace de NFTs

Marketplace de demonstração desenvolvido para o Frontend Challenge. O projeto usa React, TypeScript, TanStack Router/Query, Axios, Tailwind CSS, MSW e Socket.IO Client. Os dados são simulados no navegador; não há conexão com blockchain ou serviço de pagamento real.

## Entrega e estado da publicação

- Repositório: [github.com/DouglasCorreia/marketplace-nfts](https://github.com/DouglasCorreia/marketplace-nfts)
- Aplicação pública: **ainda não publicada**. O deploy obrigatório e uma URL pública continuam pendentes.
- Referência visual: [Frontend Challenge — cópia no Figma](https://www.figma.com/design/tqAqUwFixkfhFB86cjrRGW/Frontend-Challenge--Copy-?node-id=0-1).

O Figma MCP não estava disponível durante os últimos ajustes por limite do plano Starter. A implementação visual usa as capturas fornecidas no projeto; diferenças e limitações estão em [`docs/ARCHITECTURE.md`](docs/ARCHITECTURE.md).

## Requisitos e setup

- Node.js 22 ou superior
- npm
- Git

```bash
git clone https://github.com/DouglasCorreia/marketplace-nfts.git
cd marketplace-nfts
npm ci
```

Copie `.env.example` para `.env` se quiser alterar a configuração local. Não há chaves privadas nem serviços externos obrigatórios.

```dotenv
VITE_ENABLE_MOCKS=false
```

No modo Vite de desenvolvimento, os mocks iniciam automaticamente, independentemente desse valor. `VITE_ENABLE_MOCKS=true` ativa os mocks em um build de demonstração.

### Executar localmente

```bash
npm run dev:mock
```

Abra `http://127.0.0.1:5173`. `dev:mock` é um alias de `vite`; o `src/main.tsx` inicia o Service Worker do MSW em desenvolvimento. As rotas são SPA e o servidor Vite atende acesso direto/refresh durante o desenvolvimento e preview.

### Comandos disponíveis

| Comando | Uso e estado |
| --- | --- |
| `npm run dev:mock` | Desenvolvimento com handlers MSW e mock Socket.IO. |
| `npm run typecheck` | Verificação TypeScript (`tsc -b --pretty`). |
| `npm test` | Testes unitários Vitest em `src/**/*.test.ts`. |
| `npm run build` | Build otimizado sem ativar mocks; requer uma API compatível em `/api` para funcionar. |
| `npm run build:demo` | Build otimizado com `VITE_ENABLE_MOCKS=true`, sem backend. |
| `npm run preview` | Serve `dist/`; para demo, execute após `npm run build:demo`. |
| `npx playwright install chromium` | Instala o Chromium usado nos testes E2E. |
| `npm run test:e2e` | Playwright em Chromium desktop e mobile; a configuração inicia Vite. |
| `npm run test:e2e:ui` | Interface interativa do Playwright. |
| `npm run test:report` | Abre o relatório HTML gerado pelo Playwright. |
| `npm run mock:reset` | Remove `.mock-data`, que não é usado pelos handlers atuais; veja o reset real abaixo. |
| `npm run lint` | Script declarado, mas ESLint e sua configuração não estão incluídos no checkout atual. Não funciona em instalação limpa. |
| `npm run lighthouse` | Script declarado, mas `@lhci/cli` e configuração Lighthouse não estão incluídos no checkout atual. Não funciona em instalação limpa. |
| `npm run test:visual` | Script declarado, mas não existe `tests/visual` nem baseline visual versionada. |

Para testar o build isolado de demonstração:

```bash
npm run build:demo
npm run preview
```

O host de produção deve encaminhar caminhos desconhecidos para `index.html` (SPA fallback) e servir os arquivos `public/` na mesma origem, para que rotas diretas, refresh e o endpoint mock `/socket.io` funcionem. Nenhuma configuração de Vercel, Netlify ou Cloudflare Pages foi entregue até agora.

## Conta de demonstração

Use este usuário para login e checkout:

| E-mail | Senha |
| --- | --- |
| `collector@gallery.test` | `Gallery2026!` |

Também é possível cadastrar contas de demonstração. Os dados dessas contas ficam no `sessionStorage` da aba e são removidos ao limpar o armazenamento. Não use dados reais.

## Mocks: cenários, seleção e reset

Os handlers REST e o handler WebSocket/Socket.IO estão em `src/mocks/handlers.ts`; o catálogo vem de `src/mocks/fixtures/nfts.ts`. O conjunto atual tem nove NFTs. Não existe seletor geral de cenários nem um sistema de latência/falhas configurável.

Fluxos de falha que podem ser reproduzidos hoje:

1. **Credenciais inválidas (401):** tente entrar com outro e-mail ou senha.
2. **E-mail já cadastrado (409):** registre a conta `collector@gallery.test`.
3. **Pagamento recusado:** adicione NFT ao carrinho, entre na conta e, na versão desktop do checkout, escolha **Recusar pagamento (teste)**. O seletor não aparece no checkout mobile.
4. **Endereço inválido:** no checkout desktop, informe um endereço que não corresponda ao padrão `0x` + 40 caracteres hexadecimais.
5. **Item indisponível (409):** altere temporariamente `available` no fixture para um valor inferior à quantidade pedida. O fixture é estático e o checkout não oferece um controle de cenário para isso.

Timeout após criação, latência variável, respostas fora de ordem, sessão expirada, preço/estoque alterados durante o checkout e eventos Socket.IO de pedido/NFT ainda não são cenários implementados.

Para zerar o estado usado pela aplicação, abra o DevTools do navegador na origem local, execute no Console e recarregue:

```js
localStorage.removeItem('kurio:favorites:v1');
sessionStorage.clear();
location.reload();
```

Isso limpa favoritos, sessão, contas de demonstração, carrinho, pedidos e chave de idempotência daquela aba/origem. Os fixtures em `src/mocks/fixtures/` não são alterados. `npm run mock:reset` só remove `.mock-data`, que os handlers atuais não leem.

## Rotas entregues

| Rota | Conteúdo |
| --- | --- |
| `/` | Home, catálogo, busca, filtros e ordenação. |
| `/nft/:nftId` | Detalhe, escolha de edição, quantidade, favorito e compra. |
| `/cart` | Itens e quantidades do carrinho. |
| `/checkout` | Checkout simulado, exige sessão. |
| `/orders/:orderId` | Recibo do pedido, exige sessão pela API. |
| `/profile` | Formulário visual de perfil, exige sessão. |
| `/profile/wallets` | Formulário visual de carteiras, exige sessão. |
| `/profile/favorites` | Lista de favoritos do armazenamento local, dentro da área de perfil. |

Perfil e carteiras ainda não persistem em API. Os links de Atividade, Ofertas, Arquivos baixados e Suporte são apenas itens visuais do menu.

## Contratos REST implementados

Todas as chamadas usam Axios (`src/lib/http/client.ts`) e os handlers MSW.

| Método e caminho | Corpo/consulta | Resultado atual |
| --- | --- | --- |
| `GET /api/nfts` | `q`, `category`, `sort`, `page` | `{ items, total, page, pageSize }`; fixture estático. |
| `GET /api/nfts/:nftId` | ID na rota | NFT; `404 NOT_FOUND` se não existir. |
| `GET /api/session` | — | `{ user }`, com `user: null` sem sessão. |
| `POST /api/auth/login` | `{ email, password }` | `{ user }`; `401 INVALID_CREDENTIALS` para falha. Token mock é guardado no `sessionStorage`. |
| `POST /api/auth/register` | `{ name, email, password }` | `{ user }`; valida senha de ao menos 10 caracteres e retorna `409 EMAIL_IN_USE`. |
| `POST /api/auth/logout` | — | `{ ok: true }`; remove sessão simulada. |
| `GET /api/cart` | — | `{ items, version, subtotalEth }`. |
| `POST /api/cart/items` | `{ nftId, edition, quantity }` | Carrinho atualizado; `400`, `404` ou `409 UNAVAILABLE` conforme validação. |
| `PATCH /api/cart/items/:nftId?edition=...` | `{ quantity }` | Carrinho atualizado; verifica estoque do fixture. |
| `DELETE /api/cart/items/:nftId?edition=...` | — | Carrinho atualizado. |
| `POST /api/orders` | `{ walletAddress, network, paymentDecision }` e header `Idempotency-Key` | Pedido imediatamente `confirmed` ou `declined`; mesma chave retorna pedido armazenado, sem validar se o corpo mudou. |
| `GET /api/orders/:orderId` | ID na rota | Pedido armazenado; exige token mock, retorna `401` ou `404` em falha. |

Valores de ETH trafegam como strings; a aritmética de valores usa wei (`bigint`). O mock de pedido guarda snapshot dos itens, aplica taxa de rede simulada de `0.016 ETH` em confirmação e esvazia o carrinho apenas nesse caso.

Não existem endpoints REST para favoritos, cotação/cupom, perfil ou carteiras. Favoritos são armazenados em `localStorage`; seus IDs não são isolados por conta. O carrinho, sessão, contas e pedidos mock são armazenados em `sessionStorage`, sem persistência entre sessões/abas como um backend faria. Veja [`docs/API.md`](docs/API.md) para detalhes.

## Socket.IO e atualização de dados

O cliente conecta à mesma origem por WebSocket em `/socket.io`, emite `catalog:subscribe` e o mock responde com:

```json
{ "version": 1, "updatedAt": "ISO-8601" }
```

O evento atual chama-se `catalog:update`. Ao conectar ou receber uma versão maior, o cliente invalida consultas de catálogo; REST continua sendo a fonte dos dados. O listener remove seus handlers e desconecta ao encerrar o ciclo de vida.

O contrato exigido `nft.updated` e `order.updated` **não está implementado**. O evento atual não traz identidade do NFT/pedido nem identidade de sessão; não atualiza detalhe, carrinho ou pedido. A reconciliação após reconexão cobre apenas catálogo. Duplicatas são ignoradas por versão numérica local, mas essa versão é reiniciada quando o listener remonta. Portanto, esta integração é uma prova limitada do transporte, não um fluxo de tempo real completo. Consulte [`docs/EVENTS.md`](docs/EVENTS.md).

## Sessão, carrinho e cache

- O token de demonstração fica em `sessionStorage` e é enviado como `Authorization: Bearer ...` pelo interceptor Axios. É uma simulação client-side; não equivale a cookie `HttpOnly` nem a autenticação segura de produção.
- Logout chama o endpoint mock e limpa o TanStack Query cache. Não há expiração simulada, isolamento completo de mock state por usuário ou fluxo testado de troca de usuário.
- O carrinho é consultado pela chave TanStack Query `['cart']`; mutations de inclusão, quantidade e remoção invalidam essa chave e recarregam via REST.
- As consultas usam `staleTime: 30s`, `refetchOnWindowFocus: false` e `retry: 1` por padrão. Sessão usa `staleTime: 0`/sem retry; detalhe também desativa retry.
- Criação do pedido guarda a resposta em `['order', id]` e invalida o carrinho se confirmado. A chave de idempotência fica no `sessionStorage` até sucesso.
- Não há atualização otimista entregue. A sincronização Socket.IO/REST está limitada ao catálogo e conforme descrito acima.

## Testes e auditorias

```bash
npm test
npm run typecheck
npx playwright install chromium
npm run test:e2e
```

Vitest contém testes de domínio para cálculo/validação de catálogo, carrinho e uma função de ordenação de versão de pedido. Playwright está configurado para Chromium desktop e Pixel 7 mobile, com relatório HTML e trace retido em falhas. A suíte existente cobre filtros/URL, detalhe válido e inexistente, carrinho e compra simulada. Ela ainda não cobre todos os fluxos listados pelo desafio; não há baselines visuais.

Os scripts `lint` e `lighthouse` estão declarados em `package.json`, mas faltam dependências e configuração correspondentes no checkout. Não há resultados Lighthouse versionados, medições de três execuções, configuração de auditoria ou metas verificadas. Esses itens continuam pendentes; não execute esses scripts esperando uma auditoria válida.

## Estrutura do projeto

```text
src/
  app/          providers, router e listener de live updates
  components/   layout e componentes compartilhados
  domain/       tipos e regras puras de catálogo, carrinho e pedido
  features/     páginas, API e queries por fluxo
  lib/          Axios, Socket.IO e armazenamento de sessão/checkout
  mocks/        handlers MSW e fixtures
  styles/       Tailwind e tokens visuais
tests/e2e/      fluxos Playwright
docs/           arquitetura, contratos e estado dos testes
public/         service worker MSW e assets raster
```

Mais contexto, incluindo decisões de UX, divergências visuais e limites de escopo, está em [`docs/ARCHITECTURE.md`](docs/ARCHITECTURE.md).
