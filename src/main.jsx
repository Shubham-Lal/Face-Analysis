import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import Navbar from './components/navbar/index.jsx'
import { Toaster } from 'sonner'

ReactDOM.createRoot(document.getElementById('root')).render(
    <>
        <Navbar />
        <App />
        <Toaster
            position='top-center'
            duration={5000}
            richColors
        />
    </>
)