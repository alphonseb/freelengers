const { sanitizeEntity } = require('strapi-utils');


module.exports = {
    async findOneBySlug (ctx, next) {
        const { slug } = ctx.params;
        
        // await next();
        const entity = await strapi.query('user', 'users-permissions').findOne({ username: decodeURIComponent(slug) });
        
        const { id, username, firstName, lastName } = entity
        if (id === ctx.state.user.id) {
            return 
        }
        let status = 'none'
        console.log(ctx.state.user.friends, id);
        if (ctx.state.user.friends.find(friend => friend.id === id)) {
            status = 'in-network'
        }
        if (status === 'none') {
            const sentRequest = await strapi.services['network-request'].findOne({ requester: ctx.state.user.id, requestee: id });
            
            if (sentRequest) {
                status = 'request-sent'
            }
            const receivedRequest = await strapi.services['network-request'].findOne({ requestee: ctx.state.user.id, requester: id });
            
            if (receivedRequest) {
                status = 'request-received'
            }
        }
        ctx.send({id, username, firstName, lastName, status })
    }
}