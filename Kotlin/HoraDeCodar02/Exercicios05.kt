fun main() {

    val valores = DoubleArray(6)
    valores.mapIndexed { index, valor ->
        print("Digite o ${index + 1}º valor: ")
        valores[index] = readln().toDouble()
        if (index == valores.size - 1) {
            valores.forEach { valor -> print("${valor} ") }
            println("\nA média aritmética dos valores acima é ${"%.2f".format(valores.sum() / valores.size)}")
        }
    }
}