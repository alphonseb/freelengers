import { useContext, useEffect, useState } from 'react'
import { fetchAPI } from 'utils/api'
import { useRouter } from 'next/router'
import Button from 'components/elements/button'
import AppContext from 'context/AppContext'

export default function SingleProject () {
    const { user } = useContext(AppContext)
    const router = useRouter()
    const { slug } = router.query
    const [isLoading, setIsLoading] = useState(true)
    const [project, setProject] = useState({})
    useEffect(() => {
        async function fetchProject () {
            const project = await fetchAPI(`/projects/slug/${ slug }`)
            setProject(project)
            console.log(user, project);
            const application = await fetchAPI(`/applications/project/${ project.id }/user/${ user.id }`)
            const newRecommendations = {}
            if (application) {
                setApplication(application)
                setHasApplied(true)
                newRecommendations[application.job.name] =  user
            }
            
            const recommendations = await fetchAPI(`/recommendations/recommender/${ user.id }/project/${ project.id }`)
            if (recommendations.length) {
                recommendations.forEach(recommendation => {
                    newRecommendations[recommendation.job.name] = recommendation.recommendee
                })
            }
            setJobsRecommendations(newRecommendations)
            setIsLoading(false)
        }
        if (user) {
            
            fetchProject()
        }
    }, [user])
    
    
    
    const [selectedJob, setSelectedJob] = useState('')
    const [dailyRate, setDailyRate] = useState(0)
    const [daysNumber, setDaysNumber] = useState(0)
    
    const [hasApplied, setHasApplied] = useState(false)
    const [application, setApplication] = useState(null)
    
    const [jobsRecommendations, setJobsRecommendations] = useState({})
    
    const [showNetwork, setShowNetwork] = useState(false)
    const [recommendingFor, setRecommendingFor] = useState('')
    const [selectedFriendId, setSelectedFriendId] = useState('')
    
    const [showApplication, setShowApplication] = useState(false)
    
    const apply = async () => {
        console.log(selectedJob, dailyRate, daysNumber);
        const createdApplication = await fetchAPI('/applications', { method: 'POST', body: JSON.stringify({job: selectedJob, dailyRate, daysNumber, project: project.id, user: user.id})})
        setHasApplied(true)
        setApplication(createdApplication)
        setJobsRecommendations({...jobsRecommendations, [createdApplication.job.name]: user})
    }
    
    const startRecommendation = (job) => {
        setRecommendingFor(job.id)
        setShowNetwork(true)
    }
    
    const recommend = async () => {
        const recommendationBody = {
            recommender: user.id,
            recommendee: selectedFriendId,
            project: project.id,
            job: recommendingFor
        }
        
        const applicationBody = {
            recommends: [...application.recommends, selectedFriendId]
        }
        
        const recommendation = await fetchAPI('/recommendations', { method: 'POST', body: JSON.stringify(recommendationBody) })
        setJobsRecommendations({ ...jobsRecommendations, [recommendation.job.name]: recommendation.recommendee })
        
        const updatedApplication = await fetchAPI(`/applications/${ application.id }`, { method: 'PUT', body: JSON.stringify(applicationBody) })
        setApplication(updatedApplication)
        setShowNetwork(false)
    }
    
    const showApplicationProcess = () => {
        setShowApplication(true)
    }
    
    return (project.name && user) ? (
        <div style={{paddingTop: 48}}>
            <h1>{ project.name }</h1>
            <h2>Brief</h2>
            <p>{ project.shortDescription }</p>
            <ul>
                { project.jobs.map(job => (<li key={ job.id }>{ job.name }</li>))}
            </ul>
            <div className='input-container'>
                <button onClick={showApplicationProcess}>
                    Candidater pour ce challenge
                </button>
            </div>
            <div>
                <div>    
                    <h2>Le challenge</h2>
                    <ul>
                        {
                            project.tags.map((tag, i) => (
                                <li key={i}>{ tag }</li>
                            ))
                        }
                    </ul>
                    <p>{ project.description }</p>
                </div>
                <div>    
                    <h2>{ project.company.name }</h2>
                    <ul>
                        {
                            project.company.tags.map((tag, i) => (
                                <li key={i}>{ tag }</li>
                            ))
                        }
                    </ul>
                    <p>{ project.company.description }</p>
                </div>
            </div>
            <div>
                <p>{ project.company.quote }</p>
                <span>{ project.company.quoteAuthor }</span>
            </div>
            <div className="input-container">
                <button onClick={showApplicationProcess}>Candidater pour ce challenge</button>
            </div>
            {
                showApplication ? (
                    <>
                        {
                            isLoading ?
                                (<div>Loading...</div>)
                                :
                            !hasApplied ? (        
                                <form onSubmit={(e) => {e.preventDefault()}}>
                                    <select id="" onChange={(e) => {setSelectedJob(e.target.value)}} value={selectedJob}>
                                        <option value="">Choisir</option>
                                        {
                                            project.jobs.map(job => (<option key={job.id} value={job.id}>{ job.name }</option>))
                                        }
                                    </select>
                                    <input type="number" name="" id="" value={ dailyRate } onChange={ (e) => {setDailyRate(e.target.value)} }/>
                                    <input type="number" name="" id="" value={ daysNumber } onChange={ (e) => {setDaysNumber(e.target.value)} }/>
                                    <Button handleClick={ apply } button={ { text: "Apply" } } />
                                </form>
                            ) : (
                                <>
                                    <h2>L'équipe</h2>
                                    <ul>
                                        {
                                            project.jobs.map(job => (
                                                <li key={ job.id }>
                                                    <span>{ job.name }</span> - <span>{ jobsRecommendations[job.name]?.username }</span>
                                                    {jobsRecommendations[job.name] ? '' : (<Button handleClick={() => startRecommendation(job)} button={{text: "I know someone"}} />)}
                                                </li>
                                            ))
                                        }
                                    </ul>
                                </>
                            )
                        }
                        {
                            showNetwork ? (
                                <form onSubmit={(e) => {e.preventDefault()}}>
                                    <h2>Network</h2>
                                    <select value={ selectedFriendId } onChange={ (e) => { setSelectedFriendId(e.target.value) }}>
                                            <option value="">Choose from your network</option>
                                        { user.friends.map(friend => <option value={friend.id} key={ friend.id }>{ friend.username }</option>)}
                                    </select>
                                    <Button handleClick={  recommend } button={ { text: "Recommend" } } />
                                </form>
                            ) : ''
                        }
                    </>
                ) : ''
            }
        </div>
    ) : (<div>Loading...</div>)
}

// export async function getStaticPaths () {
//     async function fetchProjects () {
//         const strapiProjects = await fetchAPI('/projects')
//         return strapiProjects
//     }
//     return fetchProjects().then(projects => {
//         return ({ paths: projects.map(project => ({ params: { slug: project.slug } })), fallback: false })
//     })
// }

// export async function getServerSideProps ({params}) {
//     const project = await fetchAPI(`/projects/slug/${params.slug}`)
//     return { props: project }
//   // Fetch necessary data for the blog post using params.id
// }

// export async function getStaticProps ({ params }) {
//     return {props: params}
// }