fun main() {
    fun main() {

        var maiorValor: Double? = null
        for (i in 1..2) {
            print("Digite o ${i}º valor: ")
            val valor = readln().toDouble()
            if (maiorValor == null) maiorValor = valor
            else if (valor > maiorValor) maiorValor = valor
        }
        println("O maior valor digitado foi ${maiorValor}")
    }

}