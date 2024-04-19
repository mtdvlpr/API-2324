'use strict'

/**
 * Formats a date to a readable format
 * @param {string} timestamp A timestamp
 * @returns The formatted date string
 */
export const formatDate = (timestamp) => {
  const date = new Date(timestamp)
  if (new Date().toDateString() === date.toDateString()) {
    return formatTimeAgo(date)
  } else {
    return Intl.DateTimeFormat('nl-NL', {
      dateStyle: 'short',
      timeStyle: 'short',
    }).format(new Date(timestamp))
  }
}

/**
 * Formats a date to a relative time
 * @param {Date} date The date
 */
export const formatTimeAgo = (date) => {
  const diff = date.getTime() - new Date().getTime()
  const seconds = Math.round(diff / 1000)
  const minutes = Math.round(diff / 1000 / 60)
  const hours = Math.round(diff / 1000 / 60 / 60)
  let output = [seconds, 'seconds']
  if (minutes <= -1) {
    output = [minutes, 'minutes']
  }
  if (hours <= -1) {
    output = [hours, 'hours']
  }
  return new Intl.RelativeTimeFormat('en-US', {
    numeric: 'auto',
  }).format(output[0], output[1])
}

/**
 * Converts a base64 string to a Uint8Array
 * @param {string} base64String The base64 string
 * @returns {Uint8Array} The Uint8Array
 */
export const urlBase64ToUint8Array = (base64String) => {
  var padding = '='.repeat((4 - (base64String.length % 4)) % 4)
  var base64 = (base64String + padding).replace(/-/g, '+').replace(/_/g, '/')

  var rawData = window.atob(base64)
  var outputArray = new Uint8Array(rawData.length)

  for (var i = 0; i < rawData.length; ++i) {
    outputArray[i] = rawData.charCodeAt(i)
  }
  return outputArray
}

/**
 * Escapes HTML characters in a string
 * @param {string} html The HTML string
 * @returns The escaped HTML string
 */
export const escapeHTML = (html) => {
  const div = document.createElement('div')
  div.textContent = html
  return div.innerHTML
}
