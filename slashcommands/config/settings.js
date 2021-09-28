const { MessageEmbed, Client, CommandInteraction } = require('discord.js');
const GuildSettings = require('../../models/settings');
const schannel = require('../../models/suggestionchannel')
const autoschema = require('../../models/autorole')
const mchannel = require('../../models/modlog')
const userdb = require('../../models/userdb')
const { isHex } = require('../../functions')

var lvlrgx = {
    true: 'Enabled',
    false: 'Disabled'
}
//#f56942
module.exports = {
    name: 'settings',
    description: 'Updates the settings for your server/yourself',
    private: false,
    timeout: 5,
    options:
        [
            {
                type: 1,
                name: 'show',
                description: 'Shows the current settings and their value',
                required: false,
            },
            {
                type: 1,
                name: 'color',
                description: 'Change your embed color',
                required: false,
                options:
                    [
                        {
                            type: 3,
                            name: 'embedcolor',
                            description: 'The color',
                            required: true
                        },
                    ],
            },
            // {
            //     type: 1,
            //     name: 'suggest',
            //     description: 'Changes the suggestion channel of the guild',
            //     required: false,
            //     options:
            //         [
            //             {
            //                 type: 'CHANNEL',
            //                 name: 'suggestionchannel',
            //                 description: 'The channel',
            //                 required: false
            //             },
            //             {
            //                 type: 2,
            //                 name: 'none',
            //                 description: 'Resets your channel',
            //                 required: false
            //             },
            //         ],
            // },

        ],
    /**
     * 
     * @param {Client} client 
     * @param {CommandInteraction} interaction 
     */
    run: async (client, interaction, args, userinfo) => {



        var sub = interaction.options.getSubcommand(['color', 'show', 'suggest'])
        var color = interaction.options.getString('embedcolor')
        var suchannel = interaction.options.getChannel('suggestionchannel')
        var setmodel = await GuildSettings.findOne({ gid: interaction.guild.id });
        if (!setmodel) {
            const newSettings = new GuildSettings({
                gid: interaction.guild.id,
                prefix: 'v!',
                levels: true,
            });
            await newSettings.save().catch(() => { });
            setmodel = await GuildSettings.findOne({ gid: interaction.guild.id });
        }

        var sugmodel = await schannel.findOne({ gid: interaction.guild.id });
        if (!sugmodel) {
            const newSettings = new schannel({
                gid: interaction.guild.id,
                channel: `None`,
            });
            await newSettings.save().catch(() => { });
            sugmodel = await schannel.findOne({ gid: interaction.guild.id });
        }

        // var amodel = await autoschema.findOne({ gid: interaction.guild.id });
        // if (!amodel) {
        //     const newSettings = new autoschema({
        //         gid: interaction.guild.id,
        //         enabled: false,
        //     });
        //     await newSettings.save().catch(() => { });
        //     samodel = await autoschema.findOne({ gid: interaction.guild.id });
        // }

        var modmodel = await mchannel.findOne({ gid: interaction.guild.id });
        if (!modmodel) {
            const newSettings = new mchannel({
                gid: interaction.guild.id,
                channel: `None`,
            });
            await newSettings.save().catch(() => { });
            modmodel = await mchannel.findOne({ gid: interaction.guild.id });
        }

        function chs(channel) {
            if (channel === 'None') return '\`None\`'
            else return `<#${channel}>`
        }
        var prefix = '/'
        if (sub === 'show') {
            const msgembed = new MessageEmbed()
                .setTitle(`${interaction.guild.name}'s settings`)
                // .addField(`Prefix`, `> **Description:** \`Changes the prefix I respond to.\`\n> **Usage:** \`${prefix}settings prefix <prefix | reset>\`\n> **Prefix:** \`${setmodel.prefix}\` **or** <@${client.user.id}>`)
                .addField(`Suggestions Channel`, `> **Description:** \`Changes the channel for where all the suggestions go (${prefix}suggest).\`\n> **Usage:** \`${prefix}settings suggest <channel | none>\`\n> **Channel:** ${chs(sugmodel.channel)}`)
                .addField(`Modlog Channel`, `> **Description:** \`Changes the channel for where all the modlogs go.\`\n> **Usage:** \`${prefix}settings modlog <channel | none>\`\n> **Channel:** ${chs(modmodel.channel)}`)
                .addField('Embed Color', `> **Description:** \`Changes the color on all the embeds I send.\`\n> **Usage:** \`${prefix}settings color <color>\`\n> **Color:** \`${userinfo.color}\``)
                // .addField(`Autorole`, `> *${prefix} settings autorole <add | check | remove | disable | clear> [role]*`)
                .setTimestamp()
                .setColor(userinfo.color)
            interaction.editReply({ embeds: [msgembed] })
        } else if (sub === 'color') {
            let nohex = new MessageEmbed()
                .setColor(userinfo.color)
                .setTitle('Color')
                .setDescription('You must provide a real hex color. Click [here](https://htmlcolorcodes.com/color-picker/) to find your perfect color')
            if (!isHex(color)) return interaction.editReply({ embeds: [nohex] })
            userdb.findOne(
                { userid: interaction.user.id },
                async (err, data) => {
                    if (err) throw err;
                    data.color = color
                    data.save()
                }
            )
            let embed = new MessageEmbed()
                .setColor(color)
                .setDescription(`Set your color to \`${color}\`. Click [here](https://htmlcolorcodes.com/color-picker/) to find your perfect color`)
            await interaction.editReply({ embeds: [embed] })
        } else if (sub === 'suggest') {
            const support = userinfo.developer
            if (!support || !interaction.member.permissions.has('ADMINISTRATOR')) return interaction.editReply('Lol no permissions, what did you expect to happen')
            if (sub2 === 'none') {
                schannel.deleteMany({ gid: interaction.guild.id })
                return interaction.editReply('Succesfully removed the suggestion\'s channel!')
            }
            var channel = interaction.mentions.channels.last() || interaction.guild.channels.cache.get(ao)
            if (!channel) return interaction.editReply('You must specify a new channel')
            schannel.findOne(
                { gid: interaction.guild.id },
                async (err, data) => {
                    if (err) throw err;
                    data.gid = interaction.guild.id,
                        data.channel = channel.id
                    data.save();
                }
            );
            interaction.editReply(`Changed the suggestions channel to <#${channel.id}>`)
        }
    }
}