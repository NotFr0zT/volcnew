const { MessageEmbed, Client, Message } = require('discord.js')


const ms = require('ms')

module.exports = {
    name: 'slowmode',
    category: 'Moderation',
    description: 'Sets the slowmode of then channel you\'re in',
    aliases: ['sm', 'sw'],
    usage: 'slowmode <time in seconds> [reason]',
    example: 'slowmode 20s Too much spam',
    userperms: ['MANAGE_CHANNELS'],
    botperms: [],
    /**
     * 
     * @param {CLient} client 
     * @param {Message} message 
     * @param {String[]} args 
     */
    run: async (client, message, args, prefix, userinfo) => {


        if (!args[0]) return message.reply('You did not specify a time!').then(m => m.delete({ timeout: 5000 }));

        const currentCooldown = message.channel.rateLimitPerUser;

        const reason = args[1] ? args.slice(1).join(' ') : 'No reason';

        const embed = new MessageEmbed()
            .setFooter(`${message.author.tag} | ${message.author.id}`, message.author.avatarURL({ dynamic: true }));

        if (args[0] === 'off') {

            if (currentCooldown === 0) return message.reply('Channel cooldown is already off').then(m => m.delete({ timeout: 5000 }));

            embed.setTitle('Slowmode Disabled')
                .setColor(userinfo.color)
            return message.channel.setRateLimitPerUser(0, reason).then(message.reply({ embeds: [embed] }))

        }

        const time = ms(args[0]) / 1000;

        if (isNaN(time)) return message.reply('Not a valid time, please try again!').then(m => m.delete({ timeout: 5000 }));

        if (time >= 21600) return message.reply('That slowmode limit is too high, please enter anything lower than 6 hours.').then(m => m.delete({ timeout: 5000 }));

        if (currentCooldown === time) return message.reply(`Slowmode is already set to ${args[0]}`);

        embed.setTitle('Slowmode Enabled')
            .addField('Slowmode: ', args[0])
            .addField('Reason: ', reason)
            .setColor(userinfo.color)

        message.channel.setRateLimitPerUser(time)
        message.reply({ embeds: [embed] })

    }
}