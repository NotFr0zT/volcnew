const { Client, MessageEmbed, Guild } = require('discord.js')
const settings = require('../../models/settings')
const reward = require('../../models/lvlreward')
const autorole = require('../../models/autorole')
const custom = require('../../models/custom')
const modlog = require('../../models/modlog')
const suggest = require('../../models/suggestionchannel')
/**
 * 
 * @param {Client} client 
 * @param {Guild} guild
 */
module.exports = (client, guild) => {

    settings.deleteMany({ gid: guild.id })
    reward.deleteMany({ gid: guild.id })
    autorole.deleteMany({ gid: guild.id })
    custom.deleteMany({ Guild: guild.id })
    modlog.deleteMany({ gid: guild.id })
    suggest.deleteMany({ gid: guild.id })


    let channel = client.channels.cache.get('846773165698187274')
    let totalMembers = 0;

    client.guilds.cache.forEach(guild => {
        totalMembers += guild.memberCount
    })
    let embed = new MessageEmbed()
        .setColor('RED')
        .setTitle('Guild Leave')
        .addField('ID', `${guild.id}`, true)
        .addField('Name', `${guild.name}`, true)
        .addField('Owner', `${guild.ownerId}`, true)
        .addField('Members', `${guild.memberCount}`, true)
        .setDescription(`Now in ${client.guilds.cache.size} servers with ${totalMembers} users`)
    channel.send({ embeds: [embed] })
}