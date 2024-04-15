'use strict'

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
 *
 * @param {Date} date Date
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
