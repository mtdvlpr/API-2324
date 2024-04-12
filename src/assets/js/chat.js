import { formatDate } from './utils'

// HTML elements
const chatForm = document.getElementById('chat-form')
const list = document.querySelector('[data-events]')
const drawer = document.querySelector('.chat-drawer')
const openBtn = document.querySelector('.chat-btn sl-icon-button')
const notifyBadge = document.querySelector('.new-chats')
const header = document.querySelector('header')

// Global variables
let nrOfReadMessages = 0

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
    nrOfReadMessages = list.children.length
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
    const nrOfMessages = messages.length
    if (nrOfMessages > nrOfReadMessages) {
      setUnreadMessages(notifyBadge, nrOfMessages - nrOfReadMessages)
    }
    fillChat(list, messages)
  })
}

/**
 * Fills the list with chat messages
 * @param {HTMLUListElement} list The list element
 * @param {{name: string;timestamp: string;message:string}[]} messages The chat messages
 */
const fillChat = (list, messages) => {
  console.log('fillChat', messages)
  const nrOfMessages = messages.length
  if (nrOfMessages > nrOfReadMessages) {
    setUnreadMessages(notifyBadge, nrOfMessages - nrOfReadMessages)
  }
  if (list) {
    list.innerHTML = ''
    messages.forEach((message) => {
      const li = document.createElement('li')
      li.textContent = `[${formatDate(message.timestamp)}] ${message.name}: ${
        message.message
      }`
      list.appendChild(li)
    })
  }
}

/**
 * Sets the number of unread messages
 * @param {HTMLElement} badge The badge element
 * @param {number} nrOfUnreadMessages The number of unread messages
 */
const setUnreadMessages = (badge, nrOfUnreadMessages) => {
  badge.textContent = nrOfUnreadMessages
  badge.style.display = nrOfReadMessages ? 'block' : 'none'
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
        headers: {
          'Content-Type': 'application/json',
        },
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
