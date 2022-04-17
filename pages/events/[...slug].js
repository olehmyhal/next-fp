import { useRouter } from "next/router" 

import { getFilteredEvents } from "../../dummy-data"
import EventList from "../../components/events/event-list"
import ResultsTitle from '../../components/events/results-title'
import Button from "../../components/ui/Button"
import ErrorAlert from '../../components/ui/error-alert'

const FilteredEventPages = () => {
    const router = useRouter()

    const filteredData = router.query.slug

    if(!filteredData){
        return <p className="center">Loading...</p>
    }

    const [filteredYear, filteredMonth] = filteredData
    const numYear = +filteredYear
    const numMonth = +filteredMonth

    if(isNaN(numYear) || isNaN(numMonth) || numMonth < 1 || numMonth > 12){
        return <>
            <ErrorAlert><p>Invalid Filter. Please adjust your values!</p></ErrorAlert>
            <div className="center">
                    <Button link='/events'>Show all events!</Button>
            </div>
        </>
    }

    const filteredEvents = getFilteredEvents({
        year: numYear,
        month: numMonth
    })

    if(!filteredEvents || filteredEvents.length === 0){
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
        <EventList items={filteredEvents}/>
    </>
}

export default FilteredEventPages