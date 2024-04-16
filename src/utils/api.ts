import _fetch, { type RequestInit } from 'node-fetch'
import { normalizeURL } from './general'

/**
 * Fetches a URL with query parameters
 * @param url The URL
 * @param params The query parameters
 * @param options The fetch options
 * @returns The response
 */
const fetch = async (
  url: string,
  params: Record<string, any> = {},
  options?: RequestInit
) => {
  const query = new URLSearchParams(params).toString()
  return _fetch(`${url}?${query}`, options)
}

/**
 * Fetches a JSON response
 * @param base The base URL
 * @param url The relative URL
 * @param params The query parameters
 * @param options The fetch options
 * @returns The JSON response
 */
export const fetchJSON = async <T = unknown>(
  base: string,
  url: string,
  params: Record<string, any> = {},
  options?: RequestInit
) => {
  const response = await fetch(
    `${normalizeURL(base)}${url.replace(/\/+/g, '/')}`,
    params,
    options
  )
  return (await response.json()) as T
}
