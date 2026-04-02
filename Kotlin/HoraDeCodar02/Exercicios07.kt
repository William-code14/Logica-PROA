fun main() {

    val valores = DoubleArray(6)
    var valoresSomados: Double = 0.0
    valores.forEachIndexed { index, valor ->
        print("Digite o ${index + 1}º valor: ")
        val valorInformado = readln().toDouble()
        valores[index] = valorInformado
        if (valorInformado < 72) valoresSomados += valorInformado
    }
    println("A soma dos valores inferiores a 72 é: $valoresSomados")
    println("Os valores informados foram: ")
    valores.forEach { valor -> print("$valor ") }
}