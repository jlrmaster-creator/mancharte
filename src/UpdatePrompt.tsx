import { useEffect, useState } from 'react'
import { onPWAStateChange, updateServiceWorker, closePrompt } from './pwa'

export function UpdatePrompt() {
  const [visible, setVisible] = useState(false)
  const [mode, setMode] = useState<'update' | 'offline'>('update')

  useEffect(() => {
    return onPWAStateChange((s) => {
      if (s.needRefresh) {
        setMode('update')
        setVisible(true)
      } else if (s.offlineReady) {
        setMode('offline')
        setVisible(true)
      }
    })
  }, [])

  if (!visible) return null

  return (
    <div className="fixed bottom-20 md:bottom-4 inset-x-4 z-50 flex justify-center">
      <div className="bg-gray-900 text-white px-5 py-3 rounded-xl shadow-xl flex items-center gap-4 max-w-sm w-full">
        <div className="flex-1 text-sm">
          {mode === 'update' ? (
            <p>
              Nueva versión disponible{' '}
              <span className="text-xs opacity-75">v{__APP_VERSION__}</span>
            </p>
          ) : (
            <p>App lista para usar sin conexión</p>
          )}
        </div>
        <div className="flex gap-2 shrink-0">
          {mode === 'update' ? (
            <>
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
            </>
          ) : (
            <button
              onClick={() => setVisible(false)}
              className="text-xs bg-white text-gray-900 font-medium px-3 py-1.5 rounded-lg hover:bg-gray-100"
            >
              OK
            </button>
          )}
        </div>
      </div>
    </div>
  )
}
