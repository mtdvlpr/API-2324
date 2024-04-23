import { type RequestInit } from 'node-fetch'
import { fetchJSON } from './api'
import type {
  Movie,
  MovieBase,
  MovieListResponse,
  MovieMapped,
} from '@/types/tmdb'

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

/**
 * Maps a movie to include the rating
 * @param movie The movie to map
 * @returns The mapped movie
 */
const mapMovie = <T extends MovieBase>(movie: T): T & MovieMapped => {
  return { ...movie, rating: movie.vote_average / 2 }
}

/**
 * Fetches the popular movies
 * @returns The popular movies
 */
export const getPopularMovies = async () => {
  const result = await fetch<MovieListResponse>('movie/popular')
  if (!result) return { results: [] }
  return {
    ...result,
    results: result.results.map(mapMovie),
  }
}

/**
 * Fetches the trending movies
 * @param time The time period
 * @returns The trending movies
 */
export const getTrendingMovies = async (time: 'day' | 'week' = 'day') => {
  const result = await fetch<MovieListResponse>(`trending/movie/${time}`)
  if (!result) return { results: [] }
  return {
    ...result,
    results: result.results.map(mapMovie),
  }
}

/**
 * Fetches a movie by ID
 * @param id The ID
 * @param withTrailer Wether to include the trailer
 * @returns The movie
 */
export const getMovie = async (id: number, withTrailer?: boolean) => {
  const query = withTrailer ? { append_to_response: 'videos' } : {}
  const movie = await fetch<Movie>(`movie/${id}`, query)
  if (withTrailer && movie && !movie.video) {
    movie.video =
      movie?.videos?.results?.find((v) => {
        return v.type === 'Trailer' && v.site === 'YouTube' && v.official
      }) || false
  }
  return movie ? mapMovie(movie) : null
}

/**
 * Searches for movies
 * @param query The search query
 * @returns The search results
 */
export const searchMovies = async (query: string) => {
  const result = await fetch<MovieListResponse>('search/movie', { query })
  if (!result) return { results: [] }
  return {
    ...result,
    results: result.results.map(mapMovie),
  }
}
