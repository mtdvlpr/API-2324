import 'vite/modulepreload-polyfill'
import '@styles/main.scss'
import { initShareAPI } from './share'
import { initSpeechAPI } from './speech'
import { initPWA } from './pwa'

initPWA()
initShareAPI()
initSpeechAPI()
