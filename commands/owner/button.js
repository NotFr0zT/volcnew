const { MessageEmbed, Client, Message, MessageActionRow, MessageButton } = require('discord.js');
const { OWNER } = process.env

module.exports = {
    name: 'button',
    category: 'Owner',
    description: 'Button testing',
    aliases: [],
    usage: 'button',
    userperms: ['BOT_OWNER'],
    botperms: [],
    /**
    * @param {Client} client
    * @param {Message} message
    * @param {String[]} args
    */
    run: async (client, message, args) => {
        if (message.author.id !== OWNER) return;

        const row = new MessageActionRow()
            .addComponents(
                new MessageButton()
                    .setStyle('SUCCESS')
                    .setCustomId('yes')
                    .setLabel('Yes')
                    .setEmoji('✔'),

                new MessageButton()
                    .setStyle('DANGER')
                    .setCustomId('no')
                    .setLabel('No')
                    .setEmoji('⛔')
            )

        let embed = new MessageEmbed()
            .setColor('BLURPLE')
            .setTitle('Do you want to ban this user?')

        message.channel.send({ embeds: [embed], components: [row] })

        const filter = (interaction) => {
            if (interaction.user.id === message.author.id) return true;
            return interaction.reply({ content: 'You can\'t use this button', ephemeral: true })
        }

        const collector = message.channel.createMessageComponentCollector({ filter, max: 1 })

        collector.on('end', (int) => {
            const id = int.first().customId;

            if (id == 'yes') {
                message.channel.send({ content: 'You chose yes' })
            } else if (id === 'no') {
                message.channel.send({ content: 'You chose no' })
            }
        })
    }
}

