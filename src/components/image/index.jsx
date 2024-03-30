import './style.css'
import { useEffect } from 'react'
import { TbCaptureFilled, TbPhoto } from 'react-icons/tb'
import { BsArrowRepeat } from "react-icons/bs";

const ImageCapture = ({
    webcamRef, imageRef,
    capturing, setCapturing,
    image, setImage,
    permissionState, setPermissionState,
    action, setAction
}) => {

    useEffect(() => {
        if (capturing) {
            startWebcam();
        }
    }, [capturing]);

    const startWebcam = async () => {
        try {
            const stream = await navigator.mediaDevices.getUserMedia({
                video: { facingMode: "user" },
                audio: false,
            });
            webcamRef.current.srcObject = stream;
            setPermissionState('granted');
        } catch (err) {
            setPermissionState('denied');
        }
    };

    const stopWebcam = () => {
        if (webcamRef.current.srcObject) {
            webcamRef.current.srcObject.getTracks().forEach(track => track.stop());
            webcamRef.current.srcObject = null;
        }
    };

    const captureImage = () => {
        const canvas = document.createElement('canvas');
        canvas.width = webcamRef.current.videoWidth;
        canvas.height = webcamRef.current.videoHeight;
        const context = canvas.getContext('2d');
        context.drawImage(webcamRef.current, 0, 0);
        const imageData = canvas.toDataURL('image/png');
        setImage(imageData);
        setAction('capture');
        setCapturing(false);
        stopWebcam();
    };

    const selectImage = (event) => {
        const file = event.target.files[0];
        const reader = new FileReader();
        reader.onloadend = () => {
            setImage(reader.result);
            setAction('upload');
            setCapturing(false);
        };
        reader.readAsDataURL(file);
    };

    return (
        <div id='image'>
            <div className='main__container'>
                {permissionState === 'pending' ? (
                    <div className='pending__container'>
                        <video hidden ref={webcamRef} autoPlay playsInline />
                        <h1>Allow Camera Access</h1>
                    </div>
                ) : permissionState === 'granted' ? (
                    capturing ? (
                        <>
                            <div className='webcam__container' >
                                <video ref={webcamRef} autoPlay playsInline />
                            </div>
                            <button
                                onClick={captureImage}
                                className='capture-btn'
                            >
                                <TbCaptureFilled size={30} />
                            </button>
                        </>
                    ) : (
                        <>
                            <div className='image__container'>
                                <img src={image} alt="Captured" />
                            </div>
                            <button
                                className='capture-btn'
                                onClick={() => {
                                    if (action === 'capture') setCapturing(true);
                                    else if (action === 'upload') imageRef?.current.click();
                                }}
                            >
                                <BsArrowRepeat size={30} />
                                <input ref={imageRef} hidden type="file" onChange={selectImage} />
                            </button>
                        </>
                    )
                ) : (
                    <>
                        {image && (
                            <div className='image__container'>
                                <img src={image} alt="Captured" />
                            </div>
                        )}
                        <button
                            className={`${image ? 'capture-btn' : 'upload-btn'}`}
                            onClick={() => imageRef?.current.click()}
                        >
                            {image ? (
                                <>
                                    <BsArrowRepeat size={30} />
                                    <input ref={imageRef} hidden type="file" onChange={selectImage} />
                                </>
                            ) : (
                                <>
                                    <TbPhoto />
                                    <p>Upload</p>
                                    <input ref={imageRef} hidden type="file" onChange={selectImage} />
                                </>
                            )}
                        </button>
                    </>
                )}
            </div>
        </div >
    )
}

export default ImageCapture