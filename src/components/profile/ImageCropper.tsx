import React, { useState, useCallback } from 'react';
import Cropper, { Area } from 'react-easy-crop';

// Helper function to extract cropped image as Blob
const createImage = (url: string) =>
  new Promise<HTMLImageElement>((resolve, reject) => {
    const image = new Image();
    image.addEventListener('load', () => resolve(image));
    image.addEventListener('error', (error) => reject(error));
    image.setAttribute('crossOrigin', 'anonymous');
    image.src = url;
  });

async function getCroppedImg(
  imageSrc: string,
  pixelCrop: Area,
  rotation = 0
): Promise<Blob | null> {
  const image = await createImage(imageSrc);
  const canvas = document.createElement('canvas');
  const ctx = canvas.getContext('2d');

  if (!ctx) {
    return null;
  }

  // set canvas size to match the bounding box
  canvas.width = image.width;
  canvas.height = image.height;
  ctx.drawImage(image, 0, 0);

  // extract the cropped image data
  const data = ctx.getImageData(
    pixelCrop.x,
    pixelCrop.y,
    pixelCrop.width,
    pixelCrop.height
  );

  // set canvas width to final desired crop size - this will clear existing context
  canvas.width = pixelCrop.width;
  canvas.height = pixelCrop.height;
  ctx.putImageData(data, 0, 0);

  return new Promise((resolve) => {
    canvas.toBlob((blob) => {
      if (blob) resolve(blob);
    }, 'image/jpeg');
  });
}

interface ImageCropperProps {
  imageSrc: string;
  onCropComplete: (croppedBlob: Blob) => void;
  onCancel: () => void;
}

export default function ImageCropper({ imageSrc, onCropComplete, onCancel }: ImageCropperProps) {
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [croppedAreaPixels, setCroppedAreaPixels] = useState<Area | null>(null);

  const handleCropComplete = useCallback((croppedArea: Area, croppedAreaPixels: Area) => {
    setCroppedAreaPixels(croppedAreaPixels);
  }, []);

  const handleSave = async () => {
    if (croppedAreaPixels) {
      const croppedImageBlob = await getCroppedImg(imageSrc, croppedAreaPixels);
      if (croppedImageBlob) {
        onCropComplete(croppedImageBlob);
      }
    }
  };

  return (
    <div style={{
      position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
      backgroundColor: 'rgba(0,0,0,0.85)', zIndex: 9999,
      display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center'
    }}>
      <h3 style={{ color: 'white', marginBottom: '20px', zIndex: 10000 }}>Sesuaikan Foto Anda</h3>
      <div style={{ position: 'relative', width: '90%', maxWidth: '400px', height: '400px', backgroundColor: '#333', borderRadius: '16px', overflow: 'hidden' }}>
        <Cropper
          image={imageSrc}
          crop={crop}
          zoom={zoom}
          aspect={1}
          cropShape="round"
          showGrid={false}
          onCropChange={setCrop}
          onCropComplete={handleCropComplete}
          onZoomChange={setZoom}
        />
      </div>
      
      {/* Zoom Slider */}
      <div style={{ width: '90%', maxWidth: '300px', display: 'flex', alignItems: 'center', gap: '15px', marginTop: '20px', zIndex: 10000 }}>
        <span style={{ color: 'white' }}>-</span>
        <input
          type="range"
          value={zoom}
          min={1}
          max={3}
          step={0.1}
          aria-labelledby="Zoom"
          onChange={(e) => setZoom(Number(e.target.value))}
          style={{ flex: 1, accentColor: '#ff477e' }}
        />
        <span style={{ color: 'white' }}>+</span>
      </div>

      <div style={{ display: 'flex', gap: '15px', marginTop: '30px', zIndex: 10000 }}>
        <button onClick={onCancel} style={{
          padding: '12px 25px', borderRadius: '8px', border: '1px solid rgba(255,255,255,0.3)',
          backgroundColor: 'transparent', color: '#fff', cursor: 'pointer', fontWeight: '500'
        }}>
          Batal
        </button>
        <button onClick={handleSave} style={{
          padding: '12px 25px', borderRadius: '8px', border: 'none',
          backgroundColor: '#ff477e', color: '#fff', cursor: 'pointer', fontWeight: 'bold',
          boxShadow: '0 4px 15px rgba(255,71,126,0.4)'
        }}>
          Simpan Potongan
        </button>
      </div>
    </div>
  );
}
