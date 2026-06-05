import { useState } from 'react';
import LoginForm from './LoginForm';
import RegisterForm from './RegisterForm';
import { validateEmail } from '@/app/utils/validateEmail';

export default function LoginRegister({
    showRegister,
    showResetPassword,
    setShowRegister,
    setShowResetPassword,
}: {
    showRegister: boolean;
    showResetPassword: boolean;
    setShowRegister: (value: boolean) => void;
    setShowResetPassword: (value: boolean) => void;
}) {
    const [resetEmail, setResetEmail] = useState('');
    const formHeaderStyle = "bg-white dark:bg-slate-900 rounded-2xl shadow-lg border border-slate-200 dark:border-slate-800 overflow-hidden"

    const handleResetPassword = async (e: React.FormEvent) => {
        e.preventDefault();
        const trimmedEmail = resetEmail.trim();

        try {
            if(!validateEmail(trimmedEmail)) {
                throw new Error("Please enter a valid email address");
            }

            let response = await fetch(`/api/users/profile`, {
                method: 'GET'
            });

            if(!response.ok) {
                throw new Error("Failed to fetch users");
            }

            const data = await response.json();
            const users = data.users;
            const user = users.find((user: any) => user.email === trimmedEmail);
            
            if(!user) {
                throw new Error("No account found with that email address");
            }

            response = await fetch(`/api/send-email`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json'
                },
                body: JSON.stringify({ email: trimmedEmail, id: user.id })
            })

            if(!response.ok) {
                throw new Error("Failed to send reset email");
            }

            alert("Password reset email sent. Please check your inbox.");
        }
        catch(err) {
            console.log((err as Error).message);
            alert("An error occurred while checking the email. Please try again later.");
        }
    }

    if(showRegister) {
        return (
            <div className={`${formHeaderStyle}`}>
                <div className="bg-gradient-to-r from-blue-50 to-blue-100 dark:from-blue-950 dark:to-blue-900 p-6 border-b border-slate-200 dark:border-slate-800">
                    <h2 className="text-2xl font-bold text-slate-900 dark:text-white text-center">
                    Create Account
                    </h2>
                    <p className="text-sm text-slate-600 dark:text-slate-400 text-center mt-1">Join the fitness revolution</p>
                </div>
                <div className="p-6">
                    <RegisterForm
                    onSuccess={() => {
                        setShowRegister(false);
                    }}
                    />
                </div>
                <div className="border-t border-slate-200 dark:border-slate-800 p-4">
                    <button
                        onClick={() => setShowRegister(false)}
                        className="w-full text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300 font-medium py-2 transition-colors"
                    >
                        Already have an account? Login
                    </button>
                </div>
            </div>
        );
    }
    else if (showResetPassword) {
        return (
            <div className={`${formHeaderStyle}`}>
                <div className="bg-gradient-to-r from-blue-50 to-blue-100 dark:from-blue-950 dark:to-blue-900 p-6 border-b border-slate-200 dark:border-slate-800">
                    <h2 className="text-2xl font-bold text-slate-900 dark:text-white text-center">
                    Welcome Back
                    </h2>
                    <p className="text-sm text-slate-600 dark:text-slate-400 text-center mt-1">Continue your fitness journey</p>
                </div>
                <div className="p-6">
                    <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">
                        Email Address
                    </label>    
                    <input 
                        type="email" 
                        placeholder="Enter your email" 
                        className="w-full px-4 py-3 border border-slate-300 dark:border-slate-600 rounded-lg bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 dark:focus:ring-offset-slate-900 mb-4" 
                        value={resetEmail}
                        onChange={(e) => setResetEmail(e.target.value)}
                    />
                    <button onClick={handleResetPassword} className="w-full bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-700 hover:to-blue-600 text-white font-semibold py-3 px-4 rounded-lg transition-all duration-200 shadow-md hover:shadow-lg flex items-center justify-center gap-2">
                        Send Reset Link
                    </button>
                </div>
                <div className="border-t border-slate-200 dark:border-slate-800 p-4">
                    <button
                    onClick={() => setShowRegister(true)}
                    className="w-full text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300 font-medium py-2 transition-colors"
                    >
                        Don't have an account? Register
                    </button>

                    <button
                        onClick={() => setShowResetPassword(false)}
                        className="w-full mt-2 text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300 font-medium py-2 transition-colors"
                    >
                        Return to Login
                    </button>
                </div>
            </div>
        )
    }
    else {
        return (
            <div className={`${formHeaderStyle}`}>
                <div className="bg-gradient-to-r from-blue-50 to-blue-100 dark:from-blue-950 dark:to-blue-900 p-6 border-b border-slate-200 dark:border-slate-800">
                    <h2 className="text-2xl font-bold text-slate-900 dark:text-white text-center">
                    Welcome Back
                    </h2>
                    <p className="text-sm text-slate-600 dark:text-slate-400 text-center mt-1">Continue your fitness journey</p>
                </div>
                <div className="p-6">
                    <LoginForm onSuccess={() => {}} />
                </div>
                <div className="border-t border-slate-200 dark:border-slate-800 p-4">
                    <button
                    onClick={() => setShowRegister(true)}
                    className="w-full text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300 font-medium py-2 transition-colors"
                    >
                        Don't have an account? Register
                    </button>

                    <button
                        onClick={() => setShowResetPassword(true)}
                        className="w-full mt-2 text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300 font-medium py-2 transition-colors"
                    >
                        Forget Password?
                    </button>
                </div>
            </div>
        );
    }
}