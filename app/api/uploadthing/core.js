import { createUploadthing} from "uploadthing/next";
import { utapi } from "uploadthing/server";
import { getServerSession } from 'next-auth'
import { authOptions } from '@app/api/auth/[...nextauth]/route'

const f = createUploadthing();
  
// FileRouter for your app, can contain multiple FileRoutes
export const ourFileRouter = {
  // Define as many FileRoutes as you like, each with a unique routeSlug
  imageUploader: f({ image: { maxFileSize: "4MB", maxFileCount: 1 } })
    .middleware(async (req) => {
      try{
        const session = await getServerSession(authOptions);
        if (!session?.user) throw new Error("Unauthorized");
        if(session?.user?.picture?.key) {
          await utapi.deleteFiles(session.user.picture.key);
        }
        return { id: session?.user.id };
      } catch(error) {
        console.log("UploadThing error:", error);
      }
    })
    .onUploadComplete(async ({ metadata, file }) => {
      console.log("Upload complete for userId:", metadata.id);
      console.log("The file URL:", file.url);
    }),
};