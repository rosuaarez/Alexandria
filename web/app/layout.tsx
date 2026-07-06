import type { Metadata } from "next";
import "@/styles/globals.css";
import { AuthProvider } from "@/components/providers/AuthProvider";
import { ToastContainer } from "@/components/ui/Toast";
import { GeneratingBar } from "@/components/ui/GeneratingBar";

export const metadata: Metadata = {
  title: {
    default: "Alexandría",
    template: "%s — Alexandría",
  },
  description: "Plataforma de investigación UX para equipos de producto",
  icons: {
    icon: "/favicon.svg",
  },
};

// Script inline que aplica la clase `dark-mode` en <body> antes del primer paint
// para evitar FOUC. Se coloca como primer hijo de <body> (no en <head>) porque
// el HTML original usa body.dark-mode y document.body debe existir al ejecutarlo.
// El estado del store se sincroniza luego con initTheme().
const darkModeScript = `
  try {
    if (localStorage.getItem('alexandria-dark-mode') === 'true')
      document.body.classList.add('dark-mode');
  } catch (e) {}
`;

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es" suppressHydrationWarning>
      <body suppressHydrationWarning>
        <script dangerouslySetInnerHTML={{ __html: darkModeScript }} />
        <AuthProvider>
          <GeneratingBar />
          {children}
          <ToastContainer />
        </AuthProvider>
      </body>
    </html>
  );
}
