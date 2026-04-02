fun main() {

    val valores = DoubleArray(4)
    valores.forEachIndexed { index, valor ->
        print("Digite o ${index + 1}º valor: ")
        val valorInformado = readln().toDouble()
        valores[index] = valorInformado
    }
    println("O primeiro valor informado foi: ${valores[0]}")
    println("O último valor informado foi: ${valores[valores.size - 1]}")
    println("O maior valor informado foi: ${valores.max()}")

}