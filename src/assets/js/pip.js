'use strict'

import { initForms } from './chat'

const pipBtn = document.querySelector('.pip')
const chatBox = document.querySelector('body > .chat-box')

/**
 * Initializes the Document Picture-in-Picture API
 */
export const initDocumentPictureInPicture = () => {
  if (!window.documentPictureInPicture) return
  pipBtn.classList.toggle('no-pip', false)
  pipBtn.addEventListener('click', toggleDocumentPictureInPicture)
}

/**
 * Toggles the Document Picture-in-Picture mode
 */
const toggleDocumentPictureInPicture = async () => {
  if (!window.documentPictureInPicture) return

  // If Picture-in-Picture is enabled, close the window
  if (window.documentPictureInPicture.window) {
    document.querySelector('.chat-btn sl-icon-button').click()
    await window.documentPictureInPicture.window.close()
  } else {
    /**
     * @type {Window} The Picture-in-Picture window
     */
    const pipWindow = await window.documentPictureInPicture.requestWindow({
      width: 500,
      height: 700,
    })

    // When the Picture-in-Picture window is closed, activate the chat in the main window
    pipWindow.addEventListener('pagehide', () => {
      document.querySelector('.chat-btn sl-icon-button').click()
    })

    // Copy the styles and scripts to the Picture-in-Picture window
    ;[...document.styleSheets].forEach((styleSheet) => {
      try {
        const cssRules = [...styleSheet.cssRules]
          .map((rule) => rule.cssText)
          .join('')
        const style = document.createElement('style')

        style.textContent = cssRules
        pipWindow.document.head.appendChild(style)
      } catch (e) {
        const link = document.createElement('link')

        link.rel = 'stylesheet'
        link.type = styleSheet.type
        link.media = styleSheet.media
        link.href = styleSheet.href
        pipWindow.document.head.appendChild(link)
      }
    })
    ;[...document.scripts].forEach((script) => {
      pipWindow.document.head.appendChild(script)
    })

    // Set the theme based on the user's preference
    const prefersDark = window.matchMedia(
      '(prefers-color-scheme: dark)'
    ).matches

    pipWindow.document
      .querySelector('html')
      .classList.toggle(`sl-theme-${prefersDark ? 'dark' : 'light'}`, true)
    pipWindow.document
      .querySelector('html')
      .classList.toggle(`sl-theme-${prefersDark ? 'light' : 'dark'}`, false)

    // Copy the chat to the Picture-in-Picture window
    const main = document.createElement('main')
    main.appendChild(chatBox)
    pipWindow.document.body.append(main)
    initForms(pipWindow.document.querySelectorAll('form'))

    document.querySelector('.chat-drawer')?.hide()

    // Scroll to the bottom of the chat
    await new Promise((resolve) => setTimeout(resolve, 100))
    const ul = pipWindow.document.querySelector('ul')
    ul.scrollTo(0, ul.scrollHeight)
  }
}
