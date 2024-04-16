'use strict'

import 'https://cdn.jsdelivr.net/npm/@shoelace-style/shoelace@2.15.0/cdn/components/alert/alert.js'
import { escapeHTML } from './utils'

/**
 * Sends a toast message to the user
 * @param {string} message The message
 * @param {string} title The title
 * @param {'primary' | 'success' | 'neutral' | 'warning' | 'danger'} variant The variant
 * @param {number} duration The duration in milliseconds
 * @returns
 */
export const toast = (
  message,
  title = '',
  variant = 'primary',
  duration = 3000
) => {
  const alert = Object.assign(document.createElement('sl-alert'), {
    variant,
    duration,
    closable: true,
    innerHTML: `
        <sl-icon name="${getVariantIcon(variant)}" slot="icon"></sl-icon>
        <strong style="display: ${title ? 'block' : 'none'}">${escapeHTML(
      title
    )}</strong>
        ${escapeHTML(message)}
      `,
  })

  document.body.append(alert)
  return alert.toast()
}

/**
 * Gets the appropriate icon for the variant
 * @param {'primary' | 'success' | 'neutral' | 'warning' | 'danger'} variant The variant
 * @returns
 */
const getVariantIcon = (variant) => {
  switch (variant) {
    case 'success':
      return 'check2-circle'
    case 'warning':
      return 'exclamation-triangle'
    case 'danger':
      return 'exclamation-octagon'
    default:
      return 'info-circle'
  }
}
