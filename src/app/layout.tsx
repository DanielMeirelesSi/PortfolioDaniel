import type { Metadata } from "next";
import Providers from "@/components/Providers";
import "./globals.css";

export const metadata: Metadata = {
  title: "Daniel Meireles | Desenvolvedor Full Stack",
  description:
    "Desenvolvedor focado em criar sistemas, APIs e soluções digitais para organizar processos, automatizar tarefas e resolver problemas reais.",
  openGraph: {
    title: "Daniel Meireles | Desenvolvedor Full Stack",
    description:
      "Desenvolvedor focado em criar sistemas, APIs e soluções digitais para organizar processos, automatizar tarefas e resolver problemas reais.",
    type: "website",
  },
};

const bootScript = `(function(){try{var t=localStorage.getItem('theme')||'light';document.documentElement.setAttribute('data-theme',t);var l=localStorage.getItem('lang');if(l){document.documentElement.lang=l==='pt'?'pt-BR':'en';}}catch(e){}})();`;

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="pt-BR" data-theme="light" suppressHydrationWarning>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Onest:wght@400;500;600;700&family=Hanken+Grotesk:wght@400;500;600;700&display=swap"
          rel="stylesheet"
        />
        <script dangerouslySetInnerHTML={{ __html: bootScript }} />
      </head>
      <body>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
