import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { Toaster } from 'react-hot-toast'
import './index.css'
import App from './App.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
    {/* Toast notifications (beddelka alert-yadii hore) */}
    <Toaster
      position="top-right"
      toastOptions={{
        duration: 3500,
        style: {
          borderRadius: '12px',
          background: '#001A52',
          color: '#fff',
          fontSize: '14px',
          fontWeight: 500,
        },
        success: { iconTheme: { primary: '#0057FF', secondary: '#fff' } },
        error: { iconTheme: { primary: '#EF4444', secondary: '#fff' } },
      }}
    />
  </StrictMode>,
)
