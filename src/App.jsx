import './App.css'
import { useRef, useState } from 'react'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import ImageCapture from './components/image'
import Navbar from './components/navbar'

function App() {
  const webcamRef = useRef(null);
  const imageRef = useRef(null);

  const [permissionState, setPermissionState] = useState('pending');
  const [capturing, setCapturing] = useState(true);
  const [image, setImage] = useState(null);
  const [action, setAction] = useState('');

  return (
    <>
      <Navbar />
      
      <BrowserRouter>
        <Routes>
          <Route path='/' element={
            <ImageCapture
              webcamRef={webcamRef}
              imageRef={imageRef}
              capturing={capturing}
              setCapturing={setCapturing}
              image={image}
              setImage={setImage}
              permissionState={permissionState}
              setPermissionState={setPermissionState}
              action={action}
              setAction={setAction}
            />
          } />
        </Routes>
      </BrowserRouter>
    </>
  );
}

export default App;