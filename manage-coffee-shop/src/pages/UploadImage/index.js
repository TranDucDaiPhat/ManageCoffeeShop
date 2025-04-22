import { useState, useEffect } from 'react';
import axios from 'axios';
import { toast } from "react-toastify";


const CLOUDINARY_URL = 'https://api.cloudinary.com/v1_1/dvpbtas1x/image/upload';
const CLOUDINARY_UPLOAD_PRESET = 'coffeeshop';

function UploadImage() {

    const [image, setImage] = useState(null);
    const [uploadedUrl, setUploadedUrl] = useState("");
    const [gallery, setGallery] = useState([]);
    const [previewUrl, setPreviewUrl] = useState("");

    const uploadToCloudinary = async () => {
        const formData = new FormData();
        formData.append('file', image);
        formData.append('upload_preset', CLOUDINARY_UPLOAD_PRESET);

        const res = await axios.post(CLOUDINARY_URL, formData);

        if (res.status === 200) {
            const imageUrl = res.data.secure_url;
            setUploadedUrl(imageUrl); 
            toast.success("Đăng ảnh thành công.");
        } else {
            toast.error("Đăng ảnh thất bại.");
        }

    
    };



    useEffect(() => {
        return () => {
            if (previewUrl) {
                URL.revokeObjectURL(previewUrl); // tránh memory leak
            }
        };
    }, [previewUrl]);


    return (
        <div>
            <h2>Upload Image</h2>
            <input
                type="file"
                accept="image/*"
                onChange={(e) => {
                    const file = e.target.files[0];
                    if (!file) return; // 👈 Chặn lỗi khi không có file

                    setImage(file);
                    setPreviewUrl(URL.createObjectURL(file));
                }}
            />

            <button onClick={uploadToCloudinary}>Upload</button>


            <h3>Gallery</h3>
          

            {previewUrl && (
                <div style={{ margin: '10px 0' }}>
                    <h4>Preview</h4>
                    <img src={previewUrl} alt="Preview" style={{ width: 200, height: 200, objectFit: 'cover', border: '1px solid #ccc' }} />
                </div>
            )}

            {uploadedUrl && <h4>{uploadedUrl}</h4>}
        </div>
    );
}

export default UploadImage;