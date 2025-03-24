# Relatório de Consistência - StayFocus

## Resumo da Análise

Foram analisadas 12 páginas da aplicação StayFocus para verificar a consistência visual,
estrutural e de acessibilidade entre elas.

## Consistência de Cores

### Cores de Texto Principais
- `rgb(0, 0, 0)`: presente em 100% das páginas
- `rgb(17, 24, 39)`: presente em 100% das páginas
- `rgb(107, 114, 128)`: presente em 100% das páginas
- `rgb(93, 77, 178)`: presente em 100% das páginas
- `rgb(255, 255, 255)`: presente em 100% das páginas
- `rgb(55, 65, 81)`: presente em 100% das páginas
- `rgb(75, 85, 99)`: presente em 100% das páginas

### Cores de Texto Secundárias (top 5)
- `rgb(31, 41, 55)`: presente em 67% das páginas
- `rgb(37, 99, 235)`: presente em 33% das páginas
- `rgb(239, 68, 68)`: presente em 25% das páginas
- `rgb(156, 163, 175)`: presente em 25% das páginas
- `rgb(30, 64, 175)`: presente em 25% das páginas

### Cores de Fundo Principais
- `rgb(249, 250, 251)`: presente em 100% das páginas
- `rgb(255, 255, 255)`: presente em 100% das páginas
- `rgb(59, 130, 246)`: presente em 100% das páginas

### Cores de Fundo Secundárias (top 5)
- `rgb(243, 244, 246)`: presente em 58% das páginas
- `rgb(229, 231, 235)`: presente em 50% das páginas
- `rgb(37, 99, 235)`: presente em 42% das páginas
- `rgb(239, 246, 255)`: presente em 25% das páginas
- `rgb(22, 163, 74)`: presente em 17% das páginas

## Consistência de Tipografia

### Tamanhos de Fonte Predominantes
- `16px`: presente em 100% das páginas
- `14px`: presente em 100% das páginas
- `24px`: presente em 100% das páginas
- `12px`: presente em 100% das páginas
- `18px`: presente em 83% das páginas

### Tamanhos de Fonte Secundários (top 5)
- `20px`: presente em 67% das páginas
- `36px`: presente em 17% das páginas
- `60px`: presente em 8% das páginas

## Estrutura de Páginas

Foram identificados 12 padrões de estrutura diferentes entre as páginas.

### Estruturas mais comuns

#### Padrão 1 (8% das páginas)
```
H1:Início|H2:Painel do Dia|H2:Prioridades do Dia|H2:Lembretes de Pausas|H3:Tempo de foco
```

#### Padrão 2 (8% das páginas)
```
H1:Alimentação|H2:Planejador de Refeições|H3:Adicionar Nova Refeição|H2:Registro de Refeições|H2:Hidratação|H3:Acompanhamento de Hidratação
```

#### Padrão 3 (8% das páginas)
```
H1:Gestão do Sono|H2:Registro de Sono|H3:Horário de dormir|H3:Horário de acordar|H3:Registros Recentes|H3:A importância do sono
```

## Acessibilidade

A média de botões com atributos aria-label na aplicação é de **89%**.

### Páginas com menor conformidade em acessibilidade

- **perfil**: 56.25% dos botões possuem aria-label (9/16)
- **sono**: 68.75% dos botões possuem aria-label (11/16)
- **autoconhecimento**: 72.73% dos botões possuem aria-label (8/11)

### Páginas com maior conformidade em acessibilidade

- **ajuda**: 100% dos botões possuem aria-label (6/6)
- **roadmap**: 100% dos botões possuem aria-label (6/6)
- **saude**: 100% dos botões possuem aria-label (41/41)

## Conclusões

A aplicação apresenta muitas cores de base, o que pode comprometer a consistência visual.

Os tamanhos de fonte são relativamente consistentes entre as páginas.

A acessibilidade por meio de aria-labels em botões está boa, mas pode ser melhorada em algumas páginas.

## Recomendações

1. Reduzir a paleta de cores para melhorar a consistência visual
   
2. Continuar utilizando os tamanhos de fonte atuais que apresentam boa consistência
   
3. Melhorar a implementação de aria-labels nos botões, especialmente nas páginas perfil, sono, autoconhecimento
   
4. Padronizar a estrutura das páginas para proporcionar uma experiência mais consistente
   
5. Continuar priorizando a simplicidade e o foco nas necessidades dos usuários neurodivergentes.

