const { Message, Client, MessageEmbed } = require('discord.js')


module.exports = {
    name: 'prefix',
    category: 'Config',
    description: 'Views the server prefix',
    aliases: ['setprefix'],
    usage: 'prefix ',
    userperms: ['MANAGE_GUILD'],
    botperms: [],
    /**
    * @param {Client} client
    * @param {Message} message
    * @param {String[]} args
    */
    run: async (client, message, args, prefix, userinfo) => {

        message.reply(`The prefix for ${message.guild.name} is \`${prefix}\``)
    },
};