import { useRouter } from "next/router"

import { getAllEvents } from "../../helpers/api-utils"
import EventList from "../../components/events/event-list"
import EventSearch from "../../components/events/event-search"

const AllEventsPage = (props) => {
    const { events } = props

    const router = useRouter()

    const findEventHandler = (year, month) => {
        const fullPath = `/events/${year}/${month}`

        router.push(fullPath)
    }

    return <>
        <EventSearch onSearch={findEventHandler}/>
        <EventList items={events}/>
    </>
}

export async function getStaticProps(){
    const events = await getAllEvents()

    return {
        props: {
            events
        },
        revalidate: 60
    }
}

export default AllEventsPage