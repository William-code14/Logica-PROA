package com.ichooseyou

import androidx.lifecycle.LiveData
import androidx.lifecycle.MutableLiveData
import androidx.lifecycle.ViewModel
import kotlin.random.Random

/**
 * Representa um gênero e se ele está selecionado ou não.
 */
data class GenreItem(
    val name: String,
    val isSelected: Boolean = true
)

/**
 * ViewModel para gerenciar o estado da aplicação I Choose You.
 */
class MainViewModel : ViewModel() {

    // Lista de gêneros com seu estado de seleção
    private val _genres = MutableLiveData<List<GenreItem>>(
        listOf(
            GenreItem("Action Movie"),
            GenreItem("Comedy Movie"),
            GenreItem("Drama Movie"),
            GenreItem("Science Fiction Movie"),
            GenreItem("Animated Movie"),
            GenreItem("Horror Movie"),
            GenreItem("Adventure Movie"),
            GenreItem("Thriller Movie")
        )
    )
    val genres: LiveData<List<GenreItem>> = _genres

    // Histórico das últimas seleções
    private val _selectionHistory = MutableLiveData<List<String>>(emptyList())
    val selectionHistory: LiveData<List<String>> = _selectionHistory

    // Gênero selecionado no momento
    private val _selectedGenre = MutableLiveData<String?>()
    val selectedGenre: LiveData<String?> = _selectedGenre

    private val maxHistorySize = 5

    fun addGenre(name: String) {
        val currentList = _genres.value?.toMutableList() ?: mutableListOf()
        if (currentList.none { it.name.equals(name, ignoreCase = true) }) {
            currentList.add(GenreItem(name, true))
            _genres.value = currentList
        }
    }

    fun toggleGenreSelection(name: String) {
        val currentList = _genres.value?.map {
            if (it.name == name) it.copy(isSelected = !it.isSelected) else it
        }
        _genres.value = currentList
    }

    fun chooseRandomGenre() {
        val activeGenres = _genres.value?.filter { it.isSelected }?.map { it.name } ?: emptyList()
        if (activeGenres.isNotEmpty()) {
            val selected = activeGenres[Random.nextInt(activeGenres.size)]
            _selectedGenre.value = selected
            addToHistory(selected)
        }
    }

    private fun addToHistory(genre: String) {
        val currentHistory = _selectionHistory.value?.toMutableList() ?: mutableListOf()
        currentHistory.add(0, genre)
        if (currentHistory.size > maxHistorySize) {
            currentHistory.removeAt(currentHistory.size - 1)
        }
        _selectionHistory.value = currentHistory
    }
}
