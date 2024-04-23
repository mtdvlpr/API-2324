'use strict'

const trendingForm = document.querySelector('.trending-form')
const searchForm = document.querySelector('.search-form')
const searchResults = document.querySelector('.search-results')

/**
 * Initializes the trending filter
 */
export const initTrendingFilter = () => {
  if (!trendingForm) return
  trendingForm.addEventListener('submit', async (e) => {
    try {
      e.preventDefault()

      // If the browser supports view transitions, use it
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
    // Get the selected filter value from the pressed button
    const params = new URLSearchParams({
      [submitter.name]: submitter.value,
    })

    // Update the URL with the selected filter
    const url = `?${params.toString()}`
    window.history?.pushState({}, '', url)

    // Fetch the partial HTML of the trending movies based on the selected filter
    const result = await fetch(`${url}&partial=true`)
    const html = await result.text()

    // Update the trending list with the new HTML
    document.querySelector('.trending-list').innerHTML = html

    // Highlight the selected filter button
    trendingForm.querySelectorAll('sl-button').forEach((btn) => {
      btn.setAttribute(
        'variant',
        btn.getAttribute('value') === submitter.value ? 'primary' : 'default'
      )
    })
  } catch (e) {
    console.error(e)
  }
}

/**
 * Initializes the search filter
 */
export const initSearchFilter = () => {
  if (!searchForm || !searchResults) return

  searchForm.addEventListener('submit', async (e) => {
    try {
      e.preventDefault()
      const formData = new FormData(e.target)

      // If the browser supports view transitions, use it
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

/**
 * Updates the search results based on the form data
 * @param {FormData} formData The form data
 */
const updateSearchResults = async (formData) => {
  try {
    // Update the URL with the search query
    const params = new URLSearchParams({ q: formData.get('q') })
    const url = `?${params.toString()}`
    window.history?.pushState({}, '', url)

    // Fetch the partial HTML of the search results based on the search query
    const result = await fetch(`${url}&partial=true`)
    const html = await result.text()

    // Update the search results with the new HTML
    searchResults.innerHTML = html
  } catch (e) {
    console.error(e)
  }
}
