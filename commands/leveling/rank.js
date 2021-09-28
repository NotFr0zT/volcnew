const canvacord = require('canvacord');
const Discord = require('discord.js')
const xpdb = require('../../models/xpdb');
const GuildSettings = require('../../models/settings');
const { MessageEmbed, Client, Message } = require('discord.js');

module.exports = {
    name: 'rank',
    category: 'Leveling',
    description: 'Shows you or someone elses rank',
    aliases: ['level'],
    usage: 'rank [user]',
    userperms: [],
    botperms: [],
    /**
    * @param {Client} client
    * @param {Message} message
    * @param {String[]} args
    */
    run: async (client, message, args, prefix, userinfo) => {
        var storedSettings = await GuildSettings.findOne({ gid: message.guild.id });
        if (storedSettings) {
            if (!storedSettings.levels) return message.error(`Levels are disabled in this server!`)
        }
        let User = message.mentions.users.first() || message.author || client.users.cache.find(args[0])
        let Avatar = User.displayAvatarURL({ dynamic: false, format: 'png' });
        const userData = await xpdb.findOne({ id: `${message.guild.id}_${User.id}` });
        if (!userData) return message.reply(`This users hasn't send any messages!`);
        const rank = new canvacord.Rank()
            .setAvatar(Avatar)
            .setCurrentXP(userData.xp)
            .setRequiredXP(userData.reqXP)
            .setLevel(userData.level)
            .setStatus('online')
            .setProgressBar(userinfo.color, 'COLOR')
            .setUsername(User.username)
            .setDiscriminator(User.discriminator)
        rank.build()
            .then(async (data) => {
                const attachment = new Discord.MessageAttachment(data, 'RankCard.png');
                await message.reply({ files: [attachment] });
            });
        // var storedSettings = await GuildSettings.findOne({ gid: message.guild.id })
        // if (storedSettings) {
        //     if (!storedSettings.levels) return message.reply('Levels are disabled in this server!')
        // }
        // let user = message.mentions.users.first() || message.author
        // let avatar = user.avatarURL({ dynamic: false, format: 'png' })

        // const userData = xpdb.findOne({ id: `${message.guild.id}_${user.id}` })
        // if (!userData) return message.reply('That user hasn\'t sent a message yet!')

        // const rank = new canvacord.Rank()
        //     .setAvatar(avatar)
        //     .setCurrentXP(userData.xp)
        //     .setRequiredXP(userData.reqXP)
        //     .setLevel(userData.level)
        //     .setStatus('online')
        //     .setProgressBar(userinfo.color, 'COLOR')
        //     .setUsername(user.username)
        //     .setDiscriminator(user.discriminator)
        // rank.build()
        //     .then(async data => {
        //         const attatchment = new Discord.MessageAttachment(data, 'RankCard.png')
        //         await message.reply({ files: [attatchment] })
        //     })
    }
}