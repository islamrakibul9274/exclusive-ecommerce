import "../src/index.css";
import Providers from "../src/Providers";
export const metadata = {
  title: {
    default: "Exclusive — Considered finds for everyday life",
    template: "%s | Exclusive",
  },
  description:
    "Good things for the way you live, work, and play. Discover a considered collection of gaming, technology, fashion, and home essentials.",
  icons: { icon: "/favicon.svg" },
};
export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
