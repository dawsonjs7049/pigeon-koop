import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import interactionPlugin from '@fullcalendar/interaction';
import googleCalendarPlugin from '@fullcalendar/google-calendar';
import { useRef, useState } from 'react';
import { getDateRange, formatDate } from '@/utils/utilities';
import { Box, Slider, SliderTrack, SliderFilledTrack, SliderThumb, ModalOverlay, Modal, Text, Button, ModalContent, ModalHeader, ModalFooter, ModalBody, ModalCloseButton, useDisclosure, HStack, useToast, Switch } from '@chakra-ui/react';
import { addDoc, collection, deleteDoc, doc, serverTimestamp, Timestamp, updateDoc } from 'firebase/firestore';
import { sendEmail } from '@/utils/email';

export default function Calendar({ events, user, db, name }) {

    const { isOpen: bookIsOpen, onOpen: bookOnOpen, onClose: bookOnClose } = useDisclosure();
    const { isOpen: cancelIsOpen, onOpen: cancelOnOpen, onClose: cancelOnClose } = useDisclosure();

    const [numPeople, setNumPeople] = useState(1);
    const [dateString, setDateString] = useState();
    const [selectedDates, setSelectedDates] = useState();
    const [notify, setNotify] = useState(true);

    const toast = useToast();

    const calendarRef = useRef();

    const sources = [
        {
            events
        },
        {
            googleCalendarId: 'en.usa#holiday@group.v.calendar.google.com',
            color: 'green',
        }
    ];

    const onSelect = (info) => {
        let dates = getDateRange(info.start, info.end);

        // if selected dates has dates user already booked, filter out all non-user booked dates and open cancellation modal
        let userEvents = [];
        dates.forEach((date) => {
            let event = events.filter(event => {
                if(event.fullDate) 
                {
                    let fullEventDate = new Timestamp(event.fullDate.seconds, event.fullDate.nanoseconds).toDate();
                    console.log("FULL EVENT DATE: " + fullEventDate);
                    console.log("DATE: " + date);
                    console.log(event.user === user.email);
                    return ( (String(fullEventDate) == String(date)) && (event.user === user.email) );
                }

                // return ( (String(event.fullDate) === String(date)) && (event.user == user.email) )
            })

            if(event[0])
            {
                // if an event was returned, then this date is taken by the user already
                userEvents.push(event[0]);
                setNumPeople(event[0].people);
            }
        });
        if(userEvents.length > 0)
        {
            // open cancellation modal with userDates
            var dateRangeString = (userEvents.length > 1 ? userEvents[0].date + "  ->  " + userEvents[userEvents.length - 1].date : userEvents[0].date);
            // var dateRangeString = (userEvents.length > 1 ? formatDate(userEvents[0].date) + "  ->  " + formatDate(userEvents[userEvents.length - 1].date) : formatDate(userEvents[0].date));
            setDateString(dateRangeString);
            setSelectedDates(userEvents);

            cancelOnOpen();
        }
        else
        {
            // do another filter to check that selected dates don't belong to anyone else
            let takenDates = [];
            dates.forEach(date => {
                let event = events.filter(event => {
                    return ((String(event.date) === String(date)) && (event.user != user.email))
                })
                
                if(event[0])
                {
                    // if an event was returned, then this date is taken by someone else already
                    takenDates.push(date);
                    setExpectedPeople(event[0].people);
                }
            })
            if(takenDates.length == 0)
            {
                // the selected dates were not taken by the user or by anyone else, open booking modal 

                var dateRangeString = (dates.length > 1 ? formatDate(dates[0]) + "  ->  " + formatDate(dates[dates.length - 1]) : formatDate(dates[0]));
                setDateString(dateRangeString);
                setSelectedDates(dates);
                bookOnOpen();
            }
        }
    }

    const bookDates = async () => {
        const collectionRef = collection(db, 'reservations');
        const dateArray = [];

        selectedDates.forEach(async (date) => {
            const newDate = new Date(date);
            const calendarDate = date.getUTCFullYear() + "-" + ("0" + (date.getUTCMonth()+1)).slice(-2) + "-" + ("0" + date.getUTCDate()).slice(-2)
            
            dateArray.push(("0" + (date.getUTCMonth()+1)).slice(-2) + "-" + ("0" + date.getUTCDate()).slice(-2) + "-" + date.getUTCFullYear());

            await addDoc(collectionRef, {
                title: name + " - " + numPeople,
                people: numPeople,
                niceDate: dateString,
                date: calendarDate,
                fullDate: newDate,
                user: user.email,
                timestamp: serverTimestamp()
            });
        });

        bookOnClose();

        if (notify) {
            const dates = dateArray.length == 1 ? dateArray[0] : dateArray[0] + " -> " + dateArray[dateArray.length - 1];
            const username = user.email.substring(0, user.email.indexOf('@'));

            await sendEmail({ from: user.email, date: dates, people: numPeople, user: username })
        }

        toast({
            title: 'Success',
            description: "Your Reservation was Successful",
            status: "success",
            duration: 5000,
            isClosable: true,
        });
    }

    const cancelDates = () => {

        selectedDates.forEach(async (event) => {
            const docRef = doc(db, 'reservations', event.id);
            await deleteDoc(docRef);
        });

        cancelOnClose();

        toast({
            title: 'Success',
            description: "Your Reservation was Cancelled",
            status: "success",
            duration: 5000,
            isClosable: true,
        });
    }

    const updatePeople = () => {
        selectedDates.forEach(async (event) => {
            event.people = numPeople;
            event.title = name + " - " + numPeople;

            const docRef = doc(db, 'reservations', event.id);
            await updateDoc(docRef, { ...event });
        });

        cancelOnClose();

        toast({
            title: 'Success',
            description: "Your Reservation was Updated",
            status: "success",
            duration: 5000,
            isClosable: true,
        });
    }

    return (
        <>
            <Box shadow='lg' borderRadius={"md"} w="100%" h="1000px" p='5' bgColor='white' color='black'>
                <FullCalendar
                    plugins={[ dayGridPlugin, interactionPlugin, googleCalendarPlugin ]}
                    ref={calendarRef}
                    initialView="dayGridMonth" 
                    selectable={true}
                    googleCalendarApiKey="AIzaSyATsMPLPyPHnbg-gmZqtQPT1a_sdZk-aE8"
                    select={onSelect}
                    eventSources={sources}
                    height="100%"
                >
                </FullCalendar>
            </Box>
            <Modal isOpen={bookIsOpen} onClose={bookOnClose} size="md">
                <ModalOverlay bg='blackAlpha.300' backdropFilter='blur(10px) hue-rotate(90deg)' />
                <ModalContent h='fit-content'>
                    <ModalHeader>Book Reservation</ModalHeader>
                    <ModalCloseButton />
                    <ModalBody>
                        <Text fontSize='xl' fontWeight='bold' textAlign='center'>Booking: {dateString}</Text>
                        <Box color='black' borderRadius='10px' mt='10' p='5' backgroundColor='ghostwhite'>
                            <Text fontSize='xl' textAlign='center'>Expected People: {numPeople}</Text>
                            <Slider mt='5' defaultValue={1} min={0} max={10} step={1} onChangeEnd={(val) => setNumPeople(val)}>
                                <SliderTrack bg='red.100'>
                                    <Box position='relative' right={10} />
                                    <SliderFilledTrack bg='tomato' />
                                </SliderTrack>
                                <SliderThumb boxSize={6} />
                            </Slider>
                        </Box>
                        <HStack placeContent="center" w="full" mt="5">
                            <Switch size="lg" isChecked={notify} onChange={() => setNotify(!notify)}/>
                            <Text>Notify Others</Text>
                        </HStack>
                        <Button my='10' w='100%' onClick={bookDates} bgColor="teal.300">
                            Book
                        </Button>
                    </ModalBody>
                    <ModalFooter>
                        <Button onClick={bookOnClose} bgColor="red.300">
                            Cancel
                        </Button>
                    </ModalFooter>
                </ModalContent>
            </Modal>
            <Modal isOpen={cancelIsOpen} onClose={cancelOnClose}>
                <ModalOverlay bg='blackAlpha.300' backdropFilter='blur(10px) hue-rotate(90deg)' />
                <ModalContent h='fit-content'>
                    <ModalHeader>Update/Cancel</ModalHeader>
                    <ModalCloseButton />
                    <ModalBody>
                        <Text fontSize='xl' fontWeight='bold' textAlign='center'>Booking: {dateString}</Text>
                        <Box color='black' borderRadius='10px' mt='10' p='5' backgroundColor='ghostwhite'>
                            <Text fontSize='xl' textAlign='center'>Update - People: {numPeople}</Text>
                            <Slider mt="5" defaultValue={numPeople} min={0} max={10} step={1} onChangeEnd={(val) => setNumPeople(val)}>
                                <SliderTrack bg='red.100'>
                                    <Box position='relative' right={10} />
                                    <SliderFilledTrack bg='tomato' />
                                </SliderTrack>
                                <SliderThumb boxSize={6} />
                            </Slider>
                        </Box>
                        <Button backgroundColor='teal.300' w="100%" my='5' onClick={updatePeople}>Update</Button>
                        <hr></hr>
                        <Text my='5' textAlign='center' fontSize='xl'>OR</Text>
                        <Button backgroundColor="red.300" mb='10' w="100%" onClick={cancelDates}>Cancel Reservation</Button>
                    </ModalBody>
                    <ModalFooter>
                        <Button onClick={cancelOnClose} bgColor="red.300">
                            Close
                        </Button>
                    </ModalFooter>
                </ModalContent>
            </Modal>
        </>

    )
}