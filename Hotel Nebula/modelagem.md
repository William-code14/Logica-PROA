# Parte 1 — Origem do Sistema: Modelagem do Hotel Nebula

## 1. Compreensão do Problema

O Hotel Nebula possui dados dispersos em sistemas distintos. O objetivo é unificá-los em um banco não relacional (MongoDB), capaz de lidar com a variabilidade natural de um ambiente hoteleiro: quartos com diferentes comodidades, hóspedes com histórico variado, serviços opcionais, avaliações independentes e pagamentos com múltiplos métodos.

A escolha por **MongoDB** (banco orientado a documentos) se justifica pela **flexibilidade do schema**: quartos de categorias diferentes podem ter atributos distintos, hospedagens podem conter zero ou vários serviços extras, e avaliações podem ser parciais ou completas — sem precisar de colunas nulas em uma tabela rígida.

---

## 2. Identificação dos Núcleos de Informação

```
┌─────────────────────────────────────────────────────────────┐
│                      HOTEL NEBULA                           │
│                                                             │
│  [hospedes] ──────────► [reservas] ◄──────── [quartos]     │
│                              │                              │
│                              ▼                              │
│                        [hospedagens]                        │
│                         │        │                          │
│                         ▼        ▼                          │
│                   [pagamentos] [servicos embutidos]         │
│                                                             │
│  [avaliacoes] ◄──── referencia hospede + quarto            │
│  [funcionarios] ◄── responsáveis por hospedagens           │
└─────────────────────────────────────────────────────────────┘
```

---

## 3. Coleções e Estratégia de Modelagem

### 3.1 — `hospedes`
**Estratégia:** documento próprio com dados completos.

Hóspedes são entidades reutilizadas em múltiplas reservas. Manter como coleção separada evita duplicação e permite atualizar dados cadastrais sem tocar em todas as reservas.

Dentro do documento do hóspede, o **histórico de reservas é referenciado** (apenas IDs), não embutido — o histórico pode crescer indefinidamente e consultá-lo todo não é o caso de uso mais comum.

```json
{
  "_id": ObjectId("aaa001"),
  "nome": "Mariana Oliveira",
  "email": "mariana.oliveira@email.com",
  "telefone": "+55 11 91234-5678",
  "cpf": "123.456.789-00",
  "nacionalidade": "Brasileira",
  "data_nascimento": ISODate("1990-03-15"),
  "endereco": {
    "rua": "Av. Paulista",
    "numero": "1000",
    "cidade": "São Paulo",
    "estado": "SP",
    "pais": "Brasil",
    "cep": "01311-000"
  },
  "preferencias": ["andar alto", "travesseiro extra", "quarto silencioso"],
  "historico_reservas": [
    ObjectId("rrr001"),
    ObjectId("rrr002")
  ],
  "criado_em": ISODate("2023-01-10")
}
```

---

### 3.2 — `quartos`
**Estratégia:** documento rico com array de comodidades embutido.

Cada quarto tem características únicas. Comodidades (`amenities`) variam muito de quarto a quarto — um array de strings é perfeito para isso no MongoDB. Não faz sentido normalizar "banheira" em uma tabela separada.

```json
{
  "_id": ObjectId("qqq001"),
  "numero": 101,
  "andar": 1,
  "categoria": "Standard",
  "capacidade": 2,
  "preco_por_noite": 280.00,
  "moeda": "BRL",
  "status": "disponivel",
  "descricao": "Quarto padrão com vista para o jardim interno.",
  "comodidades": ["ar-condicionado", "TV 42\"", "frigobar", "Wi-Fi", "cofre"],
  "fotos": [
    "https://hotelnebula.com/fotos/101_a.jpg",
    "https://hotelnebula.com/fotos/101_b.jpg"
  ],
  "ultima_manutencao": ISODate("2025-03-01")
}
```

