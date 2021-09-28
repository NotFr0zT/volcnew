const { MessageEmbed, Client, Message } = require('discord.js');


module.exports = {
    name: 'announce',
    category: 'Utility',
    description: 'Make an announcement in your server',
    aliases: [],
    usage: 'announce <#channel> <announcement>',
    userperms: ['MANAGE_CHANNELS'],
    botperms: [],
    /**
    * @param {Client} client
    * @param {Message} message
    * @param {String[]} args
    */
    run: async (client, message, args, prefix, userinfo) => {
        const anchannel = message.mentions.channels.first();
        if (!anchannel) {
            return message.reply("`Usage: v!announce <channel> <msg>`")
        }
        if (!args[0]) {
            return message.reply("Please add some text to make an Announcement")
        }

        let embed = new MessageEmbed()
            .setTitle(`<a:announcement:733341856674611230> New Server Announcement`)
            .setDescription(args.slice(1).join(" "), { allowedMentions: { parse: ["users"] } })
            .setColor(userinfo.color)
            .setFooter(`Announcement by ${message.author.username}`);
        anchannel.send({ embeds: [embed] });

        let anembed = new MessageEmbed()
            .setTitle("Done!")
            .setDescription(`Announcement has been sent to ${anchannel}`)
            .setColor(userinfo.color)

        message.reply({ embeds: [anembed] });
        message.delete();
    }
}