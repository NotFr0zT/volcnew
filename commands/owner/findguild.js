const { MessageEmbed, Client, Message } = require('discord.js');


module.exports = {
    name: 'findguild',
    category: 'Owner',
    description: 'sad',
    aliases: ['fg'],
    usage: 'findguild <id>',
    userperms: ['BOT_OWNER'],
    botperms: [],
    /**
    * @param {Client} client
    * @param {Message} message
    * @param {String[]} args
    */
    run: async (client, message, args, prefix, userinfo) => {
        if (!userinfo.developer && message.guild.id !== client.config.testserver) return message.reply({ content: 'nah fam' })
        var g = client.guilds.cache.get(args[0])
        var channel = g.channels.cache
            .filter((channel) => channel.type === 'GUILD_TEXT')
            .first();
        if (!channel) return;
        const invite = await channel
            .createInvite({ maxAge: 0, maxUses: 0 })
        message.reply({ content: `Guild name: **${g.name}** guild invite: ${invite.url}` })
    }
}