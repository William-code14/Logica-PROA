// =============================================================
//  HOTEL NEBULA — Parte 2: Montagem do Núcleo
//  Script de inserção para MongoDB Shell (mongosh)
//
//  Como executar:
//    mongosh hotel_nebula parte2/insercao.js
//
//  Ou dentro do mongosh:
//    use hotel_nebula
//    load("parte2/insercao.js")
// =============================================================

// Limpa o banco para execução idempotente (dev/test)
db.hospedes.drop();
db.quartos.drop();
db.reservas.drop();
db.hospedagens.drop();
db.pagamentos.drop();
db.funcionarios.drop();
db.avaliacoes.drop();

print("✅ Coleções limpas. Iniciando inserção...\n");

// =============================================================
//  FUNCIONÁRIOS
// =============================================================

const funcionarios = db.funcionarios.insertMany([
  {
    nome: "Ricardo Mendes",
    cargo: "Recepcionista",
    turno: "manhã",
    email_corporativo: "r.mendes@hotelnebula.com",
    telefone: "+55 21 98888-1111",
    cpf: "987.654.321-00",
    data_admissao: new Date("2022-06-01"),
    ativo: true,
    habilidades: ["check-in", "check-out", "concierge", "inglês fluente"]
  },
  {
    nome: "Fernanda Castro",
    cargo: "Recepcionista",
    turno: "tarde",
    email_corporativo: "f.castro@hotelnebula.com",
    telefone: "+55 21 98888-2222",
    cpf: "111.222.333-44",
    data_admissao: new Date("2023-02-15"),
    ativo: true,
    habilidades: ["check-in", "check-out", "espanhol intermediário"]
  },
  {
    nome: "Bruno Teixeira",
    cargo: "Gerente de Operações",
    turno: "integral",
    email_corporativo: "b.teixeira@hotelnebula.com",
    telefone: "+55 21 98888-3333",
    cpf: "555.666.777-88",
    data_admissao: new Date("2020-01-10"),
    ativo: true,
    habilidades: ["gestão", "escalas", "atendimento VIP", "inglês fluente", "francês intermediário"]
  },
  {
    nome: "Patrícia Souza",
    cargo: "Camareira Chefe",
    turno: "manhã",
    email_corporativo: "p.souza@hotelnebula.com",
    telefone: "+55 21 98888-4444",
    cpf: "999.888.777-66",
    data_admissao: new Date("2019-08-20"),
    ativo: true,
    habilidades: ["governança", "limpeza", "lavanderia", "supervisão de equipe"]
  },
  {
    nome: "Lucas Ferreira",
    cargo: "Concierge",
    turno: "noite",
    email_corporativo: "l.ferreira@hotelnebula.com",
    telefone: "+55 21 98888-5555",
    cpf: "222.333.444-55",
    data_admissao: new Date("2021-11-01"),
    ativo: true,
    habilidades: ["check-in tardio", "reservas externas", "inglês fluente", "italiano básico"]
  }
]);

const [fRicardo, fFernanda, fBruno, fPatricia, fLucas] = funcionarios.insertedIds;
print("✅ Funcionários inseridos:", Object.keys(funcionarios.insertedIds).length);

// =============================================================
//  QUARTOS
// =============================================================

