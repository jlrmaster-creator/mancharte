type PWAState = {
  needRefresh: boolean
  offlineReady: boolean
}

type PWAListener = (state: PWAState) => void

let listeners: PWAListener[] = []
let state: PWAState = { needRefresh: false, offlineReady: false }
let swRegistration: ServiceWorkerRegistration | null = null

function notify() {
  listeners.forEach((l) => l(state))
}

export function onPWAStateChange(listener: PWAListener) {
  listeners.push(listener)
  listener(state)
  return () => {
    listeners = listeners.filter((l) => l !== listener)
  }
}

export function updateServiceWorker() {
  if (swRegistration?.waiting) {
    swRegistration.waiting.postMessage('SKIP_WAITING')
    window.location.reload()
  }
}

export function closePrompt() {
  state = { needRefresh: false, offlineReady: false }
  notify()
}

export function registerSW() {
  if (!('serviceWorker' in navigator)) return

  window.addEventListener('load', async () => {
    try {
      const reg = await navigator.serviceWorker.register('sw.js')
      swRegistration = reg

      if (reg.active) {
        state.offlineReady = true
        notify()
      }

      reg.addEventListener('updatefound', () => {
        const newWorker = reg.installing
        if (!newWorker) return

        newWorker.addEventListener('statechange', () => {
          if (newWorker.state === 'installed') {
            if (navigator.serviceWorker.controller) {
              state.needRefresh = true
              notify()
            } else {
              state.offlineReady = true
              notify()
            }
          }
        })
      })
    } catch {
      // SW registration failed, app works without it
    }
  })
}
