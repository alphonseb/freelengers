import React, { useEffect, useState } from 'react'
import { fetchAPI } from 'utils/api'
import Link from 'next/link'

// const getProjects = async () => {
    
//     return projects
// }

export default function Projects () {
    const [projects, setProjects] = useState([])
    
    useEffect(() => {
        async function fetchProjects () {
            const strapiProjects = await fetchAPI('/projects')
            setProjects(strapiProjects)
            }
            fetchProjects()
    }
        , [])
    
    return (
        <ul>
            {projects.length && 
                projects.map(project => <li key={project.id}>
                    <Link href={`/projects/${project.slug}`}><a>{project.name}</a></Link>
                </li>)
            }
        </ul>
    )
}