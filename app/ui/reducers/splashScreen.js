import { reducer, getState } from '../state.js'

reducer((action) => {
  if (action.type === 'FONT_LOADED') {
    const initialized = getState('INITIALIZED')

    if (!initialized) {
      // Remove splash screen.
      const splashScreen = document.getElementById('splash-screen')
      const start = +splashScreen.dataset.start
      const minSplashTime = 1771 + Math.floor(Math.random() * 1771)
      setTimeout(
        () => {
          splashScreen.remove()
        },
        Math.max(0, minSplashTime - (performance.now() - start))
      )
    }

    return { INITIALIZED: true }
  }
})
