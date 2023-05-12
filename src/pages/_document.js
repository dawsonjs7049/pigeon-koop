import { Html, Head, Main, NextScript } from 'next/document'
import theme from '@/styles/theme';
import { ColorModeScript } from '@chakra-ui/react';

export default function Document() {
  return (
    <Html lang="en">
      <Head />
      <body>
        <ColorModeScript  initialColorMode={theme.initialColorMode}  />
        <Main />
        <NextScript />
      </body>
    </Html>
  )
}
