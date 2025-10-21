import { NextRequest, NextResponse } from "next/server";
import { getAuth } from "@clerk/nextjs/server";
import { connectDB } from "@/lib/db";
import Store from "@/models/Store";
import User from "@/models/User";
import imagekit from "@/configs/imageKit";

export async function POST(req: NextRequest) {
  try {
    const { userId } = getAuth(req);
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    await connectDB();

    const formData = await req.formData();

    const name = formData.get("name") as string;
    const username = formData.get("username") as string;
    const description = formData.get("description") as string;
    const email = formData.get("email") as string;
    const contact = formData.get("contact") as string;
    const address = formData.get("address") as string;
    const images = formData.get("images") as File;

    if (
      !name ||
      !username ||
      !description ||
      !email ||
      !contact ||
      !address ||
      !images
    ) {
      return NextResponse.json(
        { error: "Missing store info" },
        { status: 400 }
      );
    }

    // Kiểm tra xem user đã có store chưa
    const existingStore = await Store.findOne({ userId });
    if (existingStore) {
      return NextResponse.json({ status: existingStore.status });
    }

    // Kiểm tra username trùng
    const isUsernameTaken = await Store.findOne({
      username: username.toLowerCase(),
    });
    if (isUsernameTaken) {
      return NextResponse.json(
        { error: "Username already taken" },
        { status: 400 }
      );
    }

    // Upload ảnh lên imagekit
    const buffer = Buffer.from(await images.arrayBuffer());
    const response = await imagekit.upload({
      file: buffer,
      fileName: images.name,
      folder: "logos",
    });

    const optimizedImage = imagekit.url({
      path: response.filePath,
      transformation: [
        { quality: "auto" },
        { format: "webp" },
        { width: "512" },
      ],
    });

    const newStore = await Store.create({
      userId,
      name,
      description,
      username: username.toLowerCase(),
      email,
      contact,
      address,
      logo: optimizedImage,
    });

    // Link store to user
    await User.findOneAndUpdate({ id: userId }, { store: newStore._id });

    return NextResponse.json({ message: "Applied, waiting for approval" });
  } catch (error: any) {
    console.error(error);
    return NextResponse.json(
      { error: error.message || "Internal server error" },
      { status: 400 }
    );
  }
}

// Check is user have already registered a store if yes then send status if store
export async function GET(req: NextRequest) {
  try {
    const { userId } = getAuth(req);

    const existingStore = await Store.findOne({ userId });
    if (existingStore) {
      return NextResponse.json({ status: existingStore.status });
    }

    return NextResponse.json({ status: "not registered" });
  } catch (error: any) {
    console.error(error);
    return NextResponse.json(
      { error: error.message || "Internal server error" },
      { status: 400 }
    );
  }
}
