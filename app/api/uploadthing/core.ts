import { createUploadthing, type FileRouter } from "uploadthing/next";
// import { UploadThingError } from "uploadthing/server";
// import { protectRoute } from "@/utils/protectRoute";

const f = createUploadthing()

export const ourFileRouter = {
  imageUploader: f({
    image: { maxFileSize: "4MB", maxFileCount: 1 },
  })
    // .middleware(async ({ req }) => {
    //   const errorResponse = await protectRoute(req, ['admin', 'user'])
    //   if (errorResponse) throw new UploadThingError("Unauthorized")

    //   return { }
    // })
    .onUploadComplete(async ({ metadata, file }) => {
      try {
        return { uploadedBy: metadata, fileUrl: file.url };
      } catch (error) {
        console.error("UploadThing error:", (error as Error).message, "File:", file?.name);
        throw error;
      }
    }),
} satisfies FileRouter

export type OurFileRouter = typeof ourFileRouter
