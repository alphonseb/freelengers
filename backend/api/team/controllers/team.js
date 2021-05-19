'use strict';

const { sanitizeEntity } = require('strapi-utils');

/**
 * Read the documentation (https://strapi.io/documentation/developer-docs/latest/development/backend-customization.html#core-controllers)
 * to customize this controller
 */

module.exports = {
    async findByProject (ctx) {
        const { slug } = ctx.params

        const project = await strapi.services.project.findOne({ slug })
        const teams = await strapi.services.team.find({ project: project.id })

        const jobs = await Promise.all(teams.map(team => Promise.all(team.applications.map(application => strapi.query('job').findOne({ id: application.job })))))

        const users = await Promise.all(teams.map(team => Promise.all(team.applications.map(application => strapi.query('user', 'users-permissions').findOne({ id: application.user })))))

        const updatedTeams = teams.map((team, i) => (
            {
                ...team,
                applications: team.applications.map((application, j) => (
                    {
                        ...application,
                        job: jobs[i][j],
                        user: users[i][j]
                    }
                ))
            }
        ))

        return updatedTeams.map(team => sanitizeEntity(team, { model: strapi.models.team }));
    }
};
