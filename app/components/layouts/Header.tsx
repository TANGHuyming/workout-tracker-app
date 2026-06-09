'use client';
import { FaXmark } from "react-icons/fa6";
import { useState } from "react";
import { GiHamburgerMenu } from "react-icons/gi";
import { LuBicepsFlexed } from 'react-icons/lu';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/app/utils/auth/AuthContext';

export default function Header() {
    const router = useRouter();
    const { logout } = useAuth();
    const [showDropdownMenu, setShowDropdownMenu] = useState(false);

    return (
        <header 
            onMouseLeave={() => setShowDropdownMenu(false)}
            className="sticky top-0 z-40 bg-white/80 dark:bg-slate-900/80 backdrop-blur-md border-b border-slate-200 dark:border-slate-800"
        >
            <div className="max-w-6xl mx-auto px-4 py-4 sm:px-6 lg:px-8 flex justify-between items-center">
                <div className="flex items-center gap-3">
                <LuBicepsFlexed className="hidden sm:block text-2xl text-blue-500 font-black bg-linear-to-r from-blue-600 to-blue-500 dark:from-blue-400 dark:to-blue-300 bg-clip-text" />
                <h1 className="text-2xl font-black bg-linear-to-r from-blue-600 to-blue-500 dark:from-blue-400 dark:to-blue-300 bg-clip-text text-transparent">
                    FitTrack
                </h1>
                </div>
                {/* Desktop navigation */}
                <nav className="hidden sm:flex items-center gap-1 sm:gap-3">
                    <button
                        onClick={() => router.push('/')}
                        className="px-4 py-2 bg-indigo-50 dark:bg-indigo-950 text-indigo-600 dark:text-indigo-400 font-semibold rounded-lg hover:bg-indigo-100 dark:hover:bg-indigo-900 transition-colors border border-indigo-200 dark:border-indigo-800"
                    >
                        Home
                    </button>
                    
                    <button
                        onClick={() => router.push('/history')} 
                        className="px-4 py-2 bg-blue-50 dark:bg-blue-950 text-blue-600 dark:text-blue-400 font-semibold rounded-lg hover:bg-blue-100 dark:hover:bg-blue-900 transition-colors border border-blue-200 dark:border-blue-800"
                    >
                        History
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

                <nav className="sm:hidden flex">
                    {
                        showDropdownMenu
                        ? 
                        <FaXmark onClick={() => setShowDropdownMenu(false)}/> 
                        : 
                        <GiHamburgerMenu onClick={() => setShowDropdownMenu(true)}/>
                    }
                
                    <div className={`${showDropdownMenu ? "flex" : "hidden"}`}>
                        <ul className="font-bold text-md fixed top-16 right-4 z-10 min-w-[50vw] bg-linear-to-br from-slate-50 to-blue-50 dark:from-slate-950 dark:to-blue-950 border-blue-950 rounded-md border-2">
                            <li className="dropdown_item" onClick={() => router.push('/')}>Home</li>
                            <li className="dropdown_item" onClick={() => router.push('/history')}>History</li>
                            <li className="dropdown_item" onClick={() => router.push('/profile')}>Profile</li> 
                            <li className="dropdown_item" onClick={() => logout()}>Logout</li>
                        </ul>
                    </div>
                </nav>
            </div>
        </header>
    )
}