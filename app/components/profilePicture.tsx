"use client";

import { useUploadThing } from "../utils/uploadthing";
import { useRef, useState, useEffect } from "react";
import { useSession, authClient } from "../../auth-client";
import { DEFAULT_PROFILE_IMAGE } from "../lib/constants";

export default function ProfilePicture() {
  const { data: session, isPending } = useSession();
  const [imageUrl, setImageUrl] = useState("");
  const fileInputRef = useRef<HTMLInputElement>(null);

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
          src={imageUrl || DEFAULT_PROFILE_IMAGE}
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
