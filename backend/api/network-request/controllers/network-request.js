'use strict';

/**
 * Read the documentation (https://strapi.io/documentation/developer-docs/latest/development/backend-customization.html#core-controllers)
 * to customize this controller
 */

const { sanitizeEntity } = require('strapi-utils');

module.exports = {
    async received (ctx) {
        const requests = await strapi.services['network-request'].find({ requestee: ctx.state.user.id });
        return requests.map(request => sanitizeEntity(request, { model: strapi.models['network-request'] }));
    },
    async sent (ctx) {
        const requests = await strapi.services['network-request'].find({ requester: ctx.state.user.id });
        return requests.map(request => sanitizeEntity(request, { model: strapi.models['network-request'] }));
    }
};
