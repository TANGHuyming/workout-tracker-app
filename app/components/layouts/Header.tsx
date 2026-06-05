'use client';
import { LuBicepsFlexed } from 'react-icons/lu';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/app/utils/auth/AuthContext';

export default function Header() {
    const router = useRouter();
    const { logout } = useAuth();

    return (
        <header className="sticky top-0 z-40 bg-white/80 dark:bg-slate-900/80 backdrop-blur-md border-b border-slate-200 dark:border-slate-800">
            <div className="max-w-6xl mx-auto px-4 py-4 sm:px-6 lg:px-8 flex justify-between items-center">
                <div className="flex items-center gap-3">
                <LuBicepsFlexed className="hidden sm:block text-2xl text-blue-500 font-black bg-linear-to-r from-blue-600 to-blue-500 dark:from-blue-400 dark:to-blue-300 bg-clip-text" />
                <h1 className="text-2xl font-black bg-linear-to-r from-blue-600 to-blue-500 dark:from-blue-400 dark:to-blue-300 bg-clip-text text-transparent">
                    FitTrack
                </h1>
                </div>
                <nav className="flex items-center gap-1 sm:gap-3">
                    <button
                        onClick={() => router.push('/')}
                        className="px-4 py-2 bg-indigo-50 dark:bg-indigo-950 text-indigo-600 dark:text-indigo-400 font-semibold rounded-lg hover:bg-indigo-100 dark:hover:bg-indigo-900 transition-colors border border-indigo-200 dark:border-indigo-800"
                    >
                        Home
                    </button>

                    <button
                        onClick={() => router.push('/profile')}
                        className="px-4 py-2 bg-blue-50 dark:bg-blue-950 text-blue-600 dark:text-blue-400 font-semibold rounded-lg hover:bg-blue-100 dark:hover:bg-blue-900 transition-colors border border-blue-200 dark:border-blue-800"
                    >
                        Profile
                    </button>
                    
                    <button
                        onClick={() => logout()}
                        className="px-4 py-2 bg-red-50 dark:bg-red-950 text-red-600 dark:text-red-400 font-semibold rounded-lg hover:bg-red-100 dark:hover:bg-red-900 transition-colors border border-red-200 dark:border-red-800"
                    >
                        Logout
                    </button>
                </nav>
            </div>
        </header>
    )
}