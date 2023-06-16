import Link from 'next/link';
import { auth } from '@/utils/firebase';
import { useAuthState } from 'react-firebase-hooks/auth';
import { useRouter } from 'next/router';
import { BsFillMoonStarsFill, BsArrowDown } from 'react-icons/bs';
import { Button, Text, Box, HStack, Spacer, Flex, VStack, Collapse, useDisclosure, SlideFade, Divider, useColorMode } from '@chakra-ui/react';
import { AnimatePresence, motion } from 'framer-motion';
import { MdLogout } from 'react-icons/md';
import { HiOutlineSun } from 'react-icons/hi';
import { useEffect } from 'react';

export default function Nav({ toggleColor, isDarkMode, setIsDarkMode })
{
    const [user, loading] = useAuthState(auth);

    const { isOpen, onToggle } = useDisclosure();

    const route = useRouter();
    
    function logout() {
        auth.signOut()
        route.push('/');
    }

    return (
        <Flex justifyContent='center' bg='blue.600' h='76px'>
            <VStack w='100%' maxW='1300px'>
                <HStack px="4" pt='2' w='100%'>
                    <Link href={"/dashboard"}>
                        <Text fontSize='2xl' fontWeight='bold' color='white'>Pigeon Koop</Text>
                    </Link> 
                    <Spacer />
                    <Box>
                    {
                        user &&
                        (
                            <HStack h='60px' alignItems='center'>
                                <VStack justifyContent='center' alignItems='center' px='5' h='100%' onMouseEnter={onToggle}>
                                    <BsArrowDown fontSize='25px' color='white'></BsArrowDown>
                                </VStack>
                                <Divider orientation='vertical' borderWidth='2px' borderRadius='xl' borderColor='white'></Divider>
                                <VStack justifyContent='center' alignItems='center' px='5' h='100%'>
                                    { isDarkMode ? (
                                        <Box width='25px'>
                                            <HiOutlineSun
                                                fontSize='25px' 
                                                color='white' 
                                                onClick={() => {
                                                    toggleColor();
                                                    setIsDarkMode(false);
                                                }}
                                            cursor='pointer'/>      
                                        </Box>
                                    ) : (
                                        <Box width='25px'>
                                            <BsFillMoonStarsFill 
                                                fontSize='20px' 
                                                color='white' 
                                                onClick={() => {
                                                    toggleColor();
                                                    setIsDarkMode(true);
                                                }}
                                                cursor='pointer'/>
                                        </Box>
                                    )}
                                </VStack>
                                <Divider orientation='vertical' borderWidth='2px' borderRadius='xl' borderColor='white'></Divider>
                                <VStack justifyContent='center' alignItems='center' px='5' h='100%' cursor='pointer' onClick={logout}>
                                    <MdLogout fontSize='25px' color='white' />
                                </VStack>
                            </HStack>
                        ) 
                    }
                    </Box>
                </HStack>
                <Box w='100%' position='relative' zIndex='1000'>
                    <Box position='absolute' top='0' left='0' w='100%' zIndex='1000'>
                        <Collapse in={isOpen} animateOpacity onMouseLeave={onToggle}>
                            <Box p='10' w='100%' color='white' bg='ghostwhite' boxShadow='md'>
                                {isOpen &&
                                    <HStack w='100%' zIndex='1000'>
                                        <motion.div
                                            key={'photosLink'}
                                            style={{width: '33%'}}
                                            initial="initialState"
                                            animate="animateState"
                                            exit="exitState"
                                            transition={{ duration: 0.6 }}
                                            variants={{
                                                initialState: {
                                                    opacity: 0,
                                                    x: '-30px'
                                                },
                                                animateState: {
                                                    opacity: 1,
                                                    x: '0px'
                                                },
                                                exitState: {
                                                    opacity: 0, 
                                                    x: '30px'
                                                }
                                            }}
                                            >
                                                <Link href="/photos">
                                                    <Text color='black' fontWeight='bold' fontSize='xl' textAlign='center'>Photos</Text>
                                                </Link>
                                        </motion.div>
                                        <motion.div
                                            key={'expenseLink'}
                                            style={{width: '33%'}}
                                            initial="initialState"
                                            animate="animateState"
                                            exit="exitState"
                                            transition={{ duration: 0.8 }}
                                            variants={{
                                                initialState: {
                                                    opacity: 0,
                                                    x: '-30px'
                                                },
                                                animateState: {
                                                    opacity: 1,
                                                    x: '0px'
                                                },
                                                exitState: {
                                                    opacity: 0, 
                                                    x: '30px'
                                                }
                                            }}
                                            >
                                                 <Link href="/expenses">
                                                    <Text color='black' fontWeight='bold' fontSize='xl' textAlign='center'>Expenses</Text>
                                                </Link>
                                        </motion.div>
                                        <motion.div
                                            key={'mapLink'}
                                            style={{width: '33%'}}
                                            initial="initialState"
                                            animate="animateState"
                                            exit="exitState"
                                            transition={{ duration: 1 }}
                                            variants={{
                                                initialState: {
                                                    opacity: 0,
                                                    x: '-30px'
                                                },
                                                animateState: {
                                                    opacity: 1,
                                                    x: '0px'
                                                },
                                                exitState: {
                                                    opacity: 0, 
                                                    x: '30px'
                                                }
                                            }}
                                            >
                                                 <Link href="/map">
                                                    <Text color='black' fontWeight='bold' fontSize='xl' textAlign='center'>Map</Text>
                                                </Link>
                                        </motion.div>
                                    </HStack>
                                }
                            </Box>
                        </Collapse>
                    </Box>
                </Box>
            </VStack>
        </Flex>
    )
}