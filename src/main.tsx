import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router'
import './i18n'
import './index.css'
import App from './App.tsx'
import ThemeSync from './components/ThemeSync'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <BrowserRouter>
      <ThemeSync />
      <App />
    </BrowserRouter>
  </StrictMode>,
)
