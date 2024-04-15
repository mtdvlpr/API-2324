'use strict'

export const initShareAPI = () => {
  const shareButtons = document.querySelectorAll('[data-share]')
  shareButtons.forEach((btn) => {
    if (window.navigator?.share) {
      btn.parentElement.classList.toggle('no-share', false)
      btn.addEventListener('click', (e) => {
        shareMovie(e.target.getAttribute('data-share'))
      })
    } else {
      btn.parentElement.removeChild(btn)
    }
  })
}

/**
 * Shares a movie
 * @param {{id: number;title: string}} movie
 */
const shareMovie = async (movie) => {
  try {
    await navigator.share({
      title: movie.title,
      text: 'Check out this awesome movie!',
      url: `${window.location.origin}/movie/${movie.id}`,
    })
  } catch (e) {
    console.error('Error trying to share a movie', e)
  }
}
