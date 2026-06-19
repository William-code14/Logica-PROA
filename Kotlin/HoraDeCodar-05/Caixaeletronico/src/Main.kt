import java.util.Scanner

val scanner = Scanner(System.`in`)

// Dados do sistema
var nomeUsuario: String = ""
var saldo: Double = 1500.00
val SENHA_CORRETA = "3589"

// Extrato com transações fictícias
val extrato: MutableList<String> = mutableListOf(
    "05/06/2025 - Depósito                  + R$ 500,00",
    "08/06/2025 - Compra Supermercado       - R$ 132,50",
    "10/06/2025 - Compra Farmácia           - R$  47,80",
    "12/06/2025 - Depósito Salário          + R$ 1.200,00",
    "15/06/2025 - Compra Streaming          - R$  20,00",
    "17/06/2025 - Saque ATM                 - R$ 100,00",
    "18/06/2025 - Transferência recebida    + R$ 100,30"
)

fun main() {
    println("============================================")
    println("       BEM-VINDO AO BANCO KOTLIN S.A.      ")
    println("============================================")
    print("\nPor favor, informe o seu nome: ")
    nomeUsuario = scanner.nextLine().trim()

    println("\nOlá $nomeUsuario, é um prazer ter você por aqui!")
    println()
    inicio()
}

fun inicio() {
    println("============================================")
    println("              MENU PRINCIPAL                ")
    println("============================================")
    println("  1 - Saldo")
    println("  2 - Extrato")
    println("  3 - Saque")
    println("  4 - Depósito")
    println("  5 - Transferência")
    println("  6 - Sair")
    println("============================================")
    print("Escolha uma opção: ")

    val opcaoStr = scanner.nextLine().trim()
    val opcao = opcaoStr.toIntOrNull()

    when (opcao) {
        1 -> verSaldo()
        2 -> verExtrato()
        3 -> sacar()
        4 -> depositar()
        5 -> transferir()
        6 -> sair()
        else -> erro()
    }
}

fun validarSenha(): Boolean {
    print("Digite sua senha: ")
    val senhaDigitada = scanner.nextLine().trim()
    return senhaDigitada == SENHA_CORRETA
}

fun solicitarSenhaComRepeticao(acao: () -> Unit) {
    if (validarSenha()) {
        acao()
    } else {
        println("\n❌ Senha incorreta! Tente novamente.")
        println()
        solicitarSenhaComRepeticao(acao)
    }
}

fun verSaldo() {
    println("\n============================================")
    println("                  SALDO                    ")
    println("============================================")
    solicitarSenhaComRepeticao {
        println("\n  Saldo disponível: R$ ${"%.2f".format(saldo)}")
        println()
        voltarAoMenu()
    }
}

fun verExtrato() {
    println("\n============================================")
    println("                 EXTRATO                   ")
    println("============================================")
    solicitarSenhaComRepeticao {
        println()
        extrato.forEach { println("  $it") }
        println("--------------------------------------------")
        println("  Saldo atual: R$ ${"%.2f".format(saldo)}")
        println()
        voltarAoMenu()
    }
}

fun sacar() {
    println("\n============================================")
    println("                  SAQUE                    ")
    println("============================================")
    solicitarSenhaComRepeticao {
        print("Informe o valor a ser sacado: R$ ")
        val valorStr = scanner.nextLine().trim().replace(",", ".")
        val valor = valorStr.toDoubleOrNull()

        when {
            valor == null -> {
                println("\n⚠️  Valor inválido. Por favor, insira apenas números.")
                println()
                sacar()
                return@solicitarSenhaComRepeticao
            }
            valor <= 0 -> {
                println("\n🚫 Operação não autorizada.")
                println("   O valor do saque deve ser maior que zero.")
                println()
            }
            valor > saldo -> {
                println("\n🚫 Operação não autorizada.")
                println("   Saldo insuficiente para realizar o saque.")
                println("   Saldo disponível: R$ ${"%.2f".format(saldo)}")
                println()
            }
            else -> {
                saldo -= valor
                extrato.add("Hoje       - Saque ATM                 - R$ ${"%.2f".format(valor)}")
                println("\n✅ Saque de R$ ${"%.2f".format(valor)} realizado com sucesso!")
                println("   Saldo restante: R$ ${"%.2f".format(saldo)}")
                println()
            }
        }
        voltarAoMenu()
    }
}

fun depositar() {
    println("\n============================================")
    println("                 DEPÓSITO                  ")
    println("============================================")
    print("Informe o valor a ser depositado: R$ ")
    val valorStr = scanner.nextLine().trim().replace(",", ".")
    val valor = valorStr.toDoubleOrNull()

    when {
        valor == null -> {
            println("\n⚠️  Valor inválido. Por favor, insira apenas números.")
            println()
            depositar()
            return
        }
        valor <= 0 -> {
            println("\n🚫 Operação não autorizada.")
            println("   O valor do depósito deve ser maior que zero.")
            println()
        }
        else -> {
            saldo += valor
            extrato.add("Hoje       - Depósito                  + R$ ${"%.2f".format(valor)}")
            println("\n✅ Depósito de R$ ${"%.2f".format(valor)} realizado com sucesso!")
            println("   Novo saldo: R$ ${"%.2f".format(saldo)}")
            println()
        }
    }
    voltarAoMenu()
}

fun transferir() {
    println("\n============================================")
    println("              TRANSFERÊNCIA                 ")
    println("============================================")
    solicitarSenhaComRepeticao {
        print("Informe o número da conta destino: ")
        val contaStr = scanner.nextLine().trim()

        if (contaStr.isEmpty() || !contaStr.all { it.isDigit() }) {
            println("\n⚠️  Número de conta inválido. Informe apenas dígitos numéricos.")
            println()
            transferir()
            return@solicitarSenhaComRepeticao
        }

        val contaDestino = contaStr

        print("Informe o valor a ser transferido: R$ ")
        val valorStr = scanner.nextLine().trim().replace(",", ".")
        val valor = valorStr.toDoubleOrNull()

        when {
            valor == null -> {
                println("\n⚠️  Valor inválido. Por favor, insira apenas números.")
                println()
                transferir()
                return@solicitarSenhaComRepeticao
            }
            valor <= 0 -> {
                println("\n🚫 Operação não autorizada.")
                println("   O valor da transferência deve ser maior que zero.")
                println()
            }
            valor > saldo -> {
                println("\n🚫 Operação não autorizada.")
                println("   Saldo insuficiente para realizar a transferência.")
                println("   Saldo disponível: R$ ${"%.2f".format(saldo)}")
                println()
            }
            else -> {
                saldo -= valor
                extrato.add("Hoje       - Transferência c/$contaDestino     - R$ ${"%.2f".format(valor)}")
                println("\n✅ Transferência de R$ ${"%.2f".format(valor)} para a conta $contaDestino realizada com sucesso!")
                println("   Saldo restante: R$ ${"%.2f".format(saldo)}")
                println()
            }
        }
        voltarAoMenu()
    }
}

fun sair() {
    println("\n============================================")
    println("$nomeUsuario, foi um prazer ter você por aqui!")
    println("     Até logo e obrigado pelos serviços!    ")
    println("============================================\n")
}

fun erro() {
    println("\n⚠️  Opção inválida!")
    println("Por favor, informe um número entre 1 a 6.")
    println()
    inicio()
}

fun voltarAoMenu() {
    print("Pressione ENTER para voltar ao menu...")
    scanner.nextLine()
    println()
    inicio()
}