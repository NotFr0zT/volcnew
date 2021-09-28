const { CommandInteraction, Client, MessageEmbed } = require('discord.js')
const db = require('../../models/warn')

module.exports = {
    name: 'warnings',
    category: 'Moderation',
    description: 'Warning system',
    timeout: 5,
    options: [
        {
            name: 'add',
            description: 'Adds a warnings',
            type: 'SUB_COMMAND',
            options: [
                {
                    name: 'target',
                    description: 'Select a target',
                    type: 'USER',
                    required: true
                },
                {
                    name: 'reason',
                    description: 'Provide a reason',
                    type: 'STRING',
                    required: true
                },
                {
                    name: 'evidence',
                    description: 'Provide evidence',
                    type: 'STRING',
                    required: false
                },
            ]
        },
        {
            name: 'check',
            description: 'Checks the warnings',
            type: 'SUB_COMMAND',
            options: [
                {
                    name: 'target',
                    description: 'Select a target',
                    type: 'USER',
                    required: true
                },
            ]
        },
        {
            name: 'remove',
            description: 'Removes a specific warning',
            type: 'SUB_COMMAND',
            options: [
                {
                    name: 'target',
                    description: 'Select a target',
                    type: 'USER',
                    required: true
                },
                {
                    name: 'id',
                    description: 'Provide the warning ID',
                    type: 'NUMBER',
                    required: true
                },
            ]
        },
        {
            name: 'clear',
            description: 'Clears all warnings',
            type: 'SUB_COMMAND',
            options: [
                {
                    name: 'target',
                    description: 'Select a target',
                    type: 'USER',
                    required: true
                },
            ]
        },
    ],
    /**
     * @param {CommandInteraction} interaction
     * @param {Client} client
     */
    run: async (client, interaction, args, userinfo) => {
        if (!interaction.member.permissions.has('ADMINISTRATOR')) return interaction.editReply({ content: 'You don\'t have permission to do this! `ADMINISTRATOR` required' })
        const sub = interaction.options.getSubcommand(['add', 'check', 'remove', 'clear'])
        const target = interaction.options.getMember('target')
        const reason = interaction.options.getString('reason')
        const evidence = interaction.options.getString('evidence') || 'None provided.'
        const warnid = interaction.options.getNumber('warnid') - 1
        const warndate = new Date(interaction.createdTimestamp).toLocaleDateString()
        if (sub === 'add') {
            db.findOne({ GuildID: interaction.guild.id, UserID: target.id, UserTag: target.user.tag }, async (err, data) => {
                if (err) throw err
                if (!data) {
                    let data = new db({
                        GuildID: interaction.guild.id,
                        UserID: target.id,
                        UserTag: target.user.tag,
                        Content: [
                            {
                                ExecutorID: interaction.user.id,
                                ExecutorTag: interaction.user.tag,
                                Reason: reason,
                                Evidence: evidence,
                                Date: warndate
                            }
                        ],
                    })
                    data.save()
                } else {
                    const obj = {
                        ExecutorID: interaction.user.id,
                        ExecutorTag: interaction.user.tag,
                        Reason: reason,
                        Evidence: evidence,
                        Date: warndate
                    }
                    data.Content.push(obj)
                    data.save()
                }
            });

            interaction.editReply({
                embeds: [
                    new MessageEmbed()
                        .setColor(userinfo.color)
                        .setTitle(`${client.user.username} Warning System`)
                        .setDescription(`Warning added: ${target.user.tag} | ||${target.user.id}||\n**Reason**: ${reason}\n**Evidence**: ${evidence}`)
                ]
            })





        } else if (sub === 'check') {

            db.findOne({ GuildID: interaction.guild.id, UserID: target.id, UserTag: target.user.tag }, async (err, data) => {
                if (err) throw err
                if (data) {
                    interaction.editReply({
                        embeds: [
                            new MessageEmbed()
                                .setColor(userinfo.color)
                                .setTitle(`${client.user.username} Warning System`)
                                .setDescription(`${data.Content.map(
                                    (w, i) => `**ID**: ${i + 1}\n**By**: ${w.ExecutorTag}\n**Date**: ${w.Date}\n**Reason**: ${w.Reason}\n **Evidence**: ${w.Evidence}
                                    \n`
                                ).join(' ')}`)
                        ]
                    })
                } else {
                    interaction.editReply({
                        embeds: [
                            new MessageEmbed()
                                .setColor(userinfo.color)
                                .setDescription(`${target.user.tag} | ||${target.user.id}|| has no history.`)
                                .setTitle(`${client.user.username} Warning System`)
                        ]
                    })
                }
            })





        } else if (sub === 'remove') {
            db.findOne({ GuildID: interaction.guild.id, UserID: target.id, UserTag: target.user.tag }, async (err, data) => {
                if (err) throw err;
                if (data) {
                    data.Content.splice(warnid, 1)
                    interaction.editReply({
                        embeds: [
                            new MessageEmbed()
                                .setColor(userinfo.color)
                                .setDescription(`${target.user.tag} | ||${target.user.id}|| has no history.`)
                                .setTitle(`${client.user.username} Warning System`)
                        ]
                    })
                }
            })




        } else if (sub === 'clear') {





        }
    }
}