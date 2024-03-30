import './App.css'
import { useRef, useState } from 'react'
import ImageCapture from './components/image'
import Navbar from './components/navbar'

function App() {
  const webcamRef = useRef(null);
  const imageRef = useRef(null);

  const [permissionState, setPermissionState] = useState('pending');
  const [capturing, setCapturing] = useState(true);
  const [image, setImage] = useState(null);
  const [action, setAction] = useState("");

  return (
    <>
      <Navbar
        imageRef={imageRef}
        setCapturing={setCapturing}
        setImage={setImage}
        permissionState={permissionState}
        setAction={setAction}
      />
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
    </>
  );
}

export default App;