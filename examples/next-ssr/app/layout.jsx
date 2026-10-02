export const metadata = {
  title: 'Kinetrell SSR verification',
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
