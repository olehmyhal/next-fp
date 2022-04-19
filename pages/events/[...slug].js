import { useEffect, useState } from 'react'
import { useRouter } from "next/router" 
import useSWR from "swr"

import { getFilteredEvents } from "../../helpers/api-utils"
import EventList from "../../components/events/event-list"
import ResultsTitle from '../../components/events/results-title'
import Button from "../../components/ui/Button"
import ErrorAlert from '../../components/ui/error-alert'

const FilteredEventPages = (props) => {
    const { hasError, events: eventsProps, date: dateProps } = props

    const router = useRouter()

    const [events, setEvents] = useState()

    const { data, error } = useSWR('https://next-test-pr-default-rtdb.firebaseio.com/events.json')
    console.log(data)
    useEffect(() => {
        if(data){
            const eventsArr = []

            for(const key in data){
                eventsArr.push({
                    id: key,
                    ...data[key]
                })
            }

            setEvents(eventsArr)
        }
    }, [data])

    const filteredData = router.query.slug

    if(!events){
        return <p className="center">Loading...</p>
    }

    const [filteredYear, filteredMonth] = filteredData
    const numYear = +filteredYear
    const numMonth = +filteredMonth

    if(isNaN(numYear) || isNaN(numMonth) || numMonth < 1 || numMonth > 12 || error){
        return <>
            <ErrorAlert><p>Invalid Filter. Please adjust your values!</p></ErrorAlert>
            <div className="center">
                    <Button link='/events'>Show all events!</Button>
            </div>
        </>
    }

    const filteredEvents = events.filter((event) => {
        const eventDate = new Date(event.date);
        return eventDate.getFullYear() === numYear && eventDate.getMonth() === numMonth - 1;
    });

    if(!eventsProps || eventsProps.length === 0){
        return <>
            <ErrorAlert><p>No events found!</p></ErrorAlert>
            <div className="center">
                <Button link='/events'>Show all events!</Button>
            </div>
        </>
    }

    const date = new Date(numYear, numMonth - 1)

    return <>
        <ResultsTitle date={date}/>
        <EventList items={eventsProps}/>
    </>
}

// export async function getServerSideProps(context){
//     const { params } = context

//     const filteredData = params.slug

//     const [filteredYear, filteredMonth] = filteredData
//     const numYear = +filteredYear
//     const numMonth = +filteredMonth

//     if(isNaN(numYear) || isNaN(numMonth) || numMonth < 1 || numMonth > 12){
//         return {
//             props: { hasError: true }
//         }
//     }

//     const filteredEvents = await getFilteredEvents({
//         year: numYear,
//         month: numMonth
//     })

//     return {
//         props: {
//             events: filteredEvents,
//             date: {
//                 year: numYear,
//                 month: numMonth
//             }
//         }
//     }
// }

export default FilteredEventPages