const quartos = db.quartos.insertMany([
  {
    numero: 101,
    andar: 1,
    categoria: "Standard",
    capacidade: 2,
    preco_por_noite: 280.00,
    moeda: "BRL",
    status: "disponivel",
    descricao: "Quarto padrão com vista para o jardim interno.",
    comodidades: ["ar-condicionado", "TV 42\"", "frigobar", "Wi-Fi", "cofre"],
    fotos: ["https://hotelnebula.com/fotos/101_a.jpg"],
    ultima_manutencao: new Date("2025-03-01")
  },
  {
    numero: 102,
    andar: 1,
    categoria: "Standard",
    capacidade: 2,
    preco_por_noite: 280.00,
    moeda: "BRL",
    status: "ocupado",
    descricao: "Quarto padrão com vista para o jardim interno.",
    comodidades: ["ar-condicionado", "TV 42\"", "frigobar", "Wi-Fi", "cofre"],
    fotos: ["https://hotelnebula.com/fotos/102_a.jpg"],
    ultima_manutencao: new Date("2025-02-15")
  },
  {
    numero: 201,
    andar: 2,
    categoria: "Standard Plus",
    capacidade: 2,
    preco_por_noite: 420.00,
    moeda: "BRL",
    status: "disponivel",
    descricao: "Quarto superior com área de trabalho e banheiro ampliado.",
    comodidades: ["ar-condicionado", "TV 50\"", "frigobar", "Wi-Fi", "cofre", "mesa de trabalho", "banheira"],
    fotos: ["https://hotelnebula.com/fotos/201_a.jpg", "https://hotelnebula.com/fotos/201_b.jpg"],
    ultima_manutencao: new Date("2025-04-01")
  },
  {
    numero: 301,
    andar: 3,
    categoria: "Deluxe",
    capacidade: 3,
    preco_por_noite: 680.00,
    moeda: "BRL",
    status: "disponivel",
    descricao: "Quarto deluxe com vista parcial para o mar.",
    comodidades: ["ar-condicionado", "TV 55\"", "frigobar premium", "Wi-Fi", "cofre", "banheira", "vista para o mar", "varanda"],
    fotos: ["https://hotelnebula.com/fotos/301_a.jpg"],
    ultima_manutencao: new Date("2025-04-05")
  },
  {
    numero: 302,
    andar: 3,
    categoria: "Deluxe",
    capacidade: 3,
    preco_por_noite: 680.00,
    moeda: "BRL",
    status: "manutencao",
    descricao: "Quarto deluxe — em manutenção preventiva.",
    comodidades: ["ar-condicionado", "TV 55\"", "frigobar premium", "Wi-Fi", "cofre", "banheira", "varanda"],
    fotos: [],
    ultima_manutencao: new Date("2025-05-10")
  },
  {
    numero: 401,
    andar: 4,
    categoria: "Suite Executiva",
    capacidade: 2,
    preco_por_noite: 950.00,
    moeda: "BRL",
    status: "disponivel",
    descricao: "Suite executiva com sala de reuniões privativa e vista para o mar.",
    comodidades: [
      "ar-condicionado", "TV 60\"", "frigobar premium", "Wi-Fi ultra", "cofre",
      "banheira de hidromassagem", "vista para o mar", "sala de reuniões",
      "serviço de mordomo", "café expresso na suite"
    ],
    fotos: ["https://hotelnebula.com/fotos/401_a.jpg", "https://hotelnebula.com/fotos/401_b.jpg"],
    ultima_manutencao: new Date("2025-04-15")
  },
  {
    numero: 501,
    andar: 5,
    categoria: "Suite Luxo",
    capacidade: 4,
    preco_por_noite: 1200.00,
    moeda: "BRL",
    status: "disponivel",
    descricao: "Suite com vista panorâmica para o mar, banheira de hidromassagem e sala de estar.",
    comodidades: [
      "ar-condicionado", "TV 65\"", "frigobar", "Wi-Fi ultra", "cofre",
      "banheira de hidromassagem", "vista para o mar", "sala de estar",
      "varanda privativa", "serviço de mordomo", "jacuzzi externa"
    ],
    fotos: ["https://hotelnebula.com/fotos/501_a.jpg", "https://hotelnebula.com/fotos/501_b.jpg"],
    ultima_manutencao: new Date("2025-04-10")
  }
]);

const [q101, q102, q201, q301, q302, q401, q501] = quartos.insertedIds;
print("✅ Quartos inseridos:", Object.keys(quartos.insertedIds).length);

// =============================================================
//  HÓSPEDES
// =============================================================

