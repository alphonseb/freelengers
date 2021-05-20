import { useEffect, useState } from 'react'
import { useRouter } from 'next/router'
import { fetchAPI } from 'utils/api'

import Lock from '../../src/assets/icons/lock.svg'
import Check from '../../src/assets/icons/check.svg'
import ArrowRight from '../../src/assets/icons/arrow-right.svg'

export default function MyProject () {
    const router = useRouter()
    const { slug } = router.query

    const [project, setProject] = useState(null)
    const [teams, setTeams] = useState([])
    const [selectedTeam, setSelectedTeam] = useState(null)

    useEffect(() => {
        async function fetchInfos () {
            const teams = await fetchAPI(`/teams/project/${ slug }`)
            const project = await fetchAPI(`/projects/slug/${ slug }`)

            if (teams.length) {
                setTeams(teams)
            }

            if (project) {
                setProject(project)
            }
        }
        fetchInfos()
    }, [])


    return (
        <div className="team-selection">
            <div className="team-selection__select">
                {
                    (project && teams.length) ? (
                        <>
                            <h1 className="h3">{ project.name }</h1>
                            <ul>
                                {
                                    teams.map((team, i) => (
                                        <li key={ team.id } className={ i === 2 ? 'locked' : '' }>
                                            <button title={ i === 2 ? 'Vous ne pouvez découvrir que 2 équipes dans le plan basique.' : '' } onClick={ () => { i !== 2 ? setSelectedTeam(team) : '' } } className={ selectedTeam?.id === team.id ? `team-selection__select-button selected` : `team-selection__select-button` }>
                                                <span>Proposition { i + 1 }</span>
                                                <span>Score général <span className="score">{ Math.floor(team.fullScore * 10) / 2 }</span><span className="total">/5</span></span>
                                                {
                                                    i == 2 ? <Lock /> : ''
                                                }
                                                <ArrowRight className="arrow" />
                                            </button>
                                        </li>
                                    ))
                                }
                            </ul>
                            <button className="btn-primary">
                                Valider l'équipe et passer au projet
                                <Check />
                            </button>
                        </>
                    ) : (<p>Chargement...</p>)
                }
            </div>
            <div className="team-selection__info">
                {
                    selectedTeam ? (
                        <>
                            <h2 className="h3">Informations générales</h2>
                            <div className="team-selection__recap">
                                <div>
                                    <p>{ Math.floor(selectedTeam.fullScore * 10) / 2 }<span>/5</span></p>
                                    <p className="paragraph">Score général</p>
                                </div>
                                <div>
                                    <p>{ Math.floor(selectedTeam.applications.reduce((prev, curr) => (prev + 1.1 * (curr.dailyRate * curr.daysNumber)), 0) * 1.1 * 100) / 100 } €</p>
                                    <p className="paragraph">Budget Total</p>
                                </div>
                            </div>
                            <h2 className="h3">Membres de l'équipe</h2>
                            <ul className="team-selection__team">
                                {
                                    selectedTeam.applications.map(application => (
                                        <li key={ application.id }>
                                            <div>
                                                <p className="accent">{ application.user.firstName } { application.user.lastName }</p>
                                                <p className="job">{ application.job.name }</p>
                                            </div>
                                            <a href="#" target="_blank" rel="noopener">Voir le profil { '>' }</a>
                                        </li>
                                    ))
                                }
                            </ul>
                            <h2 className="h3">Détails des notes</h2>
                            <ul className="team-selection__grades">
                                <li>
                                    <div className="grade h3">
                                        <span>{ Math.floor(selectedTeam.clientRatingScore * 10) / 2 }</span>
                                        <span className="total">/5</span>
                                    </div>
                                    <div>
                                        <p className="accent">Note des clients</p>
                                        <p className="paragraph">
                                            Moyenne des notes attribués aux Freelengers de l’équipe par leurs précédents clients.
                                        </p>
                                    </div>
                                </li>
                                <li>
                                    <div className="grade h3">
                                        <span>{ Math.floor(selectedTeam.chemistryScore * 10) / 2 }</span>
                                        <span className="total">/5</span>
                                    </div>
                                    <div>
                                        <p className="accent">Note de symbiose</p>
                                        <p className="paragraph">
                                            Note attribuée en fonction des recommandations des Freelengers de l’équipe entre eux.
                                        </p>
                                    </div>
                                </li>
                                <li>
                                    <div className="grade h3">
                                        <span>{ Math.floor(selectedTeam.jobScore * 10) / 2 }</span>
                                        <span className="total">/5</span>
                                    </div>
                                    <div>
                                        <p className="accent">Note de compétence</p>
                                        <p className="paragraph">
                                            Moyenne des notes attribuées en fonction des compétences principales et secondaires des Freelengers.
                                        </p>
                                    </div>
                                </li>
                                <li>
                                    <div className="grade h3">
                                        <span>{ Math.floor(selectedTeam.freelanceRatingScore * 10) / 2 }</span>
                                        <span className="total">/5</span>
                                    </div>
                                    <div>
                                        <p className="accent">Note des Freelengers</p>
                                        <p className="paragraph">
                                            Moyenne des notes des Freelengers de l’équipe données par les Freelengers avec qui ils ont déjà travaillé.
                                        </p>
                                    </div>
                                </li>
                            </ul>
                        </>
                    ) : (<p>Sélectionnez une équipe pour la consulter en détail</p>)
                }
            </div>
        </div>
    )
}