import LoginForm from './LoginForm';
import RegisterForm from './RegisterForm';

export default function User({
    showRegister,
    setShowRegister,
}: {
    showRegister: boolean;
    setShowRegister: (value: boolean) => void;
}) {
    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 dark:from-slate-950 dark:to-blue-950 flex items-center justify-center px-4 py-8">
            <div className="w-full max-w-md">
                <div className="text-center mb-10">
                <div className="mb-6">
                    <h1 className="text-5xl font-black bg-gradient-to-r from-blue-600 to-blue-500 dark:from-blue-400 dark:to-blue-300 bg-clip-text text-transparent mb-2">
                    💪 FitTrack
                    </h1>
                </div>
                <p className="text-lg font-medium text-slate-600 dark:text-slate-300">
                    Track your workouts and reach your goals
                </p>
                </div>

                <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-lg border border-slate-200 dark:border-slate-800 overflow-hidden">
                {showRegister ? (
                    <>
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
                    </>
                ) : (
                    <>
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
                    </div>
                    </>
                )}
                </div>
            </div>
        </div>
    );
}