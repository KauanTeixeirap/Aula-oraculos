# Original User Request

## Initial Request — 2026-10-04T19:29:01Z

Plataforma web interativa de aprendizado sobre Oráculos em Blockchain e Integração com Dados Externos, baseada em uma árvore de dependências de conceitos, com simulações visuais dinâmicas, explicações passo a passo e códigos de exemplo para capacitar o instrutor a ministrar uma aula técnica de alto nível.

Working directory: c:/Users/Inteli/workspace/modulo-3/Blockas/Plano_de_aulas/estudo_oraculos
Integrity mode: development

## Requirements

### R1. Navegação Interativa da Árvore de Dependências
O sistema deve apresentar a árvore de dependências conceitual (Nível 0: EVM/Determinismo -> Nível 1: O Problema do Oráculo -> Nível 2: Arquitetura Push/Pull & Redes Descentralizadas/DONs -> Nível 3: Data Feeds, VRF, Keepers/Automação -> Nível 4: Hands-on em Solidity/Remix). O usuário deve conseguir clicar em cada nó para desbloquear/visualizar os detalhes aprofundados e seu impacto técnico.

### R2. Visualizações Dinâmicas e Simulações de Conceitos
A plataforma deve conter componentes visuais interativos e dinâmicos:
- Simulação do Problema do Oráculo: demonstrar graficamente por que requisições HTTP quebram o consenso entre validadores.
- Simulação Push vs. Pull: fluxo animado mostrando a diferença entre feeds contínuos e modelo requisição-resposta.
- Simulador de Agregação de Dados da Rede Descentralizada (DON): seleção de múltiplos nós, eliminação de outliers e cálculo de mediana/consenso.

### R3. Conteúdo Teórico Aprofundado e Casos de Uso Reais
Explicar com rigor didático cada tópico, incluindo falhas históricas por oráculos centralizados ou manipulados (ex.: ataques de flash loan com manipuladores de preço AMM vs. Oráculos robustos como Chainlink/Pyth), funcionamento de VRF (Commit-Reveal / Criptografia) e Keepers de automação.

### R4. Laboratório Prático de Código (Hands-on Solidity)
Apresentar exemplos de código Solidity comentados e explicados linha por linha (ex.: consumo de Chainlink AggregatorV3Interface para feeds de preço, requisição de VRF e automação compatível), prontos para serem testados no Remix IDE com instruções passo a passo.

## Acceptance Criteria

### Integridade e Execução
- [ ] O projeto gera um arquivo/aplicação funcional (HTML/CSS/JS autocontido ou SPA moderna) que pode ser aberta diretamente no navegador sem dependências complexas de backend.
- [ ] A árvore de dependências permite navegação fluida, filtragem por nível de dificuldade e rastreamento de progresso de estudo.
- [ ] Pelo menos 3 simulações interativas funcionais (Quebra de Consenso/HTTP, Fluxo Push vs Pull, Agregação de Oráculos descentralizados).
- [ ] Todos os conceitos fundamentais para a aula de 05/10/2026 estão cobertos e fundamentados com as melhores práticas da Web3.
