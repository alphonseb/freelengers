import { useContext, useEffect, useState } from 'react'
import { fetchAPI } from 'utils/api'
import { useRouter } from 'next/router'
import Button from 'components/elements/button'
import AppContext from 'context/AppContext'
import Link from 'next/link'

import ArrowRight from '../../src/assets/icons/arrow-right.svg'
import Check from '../../src/assets/icons/check.svg'

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
                newRecommendations[application.job.name] = user
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
        const createdApplication = await fetchAPI('/applications', { method: 'POST', body: JSON.stringify({ job: selectedJob, dailyRate, daysNumber, project: project.id, user: user.id }) })
        setHasApplied(true)
        setApplication(createdApplication)
        setJobsRecommendations({ ...jobsRecommendations, [createdApplication.job.name]: user })
    }

    const startRecommendation = (job) => {
        setRecommendingFor(job)
        setShowNetwork(true)
    }

    const recommend = async () => {
        const recommendationBody = {
            recommender: user.id,
            recommendee: selectedFriendId,
            project: project.id,
            job: recommendingFor.id
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
        document.body.style.overflow = "hidden"
        setShowApplication(true)
    }

    const hideApplicationProcess = () => {
        document.body.style.overflow = ""
        setShowApplication(false)
    }

    return (project.name && user) ? (
        <div className="single-project">
            <div className="layout">
                <Link href="/projects">
                    <a className="single-project__go-back accent">
                        <ArrowRight style={ { transform: 'rotate(180deg)', marginRight: 16 } } /> Go back to missions
                    </a>
                </Link>
                <div className="single-project__overview">
                    <div className="single-project__overview-left">
                        <h1>{ project.name }</h1>
                        <h2>Brief</h2>
                        <p className="paragraph">{ project.shortDescription }</p>
                    </div>
                    <div className="single-project__overview-right">
                        <ul className="single-project__jobs">
                            { project.jobs.map(job => (<li key={ job.id }><span>1x</span><span>{ job.name }</span></li>)) }
                        </ul>
                        <button className="btn-primary" onClick={ showApplicationProcess }>
                            {
                                hasApplied ? 'Ma candidature' : 'Candidater pour ce challenge'
                            }
                            <ArrowRight />
                        </button>
                    </div>
                </div>
            </div>
            <div className="single-project__details-wrapper">
                <div className="layout single-project__details">
                    <div>
                        <h2>Le challenge</h2>
                        <ul className="single-project__tag-wrapper">
                            {
                                project.tags.map((tag, i) => (
                                    <li key={ i } className="single-project__tag">{ tag }</li>
                                ))
                            }
                        </ul>
                        <p className="paragraph">{ project.description }</p>
                    </div>
                    <div>
                        <h2>{ project.company.name }</h2>
                        <ul className="single-project__tag-wrapper">
                            {
                                project.company.tags.map((tag, i) => (
                                    <li key={ i } className="single-project__tag">{ tag }</li>
                                ))
                            }
                        </ul>
                        <p className="paragraph">{ project.company.description }</p>
                        <div className="single-project__company-infos">
                            <span className="paragraph single-project__company-single-info">
                                Créée en { project.company.creationYear }
                            </span>
                            <span className="paragraph single-project__company-single-info">
                                { project.company.employeeNumber } employés
                            </span>
                        </div>
                    </div>
                </div>
            </div>
            <div className="single-project__quote layout">
                <p>"{ project.company.quote }"</p>
                <span className="paragraph">{ project.company.quoteAuthor }</span>
            </div>
            <div className="single-project__cta">
                <button className="btn-primary" onClick={ showApplicationProcess }>
                    {
                        hasApplied ? 'Ma candidature' : 'Candidater pour ce challenge'
                    }
                    <ArrowRight />
                </button>
            </div>
            {
                showApplication ? (
                    <div className="single-project__pop-up-wrapper">
                        <div className="single-project__pop-up application">

                            {
                                isLoading ?
                                    (<div>Loading...</div>)
                                    :
                                    !hasApplied ? (
                                        <>
                                            <h2>Ma candidature</h2>
                                            <p className="paragraph application__sentence">
                                                Ceci est votre candidature personnelle, vous pourrez recommander des profils pour compléter l’équipe par la suite.
                                        </p>
                                            <form onSubmit={ (e) => { e.preventDefault() } }>
                                                <div className="application__fields">
                                                    <p>
                                                        Je candidate en tant que { ' ' }
                                                        <span className="application__input">
                                                            <select id="" onChange={ (e) => { setSelectedJob(e.target.value) } } value={ selectedJob } >
                                                                <option value="">Choisir</option>
                                                                {
                                                                    project.jobs.map(job => (<option key={ job.id } value={ job.id }>{ job.name }</option>))
                                                                }
                                                            </select>
                                                        </span>
                                                    </p>
                                                    <p>
                                                        Mon tarif est de { ' ' }
                                                        <span className="application__input">
                                                            <input type="number" name="" id="" value={ dailyRate } onChange={ (e) => { setDailyRate(e.target.value) } } />
                                                            { ' ' }€ / jour
                                                        </span>
                                                    </p>
                                                    <p>
                                                        J'estime à { ' ' }
                                                        <span className="application__input">
                                                            <input type="number" name="" id="" value={ daysNumber } onChange={ (e) => { setDaysNumber(e.target.value) } } />
                                                            { ' ' }jours
                                                        </span>
                                                        { ' ' } de travail cette mission.
                                                    </p>
                                                </div>
                                                <div className="application__form-buttons">
                                                    <button className="application__cancel" onClick={ hideApplicationProcess }>
                                                        Annuler
                                                </button>
                                                    <button className="btn-primary" onClick={ apply }>
                                                        Envoyer ma candidature
                                                    <ArrowRight />
                                                    </button>
                                                </div>
                                            </form>
                                        </>
                                    ) : (
                                        <>
                                            {
                                                !showNetwork ? (
                                                    <>
                                                        <h2>L'équipe</h2>
                                                        <p className="paragraph application__sentence">
                                                            Nos algorithmes privilégient des équipes de Freelances qui savent travailler ensemble.<br />Recommandez votre équipe pour augmenter vos chances d’être sélectionné.
                                                    </p>
                                                        <ul className="application__recommendation-job-wrapper">
                                                            {
                                                                project.jobs.map(job => (
                                                                    <li key={ job.id } className="application__recommendation-job">
                                                                        <div className={ jobsRecommendations[job.name] ? 'has-line' : '' }>
                                                                            <div>
                                                                                <span>1/1</span><span>{ job.name }</span>
                                                                            </div>
                                                                            {
                                                                                !jobsRecommendations[job.name] ? (
                                                                                    <button className="application__recommendation-button" onClick={ () => startRecommendation(job) }>
                                                                                        Je connais quelqu'un
                                                                                        <ArrowRight />
                                                                                    </button>
                                                                                ) : ''
                                                                            }
                                                                        </div>
                                                                        {
                                                                            jobsRecommendations[job.name] ? (
                                                                                <p><span>{ jobsRecommendations[job.name]?.firstName } { jobsRecommendations[job.name]?.lastName }</span><span className="details">{ jobsRecommendations[job.name].id === user.id ? 'Moi' : 'Recommandé(e)' }</span></p>
                                                                            ) : ''
                                                                        }
                                                                    </li>
                                                                ))
                                                            }
                                                        </ul>
                                                        <div className="application__form-buttons">
                                                            <button className="application__cancel" onClick={ hideApplicationProcess }>
                                                                Quitter
                                                        </button>
                                                            <button className="btn-primary" onClick={ hideApplicationProcess }>
                                                                Sauvegarder et quitter
                                                            <Check />
                                                            </button>
                                                        </div>
                                                    </>
                                                ) : (
                                                    <>
                                                        <h2>Je recommande</h2>
                                                        <p className="application__job-recommendation">
                                                            Je recommande pour le poste de <span>{ recommendingFor.name }</span>
                                                        </p>
                                                        <div className="application__network">
                                                            <ul>
                                                                { user.friends.map(friend => (
                                                                    <li key={ friend.id } className={ selectedFriendId === friend.id ? 'selected' : '' }>
                                                                        <button onClick={ () => { setSelectedFriendId(friend.id) } }>
                                                                            <span className="name">{ friend.firstName } { friend.lastName }</span>
                                                                            <span className="jobs">
                                                                                <span>{ friend.job_1.name }</span><span>{ friend.job_2.name }</span><span>{ friend.job_3.name }</span>
                                                                            </span>
                                                                        </button>
                                                                    </li>
                                                                )) }
                                                            </ul>
                                                        </div>
                                                        <div className="application__form-buttons">
                                                            <button className="application__cancel" onClick={ () => { setShowNetwork(false) } }>
                                                                Annuler
                                                        </button>
                                                            <button className="btn-primary" onClick={ recommend }>
                                                                Confirmer la sélection
                                                            <Check />
                                                            </button>
                                                        </div>
                                                    </>
                                                )
                                            }
                                        </>
                                    )
                            }

                        </div>
                    </div>
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