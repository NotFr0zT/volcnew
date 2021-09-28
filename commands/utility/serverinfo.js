const { MessageEmbed, Client, Message } = require('discord.js');

const moment = require('moment')

module.exports = {
    name: 'serverinfo',
    category: 'Utility',
    description: 'Sends the serverinfo',
    aliases: ['si'],
    usage: 'serverinfo',
    userperms: [],
    botperms: [],
    /**
    * @param {Client} client
    * @param {Message} message
    * @param {String[]} args
    */
    run: async (client, message, args, prefix, userinfo) => {
        const verifyFlags = {
            'NONE': `Unrestricted`,
            'LOW': `Must have verified email on account`,
            'MEDIUM': `Must be registered on Discord for longer than 5 minutes`,
            'HIGH': `Must be a member of the server for longer than 10 minutes`,
            'HIGHEST': `Must have a verified phone number`
        }

        const embed = new MessageEmbed()
            .setColor(userinfo.color)
            .setThumbnail(message.guild.iconURL({ dynamic: true }))
            .setTitle(`${message.guild.name} server information`)
            .addFields(
                {
                    name: `Name`,
                    value: `${message.guild.name}`,
                    inline: true,
                },
                {
                    name: `ID`,
                    value: `${message.guild.id}`,
                    inline: true,
                },
                {
                    name: `Owner`,
                    value: `<@${message.guild.ownerId}>`,
                    inline: true,
                },
                // {
                //     name: `Images`,
                //     value: `
                //     ${message.guild.icon && message.guild.banner && message.guild.splash ? 'No images' : ''}
                //     ${message.guild.icon ? `[Server Icon](https://cdn.discordapp.com/icons/${message.guild.id}/${message.guild.icon}.png?size=4096)` : ``}
                //     ${message.guild.banner ? `[Server Banner](https://cdn.discordapp.com/banners/${message.guild.id}/${message.guild.banner}.png?size=4096)` : ``}
                //     ${message.guild.splash ? `[Invite Background](https://cdn.discordapp.com/splashes/${message.guild.id}/${message.guild.spash}.png?size=4096)` : ``}
                //     `,
                //     inline: true,
                // },
                {
                    name: `Verify Level`,
                    value: `${verifyFlags[message.guild.verificationLevel]}`,
                    inline: true,
                },
                {
                    name: `Boost Tier`,
                    value: `Tier ${`${message.guild.premiumTier ? '0' : ''}`}`,
                    inline: true,
                },
                {
                    name: `Created`,
                    value: `<t:${(message.guild.createdAt.getTime() / 1000).toFixed(0)}> (<t:${(message.guild.createdAt.getTime() / 1000).toFixed(0)}:R>)\n`,
                    inline: true,
                },
                {
                    name: `Members`,
                    value: `${message.guild.memberCount}/${message.guild.maximumMembers}`,
                    inline: true,
                },
                {
                    name: `Bots`,
                    value: `${message.guild.members.cache.filter(member => !member.user.bot).size}`,
                    inline: true,
                },
                {
                    name: 'Text Channels',
                    value: `${message.guild.channels.cache.filter(channel => channel.type === 'GUILD_TEXT').size}`,
                    inline: true
                },
                {
                    name: 'Voice Channels',
                    value: `${message.guild.channels.cache.filter(channel => channel.type === 'GUILD_VOICE').size}`,
                    inline: true
                },
                {
                    name: 'Roles',
                    value: `${message.guild.roles.cache.size}`,
                    inline: true
                },
                {
                    name: 'Emoji count',
                    value: `${message.guild.emojis.cache.size || `None`}`,
                    inline: true
                },
                {
                    name: 'Boost count',
                    value: `${message.guild.premiumSubscriptionCount || 0}`,
                    inline: true
                }
            )

        message.reply({ embeds: [embed] });
    }
}