import { useContext, useEffect, useState } from 'react'
import { fetchAPI } from 'utils/api'
import { useRouter } from 'next/router'
import Button from 'components/elements/button'
import AppContext from 'context/AppContext'

export default function SingleProject () {
    const router = useRouter()
    const { slug } = router.query
    const [project, setProject] = useState({})
    useEffect(() => {
        async function fetchProject () {
            setProject(await fetchAPI(`/projects/slug/${slug}`))
        }
        fetchProject()
    }, [])
    
    const { user } = useContext(AppContext)
    
    const [selectedJob, setSelectedJob] = useState('')
    const [dailyRate, setDailyRate] = useState(0)
    const [daysNumber, setDaysNumber] = useState(0)
    
    const apply = async () => {
        console.log(selectedJob, dailyRate, daysNumber);
        const createdApplication = await fetchAPI('/applications', { method: 'POST', body: JSON.stringify({job: selectedJob, dailyRate, daysNumber, project: project.id, user: 1})})
        console.log(createdApplication);
    }
    
    return project.name ? (
        <>
            <h1>{ project.name }</h1>
            <h2>Jobs :</h2>
            <ul>
                { project.jobs.map((job, i) => (<li key={ i }>{ job }</li>))}
            </ul>
            <div>
                <select id="" onChange={(e) => {setSelectedJob(e.target.value)}} value={selectedJob}>
                    <option value>Choisir</option>
                    {
                        project.jobs.map((job, i) => (<option key={i} value={job}>{ job }</option>))
                    }
                </select>
                <input type="number" name="" id="" value={ dailyRate } onChange={ (e) => {setDailyRate(e.target.value)} }/>
                <input type="number" name="" id="" value={ daysNumber } onChange={ (e) => {setDaysNumber(e.target.value)} }/>
            </div>
            <Button handleClick={ apply } button={ { text: "Apply" } } />
            <h2>Network</h2>
            <ul>
                { user.friends.map(friend => <li key={ friend.id }>{ friend.username }</li>)}
            </ul>
        </>
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