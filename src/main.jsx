// src/main.jsx
import React from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'

import App from './App.jsx'
import './index.css'
import './App.css'

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    {/* Wrap your whole app in a Router so useNavigate, useLocation, etc. work */}
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </React.StrictMode>
)

