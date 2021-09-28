const { MessageEmbed, Discord } = require('discord.js')

module.exports = {
    name: 'invite',
    category: 'Utility',
    description: 'Sends the invite for the bot!',
    aliases: ['info', 'server', 'support'],
    usage: 'invite',
    example: 'invite',
    userperms: [],
    botperms: ['SEND_MESSAGES'],
    run: async (client, message, args, prefix, userinfo) => {
        const embed = new MessageEmbed()
            .setColor(userinfo.color)
            .setDescription(`[Invite Link](${client.config.botinvite})\n[Support Server](${client.config.supportserver})`)
        message.reply({ embeds: [embed] })
    }
}