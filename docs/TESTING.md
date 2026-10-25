# Testes disponíveis e cobertura

## Comandos

```bash
npm test
npm run typecheck
npx playwright install chromium
npm run test:e2e
npm run test:e2e:ui
npm run test:report
```

`npm test` executa os testes Vitest em `src/**/*.test.ts`. Playwright usa `tests/e2e`, projetos Chromium desktop e Pixel 7 mobile, reporter de linha e HTML, e salva trace em falhas. A suíte E2E existente cobre filtro de catálogo e URL, acesso ao detalhe e NFT inexistente, carrinho/quantidades e pagamento simulado com recibo.

## Lacunas conhecidas

Não há testes visuais nem diretório/baselines `tests/visual`. A suíte não cobre a lista de 12 grupos E2E requeridos pelo desafio: troca/expiração de sessão, favoritos e rollback, cupom, perfil/carteiras, falhas de rede, idempotência em timeout, eventos pelo Socket.IO, reconexão, acessibilidade ampla ou skeletons com latência controlada. Existem somente testes unitários das regras puras atuais de catálogo, carrinho e ordem.

`npm run lint` e `npm run lighthouse` existem como scripts no package.json, mas suas ferramentas/configurações não fazem parte do lockfile/checkout: ESLint e `@lhci/cli` estão ausentes. Lighthouse não foi executado; não há três medições por perfil, configuração versionada, relatórios ou baselines visuais.
