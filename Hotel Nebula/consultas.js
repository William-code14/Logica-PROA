// =============================================================
//  HOTEL NEBULA — Parte 3: Radar de Comando
//  Consultas para extração e análise de dados
//
//  Como executar:
//    mongosh hotel_nebula parte3/consultas.js
// =============================================================

print("\n" + "=".repeat(60));
print("  HOTEL NEBULA — RADAR DE COMANDO");
print("=".repeat(60));

// =============================================================
//  BLOCO 1: QUARTOS POR CARACTERÍSTICAS
// =============================================================

print("\n\n📍 BLOCO 1 — QUARTOS POR CARACTERÍSTICAS");
print("-".repeat(60));

// 1.1 — Quartos com vista para o mar
print("\n[1.1] Quartos com 'vista para o mar':");
db.quartos.find(
  { comodidades: { $in: ["vista para o mar"] } },
  { numero: 1, andar: 1, categoria: 1, preco_por_noite: 1, status: 1 }
).forEach(q => printjson(q));

// 1.2 — Quartos com banheira (qualquer tipo)
print("\n[1.2] Quartos com banheira:");
db.quartos.find(
  { comodidades: { $regex: /banheira/i } },
  { numero: 1, categoria: 1, preco_por_noite: 1, comodidades: 1 }
).forEach(q => printjson(q));

// 1.3 — Quartos de luxo ou suite disponíveis
print("\n[1.3] Suites ou Deluxe disponíveis:");
db.quartos.find(
  {
    categoria: { $in: ["Suite Luxo", "Suite Executiva", "Deluxe"] },
    status: "disponivel"
  },
  { numero: 1, categoria: 1, preco_por_noite: 1, capacidade: 1 }
).sort({ preco_por_noite: -1 }).forEach(q => printjson(q));

// 1.4 — Quartos que precisam de manutenção (status manutencao)
print("\n[1.4] Quartos em manutenção:");
db.quartos.find(
  { status: "manutencao" },
  { numero: 1, andar: 1, categoria: 1, ultima_manutencao: 1 }
).forEach(q => printjson(q));

// 1.5 — Quartos com capacidade >= 3 (família)
print("\n[1.5] Quartos para família (capacidade >= 3):");
db.quartos.find(
  { capacidade: { $gte: 3 } },
  { numero: 1, categoria: 1, capacidade: 1, preco_por_noite: 1, status: 1 }
).forEach(q => printjson(q));

// 1.6 — Quartos com múltiplas características ao mesmo tempo
print("\n[1.6] Quartos com vista para o mar E banheira de hidromassagem:");
db.quartos.find(
  {
    comodidades: { $all: ["vista para o mar", "banheira de hidromassagem"] }
  },
  { numero: 1, categoria: 1, preco_por_noite: 1, status: 1 }
).forEach(q => printjson(q));

// =============================================================
//  BLOCO 2: HÓSPEDES COM MAIS DE UMA RESERVA
// =============================================================

print("\n\n📍 BLOCO 2 — HÓSPEDES COM MAIS DE UMA RESERVA");
print("-".repeat(60));

// 2.1 — Hóspedes que fizeram mais de uma reserva (via array de histórico)
print("\n[2.1] Hóspedes com mais de uma reserva (via historico_reservas):");
db.hospedes.find(
  { $expr: { $gt: [{ $size: "$historico_reservas" }, 1] } },
  { nome: 1, email: 1, historico_reservas: 1 }
).forEach(h => printjson(h));

// 2.2 — Contagem de reservas por hóspede via agregação na coleção reservas
print("\n[2.2] Ranking de hóspedes por número de reservas:");
db.reservas.aggregate([
  {
    $group: {
      _id: "$hospede_id",
      nome_hospede: { $first: "$snapshot_hospede.nome" },
      total_reservas: { $sum: 1 },
      reservas_ids: { $push: "$_id" }
    }
  },
  { $sort: { total_reservas: -1 } },
  {
    $project: {
      nome_hospede: 1,
      total_reservas: 1,
      reservas_ids: 1
    }
  }
]).forEach(r => printjson(r));

// 2.3 — Hóspedes que reservaram mais de uma vez (filter > 1)
print("\n[2.3] Apenas hóspedes com 2+ reservas:");
db.reservas.aggregate([
  {
    $group: {
      _id: "$hospede_id",
      nome_hospede: { $first: "$snapshot_hospede.nome" },
      total_reservas: { $sum: 1 }
    }
  },
  { $match: { total_reservas: { $gt: 1 } } },
  { $sort: { total_reservas: -1 } }
]).forEach(r => printjson(r));

// =============================================================
//  BLOCO 3: FATURAMENTO
// =============================================================

print("\n\n📍 BLOCO 3 — FATURAMENTO");
print("-".repeat(60));

