import {NextRequest, NextResponse} from "next/server";
import {UserProvider} from "@/app/providers/UserProvider";
import {hashPassword} from "@/app/utils/authData";

export async function POST(request: NextRequest) {
    try {
        const body = await request.json();
        let response = null;

        // find by ID and update
        if(!body.id || !body.newPassword) {
            response = NextResponse.json(
                { success: false, message: 'User ID and new password are required' },
                { status: 400 }
            );
        }

        const hashedPassword = await hashPassword(body.newPassword);
        const data = await UserProvider.updatePasswordById(body.id, hashedPassword);

        response = NextResponse.json(
            { success: true, message: 'Password updated successfully' },
            { status: 200 }
        );

        return response;
    }
    catch(err) {
        let response: any = NextResponse.json(
            { success: false, message: 'Internal server error' },
            { status: 500 }
        );
        return response;
    }
}