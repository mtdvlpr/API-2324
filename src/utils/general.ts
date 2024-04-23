import { join } from 'path'

export const PRODUCTION_URL = 'https://api-2324.onrender.com/'

export const isProduction =
  (process.env.NODE_ENV || 'production') === 'production'

/**
 * Gets the absolute path of a file
 * @param path The path
 * @returns The absolute path
 */
export const getAbsolutePath = (...path: string[]) =>
  join(process.cwd(), ...path)

/**
 * Normalizes a URL
 * @param url The URL
 * @returns The normalized URL
 */
export const normalizeURL = (url: string) =>
  url.endsWith('/') ? url : `${url}/`
