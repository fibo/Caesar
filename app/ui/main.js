import { initializeStateFromLocalStorage } from './webStorage.js'
import { initializeLanguage } from './i18n.js'
import { initializeStateDefaults } from './state.js'
import './elements/index.js'
import './reducers/common.js'
import './reducers/bip39.js'
import './reducers/electron.js'
import './reducers/splashScreen.js'

initializeStateDefaults()
initializeStateFromLocalStorage()
initializeLanguage()
