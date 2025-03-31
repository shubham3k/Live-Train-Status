
import { Inter } from 'next/font/google';
import './globals.css'; // Import Tailwind CSS

const inter = Inter({ subsets: ['latin'] });

// Metadata can be exported directly in JS too
export const metadata = {
  title: 'Live Train Tracker',
  description: 'Track Indian railway trains live on the map',
};

export default function RootLayout({ children }) { // Removed type annotation
  return (
    <html lang="en">
      <head>
        {/* Load Leaflet CSS globally */}
        <link
           rel="stylesheet"
           href="https://unpkg.com/leaflet@1.9.4/dist/leaflet.css"
           integrity="sha256-p4NxAoJBhIIN+hmNHrzRCf9tD/miZyoHS5obTRR9BMY="
           crossOrigin=""
        />
         <link rel="icon" href="/favicon.ico" />
      </head>
      <body className={inter.className}>
        {children}
      </body>
    </html>
  );
}
