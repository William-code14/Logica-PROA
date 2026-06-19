package Hotel

import kotlin.system.exitProcess

fun cadastrarHospedes() {
    // Lista inicial com hóspedes fictícios (equivalente ao Java de referência)
    val listaHospedes = mutableListOf(
        "Fernando Netto",
        "Gabriel Augusto Azevedo",
        "Fernanda Monteiro",
        "Eleanor Neves",
        "Gabriel Paiva",
        "Débora Menezes",
        "Michael B Jordan",
        "Priscila Gabriel",
        "Noelia Vasquez",
        "Carla Octaviano Azevedo"
    )

    while (true) {
        println("""
╔══════════════════════════════════════╗
║  HOTEL TERABITHIA - CADASTRO DE      ║
║           HÓSPEDES                   ║
╠══════════════════════════════════════╣
║  1. Cadastrar hóspede                ║
║  2. Pesquisar hóspede                ║
║  3. Listar todos os hóspedes         ║
║  4. Remover hóspede                  ║
║  5. Voltar ao menu principal         ║
╚══════════════════════════════════════╝
        """.trimIndent())
        print("Escolha uma opção: ")

        val escolha = readln().toIntOrNull()

        when (escolha) {
            1 -> cadastrarHospede(listaHospedes)
            2 -> pesquisarHospede(listaHospedes)
            3 -> listarHospedes(listaHospedes)
            4 -> removerHospede(listaHospedes)
            5 -> {
                println("Voltando ao menu principal...\n")
                inicio()
                return
            }
            else -> erroCadastroDeHospedes()
        }
    }
}

fun cadastrarHospede(listaHospedes: MutableList<String>) {
    print("\nCadastro de Hóspedes — Por favor, informe o nome do hóspede: ")
    val novoHospede = readln().trim()

    if (novoHospede.isBlank()) {
        println("⚠️  Nome não pode ser vazio.")
        return
    }

    listaHospedes.add(novoHospede)
    println("✅ \"$novoHospede\" cadastrado com sucesso!")
    println("Total de hóspedes: ${listaHospedes.size}")
}

fun pesquisarHospede(listaHospedes: MutableList<String>) {
    print("\nPesquisa de Hóspedes — Por favor, informe o nome do hóspede: ")
    val nomeHospede = readln().trim()

    val encontrados = listaHospedes.filter { it.contains(nomeHospede, ignoreCase = true) }

    if (encontrados.isNotEmpty()) {
        println("\n✅ Encontramos ${encontrados.size} hóspede(s):")
        encontrados.forEachIndexed { index, nome ->
            println("  ${index + 1}. $nome")
        }
    } else {
        println("❌ Nenhum hóspede encontrado com o nome \"$nomeHospede\".")
    }
}

fun listarHospedes(listaHospedes: MutableList<String>) {
    if (listaHospedes.isEmpty()) {
        println("\n⚠️  Não há hóspedes cadastrados.")
        return
    }
    println("\n📋 Lista de hóspedes (${listaHospedes.size} no total):")
    listaHospedes.forEachIndexed { index, nome ->
        println("  ${index + 1}. $nome")
    }
}

fun removerHospede(listaHospedes: MutableList<String>) {
    if (listaHospedes.isEmpty()) {
        println("\n⚠️  Não há hóspedes cadastrados para remover.")
        return
    }

    listarHospedes(listaHospedes)
    print("\nInforme o nome do hóspede que deseja remover: ")
    val nome = readln().trim()

    val encontrados = listaHospedes.filter { it.equals(nome, ignoreCase = true) }

    when {
        encontrados.isEmpty() -> println("❌ Hóspede \"$nome\" não encontrado.")
        else -> {
            listaHospedes.removeIf { it.equals(nome, ignoreCase = true) }
            println("✅ Hóspede \"$nome\" removido com sucesso!")
        }
    }
}

fun erroCadastroDeHospedes() {
    println("\n⚠️  Por favor, informe um número entre 1 e 5.")
}
