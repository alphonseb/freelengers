import appContext from 'context/AppContext'
import { useContext, useEffect, useState } from 'react'

import { fetchAPI } from 'utils/api'
import Button from 'components/elements/button'

export default function Network () {
    const { user } = useContext(appContext)
    
    const [receivedRequests, setReceivedRequests] = useState([])
    const [sentRequests, setSentRequests] = useState([])
    const [requestStatus, setRequestStatus] = useState('')
    
    const [friends, setFriends] = useState([])
    
    useEffect(() => {
        async function fetchRequests () {
            const received = await fetchAPI('/network-requests/received')
            if (received) {
                setReceivedRequests(received)
            }
            const sent = await fetchAPI('/network-requests/sent')
            if (sent) {
                setSentRequests(sent)
            }
        }
        if (user) {
            fetchRequests()
            setFriends(user.friends)
        }
    }, [user])
    
    const acceptRequest = async (requester) => {
        const friend = await fetchAPI(`/user/add-friend/${requester.id}`, {method: 'PUT'})
        if (friend) {
            setRequestStatus('Now in your network!')
            setFriends([...friends, friend])
        }
    }
    
    const denyRequest = async (requester) => {
        const request = await fetchAPI(`/user/deny-friend/${requester.id}`, {method: 'DELETE'})
        if (request) {
            setRequestStatus('Request denied.')
        }
    }
    return (
        <>
            <h1>My Network</h1>
            
            <h2>Pending Requests</h2>
            {receivedRequests.length ? (
                <ul>
                    {
                        receivedRequests.map(req => (
                            <li key={ req.id }>
                                <span>From { req.requester.username } - { req.requester.firstName } { req.requester.lastName }</span>
                                {
                                    requestStatus ? <span>{requestStatus}</span> : (
                                        <>
                                            <Button button={ { text: 'Accept' } } handleClick={() => {acceptRequest(req.requester)}} />
                                            <Button button={ { text: 'Decline' } } handleClick={ () => { denyRequest(req.requester) }} />
                                        </>
                                    )
                                }
                            </li>
                        ))
                    }
                </ul>
            ) : ''}
            <h2>Sent Requests</h2>
            {sentRequests.length ? (
                <ul>
                    {
                        sentRequests.map(req => (
                            <li key={ req.id }>
                                <span>To { req.requestee.username } - { req.requestee.firstName } { req.requestee.lastName }</span>
                            </li>
                        ))
                    }
                </ul>
            ) : '' }
            <h2>My Network</h2>
            {(friends.length) ? (
                <ul>
                    {
                        friends.map(friend => (
                            <li key={ friend.id }>{ friend.username }</li>
                        ))
                    }
                </ul>
            ) : ''}
        </>
    )
}