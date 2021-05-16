import React, { useContext, useState, useEffect } from 'react';
import appContext from 'context/AppContext'
import { fetchAPI } from 'utils/api'
import Link from 'next/link'

export default function Recommendations () {
    const { user } = useContext(appContext)
    
    const [recommendations, setRecommendations] = useState([])
    
    useEffect(() => {
        async function fetchRecommendations () {
            const recommendations = await fetchAPI(`/recommendations/recommendee/${ user.id }`)
            setRecommendations(recommendations)
        }
        if (user) {
            fetchRecommendations()
        }
    }, [user])
    
    return (
        <>
            <h1>My recommendations</h1>
            {
                recommendations.length ? (
                    <ul>
                        {
                            recommendations.map(recommendation => (
                                <li key={ recommendation.id }>Recommended by { recommendation.recommender.username } for the {recommendation.job} job - <Link href={`/projects/${recommendation.project.slug}`}><a>{ recommendation.project.name }</a></Link></li>
                            ))
                        }
                    </ul>
                ) : ''
            }
        </>
    )
}