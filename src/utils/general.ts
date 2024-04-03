import { join } from 'path'

export const isProduction =
  (process.env.NODE_ENV || 'production') === 'production'

export const getAbsolutePath = (...path: string[]) =>
  join(process.cwd(), ...path)
