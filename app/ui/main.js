import { initializeStateFromLocalStorage } from './webStorage.js'
import { initializeLanguage } from './i18n.js'
import { initializeStateDefaults } from './state.js'
import './elements/index.js'

initializeStateDefaults()
initializeStateFromLocalStorage()
initializeLanguage()
