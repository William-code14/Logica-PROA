val PLANETAS = listOf("Terra", "Marte", "Plutão", "Vênus", "Júpiter", "Saturno")

private fun main() {
    val nomePlaneta = pedirNomePlaneta()
    verificarPlaneta(nomePlaneta)
}

fun pedirNomePlaneta(): String {
    println("Digite o nome do planeta: ")
    return readln()
}

fun verificarPlaneta(nomePlaneta: String) {
    if (nomePlaneta in PLANETAS) println("O planeta $nomePlaneta está na lista de planetas!")
    else println("Bom... esse planeta $nomePlaneta... meio que... ... ele não ta na lista!")
    return
}