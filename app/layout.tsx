import type { Metadata } from "next";
import { Geist, Geist_Mono, Black_Ops_One } from "next/font/google";
import { AuthProvider } from "./utils/auth/AuthContext";
import { WorkoutProvider } from "./utils/workout/WorkoutContext";
import "./globals.css";

const blackOpsOne = Black_Ops_One({
  weight: "400",
  variable: "--font-black-ops-one",
  subsets: ["latin"],
});

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "FitTrack",
  description: "Track your workouts and monitor progress",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${blackOpsOne.className} ${geistSans.variable} ${geistMono.variable} h-full `}
    >
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </head>

      <body className="flex flex-col">
        <AuthProvider>
          <WorkoutProvider>
            <div className="min-h-screen">{children}</div>
          </WorkoutProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
