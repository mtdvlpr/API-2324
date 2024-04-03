import { App } from '@tinyhttp/app'
import { logger } from '@tinyhttp/logger'
import sirv from 'sirv'

import { getAbsolutePath, isProduction } from './utils/general'
import { renderTemplate } from './utils/renderer'

const app = new App()
app.use(logger())

if (isProduction) {
  app.use('/assets', sirv(getAbsolutePath('dist', 'assets')))
}

app.get('/', (_, res) => {
  return renderTemplate(res, 'index', { name: 'Liquid' })
})

app.listen(3000, () => console.log('Listening on http://localhost:3000'))
