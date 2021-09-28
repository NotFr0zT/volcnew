const { MessageEmbed } = require('discord.js');


module.exports = {
    name: 'lock',
    category: 'Moderation',
    description: 'Locks a channel',
    aliases: [],
    usage: 'lock [channel]',
    example: 'lock #general',
    userperms: ['MANAGE_CHANNELS'],
    botperms: [],
    run: async (client, message, args, prefix, userinfo) => {


        let channel = message.channel || message.mentions.channels.first() || message.guild.channels.cache.find(args[0]);

        try {
            await message.guild.roles.cache.forEach(role => {
                channel.createOverwrite(role, {
                    SEND_MESSAGES: false,
                    ADD_REACTIONS: false
                });
            });
        } catch (e) {
            console.log(e);
            message.reply('Something failed! Please contact the developers in the [Support Server](https://discord.gg/xyqpAvyPgZ)')
        }

        message.reply(`Done | Channel Locked!`);
    }
}