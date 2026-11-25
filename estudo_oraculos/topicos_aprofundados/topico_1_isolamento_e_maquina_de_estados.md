# Tópico 1: Isolamento On-Chain, Fundamentos da EVM e o Imperativo do Determinismo

Este documento compila o aprofundamento técnico sobre por que redes blockchain são isoladas da Web 2, como funcionam máquinas de estados descentralizadas, o impacto do determinismo e os mecanismos de execução da EVM.

---

## 1. O que é uma Blockchain sob a Ótica da Computação?

Uma blockchain pública não é apenas um banco de dados distribuído; ela é formalmente uma **Máquina de Estados Replicada (Replicated State Machine - RSM)**.

* **Estado ($S$):** O conjunto de todos os saldos de contas, dados de armazenamento (*storage*) de smart contracts, códigos compilados (bytecodes) e nonces na rede no bloco $t$.
* **Transação ($Tx$):** Uma instrução atômica assinada criptograficamente para alterar o estado.
* **Função de Transição de Estado ($\Upsilon$):** 
  $$\Upsilon(S_t, Block_{t+1}) = S_{t+1}$$

### O Imperativo do Determinismo Estrito
Para que milhares de validadores independentes (espalhados pelo mundo, rodando diferentes sistemas operacionais e hardwares) concordem sobre o estado $S_{t+1}$ sem depender de um coordenador central, a função $\Upsilon$ deve ser **estritamente determinística**:

$$\forall \text{ nó } i, j: \quad \Upsilon_i(S_t, Block_{t+1}) \equiv \Upsilon_j(S_t, Block_{t+1})$$

Se o nó $A$ em São Paulo rodar a transação e calcular que o saldo de um usuário deve ser `10`, e o nó $B$ em Tóquio calcular `11`, o consenso é quebrado instantaneamente.

---

## 2. Onde a Máquina de Estados Fica Hospedada?

**A Máquina de Estados não fica em um servidor central (como AWS, Google Cloud ou data center único).**

Ela fica **replicada de forma redundante no disco rígido e na memória RAM de milhares de nós (nodes) independentes**.

* **Na prática:** Cada nó da rede roda um cliente de software (ex: *Geth*, *Nethermind*, *Besu* na Ethereum).
* Cada nó mantém localmente uma cópia completa de:
  1. **Histórico de Blocos e Transações** (banco de dados append-only linear).
  2. **Árvore de Estado Atual (*World State*)**: uma estrutura de dados de alta eficiência (uma *Merkle Patricia Trie* gravada em bancos chave-valor locais como *LevelDB* ou *Pebble*). Ela armazena saldos, nonces, bytecodes e o storage de cada contrato.

Executar um contrato na EVM significa que **todos os validadores executam as mesmas instruções em seus processadores locais** e atualizam suas próprias instâncias do banco de dados local.

---

## 3. O que é um *State Fork* (Bifurcação de Estado)?

Um **State Fork** ocorre quando os validadores da rede deixam de concordar sobre qual é o estado atual legítimo da máquina de estados ($S_{t+1}$).

```
                    ┌───> [Nós 1 a 600]   : Estado = 0xAAA... (Cadeia A)
Bloco t (Consenso) ─┤
                    └───> [Nós 601 a 1000] : Estado = 0xBBB... (Cadeia B)
```

### Mecânica e Consequências:
1. Um bloco é proposto contendo transações cujas execuções geram saídas distintas entre os nós (ex: leitura de dados voláteis externos).
2. O cabeçalho (*header*) do bloco inclui o hash raiz da árvore de estado (*State Root*). Nós que chegam a raízes diferentes rejeitam o bloco dos outros nós.
3. A rede se divide em blockchains paralelas e incompatíveis:
   * **Inconsistência de Balanços:** O mesmo ativo pode existir com donos diferentes em cada cadeia.
   * **Quebra de Aplicações:** Protocolos DeFi, pontes (*bridges*) e corretoras travam por falta de consenso sobre a cadeia canônica.

---

## 4. O que é I/O (Input/Output) e o Isolamento da Sandbox?

**I/O (Entrada/Saída)** é a comunicação entre o processador (CPU / Máquina Virtual) e o ambiente externo:
* **Entrada (Input):** Leitura de dados do disco, teclado, placas de rede ou sensores.
* **Saída (Output):** Gravação no disco, exibição visual ou envio de pacotes de rede (TCP/UDP, HTTP).

