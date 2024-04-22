const trendingForm = document.querySelector('.trending-form')
const searchForm = document.querySelector('.search-form')
const searchResults = document.querySelector('.search-results')

export const initTrendingFilter = () => {
  console.log('trendingForm', trendingForm)
  if (!trendingForm) return
  trendingForm.addEventListener('submit', async (e) => {
    console.log('submit', e)
    try {
      e.preventDefault()
      updateTrendingResults(e.submitter)
      if (document.startViewTransition) {
        document.startViewTransition(() => updateTrendingResults(e.submitter))
      } else {
        updateTrendingResults(e.submitter)
      }
    } catch (e) {
      console.error(e)
    }
  })
}

/**
 * Updates the trending results based on the selected filter
 * @param {HTMLButtonElement} submitter The button that was clicked
 */
const updateTrendingResults = async (submitter) => {
  try {
    const params = new URLSearchParams({
      [submitter.name]: submitter.value,
    })
    const url = `?${params.toString()}`
    window.history?.pushState({}, '', url)
    const result = await fetch(`${url}&partial=true`)
    const html = await result.text()
    document.querySelector('.trending-list').innerHTML = html
    trendingForm.querySelectorAll('sl-button').forEach((btn) => {
      btn.setAttribute(
        'variant',
        btn.getAttribute('value') === submitter.value ? 'primary' : 'secondary'
      )
    })
  } catch (e) {
    console.error(e)
  }
}

export const initSearchFilter = () => {
  if (!searchForm || !searchResults) return

  searchForm.addEventListener('submit', async (e) => {
    try {
      e.preventDefault()
      const formData = new FormData(e.target)
      if (document.startViewTransition) {
        document.startViewTransition(() => updateSearchResults(formData))
      } else {
        updateSearchResults(formData)
      }
    } catch (e) {
      console.error(e)
    }
  })
}

const updateSearchResults = async (formData) => {
  try {
    const params = new URLSearchParams({ q: formData.get('q') })
    const url = `?${params.toString()}`
    window.history?.pushState({}, '', url)
    const result = await fetch(`${url}&partial=true`)
    const html = await result.text()
    searchResults.innerHTML = html
  } catch (e) {
    console.error(e)
  }
}
