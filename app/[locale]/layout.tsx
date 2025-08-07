import { NextIntlClientProvider, hasLocale } from 'next-intl';
import { notFound } from 'next/navigation';
import { routing } from '@/i18n/routing';
import { getMessages } from 'next-intl/server';
import { Roboto, Montserrat, Open_Sans, Lato, Plus_Jakarta_Sans, Inter } from 'next/font/google';

import '@mantine/core/styles.css';
import { config } from '@fortawesome/fontawesome-svg-core'
import '@fortawesome/fontawesome-svg-core/styles.css'
config.autoAddCss = false
import { Provider } from './Provider';
import { Header } from '@/components/Header/Header';
import { Footer } from '@/components/Footer/Footer';
import ReduxProvider from './ReduxProvider';
import { EditorProvider } from './EditorContext';

export const roboto = Roboto({ subsets: ['latin'], weight: ['400', '600', '700'] });
export const montserrat = Montserrat({ subsets: ['latin'], weight: ['400', '700'] });
export const openSans = Open_Sans({ subsets: ['latin'], weight: ['400', '700'] });
export const lato = Lato({ subsets: ['latin'], weight: ['400', '700'] });
export const plusJakartaSans = Plus_Jakarta_Sans({ subsets: ['latin'], weight: ['400', '700'] });
export const inter = Inter({ subsets: ['latin'], weight: ['400', '700'] });

export default async function LocaleLAyout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  if (!hasLocale(routing.locales, locale)) {
    notFound();
  }
  const messages = await getMessages();

  return (
    <html lang={locale} className={`${roboto.className} ${montserrat.className} ${openSans.className} ${lato.className} ${plusJakartaSans.className} ${inter.className}`}>
      <head>
        <title>Quickpass</title>
        <link rel="icon" href="/favicon.ico" />
      </head>
      <body>
        <NextIntlClientProvider locale={locale} messages={messages}>
          <ReduxProvider>
            <Provider>
              <EditorProvider>
                <main style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
                  <Header />
                  <div style={{ marginTop: 72 }}>{children}</div>
                  <Footer />
                </main>
              </EditorProvider>
            </Provider>
          </ReduxProvider>
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
