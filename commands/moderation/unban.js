const { MessageEmbed } = require('discord.js');


module.exports = {
    name: 'unban',
    category: 'Moderation',
    description: 'Unban\'s a user',
    aliases: ['ub'],
    usage: 'unban <user> [reason]',
    example: 'unban 765767707621589032 Reeee',
    userperms: ['BAN_MEMBERS'],
    botperms: ['BAN_MEMBERS'],
    run: async (client, message, args, prefix, userinfo) => {



        if (!args[0]) return message.reply('Please enter a name')

        let bannedMemberInfo = await message.guild.fetchBans()

        let bannedMember;
        bannedMember = bannedMemberInfo.find(b => b.user.username.toLowerCase() === args[0].toLocaleLowerCase()) || bannedMemberInfo.get(args[0]) || bannedMemberInfo.find(bm => bm.user.tag.toLowerCase() === args[0].toLocaleLowerCase());
        if (!bannedMember) return message.reply('Please provide a valid **Username**, **Tag** or **ID**. Or the user isn\'t banned')

        let reason = args.slice(1).join(' ') || 'No reason'

        try {
            if (reason) {
                message.guild.members.unban(bannedMember.user.id, reason)
                var sembed = new MessageEmbed()
                    .setColor(userinfo.color)
                    .setDescription(`**${bannedMember.user.tag} has been unbanned for ${reason}**`)
                message.reply({ embeds: [sembed] })
            } else {
                message.guild.members.unban(bannedMember.user.id, reason)
                var sembed2 = new MessageEmbed()
                    .setColor(userinfo.color)
                    .setDescription(`**${bannedMember.user.tag} has been unbanned**`)
                message.reply({ embeds: [sembed2] })
            }
        } catch {

        }
        let model = require('../../models/modlog')
        let mod = model.findOne({ gid: message.guild.id })
        let channel = mod.channel
        if (!channel) return;

        let embed = new MessageEmbed()
            .setColor(userinfo.color)
            .setThumbnail(bannedMember.user.displayAvatarURL({ dynamic: true }))
            .setAuthor(`${message.guild.name} Modlogs`, message.guild.iconURL())
            .addField('**Moderation**', 'unban')
            .addField('**Unbanned**', `${bannedMember.user.username}`)
            .addField('**ID**', `${bannedMember.user.id}`)
            .addField('**Moderator**', message.author.username)
            .addField('**Reason**', `${reason}`)
            .addField('**Date**', message.createdAt.toLocaleString())
            .setTimestamp();

        var sChannel = message.guild.channels.cache.get(channel)
        if (!sChannel) return;
        sChannel.send({ embeds: [embed] })

    }
}
