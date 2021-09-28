const custom = require('../models/custom');
const { MessageEmbed } = require('discord.js');

module.exports = {
    name: 'cc',
    category: 'Config',
    description: 'Creates a custom command',
    aliases: ['custom', 'customcommand'],
    usage: 'cc <command> <text>',
    userperms: [],
    botperms: [],
    /**
    * @param {Client} client
    * @param {Message} message
    * @param {String[]} args
    */
    run: async (client, message, args, prefix, userinfo) => {
        let Embed2 = new MessageEmbed()
            .setDescription(':x: | Not enough permissions!')
            .setColor(userinfo.color)
        let Embed3 = new MessageEmbed()
            .setDescription(`:x: | You did not specify a custom command name!`)
            .setColor(userinfo.color);
        let Embed4 = new MessageEmbed()
            .setDescription(`:x: | No content specified!`)
            .setColor(userinfo.color);
        if (!userinfo.developer && !message.member.permissions.has('ADMINISTRATOR'))
            return message.reply({ embeds: [Embed2] })
        if (!args[0])
            return message.channel.send({ embeds: [Embed3] });
        if (!args.slice(1).join(' '))
            return message.channel.send({ embeds: [Embed4] });
        custom.findOne(
            { Guild: message.guild.id, Command: args[0] },
            async (err, data) => {
                if (err) throw err;
                if (data) {
                    data.Content = args.slice(1).join(' ');
                    data.save();

                    message.channel.send(
                        `:white_check_mark: | Successfully updated the command \`${args[0]}\``
                    );
                } else if (!data) {
                    let newData = new custom({
                        Guild: message.guild.id,
                        Command: args[0],
                        Content: args.slice(1).join(' '),
                    });
                    newData.save();
                    message.channel.send(
                        `:white_check_mark: | Successfully created the command \`${args[0]}\``
                    );
                }
            }
        );
    },
};