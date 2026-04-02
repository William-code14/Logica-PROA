fun main(){

    print("Digite um número: ")
    val valor = readln().toDouble()
    when {
        valor > 0 -> println("O número digitado é positivo")
        valor < 0 -> println("O número digitado é negativo")
        else -> println("O número digitado é zero")
    }
}