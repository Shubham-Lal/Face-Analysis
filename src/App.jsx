import './App.css'
import { useState } from 'react'
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import Navbar from './components/navbar'
import Home from './pages/home'
import Details from './pages/details'
import { Toaster } from 'sonner'

function App() {
  const [image, setImage] = useState(null);

  return (
    <>
      <Navbar />

      <BrowserRouter>
        <Routes>
          <Route path='/' element={<Home image={image} setImage={setImage} />} />
          <Route path='/details' element={image ? <Details image={image} /> : <Navigate to='/' />} />
        </Routes>
      </BrowserRouter>

      <Toaster
        position='top-center'
        duration={5000}
        richColors
      />
    </>
  );
}

export default App;