// 3.1 — Faturamento total do hotel (pagamentos aprovados)
print("\n[3.1] Faturamento total (todos os pagamentos aprovados):");
db.pagamentos.aggregate([
  { $match: { status: "aprovado" } },
  {
    $group: {
      _id: null,
      faturamento_total: { $sum: "$valor" },
      numero_pagamentos: { $sum: 1 },
      ticket_medio: { $avg: "$valor" }
    }
  },
  { $project: { _id: 0, faturamento_total: 1, numero_pagamentos: 1, ticket_medio: { $round: ["$ticket_medio", 2] } } }
]).forEach(r => printjson(r));

// 3.2 — Faturamento por mês em 2025
print("\n[3.2] Faturamento mensal em 2025:");
db.pagamentos.aggregate([
  {
    $match: {
      status: "aprovado",
      data_pagamento: {
        $gte: new Date("2025-01-01"),
        $lte: new Date("2025-12-31")
      }
    }
  },
  {
    $group: {
      _id: { mes: { $month: "$data_pagamento" }, ano: { $year: "$data_pagamento" } },
      faturamento: { $sum: "$valor" },
      numero_pagamentos: { $sum: 1 }
    }
  },
  { $sort: { "_id.mes": 1 } },
  {
    $project: {
      _id: 0,
      periodo: {
        $concat: [
          { $toString: "$_id.ano" }, "-",
          { $cond: [{ $lt: ["$_id.mes", 10] }, { $concat: ["0", { $toString: "$_id.mes" }] }, { $toString: "$_id.mes" }] }
        ]
      },
      faturamento: 1,
      numero_pagamentos: 1
    }
  }
]).forEach(r => printjson(r));

// 3.3 — Faturamento de abril de 2025 (exemplo específico)
print("\n[3.3] Faturamento em abril/2025:");
db.pagamentos.aggregate([
  {
    $match: {
      status: "aprovado",
      data_pagamento: {
        $gte: new Date("2025-04-01"),
        $lte: new Date("2025-04-30")
      }
    }
  },
  {
    $group: {
      _id: null,
      faturamento_abril: { $sum: "$valor" },
      transacoes: { $sum: 1 }
    }
  },
  { $project: { _id: 0, faturamento_abril: 1, transacoes: 1 } }
]).forEach(r => printjson(r));

// 3.4 — Faturamento por método de pagamento
print("\n[3.4] Faturamento por método de pagamento:");
db.pagamentos.aggregate([
  { $match: { status: "aprovado" } },
  {
    $group: {
      _id: "$metodo",
      total: { $sum: "$valor" },
      quantidade: { $sum: 1 }
    }
  },
  { $sort: { total: -1 } },
  { $project: { metodo: "$_id", _id: 0, total: 1, quantidade: 1 } }
]).forEach(r => printjson(r));

// 3.5 — Faturamento por categoria de quarto
print("\n[3.5] Faturamento por categoria de quarto:");
db.hospedagens.aggregate([
  { $match: { status: "encerrada" } },
  {
    $lookup: {
      from: "quartos",
      localField: "quarto_id",
      foreignField: "_id",
      as: "quarto"
    }
  },
  { $unwind: "$quarto" },
  {
    $group: {
      _id: "$quarto.categoria",
      faturamento_total: { $sum: "$total_geral" },
      numero_hospedagens: { $sum: 1 },
      ticket_medio: { $avg: "$total_geral" }
    }
  },
  { $sort: { faturamento_total: -1 } },
  {
    $project: {
      _id: 0,
      categoria: "$_id",
      faturamento_total: 1,
      numero_hospedagens: 1,
      ticket_medio: { $round: ["$ticket_medio", 2] }
    }
  }
]).forEach(r => printjson(r));

// =============================================================
//  BLOCO 4: PERÍODOS DE MAIOR OCUPAÇÃO
// =============================================================

print("\n\n📍 BLOCO 4 — PERÍODOS DE MAIOR OCUPAÇÃO");
print("-".repeat(60));

// 4.1 — Reservas por mês (volume)
print("\n[4.1] Número de reservas por mês (data de criação):");
db.reservas.aggregate([
  {
    $group: {
      _id: {
        ano: { $year: "$criado_em" },
        mes: { $month: "$criado_em" }
      },
      total_reservas: { $sum: 1 },
      valor_total: { $sum: "$valor_total_estimado" }
    }
  },
  { $sort: { "_id.ano": 1, "_id.mes": 1 } },
  {
    $project: {
      _id: 0,
      periodo: {
        $concat: [
          { $toString: "$_id.ano" }, "-",
          { $cond: [{ $lt: ["$_id.mes", 10] }, { $concat: ["0", { $toString: "$_id.mes" }] }, { $toString: "$_id.mes" }] }
        ]
      },
      total_reservas: 1,
      valor_total: 1
    }
  }
]).forEach(r => printjson(r));

