export interface PagedResponse<T> {
  page: number
  results: T[]
  total_pages: number
  total_results: number
}

export interface MovieCollection {
  id: number
  name: string
  poster_path: string
  backdrop_path: string
}

export interface MovieGenre {
  id: number
  name: string
}

export interface ProductionCompany {
  id: number
  logo_path: string
  name: string
  origin_country: string
}

export interface ProductionCountry {
  iso_3166_1: string
  name: string
}

export interface MovieLanguage {
  english_name: string
  iso_639_1: string
  name: string
}

export interface MovieVideo {
  id: string
  iso_639_1: string
  iso_3166_1: string
  key: string
  name: string
  site: string
  size: number
  type: string
  official: boolean
  published_at: string
}

export interface MovieVideosResponse {
  id?: number
  results: MovieVideo[]
}

export interface MovieBase {
  adult: boolean
  backdrop_path: string
  genre_ids: number[]
  id: number
  original_language: string
  original_title: string
  overview: string
  popularity: number
  poster_path: string
  release_date: string
  title: string
  video: MovieVideo | false
  vote_average: number
  vote_count: number
}

export interface Movie extends MovieBase {
  belongs_to_collection: MovieCollection
  budget: number
  genres: MovieGenre[]
  homepage: string
  imdb_id: string
  production_companies: ProductionCompany[]
  production_countries: ProductionCountry[]
  revenue: number
  runtime: number
  spoken_languages: MovieLanguage[]
  status: string
  tagline: string
  videos?: MovieVideosResponse
}

export interface MovieMapped {
  rating: number
}

export interface MovieListResponse extends PagedResponse<MovieBase> {}
