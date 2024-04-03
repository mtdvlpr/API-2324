import { Liquid } from 'liquidjs'
import { readFileSync } from 'fs'

import { getAbsolutePath, isProduction } from './general'
import { Response } from '@tinyhttp/app'

const engine = new Liquid({
  extname: '.liquid',
  root: getAbsolutePath('src'),
})

export const renderTemplate = (
  res: Response<unknown>,
  template: string,
  data: Record<string, any>
) => {
  const templateData = {
    ...data,
    isDev: !isProduction,
  }

  if (isProduction) {
    templateData['manifest'] = JSON.parse(
      readFileSync(getAbsolutePath('dist', '.vite', 'manifest.json'), 'utf-8')
    )
  }

  return res.send(
    engine.renderFileSync(`views/${template}.liquid`, templateData)
  )
}
