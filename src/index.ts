import 'dotenv/config'
import { App } from '@tinyhttp/app'
import { logger } from '@tinyhttp/logger'
import sirv from 'sirv'
import parser from 'body-parser'

import { getAbsolutePath, isProduction } from './utils/general'
import { renderPartial, renderView } from './utils/renderer'
import {
  getMovie,
  getPopularMovies,
  getTrendingMovies,
  searchMovies,
} from './utils/tmdb'
import { getMessages, listenForMessages, saveMessage } from './utils/chat'
import {
  deleteSubscription,
  initWebPush,
  saveSubscription,
  sendPushNotifications,
} from './utils/push'

const app = new App()
app
  .use(logger())
  .use(parser.json())
  .use(parser.urlencoded({ extended: false }))

app.use('/', sirv(getAbsolutePath('src', 'public')))

if (isProduction) {
  app.use('/assets', sirv(getAbsolutePath('dist', 'assets')))
}

app.get('/', async (req, res) => {
  const trendingTime = req.query.trending === 'week' ? 'week' : 'day'
  if (req.query.partial === 'true') {
    const result = await getTrendingMovies(trendingTime)
    return renderPartial(res, 'trending', { movies: result?.results || [] })
  } else {
    const promises = [getPopularMovies(), getTrendingMovies(trendingTime)]
    const movies = []
    const trending = []
    const results = await Promise.allSettled(promises)
    if (results[0].status === 'fulfilled') {
      movies.push(...results[0].value.results)
    }
    if (results[1].status === 'fulfilled') {
      trending.push(...results[1].value.results)
    }
    return renderView(res, 'home', {
      title: 'Home',
      movies,
      trending,
      trendingTime,
    })
  }
})

app.get('/movie/:id/', async (req, res) => {
  const movieID = parseInt(req.params.id)
  const movie = await getMovie(movieID, true)
  return renderView(res, 'detail', { title: movie.title, movie })
})

app.get('/search', async (req, res) => {
  const query = Array.isArray(req.query.q) ? req.query.q.join(' ') : req.query.q
  if (req.query.partial === 'true') {
    if (!query) {
      return renderPartial(res, 'results', { results: [] })
    }

    const result = await searchMovies(query)
    const movies = result?.results || []
    return renderPartial(res, 'results', { results: movies })
  } else {
    if (!query) {
      return renderView(res, 'search', { title: 'Zoeken', query, movies: [] })
    }

    const result = await searchMovies(query)
    const movies = result?.results || []
    return renderView(res, 'search', { title: 'Zoeken', query, movies })
  }
})

app.post('/chat', async (req, res) => {
  let status = 200
  const { name, message } = req.body
  if (name && message) {
    const result = await saveMessage(name, message)
    if (!result) status = 500
  }
  res.redirect('/chat', status)
})

app.get('/events', async (_, res) => {
  res.set({
    'Cache-Control': 'no-cache',
    'Content-Type': 'text/event-stream',
    Connection: 'keep-alive',
  })
  res.flushHeaders()

  res.write('retry: 10000\n\n')
  const messages = await getMessages()
  res.write(`data: ${JSON.stringify(messages)}\n\n`)
  listenForMessages((messages) => {
    res.write(`data: ${JSON.stringify(messages)}\n\n`)
  })
})

initWebPush()

app.get('/push/key', (_, res) => {
  res.send(process.env.VAPID_PUBLIC_KEY)
})

app.post('/push/subscribe', async (req, res) => {
  const result = await saveSubscription(req.body)
  if (result === true) res.sendStatus(201)
  else res.status(500).send(result)
})

app.post('/push/unsubscribe', async (req, res) => {
  const result = await deleteSubscription(req.body)
  if (result === true) res.sendStatus(201)
  else res.status(500).send(result)
})

app.post('/push/send', async (req, res) => {
  const result = await sendPushNotifications(
    req.body.subscription,
    req.body.payload,
    req.body.ttl,
    req.body.delay
  )

  if (result === true) res.sendStatus(201)
  else res.status(500).send(result)
})

app.listen(3000, () => console.log('Listening on http://localhost:3000'))
