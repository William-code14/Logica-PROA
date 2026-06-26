package com.ichooseyou

import android.animation.AnimatorSet
import android.animation.ObjectAnimator
import android.media.AudioAttributes
import android.media.SoundPool
import android.os.Bundle
import android.view.LayoutInflater
import android.view.View
import android.view.animation.OvershootInterpolator
import android.widget.TextView
import androidx.appcompat.app.AppCompatActivity
import androidx.core.content.ContextCompat
import androidx.lifecycle.ViewModelProvider
import com.google.android.material.chip.Chip
import com.google.android.material.dialog.MaterialAlertDialogBuilder
import com.google.android.material.textfield.TextInputEditText
import com.ichooseyou.databinding.ActivityMainBinding

/**
 * MainActivity do app "I Choose You".
 * Implementa a lógica de interface e observa o ViewModel.
 */
class MainActivity : AppCompatActivity() {

    private lateinit var binding: ActivityMainBinding
    private lateinit var viewModel: MainViewModel
    private lateinit var soundPool: SoundPool

    private var popSoundId: Int = 0
    private var soundLoaded: Boolean = false

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        binding = ActivityMainBinding.inflate(layoutInflater)
        setContentView(binding.root)

        viewModel = ViewModelProvider(this)[MainViewModel::class.java]

