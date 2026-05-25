import type { Metadata } from 'next';
import { headers } from 'next/headers';
import './globals.css';
import { SITE_URL } from '@/lib/site';

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL)
};

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  const localeHeader = (await headers()).get('x-locale');
  const htmlLang = localeHeader === 'ru' ? 'ru' : 'en';

  return (
    <html lang={htmlLang} suppressHydrationWarning>
      <head>
        <meta name="google-site-verification" content="IazBwJaQxbS-sb8Mafj3ClNeIRsh3aIFKsLAu63ctyc" />
      </head>
      <body suppressHydrationWarning>{children}</body>
    </html>
  );
}
