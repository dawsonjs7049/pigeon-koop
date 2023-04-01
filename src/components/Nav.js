import Link from 'next/link';
import { auth } from '@/utils/firebase';
import { useAuthState } from 'react-firebase-hooks/auth';
import { useRouter } from 'next/router';
import { BsFillMoonStarsFill } from 'react-icons/bs';

export default function Nav({ darkMode, setDarkMode })
{
    const [user, loading] = useAuthState(auth);

    const route = useRouter();
console.log("USER: " + JSON.stringify(user));
    function logout()
    {
        auth.signOut()

        route.push('/auth/login');
    }

    return (
        <nav className="flex flex-col md:flex-row justify-between items-center py-10">
            <Link href={"/dashboard"}>
                <button className="text-3xl font-bold text-cyan-500">Pigeon Koop</button>
            </Link> 
            {
                user &&
                (
                    <div className="flex items-center gap-5 mt-5 md:mt-0">
                        <ul>
                            <BsFillMoonStarsFill onClick={() => setDarkMode(!darkMode)} className="cursor-pointer text-3xl" stroke={darkMode ? "white" : "black"} fill={darkMode ? "white" : "black"}/>
                        </ul>

                        <ul className="">
                            <Link href={"/recipe"}>Link 1</Link>
                        </ul>

                        <ul className="">
                            <Link href={"/recipeSearch"}>Link 2</Link>
                        </ul>
                        
                        <ul className="">
                            <button onClick={() => logout() }>Logout</button>
                        </ul>
                    </div>
                ) 
            }
         
        </nav>
    )
}