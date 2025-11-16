import { wordList } from '../BIP39.js'
import { reducer, getState } from '../state.js'

/** @param {number} numWords */
function generatePassphrase(numWords) {
  const randomWords = Array.from({ length: +numWords }, () => {
    const randIndex = Math.floor(Math.random() * wordList.length)
    return wordList[randIndex]
  })
  return randomWords.join('-')
}

reducer((action) => {
  if (action.type === 'GENERATE_BIP39_WORDS') {
    return {
      PASSPHRASE: generatePassphrase(getState('BIP39_NUM_WORDS'))
    }
  }

  if (action.type === 'SET_BIP39_NUM_WORDS') {
    return {
      PASSPHRASE: generatePassphrase(action.num)
    }
  }

  if (action.type === 'SET_CRYPT_DIRECTION') {
    if (action.direction === 'encrypt') {
      if (getState('USE_BIP39') && !getState('PASSPHRASE')) {
        return {
          PASSPHRASE: generatePassphrase(getState('BIP39_NUM_WORDS'))
        }
      }
    }
  }

  if (action.type === 'SET_USE_BIP39') {
    if (action.value) {
      return {
        PASSPHRASE: generatePassphrase(getState('BIP39_NUM_WORDS'))
      }
    } else {
      return { PASSPHRASE: '' }
    }
  }
})
