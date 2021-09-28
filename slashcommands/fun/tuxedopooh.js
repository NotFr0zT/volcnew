const { MessageEmbed, CommandInteraction, Client } = require('discord.js');

module.exports = {
    name: 'tuxedopooh',
    category: 'Fun',
    description: 'Creates a tuxedopooh image',
    private: false,
    timeout: 5,
    options: [
        {
            type: 3,
            name: 'text1',
            description: 'Text 1 for the image',
            required: true,
        },
        {
            type: 3,
            name: 'text2',
            description: 'Text 2 for the image',
            required: true,
        },
    ],
    /**
 * @param {CommandInteraction} interaction
 * @param {Client} client
 */
    run: async (client, interaction, args, userinfo) => {
        const text1 = interaction.options.getString('text1')
        const text2 = interaction.options.getString('text2')
        const Image = `https://api.popcatdev.repl.co/pooh?text1=${encodeURIComponent(text1)}&text2=${encodeURIComponent(text2)}`

        let embed = new MessageEmbed()
            .setTitle('pooooooooooh')
            .setAuthor(interaction.user.username, interaction.user.avatarURL({ dynamic: true }))
            .setImage(Image)
            .setColor(userinfo.color)
        interaction.editReply({ embeds: [embed] })
    }
}