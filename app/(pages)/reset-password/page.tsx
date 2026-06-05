"use client";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";

export default function ResetPasswordPage({
    searchParams
}: {
    searchParams: { [key: string]: string | string[] | undefined }
}) {
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const router = useRouter();

    const handleResetPassword = async () => {
        if (newPassword !== confirmPassword) {
            alert('Passwords do not match');
            return;
        }

        try {
            setIsLoading(true);
            const id = (await searchParams).id;
            const response = await fetch('/api/auth/reset-password', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ id, newPassword }),
            });

            if(!response.ok) {
                throw new Error('Failed to reset password');
            }
        }
        catch(err) {
            console.error((err as Error).message);
            alert('An error occurred while resetting password');
        }
        finally {
            setIsLoading(false);
            setNewPassword('');
            setConfirmPassword('');

            router.push('/');
        }
    }

    return (
        <div>
            <div className="bg-gradient-to-r from-blue-50 to-blue-100 dark:from-blue-950 dark:to-blue-900 p-6 border-b border-slate-200 dark:border-slate-800">
                <h2 className="text-2xl font-bold text-slate-900 dark:text-white text-center">
                Welcome Back
                </h2>
                <p className="text-sm text-slate-600 dark:text-slate-400 text-center mt-1">Continue your fitness journey</p>
            </div>
            <div className="p-6">
                <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">
                    New Password
                </label>
                <input 
                    type="password" 
                    placeholder="Enter your password" 
                    className="w-full px-4 py-3 border border-slate-300 dark:border-slate-600 rounded-lg bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 dark:focus:ring-offset-slate-900 mb-4" 
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                />

                <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">
                    Confirm Password
                </label>
                <input 
                    type="password" 
                    placeholder="Confirm your password" 
                    className="w-full px-4 py-3 border border-slate-300 dark:border-slate-600 rounded-lg bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 dark:focus:ring-offset-slate-900 mb-4" 
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                />
                <button onClick={handleResetPassword} disabled={isLoading} className="w-full bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-700 hover:to-blue-600 text-white font-semibold py-3 px-4 rounded-lg transition-all duration-200 shadow-md hover:shadow-lg flex items-center justify-center gap-2">
                    {isLoading ? 'Resetting...' : 'Reset Password'}
                </button>
            </div>
            <div className="border-t border-slate-200 dark:border-slate-800 p-4 text-center">
                <Link
                    href="/"
                    className="w-full mt-2 text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300 font-medium py-2 transition-colors"
                >
                    Return to Login
                </Link>
            </div>
        </div>
    )
}