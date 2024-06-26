'use strict'

import { toast } from './toast'

/**
 * Initializes the share API
 */
export const initShareAPI = () => {
  const shareButtons = document.querySelectorAll('[data-share]')
  shareButtons.forEach((btn) => {
    if (window.navigator?.share) {
      // Show share button
      btn.parentElement.classList.toggle('no-share', false)

      // Add click event listener
      btn.addEventListener('click', (e) => {
        try {
          const movie = JSON.parse(e.target.getAttribute('data-share'))
          shareMovie(movie)
        } catch (e) {
          console.error(e)
          toast('Could not share movie', e.message, 'danger')
        }
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
    toast('Could not share movie', e.message, 'danger')
  }
}
