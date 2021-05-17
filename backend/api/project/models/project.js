'use strict';

/**
 * Read the documentation (https://strapi.io/documentation/developer-docs/latest/development/backend-customization.html#lifecycle-hooks)
 * to customize this model
 */

function cartesian(args) {
    var r = [], max = args.length-1;
    function helper(arr, i) {
        for (var j=0, l=args[i].length; j<l; j++) {
            var a = arr.slice(0); // clone arr
            a.push(args[i][j]);
            if (i==max)
                r.push(a);
            else
                helper(a, i+1);
        }
    }
    helper([], 0);
    return r;
}

async function createTeams (applications, project) {
    const algo = await strapi.query('algo').findOne();
    const teams = cartesian(project.jobs.map(job => (applications.filter(application => application.job.id === job.id))))
        .map(team => {
            let green_links = 0
            let freelanceRatings = 0
            let clientRatings = 0
            let jobRatings = 0
            for (const application of team) {
                const jobRating = (() => {
                    switch (application.job.id) {
                        case application.user.job_1:
                            return 1
                        case application.user.job_2:
                            return 0.66
                        case application.user.job_3:
                            return 0.33
                        default:
                            return 0
                    }   
                })()
                jobRatings += jobRating
                freelanceRatings += application.user.freelanceRating
                clientRatings += application.user.clientRating
                for (let index = 0; index < team.length; index++) {
                    if (application.recommends.find(recommendee => recommendee.id === team[index].user.id)) {
                        green_links += 1
                    }
                }
            }

            const greenAvg = green_links / (team.length * (team.length - 1))
            const freelanceRatingAvg = freelanceRatings / team.length
            const clientRatingAvg = clientRatings / team.length
            const jobRatingAvg = jobRatings / team.length


            const fullScore = (algo.chemistryCoeff * greenAvg + algo.freelanceRatingCoeff * freelanceRatingAvg + algo.clientRatingCoeff * clientRatingAvg + algo.jobCoeff * jobRatingAvg) / (algo.chemistryCoeff + algo.freelanceRatingCoeff + algo.clientRatingCoeff + algo.jobCoeff)
            
            return {
                applications: team.map(application => application.id),
                project: project.id,
                fullScore,
                jobScore: jobRatingAvg,
                freelanceRatingScore: freelanceRatingAvg,
                clientRatingScore: clientRatingAvg,
                chemistryScore: greenAvg
            }
        })
        .sort((a, b) => b.fullScore - a.fullScore)
        .slice(0, 3)
    return teams
}

module.exports = {
    lifecycles: {
        async afterUpdate (data) {
            if (data.applicationsOver) {
                const applications = await strapi.services.application.find({ project: data.id })
                const teams = await createTeams(applications, data)
                teams.forEach(team => {
                    strapi.query('team').create(team)
                })
            }
        }
    }
};