        setupUI()
        setupObservers()
        setupSoundPool()
    }

    private fun setupUI() {
        binding.resultCard.visibility = View.INVISIBLE
        binding.historySection.visibility = View.GONE

        binding.chooseButton.setOnClickListener {
            val anySelected = viewModel.genres.value?.any { it.isSelected } ?: false
            if (!anySelected) {
                showNoGenresDialog()
            } else {
                viewModel.chooseRandomGenre()
                playPopSound()
            }
        }

        binding.addGenreButton.setOnClickListener {
            showAddGenreDialog()
        }
    }

    private fun setupObservers() {
        // Observa mudanças na lista de gêneros
        viewModel.genres.observe(this) { genres ->
            updateGenreChips(genres)
        }

        // Observa o resultado do sorteio
        viewModel.selectedGenre.observe(this) { genre ->
            genre?.let { displayResult(it) }
        }

        // Observa o histórico
        viewModel.selectionHistory.observe(this) { history ->
            refreshHistoryView(history)
        }
    }

    private fun setupSoundPool() {
        val audioAttributes = AudioAttributes.Builder()
            .setUsage(AudioAttributes.USAGE_GAME)
            .setContentType(AudioAttributes.CONTENT_TYPE_SONIFICATION)
            .build()

        soundPool = SoundPool.Builder()
            .setMaxStreams(1)
            .setAudioAttributes(audioAttributes)
            .build()

        soundPool.setOnLoadCompleteListener { _, _, status ->
            soundLoaded = (status == 0)
        }
        popSoundId = soundPool.load(this, R.raw.pop_sound, 1)
    }

    /**
     * Atualiza os Chips de gênero. Se a lista mudar de tamanho, recria.
     * Caso contrário, apenas atualiza o estado de seleção.
     */
    private fun updateGenreChips(genres: List<GenreItem>) {
        if (binding.genreChipGroup.childCount != genres.size) {
            binding.genreChipGroup.removeAllViews()
            genres.forEach { genreItem ->
                val chip = Chip(this).apply {
                    text = genreItem.name
                    isCheckable = true
                    isChecked = genreItem.isSelected
                    chipBackgroundColor = ContextCompat.getColorStateList(context, R.color.chip_background_selector)
                    setTextColor(ContextCompat.getColorStateList(context, R.color.chip_text_selector))
                    chipStrokeWidth = 0f
                    
                    setOnCheckedChangeListener { _, isChecked ->
                        if (isChecked != genreItem.isSelected) {
                            viewModel.toggleGenreSelection(genreItem.name)
                        }
                    }
                }
                binding.genreChipGroup.addView(chip)
            }
        } else {
            for (i in 0 until binding.genreChipGroup.childCount) {
                val chip = binding.genreChipGroup.getChildAt(i) as? Chip
                val genre = genres[i]
                if (chip != null && chip.text == genre.name) {
                    if (chip.isChecked != genre.isSelected) {
                        chip.isChecked = genre.isSelected
                    }
                }
            }
        }
    }

    private fun displayResult(genre: String) {
        binding.resultText.text = genre
        binding.resultEmoji.text = getEmojiForGenre(genre)

        if (binding.resultCard.visibility != View.VISIBLE) {
            binding.resultCard.visibility = View.VISIBLE
            binding.resultCard.alpha = 0f
            binding.resultCard.scaleX = 0.5f
            binding.resultCard.scaleY = 0.5f
        }

        val fadeIn = ObjectAnimator.ofFloat(binding.resultCard, View.ALPHA, binding.resultCard.alpha, 1f)
        val scaleX = ObjectAnimator.ofFloat(binding.resultCard, View.SCALE_X, binding.resultCard.scaleX, 1f)
        val scaleY = ObjectAnimator.ofFloat(binding.resultCard, View.SCALE_Y, binding.resultCard.scaleY, 1f)

        AnimatorSet().apply {
            playTogether(fadeIn, scaleX, scaleY)
            duration = 400
            interpolator = OvershootInterpolator(1.5f)
            start()
        }

        binding.chooseButton.animate()
            .scaleX(0.92f).scaleY(0.92f)
            .setDuration(100)
            .withEndAction {
                binding.chooseButton.animate().scaleX(1f).scaleY(1f).setDuration(100).start()
            }.start()
    }

    private fun refreshHistoryView(history: List<String>) {
        if (history.isEmpty()) {
            binding.historySection.visibility = View.GONE
            return
        }

        binding.historySection.visibility = View.VISIBLE
        binding.historyContainer.removeAllViews()

        history.forEachIndexed { index, genre ->
            val itemView = LayoutInflater.from(this)
                .inflate(R.layout.item_history, binding.historyContainer, false)

            itemView.findViewById<TextView>(R.id.historyNumber).text = "#${index + 1}"
            itemView.findViewById<TextView>(R.id.historyGenre).text = genre
            itemView.findViewById<TextView>(R.id.historyEmoji).text = getEmojiForGenre(genre)

            if (index == 0) {
                itemView.alpha = 0f
                itemView.translationX = -60f
                itemView.animate().alpha(1f).translationX(0f).setDuration(300).start()
            }

            binding.historyContainer.addView(itemView)
        }
    }

    private fun showAddGenreDialog() {
        val dialogView = LayoutInflater.from(this).inflate(R.layout.dialog_add_genre, null)
        val inputField = dialogView.findViewById<TextInputEditText>(R.id.genreInput)

        MaterialAlertDialogBuilder(this)
            .setTitle(R.string.add_genre_title)
            .setView(dialogView)
            .setPositiveButton(R.string.add) { _, _ ->
                val newGenre = inputField.text?.toString()?.trim()
                if (!newGenre.isNullOrEmpty()) {
                    viewModel.addGenre(newGenre)
                }
            }
            .setNegativeButton(R.string.cancel, null)
            .show()
    }

    private fun showNoGenresDialog() {
        MaterialAlertDialogBuilder(this)
            .setTitle(R.string.no_genres_title)
            .setMessage(R.string.no_genres_message)
            .setPositiveButton(R.string.ok, null)
            .show()
    }

    private fun getEmojiForGenre(genre: String): String {
        val g = genre.lowercase()
        return when {
            g.contains("action") -> "💥"
            g.contains("comedy") -> "😂"
            g.contains("drama") -> "🎭"
            g.contains("science fiction") || g.contains("sci-fi") -> "🚀"
            g.contains("animated") || g.contains("animation") -> "✨"
            g.contains("horror") -> "👻"
            g.contains("adventure") -> "🗺️"
            g.contains("thriller") -> "😰"
            g.contains("romance") -> "❤️"
            g.contains("documentary") -> "🎥"
            g.contains("musical") -> "🎵"
            g.contains("fantasy") -> "🧙"
            else -> "🎬"
        }
    }

    private fun playPopSound() {
        if (soundLoaded) {
            soundPool.play(popSoundId, 1f, 1f, 1, 0, 1f)
        }
    }

    override fun onDestroy() {
        super.onDestroy()
        if (::soundPool.isInitialized) {
            soundPool.release()
        }
    }
}