const hospedes = db.hospedes.insertMany([
  {
    nome: "Mariana Oliveira",
    email: "mariana.oliveira@email.com",
    telefone: "+55 11 91234-5678",
    cpf: "123.456.789-00",
    nacionalidade: "Brasileira",
    data_nascimento: new Date("1990-03-15"),
    endereco: {
      rua: "Av. Paulista", numero: "1000",
      cidade: "São Paulo", estado: "SP", pais: "Brasil", cep: "01311-000"
    },
    preferencias: ["andar alto", "travesseiro extra", "quarto silencioso"],
    historico_reservas: [],
    criado_em: new Date("2023-01-10")
  },
  {
    nome: "Carlos Eduardo Lima",
    email: "carlos.lima@empresa.com",
    telefone: "+55 21 99876-5432",
    cpf: "234.567.890-11",
    nacionalidade: "Brasileira",
    data_nascimento: new Date("1982-07-22"),
    endereco: {
      rua: "Rua das Palmeiras", numero: "45",
      cidade: "Rio de Janeiro", estado: "RJ", pais: "Brasil", cep: "20040-020"
    },
    preferencias: ["cama king", "café da manhã incluído", "perto do elevador"],
    historico_reservas: [],
    criado_em: new Date("2022-09-05")
  },
  {
    nome: "Sophie Dubois",
    email: "sophie.dubois@mail.fr",
    telefone: "+33 6 12 34 56 78",
    passaporte: "FR982345A",
    nacionalidade: "Francesa",
    data_nascimento: new Date("1995-11-08"),
    endereco: {
      rua: "Rue de Rivoli", numero: "88",
      cidade: "Paris", estado: null, pais: "França", cep: "75001"
    },
    preferencias: ["vista para o mar", "silêncio à noite"],
    historico_reservas: [],
    criado_em: new Date("2024-02-20")
  },
  {
    nome: "Pedro Alves Santos",
    email: "pedro.santos@outlook.com",
    telefone: "+55 85 98765-4321",
    cpf: "345.678.901-22",
    nacionalidade: "Brasileira",
    data_nascimento: new Date("1978-05-30"),
    endereco: {
      rua: "Rua do Sol", numero: "200",
      cidade: "Fortaleza", estado: "CE", pais: "Brasil", cep: "60115-190"
    },
    preferencias: ["quarto para família", "piscina", "estacionamento"],
    historico_reservas: [],
    criado_em: new Date("2023-06-18")
  },
  {
    nome: "Ana Beatriz Ferreira",
    email: "ana.ferreira@gmail.com",
    telefone: "+55 31 91111-2222",
    cpf: "456.789.012-33",
    nacionalidade: "Brasileira",
    data_nascimento: new Date("1988-12-01"),
    endereco: {
      rua: "Av. do Contorno", numero: "530",
      cidade: "Belo Horizonte", estado: "MG", pais: "Brasil", cep: "30110-090"
    },
    preferencias: ["banheira", "spa", "room service"],
    historico_reservas: [],
    criado_em: new Date("2024-01-05")
  }
]);

const [hMariana, hCarlos, hSophie, hPedro, hAna] = hospedes.insertedIds;
print("✅ Hóspedes inseridos:", Object.keys(hospedes.insertedIds).length);

// =============================================================
//  RESERVAS
// =============================================================

