package HoraDeCodar02

fun main() {
    /*
    Escreva um programa para ler o ano de nascimento de uma pessoa e escrever uma mensagem que diga se ela poderá ou não votar este ano (não é necessário considerar o mês em que ela nasceu).
     */
    print("Digite o ano do seu nascimento: ")
    val ano: Int = readln().toInt()
    if (2026 - ano >= 16) println("Você pode votar esse ano!")
    else println("Você não pode votar esse ano!")
}