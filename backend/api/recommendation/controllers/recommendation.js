'use strict';

/**
 * Read the documentation (https://strapi.io/documentation/developer-docs/latest/development/backend-customization.html#core-controllers)
 * to customize this controller
 */
const { sanitizeEntity } = require('strapi-utils');


module.exports = {
    
    async findByRecommenderAndProject (ctx) {
        const { projectId, userId } = ctx.params;

        const entity = await strapi.services.recommendation.find({ project: projectId, recommender: userId });
        return sanitizeEntity(entity, { model: strapi.models.recommendation });
    },
    
    async findByRecommendee (ctx) {
        const { id } = ctx.params;

        const entity = await strapi.services.recommendation.find({ recommendee: id });
        return sanitizeEntity(entity, { model: strapi.models.recommendation });
    }
};
