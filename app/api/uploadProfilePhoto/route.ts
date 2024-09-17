// app/api/uploadProfilePhoto/route.ts
import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/utils/supabase/server";
import { v4 as uuidv4 } from "uuid";

export const runtime = "edge";
export const POST = async (req: NextRequest) => {
  const supabase = createClient();

  try {
    // Parse the incoming form data
    const formData = await req.formData();
    const file = formData.get("profilePhoto") as File;

    if (!file) {
      return NextResponse.json(
        { error: "No file uploaded. Please select a photo to upload." },
        { status: 400 }
      );
    }

    // Validate file type
    const allowedTypes = ["image/jpeg", "image/png", "image/gif"];
    if (!allowedTypes.includes(file.type)) {
      return NextResponse.json(
        {
          error:
            "Unsupported file type. Please upload a JPEG, PNG, or GIF image.",
        },
        { status: 400 }
      );
    }

    // Validate file size (max 2MB)
    const maxSize = 2 * 1024 * 1024; // 2MB
    if (file.size > maxSize) {
      return NextResponse.json(
        { error: "File size exceeds 2MB. Please upload a smaller image." },
        { status: 400 }
      );
    }

    // Read the file as a buffer
    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);
    const fileExt = file.name.split(".").pop();
    const fileName = `${uuidv4()}.${fileExt}`;
    const bucketName = "drivers";

    // Upload to Supabase Storage
    const { data, error: uploadError } = await supabase.storage
      .from(bucketName)
      .upload(fileName, buffer, {
        contentType: file.type,
        upsert: false, // Avoid overwriting existing files
      });

    if (uploadError) {
      console.error("Upload Error:", uploadError);
      return NextResponse.json(
        { error: "Failed to upload image. Please try again later." },
        { status: 500 }
      );
    }

    // Get the public URL
    const { data: publicData } = supabase.storage
      .from(bucketName)
      .getPublicUrl(data.path);

    const publicURL = publicData.publicUrl;

    // Fetch the authenticated user from cookies (assuming you're using Supabase Auth with cookies)
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser();

    if (authError || !user) {
      return NextResponse.json(
        { error: "Unauthorized. Please log in again." },
        { status: 401 }
      );
    }

    // Update the driver's photo_url in 'drivers' table
    const { error: updateError } = await supabase
      .from("drivers")
      .update({ photo_url: publicURL })
      .eq("id", user.id);

    if (updateError) {
      console.error("Update Error:", updateError);
      return NextResponse.json(
        { error: "Failed to update your profile. Please try again." },
        { status: 500 }
      );
    }

    return NextResponse.json(
      { message: "Photo uploaded successfully." },
      { status: 200 }
    );
  } catch (error: any) {
    console.error("Handler Error:", error);
    return NextResponse.json(
      { error: "An unexpected error occurred. Please try again later." },
      { status: 500 }
    );
  }
};
