import { NextRequest, NextResponse } from "next/server";
import { UserProvider } from "@/app/providers/UserProvider";

export const GET = async (request: NextRequest) => {
  try {
    const searchParams = request.nextUrl.searchParams;
    let response = null;
    const searchFriend = searchParams.get("searchFriend");
    let users: any[] = [];

    if (searchFriend && searchFriend.length !== 0) {
      console.log("Searching friend...");
      users = await UserProvider.findByUsername(searchFriend);
    } else {
      users = await UserProvider.findAll();
    }

    if (!users) {
      response = NextResponse.json(
        { success: false, message: "No users found" },
        { status: 404 },
      );

      return response;
    }

    const formattedUsers = users.map((user) => ({
      id: user._id.toString(),
      email: user.email,
      username: user.username,
      bodyweight: user.bodyweight,
      profilePictureUrl: user.profilePictureUrl,
      friends: user.friends,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
    }));

    response = NextResponse.json(
      { success: true, users: formattedUsers },
      { status: 200 },
    );

    return response;
  } catch (error) {
    let response: any = NextResponse.json(
      { success: false, message: "Internal server error" },
      { status: 500 },
    );
    return response;
  }
};