```json
{
  "_id": ObjectId("qqq005"),
  "numero": 501,
  "andar": 5,
  "categoria": "Suite Luxo",
  "capacidade": 4,
  "preco_por_noite": 1200.00,
  "moeda": "BRL",
  "status": "disponivel",
  "descricao": "Suite com vista panorâmica para o mar, banheira de hidromassagem e sala de estar.",
  "comodidades": [
    "ar-condicionado", "TV 65\"", "frigobar", "Wi-Fi", "cofre",
    "banheira de hidromassagem", "vista para o mar", "sala de estar",
    "varanda privativa", "serviço de mordomo"
  ],
  "fotos": [
    "https://hotelnebula.com/fotos/501_a.jpg"
  ],
  "ultima_manutencao": ISODate("2025-04-10")
}
```

---

### 3.3 — `reservas`
**Estratégia:** referência ao hóspede e ao quarto + snapshot dos dados essenciais.

A reserva referencia `hospede_id` e `quarto_id`, mas também **embute um snapshot** com nome do hóspede e número do quarto. Isso protege o histórico: se o quarto mudar de preço ou o hóspede alterar o cadastro, a reserva mantém o estado no momento da contratação.

```json
{
  "_id": ObjectId("rrr001"),
  "hospede_id": ObjectId("aaa001"),
  "quarto_id": ObjectId("qqq005"),
  "snapshot_hospede": {
    "nome": "Mariana Oliveira",
    "email": "mariana.oliveira@email.com",
    "cpf": "123.456.789-00"
  },
  "snapshot_quarto": {
    "numero": 501,
    "categoria": "Suite Luxo",
    "preco_por_noite": 1200.00
  },
  "data_check_in_previsto": ISODate("2025-04-20"),
  "data_check_out_previsto": ISODate("2025-04-25"),
  "numero_noites": 5,
  "numero_hospedes": 2,
  "status": "confirmada",
  "canal": "site_oficial",
  "observacoes": "Hóspede solicitou travesseiro extra e check-in tardio.",
  "criado_em": ISODate("2025-03-15"),
  "valor_total_estimado": 6000.00
}
```

---

### 3.4 — `hospedagens`
**Estratégia:** documento central da estadia com serviços **embutidos**.

A hospedagem é o evento real (check-in até check-out). Serviços consumidos ficam **embutidos como array** dentro da hospedagem — eles pertencem exclusivamente àquela estadia, não são compartilhados. Isso torna a consulta de "quanto um hóspede consumiu" extremamente simples.

```json
{
  "_id": ObjectId("hhh001"),
  "reserva_id": ObjectId("rrr001"),
  "hospede_id": ObjectId("aaa001"),
  "quarto_id": ObjectId("qqq005"),
  "funcionario_checkin_id": ObjectId("fff001"),
  "funcionario_checkout_id": ObjectId("fff002"),
  "data_check_in_real": ISODate("2025-04-20T14:30:00"),
  "data_check_out_real": ISODate("2025-04-25T11:00:00"),
  "numero_noites": 5,
  "status": "encerrada",
  "servicos_consumidos": [
    {
      "descricao": "Café da manhã",
      "quantidade": 4,
      "preco_unitario": 65.00,
      "subtotal": 260.00,
      "data": ISODate("2025-04-21")
    },
    {
      "descricao": "Spa — massagem relaxante 60min",
      "quantidade": 1,
      "preco_unitario": 320.00,
      "subtotal": 320.00,
      "data": ISODate("2025-04-22")
    },
    {
      "descricao": "Minibar",
      "quantidade": 3,
      "preco_unitario": 45.00,
      "subtotal": 135.00,
      "data": ISODate("2025-04-23")
    }
  ],
  "total_servicos": 715.00,
  "total_quarto": 6000.00,
  "total_geral": 6715.00,
  "observacoes_internas": "Hóspede muito satisfeita. Pediu indicação de restaurantes."
}
```

---

### 3.5 — `pagamentos`
**Estratégia:** coleção própria, referenciando a hospedagem.

Pagamentos têm complexidade própria: podem ser parciais, ter múltiplos métodos, ter estornos. Mantê-los em coleção separada permite rastrear o fluxo financeiro sem engordar o documento de hospedagem.

