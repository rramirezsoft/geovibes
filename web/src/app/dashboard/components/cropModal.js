'use client';

import Cropper from 'react-easy-crop';
import { useCallback, useState } from 'react';
import getCroppedImg from '@/utils/cropImage'; // Lo definimos más abajo
import Loading from '@/app/components/loading'; // Componente de carga

export default function CropModal({ file, onClose, onCropComplete }) {
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [croppedAreaPixels, setCroppedAreaPixels] = useState(null);
  const [loading, setLoading] = useState(false);

  const onCropDone = useCallback(async () => {
    try {
      setLoading(true);
      const croppedImage = await getCroppedImg(URL.createObjectURL(file), croppedAreaPixels);
      onCropComplete(croppedImage); // Devuelve un blob o file recortado
      onClose();
    } catch (err) {
      console.error('Error al recortar:', err);
    } finally {
      setLoading(false);
    }
  }, [croppedAreaPixels]);

  return (
    <div className="fixed inset-0 bg-black bg-opacity-80 z-50 flex flex-col items-center justify-center">
      {loading && <Loading size="lg" overlay />}
      <div className="relative w-80 h-80 bg-black">
        <Cropper
          image={URL.createObjectURL(file)}
          crop={crop}
          zoom={zoom}
          aspect={1}
          onCropChange={setCrop}
          onZoomChange={setZoom}
          onCropComplete={(_, pixels) => setCroppedAreaPixels(pixels)}
        />
      </div>
      <div className="flex mt-4 gap-4">
        <button onClick={onClose} className="bg-gray-600 px-4 py-2 rounded text-white">
          Cancelar
        </button>
        <button onClick={onCropDone} className="bg-blue-600 px-4 py-2 rounded text-white">
          Guardar
        </button>
      </div>
    </div>
  );
}
