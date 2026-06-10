"use client";

import LoginRegister from "@/app/components/LoginRegister";
import { useState } from "react";

export default function LoginPage() {
  const [showRegister, setShowRegister] = useState(false);
  const [showResetPassword, setShowResetPassword] = useState(false);

  return (
    <div className="min-h-screen bg-linear-to-br from-slate-50 to-blue-50 dark:from-slate-950 dark:to-blue-950 flex items-center justify-center px-4 py-8">
      <div className="w-full max-w-md">
        {/* Header */}
        <div className="text-center mb-10">
          <div className="mb-6">
            <h1 className="text-5xl font-black bg-linear-to-r from-blue-600 to-blue-500 dark:from-blue-400 dark:to-blue-300 bg-clip-text text-transparent mb-2">
              💪 FitTrack
            </h1>
          </div>
          <p className="text-lg font-medium text-slate-600 dark:text-slate-300">
            Track your workouts and reach your goals
          </p>
        </div>

        <LoginRegister
          showRegister={showRegister}
          showResetPassword={showResetPassword}
          setShowRegister={setShowRegister}
          setShowResetPassword={setShowResetPassword}
        />
      </div>
    </div>
  );
}
