'use strict';

/**
 * Read the documentation (https://strapi.io/documentation/developer-docs/latest/development/backend-customization.html#core-controllers)
 * to customize this controller
 */

const { sanitizeEntity } = require('strapi-utils');


module.exports = {
    
    async findOneByProjectAndUser (ctx) {
        const { projectId, userId } = ctx.params;

        const entity = await strapi.services.application.findOne({ project: projectId, user: userId });
        return sanitizeEntity(entity, { model: strapi.models.application });
    }
};