// 4.2 — Quais quartos têm mais hospedagens (mais populares)
print("\n[4.2] Quartos mais populares (por número de hospedagens):");
db.hospedagens.aggregate([
  {
    $group: {
      _id: "$quarto_id",
      total_hospedagens: { $sum: 1 },
      total_noites: { $sum: "$numero_noites" },
      receita_gerada: { $sum: "$total_geral" }
    }
  },
  {
    $lookup: {
      from: "quartos",
      localField: "_id",
      foreignField: "_id",
      as: "quarto"
    }
  },
  { $unwind: "$quarto" },
  { $sort: { total_hospedagens: -1 } },
  {
    $project: {
      _id: 0,
      quarto_numero: "$quarto.numero",
      categoria: "$quarto.categoria",
      total_hospedagens: 1,
      total_noites: 1,
      receita_gerada: 1
    }
  }
]).forEach(r => printjson(r));

// 4.3 — Check-ins por dia da semana
print("\n[4.3] Check-ins por dia da semana (0=Dom, 1=Seg, ..., 6=Sáb):");
db.hospedagens.aggregate([
  { $match: { data_check_in_real: { $ne: null } } },
  {
    $group: {
      _id: { $dayOfWeek: "$data_check_in_real" },
      total_checkins: { $sum: 1 }
    }
  },
  { $sort: { "_id": 1 } },
  {
    $project: {
      _id: 0,
      dia_semana: {
        $switch: {
          branches: [
            { case: { $eq: ["$_id", 1] }, then: "Domingo" },
            { case: { $eq: ["$_id", 2] }, then: "Segunda" },
            { case: { $eq: ["$_id", 3] }, then: "Terça" },
            { case: { $eq: ["$_id", 4] }, then: "Quarta" },
            { case: { $eq: ["$_id", 5] }, then: "Quinta" },
            { case: { $eq: ["$_id", 6] }, then: "Sexta" },
            { case: { $eq: ["$_id", 7] }, then: "Sábado" }
          ],
          default: "Desconhecido"
        }
      },
      total_checkins: 1
    }
  }
]).forEach(r => printjson(r));

// 4.4 — Média de noites por categoria de quarto
print("\n[4.4] Média de diárias por categoria de quarto:");
db.hospedagens.aggregate([
  {
    $lookup: {
      from: "quartos",
      localField: "quarto_id",
      foreignField: "_id",
      as: "quarto"
    }
  },
  { $unwind: "$quarto" },
  {
    $group: {
      _id: "$quarto.categoria",
      media_noites: { $avg: "$numero_noites" },
      total_hospedagens: { $sum: 1 }
    }
  },
  { $sort: { media_noites: -1 } },
  {
    $project: {
      _id: 0,
      categoria: "$_id",
      media_noites: { $round: ["$media_noites", 1] },
      total_hospedagens: 1
    }
  }
]).forEach(r => printjson(r));

// =============================================================
//  BLOCO 5: AVALIAÇÕES E SATISFAÇÃO
// =============================================================

print("\n\n📍 BLOCO 5 — AVALIAÇÕES E SATISFAÇÃO");
print("-".repeat(60));

// 5.1 — Média geral de avaliações do hotel
print("\n[5.1] Média geral de satisfação:");
db.avaliacoes.aggregate([
  { $match: { visivel: true } },
  {
    $group: {
      _id: null,
      media_geral: { $avg: "$nota_geral" },
      media_limpeza: { $avg: "$notas_detalhadas.limpeza" },
      media_atendimento: { $avg: "$notas_detalhadas.atendimento" },
      media_conforto: { $avg: "$notas_detalhadas.conforto" },
      total_avaliacoes: { $sum: 1 }
    }
  },
  {
    $project: {
      _id: 0,
      media_geral: { $round: ["$media_geral", 2] },
      media_limpeza: { $round: ["$media_limpeza", 2] },
      media_atendimento: { $round: ["$media_atendimento", 2] },
      media_conforto: { $round: ["$media_conforto", 2] },
      total_avaliacoes: 1
    }
  }
]).forEach(r => printjson(r));

// 5.2 — Avaliação média por quarto
print("\n[5.2] Nota média por quarto:");
db.avaliacoes.aggregate([
  {
    $lookup: {
      from: "quartos",
      localField: "quarto_id",
      foreignField: "_id",
      as: "quarto"
    }
  },
  { $unwind: "$quarto" },
  {
    $group: {
      _id: "$quarto_id",
      numero_quarto: { $first: "$quarto.numero" },
      categoria: { $first: "$quarto.categoria" },
      media_nota: { $avg: "$nota_geral" },
      total_avaliacoes: { $sum: 1 }
    }
  },
  { $sort: { media_nota: -1 } },
  {
    $project: {
      _id: 0,
      numero_quarto: 1,
      categoria: 1,
      media_nota: { $round: ["$media_nota", 2] },
      total_avaliacoes: 1
    }
  }
]).forEach(r => printjson(r));

// 5.3 — Avaliações sem resposta do hotel
print("\n[5.3] Avaliações ainda sem resposta do hotel:");
db.avaliacoes.find(
  { visivel: true, resposta_hotel: null },
  { titulo: 1, nota_geral: 1, data_avaliacao: 1 }
).forEach(r => printjson(r));

print("\n" + "=".repeat(60));
print("  FIM DO RELATÓRIO — HOTEL NEBULA");
print("=".repeat(60) + "\n");