const reservas = db.reservas.insertMany([
  // Mariana — Suite Luxo 501 — abril 2025 (encerrada)
  {
    hospede_id: hMariana,
    quarto_id: q501,
    snapshot_hospede: { nome: "Mariana Oliveira", email: "mariana.oliveira@email.com", cpf: "123.456.789-00" },
    snapshot_quarto: { numero: 501, categoria: "Suite Luxo", preco_por_noite: 1200.00 },
    data_check_in_previsto: new Date("2025-04-20"),
    data_check_out_previsto: new Date("2025-04-25"),
    numero_noites: 5,
    numero_hospedes: 2,
    status: "encerrada",
    canal: "site_oficial",
    observacoes: "Hóspede solicitou travesseiro extra e check-in tardio.",
    criado_em: new Date("2025-03-15"),
    valor_total_estimado: 6000.00
  },
  // Carlos — Suite Executiva 401 — março 2025 (encerrada)
  {
    hospede_id: hCarlos,
    quarto_id: q401,
    snapshot_hospede: { nome: "Carlos Eduardo Lima", email: "carlos.lima@empresa.com", cpf: "234.567.890-11" },
    snapshot_quarto: { numero: 401, categoria: "Suite Executiva", preco_por_noite: 950.00 },
    data_check_in_previsto: new Date("2025-03-10"),
    data_check_out_previsto: new Date("2025-03-14"),
    numero_noites: 4,
    numero_hospedes: 1,
    status: "encerrada",
    canal: "parceiro_corporativo",
    observacoes: "Viagem a negócios. Nota fiscal para empresa.",
    criado_em: new Date("2025-02-28"),
    valor_total_estimado: 3800.00
  },
  // Carlos — segunda reserva, quarto Standard 101 — fevereiro 2025 (encerrada)
  {
    hospede_id: hCarlos,
    quarto_id: q101,
    snapshot_hospede: { nome: "Carlos Eduardo Lima", email: "carlos.lima@empresa.com", cpf: "234.567.890-11" },
    snapshot_quarto: { numero: 101, categoria: "Standard", preco_por_noite: 280.00 },
    data_check_in_previsto: new Date("2025-02-05"),
    data_check_out_previsto: new Date("2025-02-07"),
    numero_noites: 2,
    numero_hospedes: 1,
    status: "encerrada",
    canal: "parceiro_corporativo",
    observacoes: "Check-in antecipado solicitado.",
    criado_em: new Date("2025-01-20"),
    valor_total_estimado: 560.00
  },
  // Sophie — Deluxe 301 — maio 2025 (confirmada, futura)
  {
    hospede_id: hSophie,
    quarto_id: q301,
    snapshot_hospede: { nome: "Sophie Dubois", email: "sophie.dubois@mail.fr", passaporte: "FR982345A" },
    snapshot_quarto: { numero: 301, categoria: "Deluxe", preco_por_noite: 680.00 },
    data_check_in_previsto: new Date("2025-06-01"),
    data_check_out_previsto: new Date("2025-06-08"),
    numero_noites: 7,
    numero_hospedes: 2,
    status: "confirmada",
    canal: "booking",
    observacoes: "Lua de mel. Preparar decoração especial no quarto.",
    criado_em: new Date("2025-04-30"),
    valor_total_estimado: 4760.00
  },
  // Pedro — Standard 102 — em andamento (check-in feito)
  {
    hospede_id: hPedro,
    quarto_id: q102,
    snapshot_hospede: { nome: "Pedro Alves Santos", email: "pedro.santos@outlook.com", cpf: "345.678.901-22" },
    snapshot_quarto: { numero: 102, categoria: "Standard", preco_por_noite: 280.00 },
    data_check_in_previsto: new Date("2025-05-12"),
    data_check_out_previsto: new Date("2025-05-15"),
    numero_noites: 3,
    numero_hospedes: 3,
    status: "em_andamento",
    canal: "telefone",
    observacoes: "Família com criança. Berço solicitado.",
    criado_em: new Date("2025-05-01"),
    valor_total_estimado: 840.00
  },
  // Ana — Standard Plus 201 — abril 2025 (encerrada)
  {
    hospede_id: hAna,
    quarto_id: q201,
    snapshot_hospede: { nome: "Ana Beatriz Ferreira", email: "ana.ferreira@gmail.com", cpf: "456.789.012-33" },
    snapshot_quarto: { numero: 201, categoria: "Standard Plus", preco_por_noite: 420.00 },
    data_check_in_previsto: new Date("2025-04-10"),
    data_check_out_previsto: new Date("2025-04-13"),
    numero_noites: 3,
    numero_hospedes: 2,
    status: "encerrada",
    canal: "site_oficial",
    observacoes: "Aniversário de casamento.",
    criado_em: new Date("2025-03-25"),
    valor_total_estimado: 1260.00
  },
  // Mariana — segunda reserva, 201 — janeiro 2025 (encerrada)
  {
    hospede_id: hMariana,
    quarto_id: q201,
    snapshot_hospede: { nome: "Mariana Oliveira", email: "mariana.oliveira@email.com", cpf: "123.456.789-00" },
    snapshot_quarto: { numero: 201, categoria: "Standard Plus", preco_por_noite: 420.00 },
    data_check_in_previsto: new Date("2025-01-15"),
    data_check_out_previsto: new Date("2025-01-18"),
    numero_noites: 3,
    numero_hospedes: 1,
    status: "encerrada",
    canal: "site_oficial",
    observacoes: "",
    criado_em: new Date("2024-12-20"),
    valor_total_estimado: 1260.00
  }
]);

const [rMariana1, rCarlos1, rCarlos2, rSophie, rPedro, rAna, rMariana2] = reservas.insertedIds;

