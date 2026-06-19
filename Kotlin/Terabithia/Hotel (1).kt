package Hotel

fun main() {
    inicio()
}

fun inicio() {
    println("╔══════════════════════════════════════╗")
    println("║      BEM-VINDO AO HOTEL TERABITHIA   ║")
    println("╠══════════════════════════════════════╣")
    println("║  1. Reserva de Quartos               ║")
    println("║  2. Cadastro de Hóspedes             ║")
    println("║  3. Abastecimento de Automóveis      ║")
    println("║  4. Sair                             ║")
    println("╚══════════════════════════════════════╝")
    print("Escolha uma opção: ")

    val escolha = readln().toIntOrNull()

    when (escolha) {
        1 -> cadastrarQuartos()
        2 -> cadastrarHospedes()
        3 -> abastecimentoDeAutomoveis()
        4 -> sairDoHotel()
        else -> erro()
    }
}

fun cadastrarQuartos() {
    println("\n╔══════════════════════════════════════╗")
    println("║   HOTEL TERABITHIA - RESERVA DE      ║")
    println("║           QUARTOS                    ║")
    println("╚══════════════════════════════════════╝")

    val quartos = mutableMapOf(
        101 to "Disponível", 102 to "Disponível",
        201 to "Disponível", 202 to "Disponível",
        301 to "Disponível"
    )

    while (true) {
        println("""
Reserva de Quartos — Selecione uma opção:
  1. Ver quartos disponíveis
  2. Reservar um quarto
  3. Cancelar reserva
  4. Voltar ao menu principal
        """.trimIndent())
        print("Opção: ")

        when (readln().toIntOrNull()) {
            1 -> {
                println("\nStatus dos quartos:")
                quartos.forEach { (numero, status) ->
                    println("  Quarto $numero → $status")
                }
            }
            2 -> {
                print("Informe o número do quarto que deseja reservar: ")
                val numero = readln().toIntOrNull()
                if (numero != null && quartos.containsKey(numero)) {
                    if (quartos[numero] == "Disponível") {
                        print("Informe o nome do hóspede: ")
                        val nome = readln()
                        quartos[numero] = "Reservado para $nome"
                        println("✅ Quarto $numero reservado para $nome com sucesso!")
                    } else {
                        println("⚠️  Quarto $numero já está ocupado: ${quartos[numero]}")
                    }
                } else {
                    println("⚠️  Quarto não encontrado.")
                }
            }
            3 -> {
                print("Informe o número do quarto para cancelar a reserva: ")
                val numero = readln().toIntOrNull()
                if (numero != null && quartos.containsKey(numero)) {
                    if (quartos[numero] == "Disponível") {
                        println("⚠️  Quarto $numero já está disponível.")
                    } else {
                        quartos[numero] = "Disponível"
                        println("✅ Reserva do quarto $numero cancelada com sucesso!")
                    }
                } else {
                    println("⚠️  Quarto não encontrado.")
                }
            }
            4 -> {
                println("Voltando ao menu principal...\n")
                inicio()
                return
            }
            else -> println("⚠️  Por favor, informe um número entre 1 e 4.")
        }
    }
}

fun abastecimentoDeAutomoveis() {
    println("\n╔══════════════════════════════════════╗")
    println("║  HOTEL TERABITHIA - ABASTECIMENTO    ║")
    println("║         DE AUTOMÓVEIS                ║")
    println("╚══════════════════════════════════════╝")

    val veiculos = mutableListOf(
        mapOf("placa" to "ABC-1234", "combustivel" to 80.0, "capacidade" to 100.0),
        mapOf("placa" to "DEF-5678", "combustivel" to 45.0, "capacidade" to 60.0),
        mapOf("placa" to "GHI-9012", "combustivel" to 20.0, "capacidade" to 80.0)
    ).map { it.toMutableMap() }

    while (true) {
        println("""
Abastecimento de Automóveis — Selecione uma opção:
  1. Ver veículos e nível de combustível
  2. Abastecer veículo
  3. Voltar ao menu principal
        """.trimIndent())
        print("Opção: ")

        when (readln().toIntOrNull()) {
            1 -> {
                println("\nFrota do Hotel Terabithia:")
                veiculos.forEachIndexed { index, v ->
                    val atual = v["combustivel"] as Double
                    val cap = v["capacidade"] as Double
                    val pct = (atual / cap * 100).toInt()
                    println("  ${index + 1}. Placa: ${v["placa"]} | Combustível: ${"%.1f".format(atual)}L / ${"%.0f".format(cap)}L ($pct%)")
                }
            }
            2 -> {
                println("Selecione o veículo (1-${veiculos.size}): ")
                val idx = (readln().toIntOrNull() ?: 0) - 1
                if (idx in veiculos.indices) {
                    val v = veiculos[idx]
                    val atual = v["combustivel"] as Double
                    val cap = v["capacidade"] as Double
                    val espaco = cap - atual
                    println("Espaço disponível para abastecimento: ${"%.1f".format(espaco)}L")
                    print("Quantos litros deseja abastecer? ")
                    val litros = readln().toDoubleOrNull()
                    when {
                        litros == null || litros <= 0 -> println("⚠️  Valor inválido.")
                        litros > espaco -> println("⚠️  Quantidade excede a capacidade do tanque. Máximo: ${"%.1f".format(espaco)}L")
                        else -> {
                            v["combustivel"] = atual + litros
                            println("✅ Veículo ${v["placa"]} abastecido com ${"%.1f".format(litros)}L. Nível atual: ${"%.1f".format(v["combustivel"] as Double)}L")
                        }
                    }
                } else {
                    println("⚠️  Veículo não encontrado.")
                }
            }
            3 -> {
                println("Voltando ao menu principal...\n")
                inicio()
                return
            }
            else -> println("⚠️  Por favor, informe um número entre 1 e 3.")
        }
    }
}

fun erro() {
    println("\n⚠️  Por favor, informe um número entre 1 e 4.")
    inicio()
}

fun sairDoHotel() {
    print("\nVocê deseja sair? (S/N): ")
    val escolha = readln().trim().uppercase()

    when (escolha) {
        "S" -> println("Obrigado por escolher o Hotel Terabithia. Até logo! 👋")
        "N" -> {
            println("Ok, voltando ao menu principal.\n")
            inicio()
        }
        else -> {
            println("Desculpe, não compreendi. Por favor, responda S ou N.")
            sairDoHotel()
        }
    }
}
