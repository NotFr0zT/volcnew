const { CommandInteraction, Client } = require('discord.js')
const model1 = require('../../models/settings')

module.exports = {
    name: 'settings',
    description: 'Change bot/user settings!',
    category: 'config',
    private: true,
    options: [
        {
            name: 'delguilddata',
            description: 'Delete all saved data of the guild!',
            type: 1,
        },
        {
            name: 'logchannel',
            description: 'Set the logchannel of the guild!',
            type: 1,
            choices: [
                {
                    type: 7,
                    name: 'channel',
                    description: 'Channel to set the logchannel to!',
                    required: false
                },
            ],
        },
        {
            name: 'snipe',
            description: 'Enable/disable your messages for the snipe command!',
            type: 1,
            choices: [
                {
                    type: 5,
                    name: `value`,
                    description: `The value to set!`,
                    required: true
                }
            ]
        },
        {
            name: 'prefix',
            description: 'Sets the new prefix for the server',
            type: 1,
            choices: [
                {
                    type: 1,
                    name: 'value',
                    description: 'New prefix',
                    required: false
                }
            ]
        },
        // {
        //     name: 'levels',
        //     description: 'Enable/disable levels',
        //     type: 1,
        //     choices: [
        //         {
        //             type: 5,
        //             name: `value`,
        //             description: `The value to set!`,
        //             required: true
        //         }
        //     ]
        // },
        {
            name: 'color',
            description: 'Set your own embed color!',
            type: 1,
            choices: [
                {
                    type: 3,
                    name: `hex`,
                    description: `Hex value of the color!`,
                    required: true
                }
            ]
        },
    ],
    /**
     * 
     * @param {Client} client 
     * @param {CommandInteraction} interaction 
     */
    run: async (client, interaction, userinfo) => {
        var az = interaction.data.options[0].value
        var ao = interaction.data.options[1].value
        const command = interaction.options.getSubcommand()
        if (command === 'prefix') {
            if (!interaction.member.permissions.has('ADMINISTRATOR')) return interaction.followUp({ content: 'You do not have permission to use this', ephemeral: true })
            var storedsettings = model1.findOne({ gid: interaction.guild.id })
            if (!storedSettings) {
                let newSettings = new model10({
                    gid: interaction.guild.id,
                    prefix: 'v!',
                    levels: true,
                });
                await newSettings.save().catch(() => { });
                storedSettings = await model10.findOne({ gid: interaction.guild.id });
            }
            model1.findOne(
                { gid: interaction.guild.id },
                async (err, data) => {
                    if (err) throw err;
                    data.prefix = az,
                        data.save();
                }
            );
            await interaction.editReply({ content: `Saved the new prefix as ${az}` })
        }
    }
}