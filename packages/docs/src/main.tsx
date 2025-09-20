import { StrictMode } from 'react'
import { createRoot, hydrateRoot } from 'react-dom/client'
import { Router } from 'waku/router/client'

const rootElement = (
  <StrictMode>
    <Router />
  </StrictMode>
)

if (globalThis.__WAKU_HYDRATE__) {
  hydrateRoot(document, rootElement)
} else {
  createRoot(document).render(rootElement)
}