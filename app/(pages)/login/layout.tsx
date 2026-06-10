import { AuthProvider } from "@/app/utils/auth/AuthContext";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <body className="flex flex-col">
      <AuthProvider>
        <div className="min-h-screen">{children}</div>
      </AuthProvider>
    </body>
  );
}
