import { fetchAPI } from 'utils/api'

export default function SingleProject (props) {
    return (
        <h1>CieWorks</h1>
    )
}

export async function getStaticPaths () {
    async function fetchProjects () {
        const strapiProjects = await fetchAPI('/projects')
        return strapiProjects
    }
    return fetchProjects().then(projects => {
        console.log({ projects });
        return ({ paths: projects.map(project => ({ params: { slug: project.slug, id: project.id } })), fallback: false })
    })
//     return {
//         paths: [{ params: { slug: 'cie-works' } }],
//         fallback: false
//   }
}

export async function getStaticProps (params) {
    console.log(params);
    return { props: { test: 'test' } }
  // Fetch necessary data for the blog post using params.id
}