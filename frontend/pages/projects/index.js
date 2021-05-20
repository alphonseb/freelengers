import React, { useEffect, useState } from "react";
import { fetchAPI } from "utils/api";
import { useRouter } from "next/router";

import Link from "next/link";

import ArrowRight from "../../src/assets/icons/arrow-right.svg";

export default function Projects () {
    const [projects, setProjects] = useState([]);
    const [recommandedProject, setRecommandedProject] = useState(null)

    const router = useRouter();
    useEffect(() => {
        async function fetchProjects () {
            const strapiProjects = await fetchAPI("/projects");
            setProjects(strapiProjects.slice(1));
            setRecommandedProject(strapiProjects[0])
        }
        fetchProjects();
    }, []);

    return (
        <div className='project-main-container'>
            <div className='project-hero'>
                <div className='hero-content'>
                    <h1>Trouvez les missions qui vous correspondent.</h1>
                    <p className='paragraph'>
                        Découvrez le panel de challenges qui vous sont proposés selon vos appétences et préférences. Renseignez vos différents champs d’informations pour affiner votre recherche et vos envies. Proposez ensuite une équipe avec qui vous aimeriez travailler !
                    </p>
                </div>
                <div className='hero-image'>
                    <img src='/images/projects-illu.png' alt='' />
                </div>
            </div>
            <div className='project-search-bar'></div>
            {(projects.length && recommandedProject) ? (
                <>
                    <div className='project-recommanded'>
                        <h2>Le challenge qui pourrait vous correspondre le plus.</h2>
                        <div className='project'>
                            <p className='subtitle'>{ recommandedProject.company.name }</p>
                            <h2>{ recommandedProject.name }</h2>
                            {/* <p className='date'>16 juillet - 1 septembre</p> */ }
                            <div className='jobs'>
                                <ul>
                                    { recommandedProject.jobs.map((job, id) => (
                                        <li key={ id }>{ job.name } x1</li>
                                    )) }
                                </ul>
                            </div>
                            <p className='paragraph'>
                                { recommandedProject.shortDescription }
                            </p>
                            <button
                                className='btn-primary'
                                onClick={ () =>
                                    router.push("projects/" + recommandedProject.slug)
                                }
                            >
                                Découvrir ce projet <ArrowRight />
                            </button>
                        </div>
                    </div>
                    <div className='projects-list'>
                        { projects.map((project, id) => (
                            <Link href={ `/projects/${ project.slug }` }>
                                <a>
                                    <div key={ id } className='project'>
                                        <p className='subtitle'>{ project.company.name }</p>
                                        <h2>{ project.name }</h2>
                                        {/* <p className='date'>16 juillet - 1 septembre</p> */ }
                                        <div className='jobs'>
                                            <ul>
                                                { project.jobs.map((job, id) => (
                                                    <li key={ id }>
                                                        {job.name } <span>x1</span>
                                                    </li>
                                                )) }
                                            </ul>
                                        </div>
                                        <p className='paragraph'>
                                            { project.shortDescription }
                                        </p>
                                        <div className='button'>
                                            <ArrowRight />
                                        </div>
                                    </div>
                                </a>
                            </Link>
                        )) }
                    </div>
                    {/* <div className='button-more-projects'>
            <button className='btn-primary'>
              Voir plus de projects <ArrowRight />
            </button>
          </div> */}
                </>
            ) : (
                <div>Chargement....</div>
            ) }
            <div className='ad-container'>
                <img src='/images/shine-ad.png' alt='' />
                <div className='ad-content'>
                    <h1>
                        <span>Shine</span> - Notre banquier partenaire
          </h1>
                    <div className='list-ad'>
                        <ul>
                            <li>
                                <div className='orange-point' />
                                <div>
                                    <p className='accent'>
                                        Un compte 100% en ligne, adapté à votre quotidien
                  </p>
                                    <p className='paragraph'>
                                        Ouvrez votre compte en quelques minutes, suivez vos finances
                                        et paramétrez vos plafonds et cartes depuis votre smartphone
                                        ou votre ordinateur.
                  </p>
                                </div>
                            </li>
                            <li>
                                <div className='orange-point' />
                                <div>
                                    <p className='accent'>
                                        Un partenaire de confiance pour votre entreprise
                  </p>
                                    <p className='paragraph'>
                                        Shine est un établissement français agréé par la Banque de
                                        France. Votre argent est assuré à hauteur de 100 000 €, et
                                        votre sécurité est notre priorité.
                  </p>
                                </div>
                            </li>
                            <li>
                                <div className='orange-point' />
                                <div>
                                    <p className='accent'>
                                        Des tarifs compétitifs, sans frais cachés
                  </p>
                                    <p className='paragraph'>
                                        Économisez en frais bancaires avec un compte complet à
                                        partir de 7,90 € HT par mois aux tarifs transparents, sans
                                        mauvaises surprises.
                  </p>
                                </div>
                            </li>
                        </ul>
                    </div>
                </div>
            </div>
        </div>
    );
}
