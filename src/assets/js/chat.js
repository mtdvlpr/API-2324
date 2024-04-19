'use strict'

import { sendPushNotification } from './push'
import { sendNotification } from './notify'
import { formatDate } from './utils'
import { toast } from './toast'

// HTML elements
const chatForms = document.querySelectorAll('.chat-form')
const lists = document.querySelectorAll('[data-events]')
const drawer = document.querySelector('.chat-drawer')
const openBtn = document.querySelector('.chat-btn sl-icon-button')
const notifyBadge = document.querySelector('.new-chats')
const header = document.querySelector('header')

/**
 * Initializes the chat
 */
export const initChat = () => {
  if (!chatForms.length || !lists.length || !drawer || !openBtn) return

  initDrawer(drawer, openBtn)
  initListener(lists)
  initForms(chatForms)
}

/**
 * Initializes the chat drawer
 * @param {HTMLElement} drawer The drawer element
 * @param {HTMLButtonElement} openBtn The button that opens the drawer
 */
const initDrawer = (drawer, openBtn) => {
  header.classList.toggle('no-chat', false)
  header.insertBefore(document.createElement('div'), header.firstChild)

  openBtn.addEventListener('click', () => {
    drawer.show()
    setNrOfReadMessages(lists.item(0).children.length)
    notifyUser(notifyBadge, 0)
    scrollToBottom()
  })
}

/**
 * Scrolls to the bottom of the chat
 * @param {HTMLElement} el The element to scroll
 */
const scrollToBottom = async (el) => {
  await new Promise((resolve) => setTimeout(resolve, 100))
  if (el) {
    el.scrollTo(0, el.scrollHeight)
  } else {
    const body = document
      .querySelector('.chat-drawer')
      ?.shadowRoot?.querySelector('.drawer__body')
    if (body) {
      body.scrollTo(0, body.scrollHeight)
    }
  }
}

/**
 * Initializes the event listener for new messages
 * @param {HTMLUListElement[]} lists The list elements
 */
const initListener = (lists) => {
  const source = new EventSource('/events')
  source.addEventListener('message', (e) => {
    const messages = JSON.parse(e.data)
    notifyUser(notifyBadge, messages.length - getNrOfReadMessages())
    const pipWindow = window.documentPictureInPicture?.window
    if (pipWindow) {
      const ul = pipWindow.document.querySelector('ul')
      fillChat([ul], messages)
      scrollToBottom(ul)
    }

    fillChat(lists, messages)
    scrollToBottom()
  })
}

/**
 * Fills the list with chat messages
 * @param {HTMLUListElement[]} lists The list elements
 * @param {{name: string;timestamp: string;message:string}[]} messages The chat messages
 */
const fillChat = (lists, messages) => {
  if (lists.length) {
    lists.forEach((list) => {
      list.innerHTML = ''
    })
    messages.forEach((message) => {
      const li = document.createElement('li')
      li.innerHTML = `<b>[${formatDate(message.timestamp)}] ${message.name}</b>
      <p>${message.message}</p>`
      lists.forEach((list) => {
        list.appendChild(li.cloneNode(true))
      })
    })
  }
}

/**
 * Shows the number of unread messages
 * @param {HTMLElement} badge The badge element
 * @param {number} nrOfUnreadMessages The number of unread messages
 */
const notifyUser = async (badge, nrOfUnreadMessages) => {
  badge.textContent = nrOfUnreadMessages
  badge.style.display = nrOfUnreadMessages ? 'block' : 'none'

  if (window.navigator?.setAppBadge && nrOfUnreadMessages) {
    navigator.setAppBadge(nrOfUnreadMessages)
  } else if (window.navigator?.clearAppBadge && !nrOfUnreadMessages) {
    navigator.clearAppBadge()
  }

  if (nrOfUnreadMessages) {
    if (document.hasFocus()) {
      if (!drawer.open) {
        toast(
          'New message(s)',
          `You have ${nrOfUnreadMessages} unread message(s)`
        )
      }
    } else {
      sendNotification(
        'New message(s)',
        `You have ${nrOfUnreadMessages} unread message(s)`,
        [
          {
            action: 'openChat',
            title: 'Open chat',
          },
        ]
      )
    }
  }
}

/**
 * Initializes the form submit event
 * @param {HTMLFormElement[]} forms The form elements
 */
export const initForms = (forms) => {
  forms.forEach((form) => {
    form.addEventListener('submit', async (e) => {
      if (!form.checkValidity()) return

      try {
        e.preventDefault()
        const formData = new FormData(form)

        const name = formData.get('name')
        const message = formData.get('message')

        await fetch('/chat', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ name, message }),
        })
        form.reset()
        scrollToBottom()
        sendPushNotification(`New message from ${name}`, message)
      } catch (e) {
        console.error(e)
        toast('Could not send message', e.message, 'danger')
      }
    })
  })
}

let nrOfReadMessages = 0

/**
 * Gets the number of read messages
 * @returns {number} The number of read messages
 */
const getNrOfReadMessages = () => {
  if (window.localStorage) {
    nrOfReadMessages =
      parseInt(window.localStorage.getItem('nrOfReadMessages')) || 0
  }

  return nrOfReadMessages
}

/**
 * Sets the number of read messages
 * @param {number} nr The number of read messages
 */
const setNrOfReadMessages = (nr) => {
  nrOfReadMessages = nr
  if (window.localStorage) {
    window.localStorage.setItem('nrOfReadMessages', nr)
  }
}
