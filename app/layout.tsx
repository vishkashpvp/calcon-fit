import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { APP } from "@/config/constants";
import { COLOR_PRESETS } from "@/config/colors";
import { Providers } from "./providers";
import "./globals.css";

const geist = Geist({ variable: "--font-geist-sans", subsets: ["latin"] });
const geistMono = Geist_Mono({ variable: "--font-geist-mono", subsets: ["latin"] });

export const metadata: Metadata = {
  title: { default: APP.NAME, template: `%s | ${APP.NAME}` },
  description: APP.DESCRIPTION,
};

const accentScript = `try{var k='calconfit-accent',s=localStorage.getItem(k);if(s&&s!=='default'){var p=${JSON.stringify(COLOR_PRESETS.map((c) => ({ id: c.id, l: c.light, d: c.dark })))};var m=p.find(function(x){return x.id===s});if(m){var d=document.documentElement,t=localStorage.getItem('theme'),isDark=t==='dark'||(t!=='light'&&window.matchMedia('(prefers-color-scheme:dark)').matches),v=isDark?m.d:m.l;d.style.setProperty('--accent-violet',v);d.style.setProperty('--bar-fill',v);d.style.setProperty('--primary',v);d.style.setProperty('--primary-foreground','oklch(0.985 0 0)');d.style.setProperty('--ring',v)}}}catch(e){}`;
const sidebarScript = `try{if(localStorage.getItem('sidebar-expanded')==='false')document.documentElement.style.setProperty('--sb-rail','72px');if(localStorage.getItem('sidebar-position')==='right'){var s=document.documentElement.style;s.setProperty('--sb-left','auto');s.setProperty('--sb-right','0');s.setProperty('--sb-order','9999')}}catch(e){}`;

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: accentScript }} />
        <script dangerouslySetInnerHTML={{ __html: sidebarScript }} />
      </head>
      <body
        className={`${geist.variable} ${geistMono.variable} min-h-screen overflow-x-hidden font-sans antialiased`}
      >
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
