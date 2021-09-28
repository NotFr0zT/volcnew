const { CommandInteraction, Client, MessageEmbed } = require('discord.js')

module.exports = {
    name: 'serverinfo',
    category: 'Info',
    private: false,
    timeout: 500,
    description: 'Get the serverinfo',
    /**
     * 
     * @param {Client} client 
     * @param {CommandInteraction} interaction 
     */
    run: async (client, interaction, args, userinfo) => {
        const verifyFlags = {
            'NONE': `Unrestricted`,
            'LOW': `Must have verified email on account`,
            'MEDIUM': `Must be registered on Discord for longer than 5 minutes`,
            'HIGH': `Must be a member of the server for longer than 10 minutes`,
            'HIGHEST': `Must have a verified phone number`
        }

        const embed = new MessageEmbed()
            .setColor(userinfo.color)
            .setThumbnail(interaction.guild.iconURL({ dynamic: true }))
            .setTitle(`${interaction.guild.name} server information`)
            .addFields(
                {
                    name: `Name`,
                    value: `${interaction.guild.name}`,
                    inline: true,
                },
                {
                    name: `ID`,
                    value: `${interaction.guild.id}`,
                    inline: true,
                },
                {
                    name: `Owner`,
                    value: `<@${interaction.guild.ownerId}>`,
                    inline: true,
                },
                // {
                //     name: `Images`,
                //     value: `
                //     ${interaction.guild.icon && interaction.guild.banner && interaction.guild.splash ? 'No images' : ''}
                //     ${interaction.guild.icon ? `[Server Icon](https://cdn.discordapp.com/icons/${interaction.guild.id}/${interaction.guild.icon}.png?size=4096)` : ``}
                //     ${interaction.guild.banner ? `[Server Banner](https://cdn.discordapp.com/banners/${interaction.guild.id}/${interaction.guild.banner}.png?size=4096)` : ``}
                //     ${interaction.guild.splash ? `[Invite Background](https://cdn.discordapp.com/splashes/${interaction.guild.id}/${interaction.guild.spash}.png?size=4096)` : ``}
                //     `,
                //     inline: true,
                // },
                {
                    name: `Verify Level`,
                    value: `${verifyFlags[interaction.guild.verificationLevel]}`,
                    inline: true,
                },
                {
                    name: `Boost Tier`,
                    value: `Tier ${`${interaction.guild.premiumTier ? '0' : ''}`}`,
                    inline: true,
                },
                {
                    name: `Created`,
                    value: `<t:${(interaction.guild.createdAt.getTime() / 1000).toFixed(0)}> (<t:${(interaction.guild.createdAt.getTime() / 1000).toFixed(0)}:R>)\n`,
                    inline: true,
                },
                {
                    name: `Members`,
                    value: `${interaction.guild.memberCount}/${interaction.guild.maximumMembers}`,
                    inline: true,
                },
                {
                    name: `Bots`,
                    value: `${interaction.guild.members.cache.filter(member => !member.user.bot).size}`,
                    inline: true,
                },
                {
                    name: 'Text Channels',
                    value: `${interaction.guild.channels.cache.filter(channel => channel.type === 'GUILD_TEXT').size}`,
                    inline: true
                },
                {
                    name: 'Voice Channels',
                    value: `${interaction.guild.channels.cache.filter(channel => channel.type === 'GUILD_VOICE').size}`,
                    inline: true
                },
                {
                    name: 'Roles',
                    value: `${interaction.guild.roles.cache.size}`,
                    inline: true
                },
                {
                    name: 'Emoji count',
                    value: `${interaction.guild.emojis.cache.size || `None`}`,
                    inline: true
                },
                {
                    name: 'Boost count',
                    value: `${interaction.guild.premiumSubscriptionCount || 0}`,
                    inline: true
                }
            )
        await interaction.editReply({ embeds: [embed] })

    }
}