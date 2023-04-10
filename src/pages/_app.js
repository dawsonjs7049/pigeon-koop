import Layout from '@/components/Layout';
import '@/styles/globals.css'
import { ChakraProvider, Toast } from '@chakra-ui/react'
import 'react-toastify/dist/ReactToastify.css';

export default function App({ Component, pageProps }) {
  return (
    <ChakraProvider>
      <Layout>
        <Component {...pageProps} />
      </Layout>
    </ChakraProvider>
  );
}
