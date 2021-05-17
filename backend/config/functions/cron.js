'use strict';

/**
 * Cron config that gives you an opportunity
 * to run scheduled jobs.
 *
 * The cron format consists of:
 * [SECOND (optional)] [MINUTE] [HOUR] [DAY OF MONTH] [MONTH OF YEAR] [DAY OF WEEK]
 *
 * See more details here: https://strapi.io/documentation/developer-docs/latest/setup-deployment-guides/configurations.html#cron-tasks
 */

module.exports = {
  /**
   * Simple example.
   * Every monday at 1am.
   */
  // '0 1 * * 1': () => {
  //
  // }
  
  
  /**
   * Every two hours, check if some project has been open for more than 24 hours. If yes, applications are over. This will trigger a function in the "afterUpdate" lifecycle hook.
   */
  '0 0 */2 * * *': async () => {
    console.log('cron task');
    const projects = await strapi.services.project.find()
    projects.filter(project => {
      return new Date() > new Date(new Date(project.created_at).getTime() + 24*3600*1000)
    }).forEach(project => {
      strapi.services.project.update({id: project.id}, {applicationsOver: true})
    })
  }
};
