val estudantes: MutableList<String> = mutableListOf()

private fun main() {
    return cadastrarEstudante()
}

fun cadastrarEstudante() {
    println("Digite \"PARE\" ")
    println("Qual o nome do estudante?")

    val nomeEstudante = readln().trim()
    if (nomeEstudante.uppercase() == "PARE") return imprimirInformacoes()
    else if (nomeEstudante.isNotBlank()) {
        estudantes.add(nomeEstudante)
        return main()
    }
    println("Nome inválido!")
    return cadastrarEstudante()
}

fun imprimirInformacoes() {
    println("Qauntidade de estudantes: ${estudantes.size}")
    println("Nomes: ${estudantes}")

}
