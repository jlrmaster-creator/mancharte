import { useEffect, useState } from 'react'
import { onPWAStateChange, updateServiceWorker, closePrompt } from './pwa'

export function UpdatePrompt() {
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    return onPWAStateChange((s) => {
      if (s.needRefresh) setVisible(true)
    })
  }, [])

  if (!visible) return null

  return (
    <div className="fixed bottom-20 md:bottom-4 inset-x-4 z-50 flex justify-center">
      <div className="bg-gray-900 text-white px-5 py-3 rounded-xl shadow-xl flex items-center gap-4 max-w-sm w-full">
        <div className="flex-1 text-sm">
          <p>
            Nueva versión disponible{' '}
            <span className="text-xs opacity-75">v{__APP_VERSION__}</span>
          </p>
        </div>
        <div className="flex gap-2 shrink-0">
          <button
            onClick={() => { setVisible(false); closePrompt() }}
            className="text-xs text-gray-300 hover:text-white px-2 py-1"
          >
            Cerrar
          </button>
          <button
            onClick={updateServiceWorker}
            className="text-xs bg-white text-gray-900 font-medium px-3 py-1.5 rounded-lg hover:bg-gray-100"
          >
            Actualizar
          </button>
        </div>
      </div>
    </div>
  )
}
