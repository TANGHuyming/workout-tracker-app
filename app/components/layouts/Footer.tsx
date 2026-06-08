'use client';
import { LuBicepsFlexed } from 'react-icons/lu';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/app/utils/auth/AuthContext';

export default function Footer() {
    const router = useRouter();
    const { logout } = useAuth();

    return (
        <footer className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-md border-t border-slate-200 dark:border-slate-800">
            <div className="max-w-6xl mx-auto px-4 py-4 sm:px-6 lg:px-8 flex justify-between items-center gap-5">
                <div className="flex items-center gap-3">
                    <LuBicepsFlexed className="hidden sm:block text-2xl text-blue-500 font-black bg-linear-to-r from-blue-600 to-blue-500 dark:from-blue-400 dark:to-blue-300 bg-clip-text" />
                    <h1 className="text-2xl font-black bg-linear-to-r from-blue-600 to-blue-500 dark:from-blue-400 dark:to-blue-300 bg-clip-text text-transparent">
                        FitTrack
                    </h1>
                </div>

                <p
                    className="text-sm text-slate-600 dark:text-slate-400"
                >
                    &copy; 2026 FitTrack. All rights reserved.
                </p>    


                <nav className="flex flex-col sm:flex-row items-center gap-1 sm:gap-3">
                    <button
                        onClick={() => router.push('/')}
                        className="cursor-pointer text-indigo-600 dark:text-indigo-400 font-semibold"
                    >
                        Home
                    </button>

                    <button
                        onClick={() => router.push('/profile')}
                        className="cursor-pointer text-blue-600 dark:text-blue-400 font-semibold"
                    >
                        Profile
                    </button>
                    
                    <button
                        onClick={() => logout()}
                        className="cursor-pointer text-red-600 dark:text-red-400 font-semibold"
                    >
                        Logout
                    </button>
                </nav>
            </div>
        </footer>
    )
}