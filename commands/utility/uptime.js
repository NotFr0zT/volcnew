const { parseDur } = require('../../functions')
const { MessageEmbed, Client, Message } = require('discord.js');


module.exports = {
    name: 'uptime',
    category: 'Utility',
    description: 'Displays the bots time online',
    aliases: ['ontime'],
    usage: 'uptime',
    userperms: [],
    botperms: [],
    /**
    * @param {Client} client
    * @param {Message} message
    * @param {String[]} args
    */
    run: async (client, message, args, prefix, userinfo) => {
        let embed = new MessageEmbed()
            .setTimestamp()
            .setDescription(`Online for: ${parseDur(client.uptime)}`)
            .setFooter('Note: The time resets after every commit.')
            .setColor(userinfo.color)
        message.reply({ embeds: [embed] })


    }
}