// Atualiza histórico dos hóspedes
db.hospedes.updateOne({ _id: hMariana }, { $set: { historico_reservas: [rMariana1, rMariana2] } });
db.hospedes.updateOne({ _id: hCarlos }, { $set: { historico_reservas: [rCarlos1, rCarlos2] } });
db.hospedes.updateOne({ _id: hSophie }, { $set: { historico_reservas: [rSophie] } });
db.hospedes.updateOne({ _id: hPedro }, { $set: { historico_reservas: [rPedro] } });
db.hospedes.updateOne({ _id: hAna }, { $set: { historico_reservas: [rAna] } });

print("✅ Reservas inseridas:", Object.keys(reservas.insertedIds).length);

// =============================================================
//  HOSPEDAGENS
// =============================================================

const hospedagens = db.hospedagens.insertMany([
  // Mariana — Suite Luxo — abril 2025
  {
    reserva_id: rMariana1,
    hospede_id: hMariana,
    quarto_id: q501,
    funcionario_checkin_id: fRicardo,
    funcionario_checkout_id: fFernanda,
    data_check_in_real: new Date("2025-04-20T14:30:00"),
    data_check_out_real: new Date("2025-04-25T11:00:00"),
    numero_noites: 5,
    status: "encerrada",
    servicos_consumidos: [
      { descricao: "Café da manhã", quantidade: 4, preco_unitario: 65.00, subtotal: 260.00, data: new Date("2025-04-21") },
      { descricao: "Spa — massagem relaxante 60min", quantidade: 1, preco_unitario: 320.00, subtotal: 320.00, data: new Date("2025-04-22") },
      { descricao: "Minibar", quantidade: 3, preco_unitario: 45.00, subtotal: 135.00, data: new Date("2025-04-23") },
      { descricao: "Room service — jantar", quantidade: 1, preco_unitario: 180.00, subtotal: 180.00, data: new Date("2025-04-24") }
    ],
    total_servicos: 895.00,
    total_quarto: 6000.00,
    total_geral: 6895.00,
    observacoes_internas: "Hóspede muito satisfeita. Pediu indicação de restaurantes."
  },
  // Carlos — Suite Executiva — março 2025
  {
    reserva_id: rCarlos1,
    hospede_id: hCarlos,
    quarto_id: q401,
    funcionario_checkin_id: fFernanda,
    funcionario_checkout_id: fRicardo,
    data_check_in_real: new Date("2025-03-10T16:00:00"),
    data_check_out_real: new Date("2025-03-14T10:00:00"),
    numero_noites: 4,
    status: "encerrada",
    servicos_consumidos: [
      { descricao: "Café da manhã", quantidade: 4, preco_unitario: 65.00, subtotal: 260.00, data: new Date("2025-03-11") },
      { descricao: "Lavanderia expressa", quantidade: 2, preco_unitario: 95.00, subtotal: 190.00, data: new Date("2025-03-12") },
      { descricao: "Transfer aeroporto", quantidade: 1, preco_unitario: 150.00, subtotal: 150.00, data: new Date("2025-03-14") }
    ],
    total_servicos: 600.00,
    total_quarto: 3800.00,
    total_geral: 4400.00,
    observacoes_internas: "NF emitida para Empresa XYZ LTDA."
  },
  // Carlos — Standard — fevereiro 2025
  {
    reserva_id: rCarlos2,
    hospede_id: hCarlos,
    quarto_id: q101,
    funcionario_checkin_id: fLucas,
    funcionario_checkout_id: fRicardo,
    data_check_in_real: new Date("2025-02-05T07:30:00"),
    data_check_out_real: new Date("2025-02-07T09:00:00"),
    numero_noites: 2,
    status: "encerrada",
    servicos_consumidos: [
      { descricao: "Estacionamento", quantidade: 2, preco_unitario: 50.00, subtotal: 100.00, data: new Date("2025-02-05") }
    ],
    total_servicos: 100.00,
    total_quarto: 560.00,
    total_geral: 660.00,
    observacoes_internas: ""
  },
  // Ana — Standard Plus — abril 2025
  {
    reserva_id: rAna,
    hospede_id: hAna,
    quarto_id: q201,
    funcionario_checkin_id: fRicardo,
    funcionario_checkout_id: fFernanda,
    data_check_in_real: new Date("2025-04-10T13:00:00"),
    data_check_out_real: new Date("2025-04-13T11:30:00"),
    numero_noites: 3,
    status: "encerrada",
    servicos_consumidos: [
      { descricao: "Café da manhã", quantidade: 3, preco_unitario: 65.00, subtotal: 195.00, data: new Date("2025-04-11") },
      { descricao: "Spa — tratamento facial", quantidade: 1, preco_unitario: 280.00, subtotal: 280.00, data: new Date("2025-04-11") },
      { descricao: "Decoração quarto — surpresa aniversário", quantidade: 1, preco_unitario: 200.00, subtotal: 200.00, data: new Date("2025-04-10") }
    ],
    total_servicos: 675.00,
    total_quarto: 1260.00,
    total_geral: 1935.00,
    observacoes_internas: "Decoração surpresa preparada pela equipe antes do check-in."
  },
  // Mariana — Standard Plus — janeiro 2025
  {
    reserva_id: rMariana2,
    hospede_id: hMariana,
    quarto_id: q201,
    funcionario_checkin_id: fLucas,
    funcionario_checkout_id: fRicardo,
    data_check_in_real: new Date("2025-01-15T15:00:00"),
    data_check_out_real: new Date("2025-01-18T10:00:00"),
    numero_noites: 3,
    status: "encerrada",
    servicos_consumidos: [
      { descricao: "Café da manhã", quantidade: 3, preco_unitario: 65.00, subtotal: 195.00, data: new Date("2025-01-16") }
    ],
    total_servicos: 195.00,
    total_quarto: 1260.00,
    total_geral: 1455.00,
    observacoes_internas: ""
  },
  // Pedro — Standard — em andamento
  {
    reserva_id: rPedro,
    hospede_id: hPedro,
    quarto_id: q102,
    funcionario_checkin_id: fFernanda,
    funcionario_checkout_id: null,
    data_check_in_real: new Date("2025-05-12T14:00:00"),
    data_check_out_real: null,
    numero_noites: 3,
    status: "em_andamento",
    servicos_consumidos: [
      { descricao: "Berço infantil", quantidade: 1, preco_unitario: 0.00, subtotal: 0.00, data: new Date("2025-05-12") },
      { descricao: "Café da manhã", quantidade: 2, preco_unitario: 65.00, subtotal: 130.00, data: new Date("2025-05-13") }
    ],
    total_servicos: 130.00,
    total_quarto: 840.00,
    total_geral: 970.00,
    observacoes_internas: "Família com criança pequena. Berço instalado."
  }
]);

