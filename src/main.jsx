import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { ImportacionProvider } from './context/ImportacionProvider'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <ImportacionProvider>
      <App />
    </ImportacionProvider>
  </StrictMode>,
)