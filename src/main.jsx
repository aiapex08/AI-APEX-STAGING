import { createRoot } from 'react-dom/client'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { Toaster } from 'react-hot-toast'
import './index.css'
import './styles/naffco.css'
import App from './App.jsx'

createRoot(document.getElementById('root')).render(
  <BrowserRouter>
    <Toaster
      position="top-right"
      toastOptions={{
        style: {
          background: '#1e1e1e',
          color: '#e8e6e3',
          border: '1px solid #2a2a2a',
          borderRadius: '10px',
        },
      }}
    />
    <Routes>
      <Route path="*" element={<App />} />
    </Routes>
  </BrowserRouter>,
)
