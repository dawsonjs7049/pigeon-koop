import Calendar from "@/components/Calender";
import { auth, db } from "@/utils/firebase";
import { collection, doc, onSnapshot, orderBy, query, Timestamp, where } from 'firebase/firestore';
import { useRouter } from "next/router";
import { useState, useEffect } from "react";
import { useAuthState } from "react-firebase-hooks/auth";
import Event from "@/models/Event";
import { Box, Flex, HStack, SlideFade, Text, VStack } from "@chakra-ui/react";
import WeatherWidget from "@/components/WeatherWidget";
import TodoList from "@/components/TodoList";


export default function Dashboard() {

    const [events, setEvents] = useState();
    const [user, loading] = useAuthState(auth);
    const [name, setName] = useState('');
    const [reservationsInMonth, setReservationsInMonth] = useState([]);

    const router = useRouter();

    useEffect(() => {
        if(loading) return;

        if(!user) 
        {
            router.push('/');
        } 
        else 
        {
            setName(user.email.substring(0, user.email.indexOf('@')));

            const eventsRef = collection(db, 'reservations');

            const q = query(eventsRef, orderBy('timestamp', 'desc'));

            const unsubscribe = onSnapshot(q, (snapshot) => {
                let events = snapshot.docs.map((doc) => {
                    return new Event({ ...doc.data(), id: doc.id });
                });

                const today = new Date();
                const firstOfMonth = new Date(today.getFullYear(), today.getMonth(), 1).getTime();
                
                const myReservationsInMonth = [];
                events.forEach(event => {
                    if(event.user === user.email) {
                        const timestamp = new Timestamp(event.timestamp.seconds, event.timestamp.nanoseconds).toDate();
                        if(timestamp >= firstOfMonth) {
                            myReservationsInMonth.push(event);
                        }
                    }
                })

                setReservationsInMonth(myReservationsInMonth);
                setEvents(events);
            });



            return unsubscribe;
        }
    }, [user, loading]);

    return (
        <Box overflowX='hidden' height='max'>
            <WeatherWidget/>
            <Flex justifyContent='center'>
                <VStack w='100%' maxW="1300px" p='5' height='max'>
                   
                        <HStack w='100%' my='10'>
                            <Box w='50%'>
                                <SlideFade in={true} offsetX='20px' delay='2000s'>
                                    <Text fontWeight='bold' fontSize='2xl' mb='5'>Welcome {name}</Text>
                                    <Text fontWeight='bold' fontSize='xl'>You have {reservationsInMonth.length} reservations this month!</Text>
                                </SlideFade>
                            </Box>
                            <Box w='50%'>
                                <SlideFade in={true} offsetX='20px'>
                                    <TodoList user={user} />
                                </SlideFade>
                            </Box>
                        </HStack>
                    <Calendar events={events} user={user} db={db} name={name} />
                </VStack>
            </Flex>
        </Box>
    )
}