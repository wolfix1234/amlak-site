import { NextRequest, NextResponse } from "next/server";
import { writeFile, mkdir } from "fs/promises";
import { join } from "path";
import { existsSync } from "fs";
import { jwtDecode } from "jwt-decode";
import connect from "@/lib/data";
import Poster from "@/models/poster";
import { validateImageFile } from "@/lib/validation";
import { getAllPosters, updatePoster } from "@/hooks/middlewares/poster";

type TokenPayload = {
  id?: string;
  _id?: string;
};

export async function GET(req: NextRequest) {
  await connect();
  return await getAllPosters(req);
}

export async function POST(request: NextRequest) {
  try {
    // Verify user token
    const token = request.headers.get("token");
    if (!token) {
      return NextResponse.json(
        { success: false, message: "توکن مورد نیاز است" },
        { status: 401 }
      );
    }

    let userId: string;
    try {
      const decoded = jwtDecode<TokenPayload>(token);
      userId = decoded.id || decoded._id || "";
      if (!userId) throw new Error("Invalid token");
    } catch {
      return NextResponse.json(
        { success: false, message: "توکن نامعتبر است" },
        { status: 401 }
      );
    }

    const formData = await request.formData();

    // Create user-specific uploads directory with userId
    const uploadsDir = join(
      process.cwd(),
      "public",
      "uploads",
      "posters",
      userId
    );
    if (!existsSync(uploadsDir)) {
      await mkdir(uploadsDir, { recursive: true });
    }

    // Process uploaded images
    const imageFiles = formData.getAll("images") as File[];
    const uploadedImages = [];

    for (let i = 0; i < imageFiles.length; i++) {
      const file = imageFiles[i];
      if (file.size > 0) {
        // Validate image file
        const validation = validateImageFile(file);
        if (!validation.valid) {
          return NextResponse.json(
            { success: false, message: validation.error },
            { status: 400 }
          );
        }
        // Generate unique filename with poster ID
        const timestamp = Date.now();
        const posterId = `poster_${timestamp}`;
        // const extension = originalName.includes('.') ? originalName.split('.').pop() : 'webp';
        const extension = "webp";
        const filename = `${posterId}_${i}_image.${extension}`;
        const filepath = join(uploadsDir, filename);

        // Save file to disk
        const bytes = await file.arrayBuffer();
        await writeFile(filepath, Buffer.from(bytes));

        // Get image metadata
        const imageDataKey = `imageData_${i}`;
        const imageData = formData.get(imageDataKey);
        const metadata = imageData ? JSON.parse(imageData as string) : {};

        uploadedImages.push({
          alt: metadata.alt || `تصویر ${i + 1}`,
          url: `/api/images/${userId}/${filename}`,
          mainImage: metadata.mainImage || false,
        });
      }
    }

    // Prepare poster data
    const posterData = {
      title: formData.get("title"),
      description: formData.get("description"),
      buildingDate: Number(formData.get("buildingDate")),
      area: Number(formData.get("area")),
      rooms: Number(formData.get("rooms")),
      parentType: formData.get("parentType"),
      tradeType: formData.get("tradeType"),
      ...(formData.get("totalPrice") &&
        !isNaN(Number(formData.get("totalPrice"))) && {
          totalPrice: Number(formData.get("totalPrice")),
        }),
      ...(formData.get("pricePerMeter") &&
        !isNaN(Number(formData.get("pricePerMeter"))) && {
          pricePerMeter: Number(formData.get("pricePerMeter")),
        }),
      ...(formData.get("depositRent") &&
        !isNaN(Number(formData.get("depositRent"))) && {
          depositRent: Number(formData.get("depositRent")),
        }),
      ...(formData.get("rentPrice") &&
        !isNaN(Number(formData.get("rentPrice"))) && {
          rentPrice: Number(formData.get("rentPrice")),
        }),
      convertible: formData.get("convertible") === "true",
      location: formData.get("location"),
      coordinates: JSON.parse(formData.get("coordinates") as string),
      locationDetails: JSON.parse(formData.get("locationDetails") as string),
      contact: formData.get("contact"),
      storage: formData.get("storage") === "true",
      floor: formData.get("floor") ? Number(formData.get("floor")) : undefined,
      parking: formData.get("parking") === "true",
      lift: formData.get("lift") === "true",
      balcony: formData.get("balcony") === "true",
      type: formData.get("type"),
      user: formData.get("user"),
      consultant: formData.get("consultant"),
      status: formData.get("status"),
      images: uploadedImages,
      video: formData.get("video") || "",
    };

    // Connect to database and save poster
    await connect();
    console.log("Poster data to save:", posterData);

    const savedPoster = await Poster.create(posterData);

    return NextResponse.json({
      success: true,
      message: "آگهی با موفقیت ایجاد شد",
      data: savedPoster,
    });
  } catch (error) {
    console.error("Error creating poster:", error);
    return NextResponse.json(
      { success: false, message: "خطا در ایجاد آگهی" },
      { status: 500 }
    );
  }
}

export async function PATCH(request: NextRequest) {
  await connect();
  return await updatePoster(request);
}
