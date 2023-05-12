import React, { useEffect, useState } from 'react';
import Nav from './Nav';
import Head from 'next/head';
import { Box, Flex, HStack, Text, useColorMode, useColorModeValue } from '@chakra-ui/react';
import { useRouter } from 'next/router';

export const DarkModeContext = React.createContext();

export default function Layout({ children })
{
    const { colorMode, toggleColorMode } = useColorMode();
    const [ isDarkMode, setIsDarkMode] = useState(false);

    const router = useRouter();
    const bgColor = useColorModeValue('white', 'gray.800');

    useEffect(() => {
        setIsDarkMode(colorMode == 'dark');
    })
    
    return (
        <>
            <Head>
                <title>Piegon Koop Cabin</title>
                <meta name="description" content="Generated by create next app" />
                <meta name="viewport" content="width=device-width, initial-scale=1" />
                <link rel="icon" href="/favicon.ico" />
            </Head>
            <Flex flexDir='column' bg={bgColor} h='100vh' justifyContent='space-between' w='100vw' overflowX='hidden'>
                <Box>
                    <Nav toggleColor={toggleColorMode} isDarkMode={isDarkMode} setIsDarkMode={setIsDarkMode} />
                    <DarkModeContext.Provider value={isDarkMode}>
                        <Box>
                            { children }
                        </Box>
                    </DarkModeContext.Provider>
                </Box>
                <Box>
                    {router.route !== '/' && 
                        <>
                            {/* a way to introduce padding without interfering with login page */}
                            <Box h='10'></Box>
                            <HStack h='40px' bg='gray.700' w='100%' justifyContent='center' alignItems='center' zIndex='1000' position='absolute' bottom='0'>
                                <Text color='white' fontWeight='bold'>Notice a problem? Deal with it</Text>
                            </HStack>     
                        </>          
                    }
                </Box>
            </Flex>
        </>
       
    )
}