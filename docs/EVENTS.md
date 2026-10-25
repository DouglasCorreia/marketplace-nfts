# Socket.IO: contrato atual e lacunas

## Implementado

- Cliente `socket.io-client`, WebSocket na mesma origem, path `/socket.io`.
- Ao conectar, o cliente envia `catalog:subscribe`.
- O mock responde com `catalog:update`:

```ts
interface CatalogUpdateEvent {
  version: number
  updatedAt: string
}
```

- Versões menores ou iguais à última versão observada pelo listener são ignoradas.
- Um evento aceito invalida queries com prefixo do catálogo; REST é a fonte dos dados.
- Em cada conexão, o cliente subscreve novamente e invalida catálogo. No cleanup remove listeners e desconecta.

## Não implementado

O payload atual não tem event ID, identidade estável do recurso, NFT/pedido afetado, usuário/sessão ou versão por recurso. `catalog:update` não muda o fixture: apenas invalida o catálogo. Não atualiza detalhe, carrinho ou cotação.

Não existem eventos/listeners `nft.updated` ou `order.updated`. A função `applyOrderUpdate` em `src/domain/order/order.ts` não é consumida por integração realtime. A versão local do listener reinicia ao remontar, então não satisfaz deduplicação robusta após ciclo de vida/reconexão.

A reconciliação após reconexão invalida somente catálogo. Não refaz GET de detalhes, carrinho ou pedidos ativos; não há verificação de sessão no payload, nem proteção de dados contra evento atrasado de usuário anterior. Não existem cenários mock para mudança de preço/estoque, evento duplicado/antigo ou pedido pendente durante desconexão.

## Transporte de mock

MSW usa `ws.link()` com `@mswjs/socket.io-binding` para adaptar o WebSocket interceptado ao protocolo Socket.IO Client. O mock cobre handshake/subscription de catálogo simples; não é serviço Socket.IO de produção e não simula entrega confiável, rooms por usuário, persistência de evento ou estado distribuído.
