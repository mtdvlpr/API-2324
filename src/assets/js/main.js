import 'vite/modulepreload-polyfill'
import './../css/main.scss'

console.log('JS init')

const shareButtons = document.querySelectorAll('[data-share]')
shareButtons.forEach((btn) => {
  btn.addEventListener('click', async (e) => {
    try {
      const movie = JSON.parse(e.target.getAttribute('data-share'))
      console.log('data', movie)
      await navigator.share({
        title: movie.title,
        text: 'Check out this awesome movie!',
        url: `${window.location.host}/movie/${movie.id}`,
      })
      console.log('Data was shared successfully', movie)
    } catch (e) {
      console.error(e)
    }
  })
})
