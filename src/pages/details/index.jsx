import './style.css';
import React, { useEffect, useState, useRef } from 'react';
import { Link } from 'react-router-dom';
import * as faceApi from 'face-api.js';

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
            const detections = await faceApi.detectAllFaces(canvas, new faceApi.TinyFaceDetectorOptions()).withFaceLandmarks().withFaceExpressions();
            if (detections.length > 0) {
              const face = detections[0];
              if (face.detection && face.detection.box) {
                const { width, height } = face.detection.box;

                const widthInCm = width * 0.0264583;
                const heightInCm = height * 0.0264583;
                const expression = face.expressions;

                setFaceDetails({ width: widthInCm, height: heightInCm });
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
    <>
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
          <Link to='/' className='go-back-link'>New Image</Link>
          <div id='details'>
            {faceDetails && (
              <div className='face-details'>
                <h2>Face Details</h2>
                <p>Face Width: {faceDetails.width.toFixed(2)} cm</p>
                <p>Face Height: {faceDetails.height.toFixed(2)} cm</p>
              </div>
            )}
            {expression && (
              <div className='face-expression'>
                <h2>Expression</h2>
                {Object.entries(expression).map(([key, value]) => (
                  <p key={key}>{key}: {value.toFixed(2)}</p>
                ))}
              </div>
            )}
          </div>
        </>
      )}
    </>
  );
};

export default Details;