```json
{
  "_id": ObjectId("ppp001"),
  "hospedagem_id": ObjectId("hhh001"),
  "hospede_id": ObjectId("aaa001"),
  "valor": 6715.00,
  "moeda": "BRL",
  "metodo": "cartao_credito",
  "bandeira": "Visa",
  "parcelas": 3,
  "status": "aprovado",
  "data_pagamento": ISODate("2025-04-25T11:15:00"),
  "codigo_transacao": "TXN-2025-88821",
  "nota_fiscal": "NF-2025-00512"
}
```

---

### 3.6 — `funcionarios`
**Estratégia:** coleção independente com turno e cargo.

```json
{
  "_id": ObjectId("fff001"),
  "nome": "Ricardo Mendes",
  "cargo": "Recepcionista",
  "turno": "manhã",
  "email_corporativo": "r.mendes@hotelnebula.com",
  "telefone": "+55 21 98888-1111",
  "cpf": "987.654.321-00",
  "data_admissao": ISODate("2022-06-01"),
  "ativo": true,
  "habilidades": ["check-in", "check-out", "concierge", "inglês fluente"]
}
```

---

### 3.7 — `avaliacoes`
**Estratégia:** coleção própria, **não embutida no quarto**.

Avaliações são entidades independentes com contexto próprio (hóspede, hospedagem, data). Embutir no quarto criaria um array que cresceria sem controle e impossibilitaria consultas como "todas as avaliações de um hóspede". Coleção própria com referências é a escolha certa.

```json
{
  "_id": ObjectId("eval001"),
  "hospede_id": ObjectId("aaa001"),
  "quarto_id": ObjectId("qqq005"),
  "hospedagem_id": ObjectId("hhh001"),
  "nota_geral": 9.5,
  "notas_detalhadas": {
    "limpeza": 10,
    "atendimento": 9,
    "conforto": 10,
    "custo_beneficio": 8,
    "localizacao": 10
  },
  "titulo": "Experiência incrível — voltarei com certeza!",
  "comentario": "O quarto 501 é simplesmente deslumbrante. Vista para o mar, banheira perfeita e atendimento impecável. A única ressalva é o café da manhã, que poderia ter mais variedade.",
  "data_avaliacao": ISODate("2025-04-27"),
  "visivel": true,
  "resposta_hotel": {
    "texto": "Obrigada, Mariana! Foi um prazer recebê-la. Já anotamos a sugestão sobre o café da manhã!",
    "data": ISODate("2025-04-28"),
    "autor": "Gerência Hotel Nebula"
  }
}
```

---

## 4. Decisões de Modelagem — Justificativas

| Questão | Decisão | Justificativa |
|---------|---------|---------------|
| Reserva embute ou referencia hóspede? | **Referência + snapshot parcial** | Referência evita duplicação; snapshot preserva o estado histórico do contrato |
| Avaliações ficam no quarto? | **Coleção própria** | Crescimento ilimitado, consultas independentes, resposta do hotel como campo próprio |
| Serviços consumidos ficam na hospedagem? | **Embutidos (array)** | Pertencem exclusivamente àquela estadia; consulta simples e atômica |
| Como manter histórico sem perder flexibilidade? | **Snapshots + timestamps** | Campos `criado_em`, `data_*_real` e snapshots nos documentos de reserva garantem rastreabilidade |
| Comodidades do quarto | **Array de strings embutido** | Variabilidade alta entre quartos; array de strings é ideal para filtros como `$in` |
| Pagamentos | **Coleção própria** | Permite múltiplos pagamentos por hospedagem, estornos e rastreamento financeiro independente |

---

## 5. Esquema Resumido das Coleções

```
hospedes          → _id, nome, email, cpf, endereco{}, preferencias[], historico_reservas[]
quartos           → _id, numero, categoria, preco_por_noite, status, comodidades[], fotos[]
reservas          → _id, hospede_id*, quarto_id*, snapshot_hospede{}, snapshot_quarto{}, datas, status
hospedagens       → _id, reserva_id*, hospede_id*, quarto_id*, servicos_consumidos[{}], totais
pagamentos        → _id, hospedagem_id*, hospede_id*, valor, metodo, status, data
funcionarios      → _id, nome, cargo, turno, habilidades[], ativo
avaliacoes        → _id, hospede_id*, quarto_id*, hospedagem_id*, notas{}, comentario, resposta_hotel{}

* = referência (ObjectId)
```
