import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/components/theme-provider"
import { Toaster } from "@/components/ui/toaster"
import Header from "@/components/common/header";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata = {
  title: "Hours App",
  description: "Calculate hours completed and full details of staff in and out time",
};

const themesArray = [
  { theme: "light", name: "Light" },
  { theme: "dark", name: "Dark" },
  { theme: "system", name: "System" },
  { theme: "rose", name: "Rose" },
  { theme: "rose-dark", name: "Rose Dark" },
  { theme: "blue", name: "Blue" },
  { theme: "blue-dark", name: "Blue Dark" },
];

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <ThemeProvider
            attribute="class"
            defaultTheme="system"
            enableSystem
            themes={themesArray.map((theme) => theme.theme)} // Extract string values
            disableTransitionOnChange
          >
          <Toaster />
          <Header themes={themesArray}/>
          {children}
        </ThemeProvider>
      </body>
    </html>
  );
}
