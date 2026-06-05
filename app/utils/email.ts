import { MailerSend, EmailParams, Sender, Recipient } from "mailersend";

export const sendPasswordResetEmail = async (emailTo: string, id: string) => {
    if(!process.env.MAILSENDER_API_KEY) {
        throw new Error("MailerSend API key is not configured");
    }

    const mailerSend = new MailerSend({
        apiKey: process.env.MAILSENDER_API_KEY || "",
    })

    const sentFrom = new Sender(
        "noreply@test-68zxl27opm34j905.mlsender.net", 
        "WorkoutTrackerApp"
    );
    
    if(emailTo === "") {
        throw new Error("Recipient email must be provided");
    }

    const sentTo = [new Recipient(emailTo)];

    const emailParams = new EmailParams()
        .setFrom(sentFrom)
        .setTo(sentTo)
        .setSubject("Password Reset Request")
        .setHtml(`
            <h1>Password Reset Request</h1>
            <p>Click the link below to reset your password: </p>
            <a href="${process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'}/reset-password?id=${encodeURIComponent(id)}">Reset Password</a>    
        `)
        .setText(`Password Reset Request: Click the link to reset your password: ${process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'}/reset-password?id=${encodeURIComponent(id)}`);
    
    mailerSend.email.send(emailParams);

    return {
        message: "Password reset email sent successfully",
        status: 200
    }
}