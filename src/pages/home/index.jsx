import './style.css'
import { useRef, useState, useEffect } from 'react'
import { TbPhoto } from 'react-icons/tb'
import { BsArrowRepeat } from 'react-icons/bs'
import { MdMotionPhotosOn } from 'react-icons/md'
import { GiCheckMark } from 'react-icons/gi'
import { Link } from 'react-router-dom'
import { toast } from 'sonner'

const Home = ({ image, setImage }) => {
    const webcamRef = useRef(null);
    const imageRef = useRef(null);

    const [permissionState, setPermissionState] = useState('pending');
    const [capturing, setCapturing] = useState(true);
    const [action, setAction] = useState('');

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
        if (!file.type.includes('image/')) {
            return toast.error('Upload image file only!');
        };

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
            <div className='instruction__component'>
                <h2>Upload an Image</h2>
                <h3>or</h3>
                <h2>Allow access to capture Image</h2>
            </div>

            {capturing && (
                <div className='webcam__container' >
                    <video ref={webcamRef} autoPlay playsInline />
                </div>
            )}
            {image && (
                <div className='image__container'>
                    <img src={image} alt='Captured' />
                </div>
            )}

            <div style={{
                display: 'grid',
                gridTemplateColumns: `repeat(${permissionState === 'pending' ? image ? '2' : '1' : permissionState === 'granted' ? image ? '3' : '2' : permissionState === 'denied' && image ? '2' : '1'}, 1fr)`,
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
                {permissionState !== 'pending' && permissionState !== 'denied' && (
                    <button
                        className='capture-btn'
                        onClick={() => {
                            if (image) {
                                setImage(null);
                                setCapturing(true);
                            }
                            else captureImage()
                        }}
                    >
                        {image && action === 'capture' ? (
                            <BsArrowRepeat size={30} />
                        ) : (
                            <MdMotionPhotosOn size={30} />
                        )}
                    </button>
                )}
                {image && (
                    <Link
                        to='/details'
                        className='capture-btn proceed'
                    >
                        <GiCheckMark size={25} />
                    </Link>
                )}
            </div>
        </div >
    )
}

export default Home