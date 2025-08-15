import { BorderRadius, Colors } from "@/utils";
import { UploadButton } from "@/utils/uploadThing";
import { faCloudUpload } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Flex } from "@mantine/core";
import styled from "styled-components";
import Cropper from "react-easy-crop";
import { useState, useCallback } from "react";
import getCroppedImg from "./GetCroppedImg";

export const UploadButtonWithLabel = ({
  label,
  onUpload,
}: {
  label: string;
  onUpload: (res: { url: string }[]) => Promise<void> | void;
}) => {
  const [imageSrc, setImageSrc] = useState<string | null>(null);
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [croppedAreaPixels, setCroppedAreaPixels] = useState<any>(null);

  const onCropComplete = useCallback((_: any, croppedPixels: any) => {
    setCroppedAreaPixels(croppedPixels);
  }, []);

  const handleSave = useCallback(async () => {
    if (!imageSrc || !croppedAreaPixels) return;
    try {
      const croppedImage = await getCroppedImg(imageSrc, croppedAreaPixels);
      onUpload([{ url: croppedImage }]); // pošleme výsledek
      setImageSrc(null); // reset editoru
    } catch (err) {
      console.error(err);
    }
  }, [imageSrc, croppedAreaPixels, onUpload]);

  return (
    <UploadWrapper>
      <label className="mantine-InputWrapper-label mantine-FileInput-label">
        {label}
      </label>

      {!imageSrc && (
        <ButtonWrapper>
          <UploadButton
            endpoint="imageUploader"
            onClientUploadComplete={(res) => {
              setImageSrc(res[0].url);
            }}
            content={{
              button: ({ ready, isUploading }) => {
                if (!ready) return "Preparing ...";
                if (isUploading) return "Uploading ...";
                return (
                  <FontAwesomeIcon
                    icon={faCloudUpload}
                    size="lg"
                    color={Colors.black}
                  />
                );
              },
              allowedContent: () => "",
            }}
          />
        </ButtonWrapper>
      )}

      {imageSrc && (
        <CropContainer>
          <Cropper
            image={imageSrc}
            crop={crop}
            zoom={zoom}
            aspect={1}
            onCropChange={setCrop}
            onZoomChange={setZoom}
            onCropComplete={onCropComplete}
          />
          <ZoomSlider
            type="range"
            min={1}
            max={3}
            step={0.1}
            value={zoom}
            onChange={(e) => setZoom(Number(e.target.value))}
          />
          <ActionButtons>
            <button onClick={() => setImageSrc(null)}>Cancel</button>
            <button onClick={handleSave}>Save</button>
          </ActionButtons>
        </CropContainer>
      )}
    </UploadWrapper>
  );
};

const UploadWrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-start;

  label {
    font-weight: 500;
    font-size: 14px;
    padding-bottom: 3px;
  }
`;

const ButtonWrapper = styled(Flex)`
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: ${BorderRadius.sm};
  background-color: ${Colors.white};
  height: 36px;
  min-width: 64px;

  & > div {
    width: 40px;
  }
`;

const CropContainer = styled.div`
  position: relative;
  width: 100%;
  height: 400px;
  background: #333;
`;

const ZoomSlider = styled.input`
  position: absolute;
  bottom: 50px;
  left: 50%;
  transform: translateX(-50%);
`;

const ActionButtons = styled.div`
  position: absolute;
  bottom: 10px;
  left: 50%;
  transform: translateX(-50%);
  display: flex;
  gap: 10px;

  button {
    padding: 6px 12px;
    border: none;
    background: ${Colors.white};
    border-radius: ${BorderRadius.sm};
    cursor: pointer;
    font-weight: 500;
  }
`;
