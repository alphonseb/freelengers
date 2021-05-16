module.exports = {
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