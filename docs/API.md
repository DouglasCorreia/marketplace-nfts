# Contratos REST implementados

Base URL: `/api`. `src/lib/http/client.ts` configura Axios, timeout de 8 segundos e header bearer quando há token mock. `src/mocks/handlers.ts` define os handlers MSW. Esta lista descreve implementação atual, não todos os recursos solicitados pelo desafio.

| Método | Endpoint | Entrada | Saída / erros implementados |
| --- | --- | --- | --- |
| GET | `/nfts` | Query `q`, `category`, `sort`, `page` | `{ items, total, page, pageSize }`; fixture estático. |
| GET | `/nfts/:nftId` | `nftId` | `NFT`; `404 { code: "NOT_FOUND", message }`. |
| GET | `/session` | — | `{ user }`, null quando não autenticado. |
| POST | `/auth/login` | `{ email, password }` | `{ user }`; `401 INVALID_CREDENTIALS`. Token gerado pelo mock fica em sessionStorage. |
| POST | `/auth/register` | `{ name, email, password }` | `{ user }`; `400 VALIDATION_ERROR`, `409 EMAIL_IN_USE`. Senha mínima de 10 caracteres. |
| POST | `/auth/logout` | — | `{ ok: true }`; remove a sessão mock. |
| GET | `/cart` | — | `{ items, version, subtotalEth }`. |
| POST | `/cart/items` | `{ nftId, edition, quantity }` | Carrinho atualizado; `400 VALIDATION_ERROR`, `404 NOT_FOUND`, `409 UNAVAILABLE`. |
| PATCH | `/cart/items/:nftId?edition=...` | `{ quantity }` | Carrinho atualizado; valida estoque e edição. |
| DELETE | `/cart/items/:nftId?edition=...` | — | Carrinho atualizado. |
| POST | `/orders` | `{ walletAddress, network, paymentDecision }`, `Idempotency-Key` | Pedido com `confirmed` ou `declined`; erro `401`, `400`, `409`. Reutilizar a chave recupera o pedido armazenado, mas o mock não compara o corpo para detectar conflito de payload. |
| GET | `/orders/:orderId` | `orderId` | `Order`; `401 UNAUTHORIZED` ou `404 NOT_FOUND`. |

Tipos de catálogo, carrinho e pedido estão em `src/domain/`. Valores monetários são strings ETH e as operações usam wei (`bigint`). O mock de pedido guarda snapshot dos itens e usa taxa estimada de `0.016 ETH` em pedidos confirmados.

## Recursos ausentes

Não há endpoints para favoritos, cotação/cupom, perfil, avatar, alteração de senha ou carteiras. Favoritos usam `localStorage`; perfil e carteiras só exibem formulário. O carrinho, sessão, contas e pedidos mock usam `sessionStorage`. Apenas os handlers de pedido verificam o token. Os mocks não oferecem expiração de sessão ou isolamento completo dos dados por usuário.

## Reset

Limpe os dados da origem no Console do navegador:

```js
localStorage.removeItem('kurio:favorites:v1');
sessionStorage.clear();
location.reload();
```

O comando npm `mock:reset` remove `.mock-data`, diretório não usado pelos handlers atuais; não substitui a limpeza do armazenamento do navegador.
