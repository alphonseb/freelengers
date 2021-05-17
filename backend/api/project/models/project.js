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

function createTeams (applications, project) {
    const teams = cartesian(project.jobs.map(job => (applications.filter(application => application.job.id === job.id))))
        .map(team => {
            let green_links = 0
            let ratings = 0
            let jobRatings = 0
            for (const application of team) {
                const jobRating = (() => {
                    switch (application.job.id) {
                        case application.user.job_1.id:
                            return 1
                        case application.user.job_2.id:
                            return 0.66
                        case application.user.job_3.id:
                            return 0.33
                        default:
                            return 0
                    }
                })()
                jobRatings += jobRating
                ratings += application.user.rating
                for (let index = 0; index < team.length; index++) {
                    if (application.recommends.find(recommendee => recommendee.id === team[index].user.id)) {
                        green_links += 1
                    }
                }
            }
            const greenAvg = green_links / (team.length * (team.length - 1))
            const avg = ratings / team.length
            
            team.score = (greenAvg + avg) / 2
            return team
        })
        .sort((a, b) => b.score - a.score)
        .slice(0, 3)
    console.log(teams);
}

module.exports = {
    lifecycles: {
        async afterUpdate (data) {
            if (data.applicationsOver) {
                const applications = await strapi.services.applications.find({ project: data.id })
                createTeams(applications, data)
            }
        }
    }
};
