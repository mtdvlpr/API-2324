export const initSpeechAPI = () => {
  const SpeechRecognition =
    window.SpeechRecognition || window.webkitSpeechRecognition

  if (SpeechRecognition) {
    const voiceSearchBtn = document.querySelector('.voice-search')
    voiceSearchBtn.style.display = 'block'

    const output = document.getElementById('search-input')
    const recognition = new SpeechRecognition()
    recognition.continuous = false
    recognition.lang = 'en-US'
    recognition.interimResults = false
    recognition.maxAlternatives = 1

    recognition.onstart = () => {
      output.setAttribute('help-text', 'Start talking...')
    }

    recognition.onaudiostart = () => {
      output.setAttribute('help-text', 'Recording...')
    }

    recognition.onresult = (event) => {
      const result = event.results[0][0].transcript
      output.setAttribute(
        'value',
        result.endsWith('.') ? result.slice(0, -1) : result
      )
      output.focus()
    }

    recognition.onspeechend = () => {
      if (recognition) recognition.stop()
    }

    recognition.onend = () => {
      output.setAttribute('help-text', '')
    }

    voiceSearchBtn.addEventListener('click', () => {
      if (recognition) recognition.start()
    })
  }
}
