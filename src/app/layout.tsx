
import type { Metadata } from 'next';
import './globals.css';
import { Providers } from '@/components/providers';
import { Toaster } from '@/components/ui/toaster';
import { FirebaseClientProvider } from '@/firebase'; // Import global provider

export const metadata: Metadata = {
  title: 'KeepInventory',
  description: 'KeepInventory - Sistema de Gestão Patrimonial (SGP)',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link
          rel="preconnect"
          href="https://fonts.gstatic.com"
          crossOrigin="anonymous"
        />
        <link
          href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="font-body antialiased">
        <Providers>
            {/* O FirebaseClientProvider agora envolve toda a aplicação,
                mas a lógica de autenticação está no AuthProvider dentro do (app) layout */}
           <FirebaseClientProvider>
              {children}
           </FirebaseClientProvider>
          <Toaster />
        </Providers>
      </body>
    </html>
  );
}
