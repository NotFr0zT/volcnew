module.exports = {
name: 'menu',
category: 'Owner',
description: 'Test',
aliases: ['select'],
usage: 'test',
userperms: ['BOT_OWNER'],
botperms: [],
/\*\*
_ @param {Client} client
_ @param {Message} message
_ @param {String[]} args
_/
run: async (client, message, args) => {

        const row = new MessageActionRow()
            .addComponents(
                new MessageSelectMenu()
                    .setCustomId('test')
                    .setPlaceholder('Choose something idk')
                    .addOptions([
                        {
                            label: '',
                        }
                    ])
            )

        message.channel.send({ content: 'Selct', components: [row] })

    }

}
