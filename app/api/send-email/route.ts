import {NextRequest, NextResponse} from "next/server";
import { sendPasswordResetEmail } from "@/app/utils/email";

export async function POST(request: NextRequest) {
    try {
        const body = await request.json();
        const email = body.email;
        const id = body.id;
        if (!email || !id) {
            return NextResponse.json(
                { success: false, message: 'Email and ID are required' },
                { status: 400 }
            );
        }

        await sendPasswordResetEmail(email, id);
        
        return NextResponse.json(
            { success: true, message: 'Password reset email sent' },
            { status: 200 }
        );
    }
    catch(err) {
        let response: any = NextResponse.json(
            { success: false, message: 'Internal server error' },
            { status: 500 }
        );
        return response;
    }
}