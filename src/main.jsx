import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
// Tipografías propias (autoalojadas con Fontsource, licencia OFL): no se piden a servidores
// de Google, así que no se les envía la IP de quien visita el sitio.
import '@fontsource/instrument-serif/400.css'
import '@fontsource/instrument-serif/400-italic.css'
import '@fontsource-variable/instrument-sans/wght.css'
import '@fontsource-variable/instrument-sans/wght-italic.css'
import '@fontsource/dm-mono/400.css'
import '@fontsource/dm-mono/500.css'
import './styles/index.css'

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
)
