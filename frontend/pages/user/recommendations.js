import React, { useContext, useState, useEffect } from 'react';
import appContext from 'context/AppContext'
import { fetchAPI } from 'utils/api'
import Link from 'next/link'
import ArrowRight from '../../src/assets/icons/arrow-right.svg'

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
        <div className="recommendations">
            <h1>Mes recommendations</h1>
            {
                recommendations.length ? (
                    <ul>
                        {
                            recommendations.map(recommendation => (
                                <li key={ recommendation.id }>
                                    <div className="infos">
                                        <p className="paragraph">Par : <span className="accent">{ recommendation.recommender.firstName } { recommendation.recommender.lastName }</span></p>
                                        <p className="paragraph">Pour le poste : <span className="accent">{ recommendation.job.name }</span></p>
                                        <p className="paragraph">Sur le projet : <span className="accent">{ recommendation.project.name }</span></p>
                                    </div>
                                    <Link href={ `/projects/${ recommendation.project.slug }?job=${ recommendation.job.id }` }>
                                        <a className="link paragraph">
                                            Je candidate !
                                            <ArrowRight />
                                        </a>
                                    </Link>
                                </li>
                            ))
                        }
                    </ul>
                ) : ''
            }
        </div>
    )
}