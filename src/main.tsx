import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import './index.css'
import App from './App.tsx'
import { UpdatePrompt } from './UpdatePrompt.tsx'
import { registerSW } from './pwa.ts'

registerSW()

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <BrowserRouter basename="/mancharte">
      <App />
      <UpdatePrompt />
    </BrowserRouter>
  </StrictMode>,
)
