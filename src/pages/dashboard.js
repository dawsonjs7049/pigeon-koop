import Calendar from "@/components/Calender";
import { auth, db } from "@/utils/firebase";
import { collection, doc, onSnapshot, orderBy, query, where } from 'firebase/firestore';
import { useRouter } from "next/router";
import { useState, useEffect } from "react";
import { useAuthState } from "react-firebase-hooks/auth";
import Event from "@/models/Event";
import { Text, VStack } from "@chakra-ui/react";


export default function Dashboard() {

    const [events, setEvents] = useState();
    const [user, loading] = useAuthState(auth);
    const [name, setName] = useState('');

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
                console.log("EVENTS");
                console.log(events);
                setEvents(events);
            });

            return unsubscribe;
        }
    }, [user, loading]);

    return (
        <div>
            <Text>Welcome {name}</Text>
            <div className="widget-div">
                <a 
                    className="weatherwidget-io" 
                    href="https://forecast7.com/en/45d88n92d37/webster/?unit=us" 
                    data-label_1="WEBSTER" 
                    data-label_2="WEATHER" 
                    data-theme="original" 
                    >WEBSTER WEATHER
                </a>
            </div>
            <VStack w="100%" h="1000px" maxW='1300px' p='10' >
                <Calendar events={events} user={user} db={db} name={name} />
            </VStack>
        </div>
    )
}