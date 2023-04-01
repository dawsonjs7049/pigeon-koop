import Link from 'next/link';
import { auth } from '@/utils/firebase';
import { useAuthState } from 'react-firebase-hooks/auth';
import { useRouter } from 'next/router';
import { BsFillMoonStarsFill } from 'react-icons/bs';
import { Button, Text, Box, HStack, Spacer } from '@chakra-ui/react';

export default function Nav({ darkMode, setDarkMode })
{
    const [user, loading] = useAuthState(auth);

    const route = useRouter();

    function logout()
    {
        auth.signOut()

        route.push('/');
    }

    return (
        <HStack p="4">
            <Link href={"/dashboard"}>
                <Button variant="link" size={'lg'}>Pigeon Koop</Button>
            </Link> 
            <Spacer />
            <Box>
            {
                user &&
                (
                    <HStack>
                        <BsFillMoonStarsFill onClick={() => setDarkMode(!darkMode)} className="cursor-pointer text-3xl" stroke={darkMode ? "white" : "black"} fill={darkMode ? "white" : "black"}/>

                        <Link href={"/recipe"}>Link 1</Link>

                        <Link href={"/recipeSearch"}>Link 2</Link>

                        <Button size={'md'} onClick={() => logout() }>Logout</Button>
                    </HStack>
                ) 
            }
            </Box>
        </HStack>
    )
}