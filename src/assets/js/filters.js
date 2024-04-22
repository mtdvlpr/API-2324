const trendingForm = document.querySelector('.filter-form')
const searchForm = document.querySelector('.search-form')
const searchResults = document.querySelector('.search-results')

export const initTrendingFilter = () => {
  if (!trendingForm) return
  trendingForm.addEventListener('submit', async (e) => {
    try {
      e.preventDefault()
      const params = new URLSearchParams({
        [e.submitter.name]: e.submitter.value,
      })
      const url = `?${params.toString()}`
      window.history?.pushState({}, '', url)
      const result = await fetch(`${url}&partial=true`)
      const html = await result.text()
      document.querySelector('.trending-list').innerHTML = html
      trendingForm.querySelectorAll('sl-button').forEach((btn) => {
        btn.setAttribute(
          'variant',
          btn.getAttribute('value') === e.submitter.value
            ? 'primary'
            : 'secondary'
        )
      })
    } catch (e) {
      console.error(e)
    }
  })
}

export const initSearchFilter = () => {
  if (!searchForm || !searchResults) return

  searchForm.addEventListener('submit', async (e) => {
    try {
      e.preventDefault()
      const formData = new FormData(e.target)
      const params = new URLSearchParams({ q: formData.get('q') })
      const url = `?${params.toString()}`
      window.history?.pushState({}, '', url)
      const result = await fetch(`${url}&partial=true`)
      const html = await result.text()
      searchResults.innerHTML = html
    } catch (e) {
      console.error(e)
    }
  })
}
