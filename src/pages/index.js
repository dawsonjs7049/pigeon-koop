import Head from 'next/head'
import Image from 'next/image'
import { Inter } from 'next/font/google'
import styles from '@/styles/Home.module.css'
import { Card, Flex, Text, CardHeader, Heading, CardBody, VStack, Input, CardFooter, Button, Box } from '@chakra-ui/react'
import { useState } from 'react'
import { signInWithEmailAndPassword } from 'firebase/auth'
import { auth } from '@/utils/firebase'
import { useRouter } from 'next/router'
import { useToast } from '@chakra-ui/react'

const inter = Inter({ subsets: ['latin'] })

export default function Home() {

  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  const router = useRouter();
  const toast = useToast();

  const handleLogin = async () => {
    try 
    {
      let result = await signInWithEmailAndPassword(auth, username, password);
      router.push('/dashboard');
    }
    catch (error)
    {
      console.log("ERROR: " + error);
      toast({
        title: 'Error',
        description: 'Login Credentials Incorrect',
        status: 'error',
        duration: 5000,
        isClosable: false,
      });
    }
  };

  return (
      <section>
        <Flex h="100%" justify={'center'} align='center'>
          <Card size={'lg'} shadow="lg">
            <CardHeader>
              <Heading size='lg' textAlign={'center'}>The Pigeon Koop</Heading>
            </CardHeader>
            <CardBody>
              <VStack>
                <Input placeholder="Username" value={username} onChange={(e) => setUsername(e.target.value)} size={'lg'} />
                <Input placeholder="Password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} size={'lg'} />
              </VStack>
            </CardBody>
            <CardFooter>
              <Button colorScheme='twitter' w='100%' onClick={handleLogin}>Login</Button>
            </CardFooter>
          </Card>
        </Flex>
        <div class='air air1'></div>
        <div class='air air2'></div>
        <div class='air air3'></div>
        <div class='air air4'></div>
      </section>
  )
}
