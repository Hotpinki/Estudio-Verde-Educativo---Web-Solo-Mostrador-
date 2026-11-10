import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

// 🔹 NUEVA IMPORTACIÓN: Traemos nuestra "Radio" (Estado Global)
import { AdminProvider } from "@/context/AdminContext";

const geistSans = Geist({
    variable: "--font-geist-sans",
    subsets: ["latin"],
});

const geistMono = Geist_Mono({
    variable: "--font-geist-mono",
    subsets: ["latin"],
});

export const metadata: Metadata = {
    title: "Estudio Verde Educativo", // 🔹 Título actualizado
    description: "Plataforma educativa de Estudio Verde",
};

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <html lang="es"> 
            <body
                className={`${geistSans.variable} ${geistMono.variable} antialiased`}
            >
                {/* 🔹 ENVOLVEMOS LA APLICACIÓN: Todo lo que esté aquí adentro tendrá acceso a la memoria global */}
                <AdminProvider>
                    {children}
                </AdminProvider>
            </body>
        </html>
    );
}