const [hospMar1, hospCar1, hospCar2, hospAna, hospMar2, hospPed] = hospedagens.insertedIds;
print("✅ Hospedagens inseridas:", Object.keys(hospedagens.insertedIds).length);

// =============================================================
//  PAGAMENTOS
// =============================================================

db.pagamentos.insertMany([
  {
    hospedagem_id: hospMar1,
    hospede_id: hMariana,
    valor: 6895.00,
    moeda: "BRL",
    metodo: "cartao_credito",
    bandeira: "Visa",
    parcelas: 3,
    status: "aprovado",
    data_pagamento: new Date("2025-04-25T11:15:00"),
    codigo_transacao: "TXN-2025-88821",
    nota_fiscal: "NF-2025-00512"
  },
  {
    hospedagem_id: hospCar1,
    hospede_id: hCarlos,
    valor: 4400.00,
    moeda: "BRL",
    metodo: "transferencia_bancaria",
    bandeira: null,
    parcelas: 1,
    status: "aprovado",
    data_pagamento: new Date("2025-03-14T10:30:00"),
    codigo_transacao: "TXN-2025-33241",
    nota_fiscal: "NF-2025-00318",
    cnpj_fatura: "12.345.678/0001-99"
  },
  {
    hospedagem_id: hospCar2,
    hospede_id: hCarlos,
    valor: 660.00,
    moeda: "BRL",
    metodo: "cartao_debito",
    bandeira: "Mastercard",
    parcelas: 1,
    status: "aprovado",
    data_pagamento: new Date("2025-02-07T09:15:00"),
    codigo_transacao: "TXN-2025-11098",
    nota_fiscal: "NF-2025-00124"
  },
  {
    hospedagem_id: hospAna,
    hospede_id: hAna,
    valor: 1935.00,
    moeda: "BRL",
    metodo: "pix",
    bandeira: null,
    parcelas: 1,
    status: "aprovado",
    data_pagamento: new Date("2025-04-13T11:45:00"),
    codigo_transacao: "PIX-2025-44002",
    nota_fiscal: "NF-2025-00498"
  },
  {
    hospedagem_id: hospMar2,
    hospede_id: hMariana,
    valor: 1455.00,
    moeda: "BRL",
    metodo: "cartao_credito",
    bandeira: "Visa",
    parcelas: 1,
    status: "aprovado",
    data_pagamento: new Date("2025-01-18T10:20:00"),
    codigo_transacao: "TXN-2025-00891",
    nota_fiscal: "NF-2025-00055"
  }
]);

