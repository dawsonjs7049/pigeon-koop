import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import interactionPlugin from '@fullcalendar/interaction';
import googleCalendarPlugin from '@fullcalendar/google-calendar';
import { useRef } from 'react';
import { getDateRange, formatDate } from '../utils/utilities';
import { Box } from '@chakra-ui/react';

export default function Calendar({ events, setDateString, setNumPeople, setSelectedDates, setShowBookModal, setShowCancelModal }) {

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
                return ((String(event.fullDate) === String(date)) && (event.title.includes(username)))
            })

            if(event[0])
            {
                // if an event was returned, then this date is taken by the user already
                userEvents.push(event[0]);
                setNumPeople(event[0].totalPeople);
            }
        });
        if(userEvents.length > 0)
        {
            // open cancellation modal with userDates

            var dateRangeString = (userEvents.length > 1 ? formatDate(userEvents[0].fullDate) + "  ->  " + formatDate(userEvents[userEvents.length - 1].fullDate) : formatDate(userEvents[0].fullDate));
            setDateString(dateRangeString);
            setSelectedDates(userEvents);
            setShowCancelModal(true);
        }
        else
        {
            // do another filter to check that selected dates don't belong to anyone else
            let takenDates = [];
            dates.forEach(date => {
                let event = events.filter(event => {
                    return ((String(event.fullDate) === String(date)) && !(event.title.includes(username)))
                })
                
                if(event[0])
                {
                    // if an event was returned, then this date is taken by someone else already
                    takenDates.push(date);
                    setExpectedPeople(event[0].totalPeople);
                }
            })
            if(takenDates.length == 0)
            {
                // the selected dates were not taken by the user or by anyone else, open booking modal 

                var dateRangeString = (dates.length > 1 ? formatDate(dates[0]) + "  ->  " + formatDate(dates[dates.length - 1]) : formatDate(dates[0]));
                setDateString(dateRangeString);
                setSelectedDates(dates);
                setShowBookModal(true);
            }
        }
    }

    return (
        <Box shadow={"md"} borderRadius={"md"}>
            <FullCalendar
                plugins={[ dayGridPlugin, interactionPlugin, googleCalendarPlugin ]}
                ref={calendarRef}
                defaultView="dayGridMonth" 
                selectable={true}
                googleCalendarApiKey="AIzaSyATsMPLPyPHnbg-gmZqtQPT1a_sdZk-aE8"
                select={onSelect}
                eventSources={sources}
            >
            </FullCalendar>
        </Box>
    )
}