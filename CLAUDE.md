# CLAUDE.md

Contexto para agentes trabalhando neste repositório.

## O projeto

Plataforma de negociação de ativos digitais: contas, custódia de saldos, ordens limitadas,
motor de matching, profundidade de mercado e histórico de negociações. O domínio, a regra de
execução e as decisões de arquitetura estão documentados no `README.md`.

## Ambiente

Node 22.6+ é obrigatório. O projeto roda TypeScript direto, sem passo de build, usando o
type stripping nativo do Node. Consequências práticas ao escrever código:

- o projeto é ESM (`"type": "module"`), não CommonJS
- imports relativos levam a extensão `.ts` (`import { validateCpf } from "./validateCpf.ts"`)
- não existe `dist/`; `tsc` é usado apenas para checagem de tipos

## Comandos

```bash
npm install
npm run compose:up      # sobe o PostgreSQL e aplica database/create.sql na primeira vez
node src/index.ts       # sobe a API na porta 3000
npx vitest run          # suíte completa, execução única
npx vitest run test/unit
npm test                # watch mode
npm run test:coverage
npx tsc --noEmit        # checagem de tipos
npm run compose:down    # derruba o container e o volume
```

Banco: `postgres://postgres:123456@localhost:5432/app`, schema `app`. São credenciais de
desenvolvimento local, definidas em `docker/docker-compose.yaml`.

## Estrutura

```
src/                 código de produção
test/unit/           regra pura, sem I/O
test/integration/    fluxos contra o PostgreSQL real
database/create.sql  schema, aplicado na primeira subida do container
docker/              docker-compose
```

## Convenções

**Teste antes da implementação.** Todo comportamento novo entra por um teste que falha
primeiro. A escolha entre `test/unit` e `test/integration` segue a natureza da regra, e não a
estrutura de pastas de `src/`: o que é determinístico e não cruza fronteira de I/O é unitário,
o resto é integração contra banco real. Banco não é mockado, porque mock esconde exatamente as
falhas que importam nessa fronteira: schema, transação e concorrência.

**Vocabulário do domínio no código.** Os nomes são os do mercado: `order`, `trade`, `fill`,
`maker`, `taker`, `depth`, `spread`, `side`. Sem camada de tradução e sem abreviação
inventada. O glossário está no `README.md`.

**Dinheiro e quantidade nunca em ponto flutuante.** `numeric` no banco. Em TypeScript, não
introduzir aritmética de `number` sobre preço ou saldo sem tratar precisão.

**A regra de negócio não conhece infraestrutura.** O motor de matching é função pura sobre o
estado do livro: não importa `pg-promise`, não recebe `Request` e não escreve resposta HTTP.
Persistência e transporte ficam nas bordas.

## Ao alterar documentação

`README.md` (inglês) e `README.pt-BR.md` (português) são equivalentes em conteúdo. Mudou um,
muda o outro. Nenhum dos dois usa travessão.
