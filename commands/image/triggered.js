const { MessageEmbed, Client, Message } = require('discord.js');


module.exports = {
    name: 'triggered',
    category: 'Image',
    description: 'TRIGGERED',
    aliases: [],
    usage: 'triggered [user]',
    userperms: [],
    botperms: [],
    /**
    * @param {Client} client
    * @param {Message} message
    * @param {String[]} args
    */
    run: async (client, message, args, prefix, userinfo) => {
        const user = message.mentions.members.first() || message.member;
        const avatar = user.user.displayAvatarURL({ size: 2048, format: "png" });

        await message.reply({ files: [{ attachment: `https://some-random-api.ml/canvas/triggered?avatar=${avatar}`, name: 'file.png' }] })
    }
}