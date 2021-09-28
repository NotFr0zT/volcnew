const { MessageEmbed, Client, Message } = require('discord.js');
const model = require('../../models/afk')

module.exports = {
    name: 'afk',
    category: 'Utility',
    description: 'Sets your afk',
    aliases: [],
    usage: 'afk [message]',
    userperms: [],
    botperms: [],
    /**
    * @param {Client} client
    * @param {Message} message
    * @param {String[]} args
    */
    run: async (client, message, args, prefix, userinfo) => {
        let User = message.author;
        var afk = await model.findOne({ gid: message.guild.id, userid: User.id });
        let text = args.join(" ") || `Not specified`;
        if (afk) return message.reply({ content: `You're already afk` });
        const newData = new model({
            gid: message.guild.id,
            userid: User.id,
            message: text,
        });
        newData.save();
        message.member.setNickname(`[AFK] ` + message.member.displayName).catch(e => { });
        message.reply({ content: `<@${User.id}>`, embeds: [{ description: ` Set your afk: ${text}`, color: userinfo.color }] });
    }
}