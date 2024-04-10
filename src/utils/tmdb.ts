import { RequestInit } from 'node-fetch'
import { fetchJSON } from './api'
import { Movie, MovieListResponse } from '@/types/tmdb'

/**
 * Fetches data from the TMDB API
 * @param url The relative URL
 * @param params The query parameters
 * @param options The fetch options
 * @returns The result
 */
const fetch = async <T = unknown>(
  url: string,
  params: Record<string, any> = {},
  options?: RequestInit
): Promise<T | null> => {
  try {
    if (!process.env.TMDB_API_KEY || !process.env.TMDB_API_URL) {
      throw new Error('TMDB_API_KEY or TMDB_API_URL is not defined')
    }

    params.api_key = process.env.TMDB_API_KEY
    return fetchJSON<T>(process.env.TMDB_API_URL, url, params, options)
  } catch (e) {
    console.error(e)
    return null
  }
}

export const getPopularMovies = async (): Promise<MovieListResponse | null> => {
  return fetch('movie/popular')
}

export const getMovie = async (
  id: number,
  withTrailer?: boolean
): Promise<Movie | null> => {
  const query = withTrailer ? { append_to_response: 'videos' } : {}
  const movie = await fetch<Movie>(`movie/${id}`, query)
  if (withTrailer && movie && !movie.video) {
    movie.video =
      movie?.videos?.results?.find((v: any) => {
        return v.type === 'Trailer' && v.site === 'YouTube' && v.official
      }) || false
  }
  return movie
}

export const searchMovies = async (
  query: string
): Promise<MovieListResponse | null> => {
  return fetch('search/movie', { query })
}
