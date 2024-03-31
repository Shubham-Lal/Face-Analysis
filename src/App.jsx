import './App.css';
import { useState, useEffect } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import * as faceApi from 'face-api.js';
import Home from './pages/home';
import Details from './pages/details';

async function loadModels() {
  await faceApi.nets.ssdMobilenetv1.loadFromUri('/models');
  await faceApi.nets.faceLandmark68Net.loadFromUri('/models');
  await faceApi.nets.faceExpressionNet.loadFromUri('/models');
  await faceApi.nets.tinyFaceDetector.loadFromUri('/models');
}

function App() {
  const [modelsLoaded, setModelsLoaded] = useState(false);

  const [permissionState, setPermissionState] = useState('pending');
  const [capturing, setCapturing] = useState(true);
  const [image, setImage] = useState(null);
  const [action, setAction] = useState('');

  useEffect(() => {
    loadModels().then(() => setModelsLoaded(true));
  }, []);

  if (!modelsLoaded) {
    return <div id='loading'><h2>Loading models...</h2></div>;
  }
  return (
    <BrowserRouter>
      <Routes>
        <Route path='/' element={
          <Home
            permissionState={permissionState} setPermissionState={setPermissionState}
            capturing={capturing} setCapturing={setCapturing}
            image={image} setImage={setImage}
            action={action} setAction={setAction}
          />
        } />
        <Route path='/details' element={
          image ? <Details image={image} /> : <Navigate to='/' />
        } />
      </Routes>
    </BrowserRouter>
  );
}

export default App;