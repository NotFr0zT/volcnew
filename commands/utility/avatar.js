const { MessageEmbed, Client, Message } = require('discord.js');


module.exports = {
    name: 'avatar',
    category: 'Utility',
    description: 'Gives the avatar of a user',
    aliases: ['pfp'],
    usage: 'avatar [user]',
    example: 'avatar @Fr0zT',
    userperms: [],
    botperms: [],
    /**
    * @param {Client} client
    * @param {Message} message
    * @param {String[]} args
    */
    run: async (client, message, args, prefix, userinfo) => {
        let user;

        if (message.mentions.users.first()) {
            user = message.mentions.users.first();
        } else if (args[0]) {
            user = message.guild.members.cache.get(args[0]).user;
        } else {
            user = message.author;
        }

        let avatar = user.avatarURL({ size: 4096, dynamic: true });

        const embed = new MessageEmbed()
            .setTitle(`${user.tag} avatar`)
            .setDescription(`[Avatar URL for **${user.tag}**](${avatar})`)
            .setColor(userinfo.color)
            .setImage(avatar)

        return message.reply({ embeds: [embed] });
    }
}