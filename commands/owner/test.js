const { MessageEmbed, Client, Message } = require('discord.js');

module.exports = {
    name: 'test',
    category: 'Owner',
    description: 'Tests stuff, dont even try to use it if you arent Fr0zT!',
    aliases: [],
    usage: 'test',
    userperms: [],
    botperms: [],
    /**
    * @param {Client} client
    * @param {Message} message
    * @param {String[]} args
    */
    run: async (client, message, args, prefix, userinfo) => {
        if (message.author.id !== client.config.owner) return client.error('you aint the owner, come on!', message)
        let model = require('../../models/modlog')
        let mod = model.findOne({ gid: message.guild.id })
        if (!mod) return
        let channel = mod.channel
        if (!channel) return;

        const embed = new MessageEmbed()
            .setAuthor(`${message.guild.name} Modlogs`, message.guild.iconURL())
            .setColor(userinfo.color)
            .setThumbnail(banMember.user.displayAvatarURL({ dynamic: true }))
            .addField('Action', 'ban')
            .addField('Banned', banMember.user.username)
            .addField('ID', `${banMember.id}`)
            .addField('Banned By', message.author.username)
            .addField('Reason', `${reason || 'No Reason'}`)
            .addField('Date', message.createdAt.toLocaleString())
            .setTimestamp();

        var sChannel = message.guild.channels.cache.get(channel)
        if (!sChannel) return;
        sChannel.send({ embeds: [embed] })
    }
}