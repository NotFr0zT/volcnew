const { MessageEmbed, CommandInteraction, Client } = require('discord.js');

module.exports = {
    name: 'invite',
    category: 'Utility',
    description: 'Links for the bot',
    private: false,
    timeout: 5,
    /**
 * @param {CommandInteraction} interaction
 * @param {Client} client
 */
    run: async (client, interaction, args, userinfo) => {
        const embed = new MessageEmbed()
            .setColor(userinfo.color)
            .setDescription(`[Invite Link](${client.config.botinvite})\n[Support Server](${client.config.supportserver})\n[Top.gg](${client.config.comingsoon})`)
        interaction.editReply({ embeds: [embed] })
    }
}