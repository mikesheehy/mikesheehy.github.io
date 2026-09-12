import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({
  variable: "--font-body",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

export const metadata: Metadata = {
  title: "Mike Sheehy | DevSecOps Engineer",
  description:
    "DevSecOps Engineer specializing in AI integration, cloud technologies, and full-stack development. Expertise in AIDLC, AWS, and accelerating team productivity.",
};

// Applies the saved/system theme before hydration so there's no flash of the
// wrong palette; ThemeToggle takes over once the client mounts.
const themeInitScript = `
(function () {
  try {
    var saved = localStorage.getItem('mikesheehy-theme');
    var theme = saved === 'light' || saved === 'dark'
      ? saved
      : (window.matchMedia('(prefers-color-scheme: light)').matches ? 'light' : 'dark');
    document.documentElement.setAttribute('data-theme', theme);
  } catch (e) {
    document.documentElement.setAttribute('data-theme', 'dark');
  }
})();
`;

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={inter.variable} suppressHydrationWarning>
      <head>
        <meta name="color-scheme" content="dark light" />
        <script dangerouslySetInnerHTML={{ __html: themeInitScript }} />
      </head>
      <body>{children}</body>
    </html>
  );
}
