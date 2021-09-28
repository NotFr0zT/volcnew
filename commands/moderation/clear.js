const { MessageEmbed, Client, Message } = require('discord.js');


module.exports = {
    name: 'clear',
    category: 'Moderation',
    description: 'Clear\'s a specified amount of messages',
    aliases: ['purge', 'c'],
    usage: 'clear <messages> [reason]',
    example: 'clear 69 Funny number',
    userperms: ['MANAGE_MESSAGES'],
    botperms: [],
    /**
    * @param {Client} client
    * @param {Message} message
    * @param {String[]} args
    */
    run: async (client, message, args, prefix, userinfo) => {


        const amount = args[0];

        if (!amount) return message.reply('You haven\'t given an amount of messages which should be deleted!');
        if (isNaN(amount)) return message.reply('The amount must be a number!');

        if (amount > 100) return message.reply(new MessageEmbed()
            .setDescription('You can\'t delete more then 100 messages at once.')
            .setFooter('The is because of Discords API, I can\'t control this.')
        );
        if (amount < 1) return message.reply('You have to delete at least 1 message');

        message.delete();

        await message.channel.messages.fetch({ limit: amount }).then(messages => {
            message.channel.bulkDelete(messages)
        });
    }
}