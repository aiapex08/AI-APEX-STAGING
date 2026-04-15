import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { Toaster } from 'react-hot-toast'
import './index.css'
import './styles/naffco.css'
import App from './App.jsx'
import SalesForm from './pages/SalesForm.jsx'
import EstimatorReview from './pages/EstimatorReview.jsx'
import QuotationReady from './pages/QuotationReady.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
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
        {/* NAFFCO Quotation routes */}
        <Route path="/quotation" element={<SalesForm />} />
        <Route path="/quotation/review/:jobId" element={<EstimatorReview />} />
        <Route path="/quotation/done/:jobId" element={<QuotationReady />} />

        {/* Existing NAFFCO AI app — catch-all */}
        <Route path="*" element={<App />} />
      </Routes>
    </BrowserRouter>
  </StrictMode>,
)