print("✅ Pagamentos inseridos.");

// =============================================================
//  AVALIAÇÕES
// =============================================================

db.avaliacoes.insertMany([
  {
    hospede_id: hMariana,
    quarto_id: q501,
    hospedagem_id: hospMar1,
    nota_geral: 9.5,
    notas_detalhadas: { limpeza: 10, atendimento: 9, conforto: 10, custo_beneficio: 8, localizacao: 10 },
    titulo: "Experiência incrível — voltarei com certeza!",
    comentario: "O quarto 501 é simplesmente deslumbrante. Vista para o mar, banheira perfeita e atendimento impecável. A única ressalva é o café da manhã, que poderia ter mais variedade.",
    data_avaliacao: new Date("2025-04-27"),
    visivel: true,
    resposta_hotel: {
      texto: "Obrigada, Mariana! Foi um prazer recebê-la. Já anotamos a sugestão sobre o café da manhã!",
      data: new Date("2025-04-28"),
      autor: "Gerência Hotel Nebula"
    }
  },
  {
    hospede_id: hCarlos,
    quarto_id: q401,
    hospedagem_id: hospCar1,
    nota_geral: 8.5,
    notas_detalhadas: { limpeza: 9, atendimento: 8, conforto: 9, custo_beneficio: 7, localizacao: 9 },
    titulo: "Ótima opção para viagens corporativas",
    comentario: "Hotel excelente para negócios. Sala de reuniões privativa foi fundamental. Poderia melhorar a velocidade do Wi-Fi nas áreas comuns.",
    data_avaliacao: new Date("2025-03-16"),
    visivel: true,
    resposta_hotel: {
      texto: "Obrigado, Carlos! Sua sugestão sobre o Wi-Fi já está em análise pela nossa equipe de TI.",
      data: new Date("2025-03-17"),
      autor: "Gerência Hotel Nebula"
    }
  },
  {
    hospede_id: hAna,
    quarto_id: q201,
    hospedagem_id: hospAna,
    nota_geral: 9.0,
    notas_detalhadas: { limpeza: 9, atendimento: 10, conforto: 9, custo_beneficio: 9, localizacao: 8 },
    titulo: "Aniversário de casamento perfeito!",
    comentario: "A equipe preparou o quarto com flores e uma mensagem surpresa. Nos sentimos muito especiais. O spa foi um highlight da viagem.",
    data_avaliacao: new Date("2025-04-15"),
    visivel: true,
    resposta_hotel: null
  },
  {
    hospede_id: hMariana,
    quarto_id: q201,
    hospedagem_id: hospMar2,
    nota_geral: 7.5,
    notas_detalhadas: { limpeza: 8, atendimento: 7, conforto: 8, custo_beneficio: 7, localizacao: 8 },
    titulo: "Boa estadia, mas com alguns pontos de melhoria",
    comentario: "O quarto estava limpo e confortável. O atendimento na recepção poderia ser mais ágil. Voltaria sim, mas esperaria melhorias.",
    data_avaliacao: new Date("2025-01-20"),
    visivel: true,
    resposta_hotel: null
  }
]);

print("✅ Avaliações inseridas.\n");
print("🏨 Hotel Nebula — banco populado com sucesso!");
print("   Coleções criadas: hospedes, quartos, reservas, hospedagens, pagamentos, funcionarios, avaliacoes");
