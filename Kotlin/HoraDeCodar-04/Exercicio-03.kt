fun main() {
    println( "Mercearia do BROWN")
    val frutas = mutableListOf("Maça", "Banana", "Uva", "Manga")
    println("Lista de compras: $frutas")

    while (frutas.isNotEmpty()){
        println("Digite o nome da fruta que deseja remover:")
        val frutaescolhida = readln()

        if (frutaescolhida != null){
            if (frutas.contains(frutaescolhida)) {
                frutas.remove(frutaescolhida)
                println("Fruta foi retirada da lista")
            }else{
                println("Fruta indisponível em nosso mercado ")

            }
        }
        println("lista atual: $frutas")
    }
    println("Lista de compra finalizada")
}