programa {
  
  funcao inicio() {
    cadeia Ativar_Bomba

    escreva("Escolha -S- Para ativar a bomba Ou Escolha -N- para Desativar Bomba","\n")
    escreva("Escolha uma das Opções acima: ")
    leia(Ativar_Bomba)

    se(Ativar_Bomba == "S"){
      escreva("Bomba Ativada!! Contagem da explosão.\n")
      
      para(inteiro i=30; i >=0; i--){
        escreva(i,"\n")
      }
      escreva("Explosão")
    }

    senao se(Ativar_Bomba =="N"){
      escreva("A bomba Foi desativada!!")
    }
    senao inicio("Opção nvalida! Programa encerrado.")

  }
}
