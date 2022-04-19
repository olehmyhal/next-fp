import { getEventById, getFeaturedEvents } from '../../helpers/api-utils'
import EventSummary from '../../components/event-detail/event-summary'
import EventLogistics from '../../components/event-detail/event-logistics'
import EventContent from '../../components/event-detail/event-content'
import ErrorAlert from '../../components/ui/error-alert'

const EventDetailPage = (props) => {
    const { selectedEvent } = props

    if(!selectedEvent){
        return <ErrorAlert><p>No Event found</p></ErrorAlert>
    }

    return <>
        <EventSummary title={selectedEvent.title}/>
        <EventLogistics 
            date={selectedEvent.date} 
            address={selectedEvent.location} 
            image={selectedEvent.image} 
            imageAlt={selectedEvent.title}
        />
        <EventContent>
            <p>{selectedEvent.description}</p>
        </EventContent>
    </>
}

export async function getStaticProps(context){
    const { eventId } = context.params

    const event = await getEventById(eventId)

    return {
        props: {
            selectedEvent: event
        },
        revalidate: 30
    }
}

export async function getStaticPaths(){
    const events = await getFeaturedEvents()

    const paths = events.map(event => ({params: { eventId: event.id }}))

    return {
        paths,
        fallback: 'blocking'
    }
}

export default EventDetailPage