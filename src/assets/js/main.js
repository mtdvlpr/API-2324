import 'vite/modulepreload-polyfill'
import './../css/main.scss'

console.log('JS init')

const shareButtons = document.querySelectorAll('[data-share]')
shareButtons.forEach((btn) => {
  if (window.navigator?.share) {
    btn.addEventListener('click', async (e) => {
      try {
        const movie = JSON.parse(e.target.getAttribute('data-share'))
        await navigator.share({
          title: movie.title,
          text: 'Check out this awesome movie!',
          url: `${window.location.origin}/movie/${movie.id}`,
        })
      } catch (e) {
        console.error(e)
      }
    })
  } else {
    btn.parentElement.removeChild(btn)
  }
})
