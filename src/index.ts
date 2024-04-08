import 'dotenv/config'
import { App } from '@tinyhttp/app'
import { logger } from '@tinyhttp/logger'
import sirv from 'sirv'
import fetch from 'node-fetch'

import { getAbsolutePath, isProduction } from './utils/general'
import { renderTemplate } from './utils/renderer'

const app = new App()
app.use(logger())

if (isProduction) {
  app.use('/assets', sirv(getAbsolutePath('dist', 'assets')))
}

app.get('/', async (_, res) => {
  let movies = []
  try {
    const response = await fetch(
      `https://api.themoviedb.org/3/movie/popular?language=en-US&api_key=${process.env.MOVIEDB_TOKEN}`
    )
    const result = (await response.json()) as any
    movies = result.results
  } catch (e) {
    console.error(e)
  }
  return renderTemplate(res, 'index', { movies })
})

app.get('/movie/:id/', async (req, res) => {
  const movieID = req.params.id
  let movie = {}
  try {
    const response = await fetch(
      `https://api.themoviedb.org/3/movie/${movieID}?api_key=${process.env.MOVIEDB_TOKEN}`
    )
    const result = (await response.json()) as any
    movie = result
  } catch (e) {
    console.error(e)
  }
  return renderTemplate(res, 'detail', { title: 'Movie', movie })
})

app.listen(3000, () => console.log('Listening on http://localhost:3000'))
