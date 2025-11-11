import { reducer } from '../state.js'

reducer((action) => {
  if (action.type === 'CLEAR_PASSPHRASE') {
    return { PASSPHRASE: '' }
  }

  if (action.type === 'CLEAR_INPUT_FILES') {
    return { INPUT_FILES: [] }
  }

  if (action.type === 'SET_BIP39_NUM_WORDS') {
    return { BIP39_NUM_WORDS: action.num }
  }

  if (action.type === 'SET_CRYPT_DIRECTION') {
    return {
      CRYPT_DIRECTION: action.direction,
      INPUT_FILES: []
    }
  }

  if (action.type === 'SET_LANGUAGE') {
    return { LANGUAGE: action.language }
  }

  if (action.type === 'SET_PASSPHRASE') {
    return { PASSPHRASE: action.passphrase }
  }

  if (action.type === 'SET_USE_BIP39') {
    return { USE_BIP39: action.value }
  }
})
