import React from "react";
import "./globals.css";
import Footer from "./Footer";

export const metadata = {
  title: "ICT Laws Hub",
  description:
    "Your comprehensive resource for ICT laws and regulations around the world.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        {children}
        <Footer />
      </body>
    </html>
  );
}
