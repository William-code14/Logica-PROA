fun main() {

    var maiorValor: Double? = null
    for (i in 0..<3) {
        print("Digite o ${i + 1}º valor: ")
        val valor = readln().toDouble()
        if (maiorValor == null) maiorValor = valor
        else if (valor > maiorValor) maiorValor = valor
    }
    println("O maior valor digitado foi ${maiorValor}")
}