import './style.css'
import { TbPhoto } from 'react-icons/tb'
import { MdMotionPhotosOn } from 'react-icons/md'

const Navbar = ({
    imageRef,
    setCapturing,
    setImage,
    permissionState,
    setAction
}) => {
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
        <div id='navbar'>
            <img
                src='/logo.png'
                alt='Face Analysis'
                className='logo'
            />
            <div className='btn__container'>
                <button className='btn' onClick={() => imageRef?.current.click()}>
                    <TbPhoto />
                    <p>Upload</p>
                    <input ref={imageRef} hidden type="file" onChange={selectImage} />
                </button>
                {permissionState === 'granted' && (
                    <button
                        className='btn'
                        onClick={() => setCapturing(true)}
                    >
                        <MdMotionPhotosOn />
                        <p>Cature Image</p>
                    </button>
                )}
            </div>
        </div>
    )
}

export default Navbar