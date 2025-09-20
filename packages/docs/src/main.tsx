import { StrictMode } from 'react'
import { createRoot, hydrateRoot } from 'react-dom/client'
import { Router } from 'waku/router/client'
import './styles/globals.css'

declare global {
  var __WAKU_HYDRATE__: boolean | undefined
}

const rootElement = (
  <StrictMode>
    <Router />
  </StrictMode>
)

const container = document.getElementById('root')

if (globalThis.__WAKU_HYDRATE__ && container) {
  hydrateRoot(container, rootElement)
} else if (container) {
  createRoot(container).render(rootElement)
}