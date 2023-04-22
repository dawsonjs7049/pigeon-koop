import React, { useState } from 'react';
import Nav from './Nav';
import Head from 'next/head';
import { Box, HStack, Text } from '@chakra-ui/react';

export default function Layout({ children })
{
    const [darkMode, setDarkMode] = useState(false);

    return (
        <>
            <Head>
                <title>Piegon Koop Cabin</title>
                <meta name="description" content="Generated by create next app" />
                <meta name="viewport" content="width=device-width, initial-scale=1" />
                <link rel="icon" href="/favicon.ico" />
            </Head>
            <div>
                <div style={{height: '100vh', width: '100vw', overflowX: 'hidden'}}>
                    <Nav darkMode={darkMode} setDarkMode={setDarkMode}/>
                    <main>
                        { children }
                    </main>
                    <HStack h='10' bg='gray.700' w='100%' justifyContent='center' alignItems='center' position='absolute' bottom='0'>
                        <Text color='white' fontWeight='bold'>Notice a problem? Deal with it</Text>
                    </HStack>
                </div>
            </div> 
        </>
       
    )
}