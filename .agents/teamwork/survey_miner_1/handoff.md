# Relatório de Handoff — survey_miner_1 (Specification Miner)

## 1. Observation

- **Arquivo de Requisição Original** (`c:/Users/Inteli/workspace/modulo-3/Blockas/Plano_de_aulas/.agents/teamwork/ORIGINAL_REQUEST.md`):
  - Linhas 5-8:
    > "Plataforma web interativa de aprendizado sobre Oráculos em Blockchain e Integração com Dados Externos, baseada em uma árvore de dependências de conceitos, com simulações visuais dinâmicas, explicações passo a passo e códigos de exemplo para capacitar o instrutor a ministrar uma aula técnica de alto nível."
    > "Working directory: c:/Users/Inteli/workspace/modulo-3/Blockas/Plano_de_aulas/estudo_oraculos"
    > "Integrity mode: development"
  - Linhas 12-25: Requisitos R1 (Árvore de Dependências com Níveis 0 a 4, nós desbloqueáveis e detalhados), R2 (3 Simulações Dinâmicas: Problema do Oráculo / quebra de consenso HTTP, Push vs Pull, Agregação DON com eliminação de outliers e mediana), R3 (Teoria aprofundada: flash loans e manipulação AMM vs Chainlink/Pyth, VRF commit-reveal/criptografia, Keepers de automação) e R4 (Hands-on Solidity pronto para Remix IDE: `AggregatorV3Interface`, VRF, Keepers).
  - Linhas 29-33: Critérios de aceitação:
    > "- [ ] O projeto gera um arquivo/aplicação funcional (HTML/CSS/JS autocontido ou SPA moderna) que pode ser aberta diretamente no navegador sem dependências complexas de backend."
    > "- [ ] A árvore de dependências permite navegação fluida, filtragem por nível de dificuldade e rastreamento de progresso de estudo."
    > "- [ ] Pelo menos 3 simulações interativas funcionais (Quebra de Consenso/HTTP, Fluxo Push vs Pull, Agregação de Oráculos descentralizados)."
    > "- [ ] Todos os conceitos fundamentais para a aula de 05/10/2026 estão cobertos e fundamentados com as melhores práticas da Web3."

- **Arquivo do Plano de Aulas Institucional** (`c:/Users/Inteli/workspace/modulo-3/Blockas/Plano_de_aulas/PLANO DE AULAS - BLOCKCHAIN.docx.pdf`):
  - Página 15:
    > "ATIVIDADE Nº 10:"
    > "TIPO DE ATIVIDADE: Atividade Extensionista — Aula Técnica"
    > "NOME DA ATIVIDADE: Aula Blockchain — Oráculos e integração com dados externos"
    > "DESCRIÇÃO DA ATIVIDADE: Problema dos oráculos, feeds de dados, automações e formas de conectar smart contracts a informações externas."
    > "RESPONSÁVEL(IS): Kauan"
    > "LOCAL DA ATIVIDADE: Ateliê do Inteli"
    > "DATA DE PREVISÃO: 05/10/2026"
    > "PÚBLICO ALVO: Estudantes do Inteli interessados em blockchain e Web3 (estimativa: 20 participantes)"
    > "IMPACTO ESPERADO: Compreender como aplicações blockchain utilizam dados externos de forma confiável."

- **Estado do Diretório Alvo** (`c:/Users/Inteli/workspace/modulo-3/Blockas/Plano_de_aulas/estudo_oraculos`):
  - A execução de `find_by_name` no diretório raiz confirmou que a pasta `estudo_oraculos` ainda não continha arquivos pré-existentes, tratando-se de uma implementação limpa (greenfield).

- **Artefato Gerado pelo Minerador** (`c:/Users/Inteli/workspace/modulo-3/Blockas/Plano_de_aulas/.agents/teamwork/survey_miner_1/spec_analysis.md`):
  - 22 funcionalidades discretas descobertas e catalogadas em tabela formal (Tabela `## Features Discovered`).
  - 13 casos de borda mapeados com comportamento observado esperado (Tabela `## Edge Cases`).
  - Grafo hierárquico de 9 nós conceituais estruturados do Nível 0 ao Nível 4.
  - Especificação detalhada das 3 simulações matemáticas e visuais.
  - Especificação de 4 contratos Solidity (3 de produção e 1 mock para execução imediata no Remix VM sem dependência de carteira/faucet).
  - Roteiro e cronograma didático estruturado para a aula de 05/10/2026 com Kauan.

## 2. Logic Chain

