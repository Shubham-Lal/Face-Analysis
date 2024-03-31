import './style.css'
import { useRef, useEffect } from 'react'
import { TbPhoto } from 'react-icons/tb'
import { BsArrowRepeat } from 'react-icons/bs'
import { MdMotionPhotosOn } from 'react-icons/md'
import { GiCheckMark } from 'react-icons/gi'
import { Link } from 'react-router-dom'
import { toast } from 'sonner'

const Home = ({
    permissionState, setPermissionState,
    capturing, setCapturing,
    image, setImage,
    action, setAction
}) => {
    const webcamRef = useRef(null);
    const imageRef = useRef(null);

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

        new Audio('/shutter.mp3').play();
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
            {!image && (
                <div className='instruction__component'>
                    <h2>Upload an Image</h2>
                    <h3
                        style={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: '10px'
                        }}
                    >
                        <div style={{ width: '100px', height: '2px', backgroundColor: '#212122' }} />
                        or
                        <div style={{ width: '100px', height: '2px', backgroundColor: '#212122' }} />
                    </h3>
                    <h2>Allow access to capture Image</h2>
                </div>
            )}

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
                    multiple={false}
                    onChange={selectImage}
                    hidden
                />
                <button
                    className='capture-btn upload'
                    onClick={() => imageRef?.current.click()}
                >
                    {image && action === 'upload' ? (
                        <BsArrowRepeat size={25} />
                    ) : (
                        <TbPhoto size={25} />
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
                            <BsArrowRepeat size={25} />
                        ) : (
                            <MdMotionPhotosOn size={25} />
                        )}
                    </button>
                )}
                {image && (
                    <Link
                        to='/details'
                        className='capture-btn proceed'
                    >
                        <GiCheckMark size={20} />
                    </Link>
                )}
            </div>
        </div >
    )
}

export default Home