import './style.css'
import React, { useEffect, useState, useRef } from 'react'
import { Link } from 'react-router-dom'
import * as faceApi from 'face-api.js'

const Details = ({ image }) => {
  const canvasRef = useRef(null);

  const [statusMessage, setStatusMessage] = useState("Analyzing image...");
  const [error, setError] = useState(null);

  const [faceDetails, setFaceDetails] = useState(null);
  const [expression, setExpression] = useState(null);

  useEffect(() => {
    if (image) {
      const analyzeImage = async () => {
        const img = new Image();
        img.src = image;
        img.onload = async () => {
          const canvas = canvasRef.current;
          canvas.width = img.width;
          canvas.height = img.height;
          const context = canvas.getContext('2d');
          context.drawImage(img, 0, 0, img.width, img.height);

          try {
            const detections = await faceApi.detectAllFaces(canvas, new faceApi.TinyFaceDetectorOptions()).withFaceLandmarks().withFaceExpressions().withAgeAndGender();
            if (detections.length > 0) {
              const face = detections[0];
              if (face.detection && face.detection.box) {
                const { width, height } = face.detection.box;

                const widthInCm = width * 0.0264583;
                const heightInCm = height * 0.0264583;
                const expression = face.expressions;

                setFaceDetails({ width: widthInCm, height: heightInCm, age: face.age, gender: face.gender });
                setExpression(expression);

                faceApi.draw.drawFaceLandmarks(canvas, detections);
                faceApi.draw.drawFaceExpressions(canvas, detections);

                setStatusMessage("");
              } else {
                throw new Error('Face detection did not return a box property for the face.');
              }
            } else {
              throw new Error('No face detected in the image.');
            }
          } catch (error) {
            setError(error.message);
          }
        };
      };

      analyzeImage();
    }
  }, [image]);

  if (error) {
    return <div id='loading'>
      <h2>{error}</h2>
      <Link to='/' className='go-back-link'>Go Back</Link>
    </div>
  }
  return (
    <div id='details-container'>
      <canvas
        ref={canvasRef}
        className='canvas-img'
        style={{ display: statusMessage !== '' ? 'none' : 'block' }}
      />

      {statusMessage !== '' ? (
        <div id='loading'>
          <h2>{statusMessage}</h2>
          <Link to='/' className='go-back-link'>Go Back</Link>
        </div>
      ) : (
        <>
          <Link to='/' className='go-back-link'>Upload new Image</Link>
          <div id='details-wrapper'>
            {faceDetails && (
              <div className='face-analyze'>
                <h2>Face Details</h2>
                <p>Width: {faceDetails.width.toFixed(2)} cm</p>
                <p>Height: {faceDetails.height.toFixed(2)} cm</p>
                <p>Age: {faceDetails.age.toFixed(0)}</p>
                <p>Gender: {faceDetails.gender.charAt(0).toUpperCase() + faceDetails.gender.slice(1)}</p>
              </div>
            )}
            {expression && (
              <div className='face-analyze'>
                <h2>Expression</h2>
                {Object.entries(expression).map(([key, value]) => (
                  <p key={key}>{key.charAt(0).toUpperCase() + key.slice(1)}: {value.toFixed(5)}</p>
                ))}
              </div>
            )}
          </div>
        </>
      )}
    </div>
  );
};

export default Details;