1. A partir de `ORIGINAL_REQUEST.md` (R1-R4 e critérios de aceitação) e do `PLANO DE AULAS` (Página 15, Atividade 10), identificou-se que o público-alvo é composto por cerca de 20 estudantes do Inteli liderados pelo instrutor Kauan em 05/10/2026.
2. Para que a aula seja de "alto nível técnico" e não dependa de infraestrutura de servidor em nuvem propensa a falhas de rede local no Ateliê, a plataforma precisa rodar 100% no navegador como uma SPA moderna e autocontida (HTML5, CSS3, JavaScript ES6+, SVG/Canvas), sem qualquer backend Node.js/Python ou banco de dados externo (RNF-01).
3. A navegação na Árvore de Dependências (R1) deve espelhar o rigor pedagógico exigido: fundamentar primeiro a rigidez matemática da EVM e seu determinismo (Nível 0), para só então apresentar o paradoxo do Oráculo (Nível 1), derivando naturalmente para as arquiteturas Push/Pull e Redes Descentralizadas DON (Nível 2), os serviços avançados como Feeds, VRF e Keepers (Nível 3) e o laboratório em Solidity (Nível 4).
4. As três simulações visuais (R2) devem ter fidelidade matemática e conceitual:
   - Simulação 1 precisa ilustrar visualmente a dispersão de latência e valores retornados por uma API Web2 em validadores distintos, comprovando que `keccak256(state)` diverge e gera forks.
   - Simulação 2 precisa comparar o gasto cumulativo de gas e frescor do dado no modelo Push (Chainlink tradicional) versus Pull (Pyth Network / Data Streams).
   - Simulação 3 precisa implementar o algoritmo real de consenso off-chain de uma DON: coleta, validação de quórum, ordenação, descarte de outliers e cálculo da mediana.
5. Para o laboratório prático (R4), contratos com interfaces de teste reais em Sepolia ETH/USD não são suficientes para uma dinâmica de aula fluida de 20 alunos, pois problemas com faucets de testnet e carteiras Web2/Web3 atrasam aulas. Logo, é indispensável incluir um contrato `MockPriceFeed.sol` para permitir deploy e teste instantâneos na máquina virtual local do Remix IDE (Remix VM), além das instruções completas de Sepolia.
6. A consolidação dos 22 requisitos funcionais e 13 casos de borda em `spec_analysis.md` estabelece a base de referência (Single Source of Truth) para os exploradores de arquitetura e implementadores subsequentes.

## 3. Caveats

- Não foram inspecionados os arquivos de aulas posteriores (ex.: Atividades 11 a 20 do PDF) além do necessário para mapear os ganchos conceituais e pré-requisitos pedagógicos da Atividade 10.
- Assume-se que os navegadores utilizados pelos alunos serão navegadores modernos com suporte padrão a ES6+, SVG e Canvas (Chrome, Brave, Edge, Firefox, Safari).

## 4. Conclusion

O levantamento de requisitos, inventário de funcionalidades e detalhamento didático da plataforma interativa de Oráculos em Blockchain foram concluídos com sucesso.
O documento `spec_analysis.md` documenta minuciosamente:
- A árvore conceitual de 5 níveis (9 nós);
- A especificação das 3 simulações interativas dinâmicas;
- O detalhamento dos estudos de caso teóricos (Flash loans, VRF e Keepers);
- O conjunto de 4 contratos Solidity e guia do Remix;
- A matriz completa de 22 funcionalidades e 13 casos de borda;
- O kit de suporte ao instrutor Kauan para 05/10/2026.
O projeto está pronto para a consolidação dos planos técnicos e o início da fase de implementação.

## 5. Verification Method

Para verificar independentemente este relatório:
1. Inspeção de arquivo: Ler `c:/Users/Inteli/workspace/modulo-3/Blockas/Plano_de_aulas/.agents/teamwork/survey_miner_1/spec_analysis.md` e verificar se contém as tabelas `## Features Discovered` (22 itens) e `## Edge Cases` (13 itens), além de todas as seções descritivas.
2. Validação contra o pedido original: Comparar `spec_analysis.md` com `ORIGINAL_REQUEST.md` e checar a cobertura de R1, R2, R3, R4 e critérios de aceitação.
3. Validação institucional: Verificar a página 15 de `PLANO DE AULAS - BLOCKCHAIN.docx.pdf` confirmando a correspondência exata de data (05/10/2026), tema (Oráculos e integração com dados externos) e responsável (Kauan).
