import React, { useState, useCallback } from "react";
import Cropper from "react-easy-crop";
import getCroppedImg from "./GetCroppedImg";
import { ProfileState } from "@/types/Profile";

interface ProfileProps {
  profile: ProfileState;
  setProfile?: (data: ProfileState) => void;
}

const Profile: React.FC<ProfileProps> = ({ profile, setProfile }) => {
  const [imageSrc, setImageSrc] = useState<string | null>(null);
  const [croppedAreaPixels, setCroppedAreaPixels] = useState<any>(null);
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);

  const onCropComplete = useCallback((_: any, croppedAreaPixels: any) => {
    setCroppedAreaPixels(croppedAreaPixels);
  }, []);

  const showCroppedImage = useCallback(async () => {
    try {
      const croppedImg = await getCroppedImg(imageSrc!, croppedAreaPixels);

      if (setProfile) {
        setProfile({ ...profile, image: croppedImg }); // uložíme do profilu
      }

      setImageSrc(null); // zavřít modal
    } catch (e) {
      console.error(e);
    }
  }, [imageSrc, croppedAreaPixels, profile, setProfile]);

  const onFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const file = e.target.files[0];
      const imageDataUrl = await readFile(file);
      setImageSrc(imageDataUrl);
    }
  };

  return (
    <div className="p-4">
      <h2 className="text-xl mb-2">Nahrát profilovou fotku</h2>
      <input type="file" onChange={onFileChange} />

      {/* Modal */}
      {imageSrc && (
        <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50">
          <div className="bg-white p-4 rounded-lg w-[400px] h-[400px] relative">
            <Cropper
              image={imageSrc}
              crop={crop}
              zoom={zoom}
              aspect={1}
              onCropChange={setCrop}
              onZoomChange={setZoom}
              onCropComplete={onCropComplete}
            />
            <div className="flex justify-end gap-2 mt-2">
              <button
                className="bg-gray-300 px-3 py-1 rounded"
                onClick={() => setImageSrc(null)}
              >
                Zrušit
              </button>
              <button
                className="bg-blue-500 text-white px-3 py-1 rounded"
                onClick={showCroppedImage}
              >
                Potvrdit
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Náhled obrázku */}
      {profile?.image && (
        <div className="mt-4">
          <h3>Oříznutý obrázek:</h3>
          <img
            src={profile.image}
            alt="Cropped"
            className="mt-2 rounded-full w-40 h-40 object-cover"
          />
        </div>
      )}
    </div>
  );
};

export { Profile };

function readFile(file: File): Promise<string> {
  return new Promise((resolve) => {
    const reader = new FileReader();
    reader.addEventListener("load", () => resolve(reader.result as string), false);
    reader.readAsDataURL(file);
  });
}
