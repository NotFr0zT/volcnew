const { MessageEmbed } = require('discord.js')



module.exports = {
    name: 'ban',
    category: 'Moderation',
    description: 'Bans a user',
    aliases: [],
    usage: 'ban <user> [reason]',
    example: 'ban @Fr0zT For being cool',
    userperms: ['BAN_MEMBERS', 'SEND_MESSAGES'],
    botperms: [],
    run: async (client, message, args, prefix, userinfo) => {
        try {
            if (!args[0]) return client.error('Please Provide A User To Ban!', message)


            let banMember = message.mentions.members.first() || message.guild.members.cache.get(args[0]) || message.guild.members.cache.find(r => r.user.username.toLowerCase() === args[0].toLocaleLowerCase()) || message.guild.members.cache.find(ro => ro.displayName.toLowerCase() === args[0].toLocaleLowerCase());
            if (!banMember) return client.error('User Is Not In The Guild', message);
            if (banMember === message.member) return client.error('You Cannot Ban Yourself', message)

            let reason = args.slice(1).join(' ') || 'No reason provided.';

            if (!banMember.bannable) return client.error('Cant Ban That User', message)
            try {
                await message.guild.members.ban(banMember)
                banMember.send(`You Have Been Banned From ${message.guild.name} for - ${reason}`).catch(() => null)
            } catch {
                message.guild.members.ban(banMember)
            }
            if (reason) {
                var sembed = new MessageEmbed()
                    .setColor(userinfo.color)
                    .setDescription(`${banMember.user.username} has been banned for \`${reason}\``)
                message.reply({ embeds: [sembed] })
            } else {
                var sembed2 = new MessageEmbed()
                    .setColor(userinfo.color)
                    .setDescription(`${banMember.user.username} has been banned`)
                message.reply({ embeds: [sembed2] })
            }
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
        } catch (e) {
            console.log(e)
        }
    }
}