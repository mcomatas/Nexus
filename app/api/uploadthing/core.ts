import { createUploadthing, type FileRouter } from "uploadthing/next";
import { auth } from "../../../auth";

const f = createUploadthing();

export const ourFileRouter = {
  // "profilePicture" upload
  profilePicture: f({
    image: { maxFileSize: "4MB", maxFileCount: 1 },
  })
    // add auth check
    .middleware(async ({ req }) => {
      // Check if user is logged in, return user id
      const session = await auth.api.getSession({
        headers: req.headers,
      });

      //If not logged in, throw error
      if (!session.user) throw new Error("Unauthorized");

      return { userId: session.user.id };
    })
    .onUploadComplete(async ({ metadata, file }) => {
      console.log("Upload complete for user: ", metadata.userId);
      console.log("File URL: ", file.url);
      return { url: file.url };
    }),
} satisfies FileRouter;

export type OurFileRouter = typeof ourFileRouter;
