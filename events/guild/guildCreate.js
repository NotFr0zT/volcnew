const { Client, MessageEmbed, Guild } = require('discord.js')
const settings = require('../../models/settings')
/**
 * 
 * @param {Client} client 
 * @param {Guild} guild
 */
module.exports = async (client, guild) => {
    var otherchannel = guild.channels.cache
        .filter((channel) => channel.type === 'GUILD_TEXT')
        .last();
    if (!otherchannel) return;
    const invite = await otherchannel
        .createInvite({ maxAge: 0, maxUses: 0 })

    var setmodel = settings.findOne({ gid: guild.id })
    if (!setmodel) {
        let ne = new settings({
            gid: message.guild.id,
            prefix: 'v!',
            levels: true
        })
        ne.save()
    }
    let channel = client.channels.cache.get('846773164460867634')
    let totalMembers = 0;

    client.guilds.cache.forEach(guild => {
        totalMembers += guild.memberCount
    })
    let embed = new MessageEmbed()
        .setColor('GREEN')
        .setTitle('Guild Join')
        .addField('ID', `${guild.id}`, true)
        .addField('Name', `${guild.name}`, true)
        .addField('Owner', `${guild.ownerId}`, true)
        .addField('Members', `${guild.memberCount}`, true)
        .addField('Invite', `[Invite Link](${invite.url || client.config.rickroll})`)
        .setDescription(`Now in ${client.guilds.cache.size} servers with ${totalMembers} users`)
    channel.send({ embeds: [embed] })


    let otherembed = new MessageEmbed()
        .setTitle('Thank you for adding me!')
        .setDescription(`Hello there! Thanks for inviting me to your server! Need help? Type \`v!help\` or use my tag <@${client.user.id}>`)
        .addField('Important Links:', `[Invite Link](${client.config.botinvite})\n[Support Server](${client.config.supportserver})`)
        .setColor('BLUE')
        .setTimestamp()

    otherchannel.send({ embeds: [otherembed] })
}