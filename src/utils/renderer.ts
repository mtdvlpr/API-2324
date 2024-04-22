import { Liquid } from 'liquidjs'
import { readFileSync } from 'fs'

import { getAbsolutePath, isProduction } from './general'
import { type Response } from '@tinyhttp/app'

const engine = new Liquid({
  extname: '/template.liquid',
  root: getAbsolutePath('src'),
  layouts: getAbsolutePath('src/layouts'),
  partials: getAbsolutePath('src/components'),
  globals: {
    isDev: !isProduction,
    tmdbAssetUrl: 'https://image.tmdb.org/t/p',
  },
})

export const renderView = (
  res: Response,
  template: string,
  data: { title: string } & Record<string, any>
) => {
  const templateData = {
    ...data,
  }

  if (isProduction) {
    templateData['manifest'] = JSON.parse(
      readFileSync(getAbsolutePath('dist', '.vite', 'manifest.json'), 'utf-8')
    )
  }

  return res.send(
    engine.renderFileSync(`views/${template}/template.liquid`, templateData)
  )
}

export const renderPartial = (
  res: Response,
  component: string,
  data: Record<string, any>
) => {
  return res.send(
    engine.renderFileSync(`components/${component}/template.liquid`, data)
  )
}
