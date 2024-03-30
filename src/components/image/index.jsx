import './style.css'
import { useEffect } from 'react'
import { TbPhoto } from 'react-icons/tb'
import { BsArrowRepeat } from 'react-icons/bs';
import { MdMotionPhotosOn } from 'react-icons/md';
import { GiCheckMark } from "react-icons/gi";

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
                video: { facingMode: 'user' },
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
                            <div style={{
                                display: 'grid',
                                gridTemplateColumns: 'repeat(2, 1fr)',
                                gap: '10px'
                            }}>
                                <button
                                    className='capture-btn upload'
                                    onClick={() => imageRef?.current.click()}
                                >
                                    <TbPhoto size={30} />
                                    <input
                                        ref={imageRef}
                                        type='file'
                                        accept='image/*'
                                        onChange={selectImage}
                                        hidden
                                    />
                                </button>
                                <button
                                    onClick={captureImage}
                                    className='capture-btn'
                                >
                                    <MdMotionPhotosOn size={30} />
                                </button>
                            </div>
                        </>
                    ) : (
                        <>
                            <div className='image__container'>
                                <img src={image} alt='Captured' />
                            </div>
                            <div style={{
                                display: 'grid',
                                gridTemplateColumns: 'repeat(3, 1fr)',
                                gap: '10px'
                            }}>
                                <input
                                    ref={imageRef}
                                    type='file'
                                    accept='image/*'
                                    onChange={selectImage}
                                    hidden
                                />
                                <button
                                    className='capture-btn upload'
                                    onClick={() => imageRef?.current.click()}
                                >
                                    {image && action === 'upload' ? (
                                        <BsArrowRepeat size={30} />
                                    ) : (
                                        <TbPhoto size={30} />
                                    )}
                                </button>
                                <button
                                    className='capture-btn'
                                    onClick={() => setCapturing(true)}
                                >
                                    {image && action === 'capture' ? (
                                        <BsArrowRepeat size={30} />
                                    ) : (
                                        <MdMotionPhotosOn size={30} />
                                    )}
                                </button>
                                <button
                                    className='capture-btn proceed'
                                >
                                    <GiCheckMark size={25} />
                                </button>
                            </div>
                        </>
                    )
                ) : (
                    <>
                        {image && (
                            <div className='image__container'>
                                <img src={image} alt='Captured' />
                            </div>
                        )}
                        <div style={{
                            display: 'grid',
                            gridTemplateColumns: `repeat(${image ? '2' : '1'}, 1fr)`,
                            gap: '10px'
                        }}>
                            <button
                                className={`${image ? 'capture-btn' : 'upload-btn'}`}
                                onClick={() => imageRef?.current.click()}
                            >
                                {image ? (
                                    <>
                                        <BsArrowRepeat size={30} />
                                        <input
                                            ref={imageRef}
                                            type='file'
                                            accept='image/*'
                                            onChange={selectImage}
                                            hidden
                                        />
                                    </>
                                ) : (
                                    <>
                                        <TbPhoto />
                                        <p>Upload</p>
                                        <input
                                            ref={imageRef}
                                            type='file'
                                            accept='image/*'
                                            onChange={selectImage}
                                            hidden
                                        />
                                    </>
                                )}
                            </button>
                            {image && (
                                <button
                                    className='capture-btn'
                                >
                                    <GiCheckMark size={25} />
                                </button>
                            )}
                        </div>
                    </>
                )}
            </div>
        </div >
    )
}

export default ImageCapture