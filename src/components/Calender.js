import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import interactionPlugin from '@fullcalendar/interaction';
import googleCalendarPlugin from '@fullcalendar/google-calendar';
import { useRef, useState } from 'react';
import { getDateRange, formatDate } from '@/utils/utilities';
import { Box, Slider, SliderTrack, SliderFilledTrack, SliderThumb, ModalOverlay, Modal, Text, Button, ModalContent, ModalHeader, ModalFooter, ModalBody, ModalCloseButton, useDisclosure, HStack, useToast } from '@chakra-ui/react';
import { addDoc, collection, serverTimestamp } from 'firebase/firestore';

export default function Calendar({ events, user, db, name }) {

    const { isOpen: bookIsOpen, onOpen: bookOnOpen, onClose: bookOnClose } = useDisclosure();
    const { isOpen: cancelIsOpen, onOpen: cancelOnOpen, onClose: cancelOnClose } = useDisclosure();

    const [numPeople, setNumPeople] = useState();
    const [dateString, setDateString] = useState();
    const [selectedDates, setSelectedDates] = useState();

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
        console.log("DATES");
        console.log(dates);
        // if selected dates has dates user already booked, filter out all non-user booked dates and open cancellation modal
        let userEvents = [];
        dates.forEach((date) => {
            let event = events.filter(event => {
                console.log("EVENT");
                console.log(event);
                return ((String(event.date) === String(date)) && (event.title.includes(user.email)))
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

            var dateRangeString = (userEvents.length > 1 ? formatDate(userEvents[0].date) + "  ->  " + formatDate(userEvents[userEvents.length - 1].date) : formatDate(userEvents[0].date));
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

        selectedDates.forEach(async (date) => {
            const newDate = new Date(date);
            const calendarDate = date.getUTCFullYear() + "-" + ("0" + (date.getUTCMonth()+1)).slice(-2) + "-" + ("0" + date.getUTCDate()).slice(-2)
            
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

        toast({
            title: 'Success',
            description: "Your Reservation was Successful",
            status: "success",
            duration: 5000,
            isClosable: true,
        });
    }

    const cancelDates = () => {

    }

    const updatePeople = () => {

    }

    return (
        <Box shadow={"md"} borderRadius={"md"} w="100%" h="1000px" p='5'>
            <FullCalendar
                plugins={[ dayGridPlugin, interactionPlugin, googleCalendarPlugin ]}
                ref={calendarRef}
                defaultView="dayGridMonth" 
                selectable={true}
                googleCalendarApiKey="AIzaSyATsMPLPyPHnbg-gmZqtQPT1a_sdZk-aE8"
                select={onSelect}
                eventSources={sources}
                height="100%"
            >
            </FullCalendar>
            <Modal isCentered isOpen={bookIsOpen} onClose={bookOnClose}>
                <ModalOverlay bg='blackAlpha.300' backdropFilter='blur(10px) hue-rotate(90deg)' />
                <ModalContent>
                    <ModalHeader>Book Dates</ModalHeader>
                    <ModalCloseButton />
                    <ModalBody>
                        <Text>Booking: {dateString}</Text>
                        <Text>Expected People: {numPeople}</Text>
                        <Slider defaultValue={1} min={0} max={10} step={1} onChangeEnd={(val) => setNumPeople(val)}>
                            <SliderTrack bg='red.100'>
                                <Box position='relative' right={10} />
                                <SliderFilledTrack bg='tomato' />
                            </SliderTrack>
                            <SliderThumb boxSize={6} />
                        </Slider>
                        <HStack>
                            <Button onClick={bookDates} bgColor="teal.300">
                                Book
                            </Button>
                            <Button onClick={bookOnClose} bgColor="red.300">
                                Cancel
                            </Button>
                        </HStack>
                    </ModalBody>
                </ModalContent>
            </Modal>
        </Box>
    )
}