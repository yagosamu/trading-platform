---
name: testing
description: Convenções de teste deste repositório. Use ao escrever, alterar ou revisar qualquer teste, e antes de implementar qualquer comportamento novo em src/, incluindo endpoints, regras de validação, lógica de matching, agregações e correções de bug.
---

# Testes

## O ciclo

Comportamento novo entra por um teste que falha primeiro. Escreva o teste, veja vermelho,
implemente o mínimo para ficar verde, depois refatore com a suíte de rede.

Antes de escrever o primeiro `test(...)`, escreva a lista de casos em comentário ou no corpo
do arquivo. A lista é o trabalho de verdade: ela força a decidir o que a regra não diz. Para
"o nome deve ter nome e sobrenome", a lista precisa responder sobre três palavras, acento,
hífen, apóstrofo, espaço sobrando e string vazia. Essas são decisões de produto disfarçadas de
validação, e é nelas que o teste paga.

## Onde o teste mora

A escolha entre `test/unit/` e `test/integration/` segue a natureza da regra, não a estrutura
de pastas de `src/`.

**`test/unit/`** cobre o que é determinístico e não cruza fronteira de I/O: validações,
cruzamento de ordens, agregação de profundidade, cálculo de spread e volume. Não sobe
servidor, não abre conexão, não lê relógio nem gera aleatório sem controle. Roda em
milissegundos.

**`test/integration/`** cobre o que atravessa a fronteira: persistência, unicidade, transação,
o fluxo HTTP completo. Exige `npm run compose:up` e a API no ar em `localhost:3000`.

Regra prática: se você precisou de um dublê para escrever o teste, provavelmente ele é de
integração, ou a regra que você está testando ainda está acoplada a I/O e deveria ser
extraída.

## Banco não é mockado

Teste de integração fala com o PostgreSQL real do container. Mock de banco esconde exatamente
as falhas que essa camada existe para pegar: coluna errada, constraint violada, transação não
commitada, corrida entre escritas concorrentes. Um teste que passa contra um banco falso e
quebra em produção é pior do que teste nenhum.

## Independência

Nenhum teste pode depender de outro, nem da ordem de execução. Cada um cria os próprios dados,
com valores únicos quando houver constraint de unicidade, para poder rodar duas vezes seguidas
sem limpar o banco no meio. Suíte que só passa em série, ou só na primeira execução, é suíte
em que ninguém confia.

## Estilo

Vitest, importado explicitamente:

```ts
import { test, expect } from "vitest";
```

O nome do teste descreve o comportamento esperado em português, não o nome da função:
`"não deve criar conta com e-mail duplicado"`, e não `"testa signup"`. Quem lê a saída
vermelha precisa entender o que quebrou sem abrir o arquivo.

Para varrer muitos valores contra a mesma asserção, use `test.each` em vez de repetir o corpo.
Mantenha um caso feliz explícito e separado dos casos de erro.

Uma asserção por comportamento. Se o teste precisa de três `expect` sobre coisas diferentes,
provavelmente são três testes.

## Vocabulário

Testes usam a linguagem do domínio: `order`, `trade`, `fill`, `maker`, `taker`, `depth`,
`spread`, `side`. Um teste do motor de matching deve ser legível por alguém que conhece
mercado e não conhece o código.

## O que não fazer

Não perseguir percentual de cobertura: cobertura mostra o que nunca foi executado, não o que
está correto. Não usar snapshot para regra de negócio, porque snapshot registra o que o código
faz, e não o que ele deveria fazer. Não escrever teste que só confirma a implementação linha a
linha, porque ele quebra em todo refactoring sem apontar defeito nenhum. Não deixar teste
comentado ou com `skip` no commit.

## Ambiente

ESM com type stripping nativo do Node, então imports relativos levam extensão `.ts`:

```ts
import { validateName } from "../../src/validateName.ts";
```

```bash
npx vitest run            # suíte completa
npx vitest run test/unit  # só os unitários
npm test                  # watch mode
```
