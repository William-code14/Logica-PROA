fun main() {

    var opcao: Int?
    do {
        println("1 - Somar, 2 - Subtrair, 3 - Multiplicar, 4 - Dividir")
        println("Qual operação você deseja fazer?")
        opcao = readln().toIntOrNull() ?: return
        if (opcao !in 1..4) println("Opção inválida!")
        else break

    } while (true)


    val valores = DoubleArray(2)
    valores.forEachIndexed { index, d ->
        do {
            print("Digite o ${index + 1}º valor: ")
            val valor: Double = readln().toDoubleOrNull() ?: continue
            if (opcao == 4 && index == 1 && valor == 0.0) continue
            valores[index] = valor
            break
        } while (true)
    }
    when (opcao) {
        1 -> println("O resultado da soma é ${valores.sum()}")
        2 -> println("O resultado da subtração é ${valores[0] - valores[1]}")
        3 -> println("O resultado da multiplicação é ${valores[0] * valores[1]}")
        4 -> println("O resultado da divisão é ${valores[0] / valores[1]}")
        else -> println("Algo não saiu como o esperado!")
    }
}