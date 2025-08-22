export default function getCroppedImg(imageSrc: string, crop: any): Promise<string> {
  return new Promise((resolve, reject) => {
    const image = new Image();
    image.crossOrigin = "anonymous";
    image.src = imageSrc;

    image.onload = async () => {
      const canvas = document.createElement("canvas");
      const ctx = canvas.getContext("2d");
      if (!ctx) return reject(new Error("Canvas context not found"));

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

      canvas.toBlob(async (blob) => {
        if (!blob) return reject(new Error("Canvas is empty"));

        try {
          const formData = new FormData();
          formData.append("file", blob, "cropped.jpg");

          // Upload na utfs.io (uploadthing storage)
          const res = await fetch("https://uploadthing.com/api/upload", {
            method: "POST",
            body: formData,
          });

          if (!res.ok) {
            return reject(new Error("Upload failed"));
          }

          const data = await res.json();
          // data.url obsahuje URL na utfs.io
          resolve(data.url);
        } catch (err) {
          reject(err);
        }
      }, "image/jpeg");
    };

    image.onerror = (err) => reject(err);
  });
}