### Por que a EVM bloqueia Network I/O (`fetch`, `curl`, sockets):
1. **Assincronia e Latência:** Atrasos de pacotes de milissegundos fariam nós diferentes receberem cotações e respostas distintas em momentos ligeiramente diferentes.
2. **Sincronização Histórica (*Archive Sync*):** Um novo nó ingressando na rede hoje precisa reexecutar blocos passados (ex: do ano de 2017). Se uma transação fizesse um `GET` para uma URL externa que saiu do ar ou mudou de dono, o nó **nunca conseguiria reconstruir o estado histórico**.
3. **Respostas Dinâmicas e Geo-IP:** APIs Web 2 usam CDNs (Cloudflare, CloudFront) que podem retornar status `403 Forbidden`, `429 Rate Limit` ou conteúdos adaptados dependendo da localização do validador.
4. **Imprevisibilidade Computacional:** Chamadas de rede podem travar em timeouts ou causar condições de corrida (*race conditions*).

Por isso, a EVM é uma **sandbox hermética** que só aceita entradas inseridas em blocos previamente minerados e assinados.

---

## 5. Máquinas de Turing, Completude e o Problema da Parada

### A. O Modelo da Máquina de Turing (Alan Turing, 1936)
Um modelo matemático universal de computação baseado em uma fita de símbolos, um cabeçote de leitura/escrita e um conjunto de estados de transição. Qualquer computador moderno é computacionalmente equivalente a uma Máquina de Turing.

### B. Turing-Completeness
Um sistema é **Turing-completo** quando consegue resolver qualquer problema computável, desde que disponha de tempo e memória. As características definidoras são o suporte a saltos condicionais (`if/else`) e **iterações/loops arbitrários** (`for`, `while`, recursão).
* O **Bitcoin Script** é intencionalmente **não Turing-completo** (não possui loops arbitrários para garantir execução rápida e previsível).
* A **EVM (Ethereum Virtual Machine)** é **Turing-completa**.

### C. O Problema da Parada (*The Halting Problem*) e o Gas
Alan Turing provou que é impossível determinar previamente por análise estática se um programa genérico vai terminar de rodar ou entrar em loop infinito.

Para impedir que códigos maliciosos como `while(true) {}` travem todos os nós da rede global, a Ethereum introduziu o **Gas**.

---

## 6. Mecanismo de Cálculo e Cobrança de Gas

O Gas é a unidade que quantifica o esforço computacional e de armazenamento exigido para executar cada instrução na EVM.

### A. Custo Base dos Opcodes (Gas Units)
Cada instrução da EVM possui um custo tabelado (*Ethereum Yellow Paper*):
* `ADD`, `SUB`: **3 gas** (processamento elementar de CPU).
* `MUL`: **5 gas**.
* `KECCAK256`: **30 gas + custo proporcional aos bytes calculados**.
* `SLOAD` (leitura de storage): **100 a 2.100 gas** (depende de slot quente/frio).
* `SSTORE` (gravação permanente de estado no disco): **até 20.000 gas** (operação mais custosa da rede).

### B. Fórmula de Cobrança Financeira (Pós-EIP-1559)

$$\text{Taxa Total (em ETH)} = \text{Gas Utilizado} \times (\text{Base Fee} + \text{Priority Fee})$$

1. **Gas Utilizado:** Quantidade total de gas consumida pelos opcodes durante a execução da transação.
2. **Base Fee (Taxa Base):** Custo mínimo por unidade de gas definido deterministicamente pelo protocolo com base na ocupação dos blocos anteriores. **Essa taxa é queimada (*burned*)**.
3. **Priority Fee (Gorjeta / Tip):** Valor adicional por gas pago pelo usuário para incentivar os validadores a incluírem a transação prioritariamente no bloco.

### C. Gas Limit e Proteção contra Falhas
* **Gas Limit:** Limite máximo de gas que o emissor autoriza a transação a consumir.
* Se a execução for bem-sucedida e consumir menos gas que o limite, o saldo restante é estornado à carteira do emissor.
* Se a transação entrar em um loop e atingir o Gas Limit, a EVM interrompe a execução com erro **`Out of Gas`**, reverte todas as mudanças de estado (*revert*), mas **consome o saldo de gas** para remunerar o trabalho de computação já realizado pelos validadores.

---

## 7. Relação Direta com a Arquitetura de Oráculos

| Conceito | Aplicação em Oráculos |
| :--- | :--- |
| **Isolamento da EVM** | Smart contracts não podem buscar cotações ou dados externos por conta própria. |
| **Determinismo Estrito** | O dado externo precisa ser inserido na blockchain empacotado dentro de uma transação assinada (*Push model*). |
| **Custo de Gas** | Toda atualização de feed de preço emitida por um oráculo consome gas e grava dados no storage on-chain. |
| **Prevenção de Fork** | Uma vez que o oráculo grava o dado em um bloco confirmado, todos os nós leem o mesmo valor determinístico. |
