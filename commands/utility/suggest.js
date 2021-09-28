const { MessageEmbed, Message, Client } = require('discord.js')
const model = require('../../models/suggestionchannel')


module.exports = {
    name: 'suggest',
    category: 'Utility',
    description: 'Suggests something!',
    aliases: [],
    usage: 'suggest <suggestion | reset>',
    userperms: [],
    botperms: ['MANAGE_CHANNELS'],
    /**
     * 
     * @param {Client} client 
     * @param {Message} message 
     * @param {String[]} args  
     */
    run: async (client, message, args, prefix, userinfo) => {

        const settings = await model.findOne({ gid: message.guild.id })
        const channel = settings.channel
        if (channel === undefined) return message.reply(`No suggestion channel set. Use\n\n\`\`\`${prefix}settings suggest <channel | none>\`\`\``)


        const suggestionQuery = args.join(" ");
        if (!suggestionQuery) return message.reply("Please Suggest Something.");


        const done = new MessageEmbed()
            .setDescription(` Your suggestion was successfully sent to <#${channel}>!`)
            .setColor(userinfo.color)

        message.reply({ embeds: [done] })
        var embed = new MessageEmbed()
            .setAuthor(message.author.tag, message.author.displayAvatarURL({ dynamic: true }))
            .setDescription(`${suggestionQuery}`)
            .setColor(userinfo.color)
        var msg = await message.guild.channels.cache.get(channel).send({ embeds: [embed] })


        msg.react('👍')
        msg.react('👎')
    }
}