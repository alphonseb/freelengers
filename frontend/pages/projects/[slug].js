import { useState } from 'react'
import { fetchAPI } from 'utils/api'
import Button from 'components/elements/button'

export default function SingleProject ({ name, jobs, id }) {
    const [selectedJob, setSelectedJob] = useState('')
    const [dailyRate, setDailyRate] = useState(0)
    const [daysNumber, setDaysNumber] = useState(0)
    
    const apply = async () => {
        console.log(selectedJob, dailyRate, daysNumber);
        const createdApplication = await fetchAPI('/applications', { method: 'POST', body: JSON.stringify({job: selectedJob, dailyRate, daysNumber, project: id, user: 1})})
        console.log(createdApplication);
    }
    
    return name ? (
        <>
            <h1>{ name }</h1>
            <h2>Jobs :</h2>
            <ul>
                { jobs.map((job, i) => (<li key={ i }>{ job }</li>))}
            </ul>
            <div>
                <select id="" onChange={(e) => {setSelectedJob(e.target.value)}} value={selectedJob}>
                    <option value>Choisir</option>
                    {
                        jobs.map((job, i) => (<option key={i} value={job}>{ job }</option>))
                    }
                </select>
                <input type="number" name="" id="" value={ dailyRate } onChange={ (e) => {setDailyRate(e.target.value)} }/>
                <input type="number" name="" id="" value={ daysNumber } onChange={ (e) => {setDaysNumber(e.target.value)} }/>
            </div>
            <Button handleClick={apply} button={{text: "Apply"}} />
        </>
    ) : (<div>Loading...</div>)
}

export async function getStaticPaths () {
    async function fetchProjects () {
        const strapiProjects = await fetchAPI('/projects')
        return strapiProjects
    }
    return fetchProjects().then(projects => {
        return ({ paths: projects.map(project => ({ params: { slug: project.slug } })), fallback: false })
    })
}

export async function getStaticProps ({params}) {
    const project = await fetchAPI(`/projects/slug/${params.slug}`)
    return { props: project }
  // Fetch necessary data for the blog post using params.id
}