export default function getCroppedImg(imageSrc: string, crop: any): Promise<string> {
  return new Promise((resolve, reject) => {
    const image = new Image();
    image.crossOrigin = "anonymous";
    image.src = imageSrc;

    image.onload = () => {
      const canvas = document.createElement("canvas");
      const ctx = canvas.getContext("2d");
      if (!ctx) {
        return reject(new Error("Canvas context not found"));
      }

      canvas.width = crop.width;
      canvas.height = crop.height;

      ctx.drawImage(
        image,
        crop.x,
        crop.y,
        crop.width,
        crop.height,
        0,
        0,
        crop.width,
        crop.height
      );

      canvas.toBlob((blob) => {
        if (!blob) return reject(new Error("Canvas is empty"));
        const fileUrl = URL.createObjectURL(blob);
        resolve(fileUrl);
      }, "image/jpeg");
    };

    image.onerror = (err) => {
      reject(err);
    };
  });
}
