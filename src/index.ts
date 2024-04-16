import 'dotenv/config'
import { App } from '@tinyhttp/app'
import { logger } from '@tinyhttp/logger'
import sirv from 'sirv'
import parser from 'body-parser'

import { getAbsolutePath, isProduction } from './utils/general'
import { renderView } from './utils/renderer'
import { getMovie, getPopularMovies, searchMovies } from './utils/tmdb'
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

app.get('/chat', (_, res) => {
  return renderView(res, 'chat', { title: 'Chat' })
})

app.post('/chat', async (req, res) => {
  const { name, message } = req.body
  if (name && message) {
    await saveMessage(name, message)
  }
  res.redirect('/chat')
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
  if (result) res.sendStatus(201)
  else res.sendStatus(500)
})

app.post('/push/unsubscribe', async (req, res) => {
  const result = await deleteSubscription(req.body)
  if (result) res.sendStatus(201)
  else res.sendStatus(500)
})

app.post('/push/send', async (req, res) => {
  const result = await sendPushNotifications(
    req.body.subscription,
    req.body.payload,
    req.body.ttl,
    req.body.delay
  )

  if (result) res.sendStatus(201)
  else res.sendStatus(500)
})

app.post('/sw/log', (req, res) => {
  console.log('Service Worker log:', req.body)
  res.sendStatus(200)
})

app.listen(3000, () => console.log('Listening on http://localhost:3000'))
