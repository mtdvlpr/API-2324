import { App } from '@tinyhttp/app'
import { logger } from '@tinyhttp/logger'
import { Liquid } from 'liquidjs'
import sirv from 'sirv'
import path from 'path'
import fs from 'fs'

const app = new App()
app.use(logger())

const isProduction = (process.env.NODE_ENV || 'production') === 'production'

if (isProduction) {
  app.use('/assets', sirv(path.join(process.cwd(), 'dist', 'assets')))
}

const engine = new Liquid({
  extname: '.liquid',
  root: path.join(process.cwd(), 'src'),
})

const renderTemplate = (template: string, data: any) => {
  const templateData = {
    ...data,
    isDev: !isProduction,
  }

  if (isProduction) {
    templateData['manifest'] = JSON.parse(
      fs.readFileSync(
        path.join(process.cwd(), 'dist', '.vite', 'manifest.json'),
        'utf-8'
      )
    )
  }

  return engine.renderFileSync(template, templateData)
}

app.get('/', (_, res) => {
  return res.send(renderTemplate('views/index.liquid', { name: 'Liquid' }))
})

app.listen(3000, () => console.log('Server started on http://localhost:3000'))

module.exports = app
