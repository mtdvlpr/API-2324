import 'dotenv/config'
import { App } from '@tinyhttp/app'
import { logger } from '@tinyhttp/logger'
import sirv from 'sirv'

import { getAbsolutePath, isProduction } from './utils/general'
import { renderView } from './utils/renderer'
import { getMovie, getPopularMovies, searchMovies } from './utils/tmdb'

const app = new App()
app.use(logger())

app.use('/', sirv(getAbsolutePath('src', 'public')))

if (isProduction) {
  app.use('/assets', sirv(getAbsolutePath('dist', 'assets')))
}

app.get('/', async (_, res) => {
  const result = await getPopularMovies()
  const movies = result?.results || []
  return renderView(res, 'home', { title: 'Home', movies })
})

app.get('/movie/:id/', async (req, res) => {
  const movieID = parseInt(req.params.id)
  const movie = await getMovie(movieID, true)
  return renderView(res, 'detail', { title: movie.title, movie })
})

app.get('/search', async (req, res) => {
  const query = req.query.q
  if (!query) {
    return renderView(res, 'search', { title: 'Zoeken', query, movies: [] })
  }

  const result = await searchMovies(
    Array.isArray(query) ? query.join(' ') : query
  )
  const movies = result?.results || []
  return renderView(res, 'search', { title: 'Zoeken', query, movies })
})

app.listen(3000, () => console.log('Listening on http://localhost:3000'))
