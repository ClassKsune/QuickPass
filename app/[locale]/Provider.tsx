'use client';

import { GlobalStyles } from "./GlobalStyles";
import { createTheme, MantineProvider } from '@mantine/core';
import { SessionProvider } from 'next-auth/react';
import { useEffect, useState } from 'react';

const theme = createTheme({
  colors: {
    primary: [
      '#f0fbdc', // Lightest
      '#e1f8b9',
      '#d1f495',
      '#c2f172',
      '#b3ed4f',
      '#90E906', // Main green
      '#74ba05',
      '#588c04',
      '#3c5d02',
      '#202f01', // Darkest
    ],
  },
  primaryColor: 'primary',
});

export const Provider = ({ children }: { children: React.ReactNode }) => {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(false);
  }, [])

  if (loading) {
    return null; // or a loading spinner
  }

  return (
    <MantineProvider theme={theme}>
      <GlobalStyles />
      <SessionProvider>{children}</SessionProvider>
    </MantineProvider>
  );
};
