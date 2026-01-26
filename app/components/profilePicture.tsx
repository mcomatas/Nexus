"use client";

import { useUploadThing } from "../utils/uploadthing";
import { useRef, useState, useEffect } from "react";
import { useSession, authClient } from "../../auth-client";

export default function ProfilePicture() {
  const { data: session, isPending } = useSession();
  const [imageUrl, setImageUrl] = useState("");
  const fileInputRef = useRef<HTMLInputElement>(null);
  const defaultImage =
    "https://i61lmhw0q5.ufs.sh/f/M3hNjJxnCROHCOdTBPzTjrhi19M43YR2Em6ntANoQa08k5gs";

  // Sync imageUrl when session loads
  useEffect(() => {
    if (session?.user?.image) {
      setImageUrl(session.user.image);
    }
  }, [session]);

  const { startUpload, isUploading } = useUploadThing("profilePicture", {
    onClientUploadComplete: async (res) => {
      const url = res[0].url;
      setImageUrl(url);
      // Save to database
      await authClient.updateUser({ image: url });
    },
    onUploadError: (error) => {
      alert(`Error: ${error.message}`);
    },
  });

  return (
    <div>
      <div
        onClick={() => fileInputRef.current?.click()}
        className="cursor-pointer relative w-36 h-36 rounded-full overflow-hidden border-2 border-primary/50 hover:border-primary transition-all"
      >
        <img
          src={imageUrl || defaultImage}
          alt="Profile"
          className="w-full h-full object-cover"
        />
        {isUploading && (
          <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
            <span className="text-white text-sm">...</span>
          </div>
        )}
      </div>

      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={(e) => {
          if (e.target.files?.[0]) {
            startUpload([e.target.files[0]]);
          }
        }}
      />
    </div>
  );
}
