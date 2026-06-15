import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import NavBar from "./components/NavBar";
import Footer from "./components/Footer";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { ThemeProvider } from "next-themes";
import GoogleProvider from "./components/GoogleProvider";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-sans",
});

export const metadata: Metadata = {
  title: "Let us Echo",
  description: "AI-powered translation for African languages and beyond",
  icons: {
    icon: [
      { url: "/icon.svg", type: "image/svg+xml" },
      { url: "/favicon.ico", sizes: "any" },
    ],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        {/* <script
          src="https://ternkonnect-widget.vercel.app/widget.js"
          data-account="Y4TeKv2Ybm"
        ></script> */}

        {/* <script
          src="https://cdn.ternkonnect.com/widget.js"
          data-account="Y4TeKv2Ybm"
        ></script> */}
      </head>
      <body
        className={`${inter.variable} font-sans antialiased bg-background text-foreground transition-colors duration-300`}
      >
        <GoogleProvider>
          {/* <NavBar /> */}
          <ThemeProvider attribute="class" defaultTheme="system" enableSystem>

            {children}
            <ToastContainer />
          </ThemeProvider>
          {/* <Footer /> */}
        </GoogleProvider>
      </body>
    </html>
  );
}
