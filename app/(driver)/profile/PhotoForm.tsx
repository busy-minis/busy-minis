// app/profile/PhotoForm.tsx
"use client";
import React from "react";

export default function PhotoForm() {
  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const formData = new FormData();
      formData.append("profilePhoto", e.target.files[0]);

      try {
        const response = await fetch("/api/uploadProfilePhoto", {
          method: "POST",
          body: formData,
        });

        if (response.ok) {
          const data = await response.json();
          // Redirect with success message
          window.location.href = `/profile?success=${encodeURIComponent(
            data.message
          )}`;
        } else {
          // Attempt to parse error message
          let errorMsg = "Unknown error occurred";
          try {
            const data = await response.json();
            errorMsg = data.error || errorMsg;
          } catch (parseError) {
            // If response is not JSON, retain the default error message
          }
          // Redirect with error message
          window.location.href = `/profile?error=${encodeURIComponent(
            errorMsg
          )}`;
        }
      } catch (err) {
        // Handle network or unexpected errors
        console.error("Upload Error:", err);
        window.location.href = `/profile?error=${encodeURIComponent(
          "Failed to upload photo. Please try again."
        )}`;
      }
    }
  };

  return (
    <input
      type="file"
      id="profilePhoto"
      name="profilePhoto"
      accept="image/*"
      className="hidden"
      onChange={handleFileChange}
    />
  );
}
