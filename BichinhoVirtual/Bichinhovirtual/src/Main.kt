import java.util.Scanner
import kotlin.concurrent.thread


val scanner = Scanner(System.`in`)

class BichinhoVirtual(val nome: String) {

    var fome: Int = 30          // 0 = saciado, 100 = morto de fome
    var felicidade: Int = 70    // 0 = muito triste, 100 = muito feliz
    var cansaco: Int = 10       // 0 = descansado, 100 = exausto
    var idade: Int = 0          // aumenta com o tempo

    // ---- AÇÕES ----

    fun alimentar() {
        if (fome <= 0) {
            println("\n🍖 $nome não está com fome agora!")
        } else {
            fome = (fome - 25).coerceAtLeast(0)
            felicidade = (felicidade + 5).coerceAtMost(100)
            println("\n🍖 $nome foi alimentado! Fome diminuiu.")
        }
    }

    fun brincar() {
        if (cansaco >= 90) {
            println("\n😴 $nome está exausto demais para brincar! Deixe-o descansar primeiro.")
            return
        }
        felicidade = (felicidade + 20).coerceAtMost(100)
        cansaco = (cansaco + 25).coerceAtMost(100)
        fome = (fome + 10).coerceAtMost(100)
        println("\n🎾 $nome brincou e ficou mais feliz! Mas também ficou mais cansado...")
    }

    fun descansar() {
        if (cansaco <= 0) {
            println("\n💤 $nome já está bem descansado!")
        } else {
            cansaco = (cansaco - 30).coerceAtLeast(0)
            felicidade = (felicidade + 5).coerceAtMost(100)
            println("\n💤 $nome descansou e recuperou as energias!")
        }
    }

    fun verificarStatus() {
        println("\n╔══════════════════════════════════╗")
        println("║      STATUS DO BICHINHO          ║")
        println("╠══════════════════════════════════╣")
        println("║  Nome:       $nome${" ".repeat((21 - nome.length).coerceAtLeast(0))}║")
        println("║  Idade:      $idade ano(s)${" ".repeat((17 - idade.toString().length).coerceAtLeast(0))}║")
        println("║  Fome:       ${barraStatus(fome)} $fome%  ║")
        println("║  Felicidade: ${barraStatus(felicidade)} ${"${felicidade}%".padEnd(4)}║")
        println("║  Cansaço:    ${barraStatus(cansaco)} ${cansaco}%  ║")
        println("╚══════════════════════════════════╝")
        println("  ${estadoGeral()}")
    }

    // ---- PASSAGEM DO TEMPO ----

    fun passarTempo() {
        fome = (fome + 8).coerceAtMost(100)
        felicidade = (felicidade - 5).coerceAtLeast(0)
        cansaco = (cansaco + 3).coerceAtMost(100)
        idade += 1
        println("\n⏰ O tempo passou! $nome ficou mais velho (idade: $idade) e com mais fome...")
    }

    // ---- UTILITÁRIOS INTERNOS ----

    private fun barraStatus(valor: Int): String {
        val blocos = (valor / 10)
        val barra = "█".repeat(blocos) + "░".repeat(10 - blocos)
        return barra
    }

    private fun estadoGeral(): String {
        return when {
            fome >= 80 -> "😰 ${nome} está passando fome!"
            felicidade <= 20 -> "😢 ${nome} está muito triste..."
            cansaco >= 80 -> "😴 ${nome} está exausto!"
            felicidade >= 80 && fome <= 30 -> "😄 ${nome} está ótimo!"
            else -> "😊 ${nome} está bem."
        }
    }
}

// =============================================
//   MENU PRINCIPAL
// =============================================

fun exibirMenu() {
    println("\n┌─────────────────────────────┐")
    println("│       O QUE FAZER?          │")
    println("├─────────────────────────────┤")
    println("│  1 - Alimentar              │")
    println("│  2 - Brincar                │")
    println("│  3 - Descansar              │")
    println("│  4 - Ver Status             │")
    println("│  5 - Avançar o Tempo        │")
    println("│  6 - Sair                   │")
    println("└─────────────────────────────┘")
    print("Escolha: ")
}

fun main() {
    println("╔══════════════════════════════════════╗")
    println("║   🐾  BICHINHO VIRTUAL Do William 🐾 ║")
    println("╚══════════════════════════════════════╝")

    print("\nQual será o nome do seu bichinho? ")
    val nome = scanner.nextLine().trim().ifEmpty { "Bolinha" }

    val bichinho = BichinhoVirtual(nome)

    println("\n🎉 Parabéns! Seu bichinho $nome chegou!")
    bichinho.verificarStatus()

    var rodando = true
    while (rodando) {
        exibirMenu()

        when (scanner.nextLine().trim()) {
            "1" -> bichinho.alimentar()
            "2" -> bichinho.brincar()
            "3" -> bichinho.descansar()
            "4" -> bichinho.verificarStatus()
            "5" -> bichinho.passarTempo()
            "6" -> {
                println("\n👋 Até logo! Cuide bem do ${bichinho.nome}!")
                rodando = false
            }
            else -> println("\n⚠️  Opção inválida! Escolha entre 1 e 6.")
        }
    }
}