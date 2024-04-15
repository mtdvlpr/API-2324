import { join } from 'path'

export const PRODUCTION_URL = 'https://api-2324.onrender.com/'

export const isProduction =
  (process.env.NODE_ENV || 'production') === 'production'

export const getAbsolutePath = (...path: string[]) =>
  join(process.cwd(), ...path)

export const normalizeURL = (url: string) =>
  url.endsWith('/') ? url : `${url}/`
