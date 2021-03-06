const { MessageEmbed, Client, Message } = require('discord.js');
const client = require('nekos.life')
const neko = new client()

module.exports = {
    name: 'cuddle',
    category: 'Fun',
    description: 'Cuddle with someone',
    aliases: [],
    usage: 'cuddle [user]',
    userperms: [],
    botperms: [],
    /**
    * @param {Client} client
    * @param {Message} message
    * @param {String[]} args
    */
    run: async (client, message, args, prefix, userinfo) => {
        let user = message.mentions.users.first() || message.author;

        let owo = (await neko.sfw.cuddle());

        const cuddleembed = new MessageEmbed()
            .setTitle(user.username + ' You just got a cuddle! ')
            .setDescription((user.toString() + ' got a cuddle from ' + message.author.toString()))
            .setImage(owo.url)
            .setColor(userinfo.color)
            .setFooter('CUDDLES!')
            .setURL(owo.url);
        message.reply({ embeds: [cuddleembed] })
    }
}