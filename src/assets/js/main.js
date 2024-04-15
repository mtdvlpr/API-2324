'use strict'

import 'vite/modulepreload-polyfill'
import '@styles/main.scss'

import { initShareAPI } from './share'
import { initSpeechAPI } from './speech'
import { initPWA } from './pwa'
import { initChat } from './chat'
import { initNotificationAPI } from './notify'
import { initPushAPI } from './push'

initPWA()
initShareAPI()
initSpeechAPI()
initNotificationAPI()
initPushAPI()
initChat()
