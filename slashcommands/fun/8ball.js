const { MessageEmbed, CommandInteraction } = require('discord.js');

module.exports = {
    name: '8ball',
    category: 'Fun',
    description: 'There is a big chance I insult you!',
    private: false,
    timeout: 5,
    options: [
        {
            type: 'STRING',
            name: `question`,
            description: `The question to ask`,
            required: true
        }
    ],
    /**
 * @param {CommandInteraction} interaction
 */
    run: async (client, interaction, args, userinfo) => {
        const [question] = args
        const text = question
        let responses = [
            'Yes',
            'No',
            'Absolute',
            'Absolute not',
            'Definetely',
            'Absoloutely',
            'Not in a million years',
        ];
        let response =
            responses[Math.floor(Math.random() * responses.length - 1)];
        let Embed = new MessageEmbed()
            .setTitle(`8Ball!`)
            .setDescription(`My reply to \`${text}\` is **${response}**`)
            .setColor(userinfo.color);
        await interaction.editReply({ embeds: [Embed] });


    },
};