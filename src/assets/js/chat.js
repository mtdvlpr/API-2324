'use strict'

import { sendPushNotification, getPushSubscription } from './push'
import { sendNotification } from './notify'
import { formatDate } from './utils'

// HTML elements
const chatForm = document.getElementById('chat-form')
const list = document.querySelector('[data-events]')
const drawer = document.querySelector('.chat-drawer')
const openBtn = document.querySelector('.chat-btn sl-icon-button')
const notifyBadge = document.querySelector('.new-chats')
const header = document.querySelector('header')

export const initChat = () => {
  if (!chatForm || !list || !drawer || !openBtn) return

  initDrawer(drawer, openBtn)
  initListener(list)
  initForm(chatForm)
}

/**
 * Initializes the chat drawer
 * @param {*} drawer The drawer element
 * @param {HTMLButtonElement} openBtn The button that opens the drawer
 */
const initDrawer = (drawer, openBtn) => {
  header.classList.toggle('no-chat', false)
  header.insertBefore(document.createElement('div'), header.firstChild)

  openBtn.addEventListener('click', () => {
    drawer.show()
    setNrOfReadMessages(list.children.length)
    notifyUser(notifyBadge, 0)
  })
}

/**
 * Initializes the event listener for new messages
 * @param {HTMLUListElement} list The list element
 */
const initListener = (list) => {
  const source = new EventSource('/events')
  source.addEventListener('message', (e) => {
    const messages = JSON.parse(e.data)
    notifyUser(notifyBadge, messages.length - getNrOfReadMessages())
    fillChat(list, messages)
  })
}

/**
 * Fills the list with chat messages
 * @param {HTMLUListElement} list The list element
 * @param {{name: string;timestamp: string;message:string}[]} messages The chat messages
 */
const fillChat = (list, messages) => {
  if (list) {
    list.innerHTML = ''
    messages.forEach((message) => {
      const li = document.createElement('li')
      li.innerHTML = `<b>[${formatDate(message.timestamp)}] ${message.name}</b>
      <p>${message.message}</p>`
      list.appendChild(li)
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

  if (nrOfUnreadMessages /* && !document.hasFocus()*/) {
    const subscription = await getPushSubscription()
    if (subscription)
      sendPushNotification(
        'New message(s)',
        `You have ${nrOfUnreadMessages} unread message(s)`
      )
    else
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

/**
 * Initializes the form submit event
 * @param {HTMLFormElement} form The form element
 */
const initForm = (form) => {
  form.addEventListener('submit', async (e) => {
    try {
      e.preventDefault()
      const formData = new FormData(form)
      await fetch('/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: formData.get('name'),
          message: formData.get('message'),
        }),
      })
      form.reset()
    } catch (e) {
      console.error(e)
    }
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