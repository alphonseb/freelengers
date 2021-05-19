const { sanitizeEntity } = require('strapi-utils');

const sanitizeUser = user =>
  sanitizeEntity(user, {
    model: strapi.query('user', 'users-permissions').model,
  });

module.exports = {
    async me(ctx) {
        const user = ctx.state.user;

        if (!user) {
            return ctx.badRequest(null, [{ messages: [{ id: 'No authorization header was found' }] }]);
        }
        
        const jobs = await Promise.all(user.friends.map(friend => Promise.all([
            strapi.query('job').findOne({id: friend.job_1}),
            strapi.query('job').findOne({id: friend.job_2}),
            strapi.query('job').findOne({id: friend.job_3})
        ])))
        
        user.friends = user.friends.map((friend, i) => ({...friend, job_1: jobs[i][0], job_2: jobs[i][1], job_3: jobs[i][2]}))

        ctx.body = sanitizeUser(user);
    },
    async addFriend (ctx) {
        const { friendId } = ctx.params
        const request = await strapi.services['network-request'].findOne({ requester: friendId, requestee: ctx.state.user.id })
        
        if (!request) {
            return 
        }
        
        const user = await strapi.query('user', 'users-permissions').findOne({ id: ctx.state.user.id });
        // console.log([...user.friends.map(friend => friend.id), friendId])
        strapi.query('user', 'users-permissions').update({id: user.id}, {
            friends: [...user.friends.map(friend => friend.id), parseInt(friendId, 10)]
        })
        
        const friend = await strapi.query('user', 'users-permissions').findOne({ id: friendId });
        strapi.query('user', 'users-permissions').update({id: friend.id}, {
            friends: [...friend.friends.map(_friend => _friend.id), parseInt(ctx.state.user.id, 10)]
        })
        
        strapi.services['network-request'].delete({ id: request.id })
        ctx.send({status: 'success'})
    },
    async denyFriend (ctx) {
        const { friendId } = ctx.params
        const request = await strapi.services['network-request'].findOne({ requester: friendId, requestee: ctx.state.user.id })
        
        if (!request) {
            return 
        }
        
        strapi.services['network-request'].delete({ id: request.id })
        ctx.send({status: 'success'})
    }
}