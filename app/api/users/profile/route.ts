import { put } from "@vercel/blob";
import { ProfilePayload } from "@/app/utils/profileData";
import { NextRequest, NextResponse } from "next/server";
import { UserProvider } from "@/app/providers/UserProvider";
import csrf from 'csrf';
import { cookies } from 'next/headers';

const csrfProtection = new csrf();
const secret = process.env.CSRF_SECRET || 'your-super-secret-key-change-in-production';

export async function GET(request: NextRequest) {
  try {
    let response: any = null;
    const users = await UserProvider.findAll();
    if (!users) {
      response = NextResponse.json(
        { success: false, message: 'No users found' },
        { status: 404 }
      );

      return response
    }

    const formattedUsers = users.map(user => ({
      id: user._id.toString(),
      email: user.email,
      username: user.username,
      bodyweight: user.bodyweight,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
    }));

    response = NextResponse.json(
      { success: true, users: formattedUsers },
      { status: 200 }
    )

    return response;
  }
  catch (err) {
    let response: any = NextResponse.json(
      { success: false, message: 'Internal server error' },
      { status: 500 }
    );
    return response;
  }
}

export async function PUT(request: NextRequest) {
  try {
    const body = await request.formData();

    // extracting fields
    const email = body.get("email") as string;
    const username = body.get("username") as string;
    const profilePicture = body.get("profilePicture") as File

    const cookieStore = await cookies();
    const csrfToken = cookieStore.get('csrfToken')?.value || "";
    const jwtPayloadHeader = request.headers.get('jwt-payload') || "{}";
    const payload = JSON.parse(jwtPayloadHeader);

    if (!payload) {
      return NextResponse.json(
        { success: false, message: 'Unauthorized: No JWT payload' },
        { status: 401 }
      );
    }

    if (!csrfProtection.verify(secret, csrfToken)) {
      let response: any = NextResponse.json(
        { success: false, message: 'Unauthorized: Invalid CSRF token' },
        { status: 403 }
      );
      return response;
    }

    // Validation
    if (!email || !username) {
      let response: any = NextResponse.json(
        { success: false, message: 'All fields are required' },
        { status: 400 }
      );
      return response;
    }

    // File validation
    const maxFileSize = 5 * 1024 * 1024; // max file size 5MB
    const allowedMIME = ["image/jpeg", "image/jpg", "image/png"];
    // Check existence and length
    let profilePictureUrl = "";
    if (!profilePicture) {
      let response: any = NextResponse.json(
        { success: false, message: "Profile picture is required" },
        { status: 400 }
      )
      return response;
    }

    // Check file size
    if (profilePicture.size > maxFileSize) {
      let response: any = NextResponse.json(
        { success: false, message: "File size exceeded" },
        { status: 400 }
      )
      return response;
    }

    // Check MIME type
    if (!allowedMIME.includes(profilePicture.type)) {
      let response: any = NextResponse.json(
        { success: false, message: "Invalid MIME type" },
        { status: 400 }
      )
      return response;
    }

    // Upload to vercel blob
    const blob = await put(profilePicture.name, profilePicture, {
      access: 'public',
      addRandomSuffix: true,
    })

    // Find user
    const user = await UserProvider.findById(payload.userId);
    if (!user) {
      let response: any = NextResponse.json(
        { success: false, message: 'User not found' },
        { status: 404 }
      );
      return response;
    }

    // Update user
    const updatedUser = await UserProvider.update(payload.userId, {
      username: username,
      email: email,
      profilePictureUrl: blob.url,
    });

    if (!updatedUser) {
      let response: any = NextResponse.json(
        { success: false, message: 'User not found' },
        { status: 404 }
      );
      return response;
    }

    let response: any = NextResponse.json(
      {
        success: true,
        user: {
          id: user._id.toString(),
          email: user.email,
          username: user.username,
          createdAt: user.createdAt,
        },
      },
      { status: 200 }
    );
    return response;
  }
  catch (err) {
    console.log(err)
    let response: any = NextResponse.json(
      { success: false, message: 'Internal server error' },
      { status: 500 }
    );
    return response;
  }
}
