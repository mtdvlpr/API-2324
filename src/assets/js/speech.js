'use strict'

import { toast } from './toast'

const voiceSearchBtn = document.querySelector('.voice-search')

/**
 * Initializes the speech API
 */
export const initSpeechAPI = () => {
  if (!voiceSearchBtn) return
  const SpeechRecognition =
    window.SpeechRecognition || window.webkitSpeechRecognition

  if (SpeechRecognition) {
    voiceSearchBtn.style.display = 'block'

    const output = document.getElementById('search-input')
    const recognition = new SpeechRecognition()

    // Set the SpeechRecognition properties
    recognition.continuous = false
    recognition.lang = 'en-US'
    recognition.interimResults = false
    recognition.maxAlternatives = 1

    // When the speech recognition starts, show a message
    recognition.onstart = () => {
      output.setAttribute('help-text', 'Start talking...')
    }

    // When a voice is recognized, show a message
    recognition.onaudiostart = () => {
      output.setAttribute('help-text', 'Recording...')
    }

    // When the speech recognition ends, set the value of the input
    recognition.onresult = (event) => {
      const result = event.results[0][0].transcript
      output.setAttribute(
        'value',
        result.endsWith('.') ? result.slice(0, -1) : result
      )
      output.focus()
    }

    // When no voice is detected anymore, stop the recognition
    recognition.onspeechend = () => {
      if (recognition) recognition.stop()
    }

    // When the speech recognition ends, clear the help text
    recognition.onend = () => {
      output.setAttribute('help-text', '')
    }

    // When an error occurs, log the error
    recognition.onerror = (e) => {
      console.error(e)
      toast('Could not recognize speech', e.message || e.error, 'danger')
    }

    // Start the speech recognition when the button is clicked
    voiceSearchBtn.addEventListener('click', () => {
      if (recognition) recognition.start()
    })
  }
}
