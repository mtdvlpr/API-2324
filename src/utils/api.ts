import fetch from 'node-fetch'

export const tmdbAPI = async <T = any>(
  url: string,
  query?: string
): Promise<T | null> => {
  try {
    const response = await fetch(
      `https://api.themoviedb.org/3/${url}?api_key=${
        process.env.MOVIEDB_TOKEN
      }${query ? `&${query}` : ''}`
    )
    const result = (await response.json()) as T
    return result
  } catch (e) {
    console.error(e)
    return null
  }
}
