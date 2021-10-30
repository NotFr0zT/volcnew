const { MessageEmbed, Client, Message, MessageCollector } = require('discord.js');


module.exports = {
    name: 'emojiid',
    category: 'Fun',
    description: 'Get ID of emojis',
    aliases: ['eid'],
    usage: 'emojiid <emoji>',
    userperms: [],
    botperms: [],
    /**
    * @param {Client} client
    * @param {Message} message
    * @param {String[]} args
    */
    run: async (client, message, args, prefix, userinfo) => {
        const name = args.join(' ');
        const emoji = message.guild.emojis.cache.find(r => r.name.replace(':', ' ') === name);
        if (!name) {
            return client.error('Please type the emoji name', message)
        }
        if (!emoji) {
            return client.error('Couldn\'t find the Emojis with the provided name. Please make sure the Emoji name is correct and is in the guild!', message);
        }
        client.main(`\`\`\`${emoji}\`\`\``, message)
    }
}