import kotlin.math.pow

fun main() {

    menu()
}

fun menu(){
    println("1 - Calcular área retângulo")
    println("2 - Calcular área quadrado")
    println("3 - Calcular área losango")
    println("4 - Calcular área trapézio")
    println("5 - Calcular área paralelogramo")
    println("6 - Calcular área triângulo")
    println("7 - Calcular área círculo")
    println("0 - Sair")

    println("Escolha uma da opções acima:")

    var opcao: Int = readln().toInt()

    when (opcao) {
        0 -> println("Programa Encerrado")
        1 -> calcularAreaRetangulo()
        2 -> calcularAreaQuadrado()
        3 -> calcularAreaLosango()
        4 -> calcularAreaTrapezio()
        5 -> calcularAreaParalelogramo()
        6 -> calcularAreaTriangulo()
        7 -> calcularAreaCirculo()
        else -> println("Opção Inválida")
    }
}

fun calcularAreaRetangulo(){
    val area: Double; val base: Double; val altura: Double
    println("Digite o valor da base do retângulo: ")
    base = readln().toDouble()

    println("Digite o valor da altura do retângulo: ")
    altura = readln().toDouble()

    area = base * altura

    println("A área do retângulo é $area")
    pausarFluxo()
    menu()
}
fun calcularAreaQuadrado(){
    println("Digite o valor de um dos lados do quadrado: ")
    val lado: Double = readln().toDouble()
    val area = lado * lado

    println("A área do quadrado é $area")

    pausarFluxo()
    menu()
}
fun calcularAreaLosango(){

    println("Digite o valor da diagonal maior do losango: ")
    val diagonalMaior: Double = readln().toDouble()

    println("Digite o valor da diagonal menor do losango: ")
    val diagonalMenor: Double = readln().toDouble()

    val area: Double = diagonalMaior * diagonalMenor / 2

    println("A área do losango é $area")
    pausarFluxo()
    menu()

}
fun calcularAreaTrapezio(){

    println("Digite o valor da base maior do trapézio: ")
    val baseMaior: Double = readln().toDouble()

    println("Digite o valor da base menor do trapézio: ")
    val baseMenor: Double = readln().toDouble()

    println("Digite o valor da altura do trapézio: ")
    val altura: Double = readln().toDouble()

    val area = (baseMaior + baseMenor) * altura / 2

    println("A área do trapézio é $area")
    pausarFluxo()
    menu()

}
fun calcularAreaParalelogramo(){
    val area: Double; val base: Double; val altura: Double
    println("Digite o valor da base do paralelograma: ")
    base = readln().toDouble()

    println("Digite o valor da altura do paralelograma: ")
    altura = readln().toDouble()

    area = base * altura

    println("A área do retângulo é $area")
    pausarFluxo()
    menu()
}
fun calcularAreaTriangulo(){
    val area: Double; val base: Double; val altura: Double
    println("Digite o valor da base do triângulo: ")
    base = readln().toDouble()

    println("Digite o valor da altura do triângulo: ")
    altura = readln().toDouble()

    area = base * altura / 2

    println("A área do retângulo é $area")
    pausarFluxo()
    menu()
}
fun calcularAreaCirculo(){
    val raio: Double; val area: Double;
    println("Digite o valor do raio do circulo: ")

    area = readln().toDouble().pow(2.0) * Math.PI


    println("A área do circulo é ${"%.2f".format(area)}")
}

fun pausarFluxo(){
    println("Para continuar aperte ENTER")
    readln()
}