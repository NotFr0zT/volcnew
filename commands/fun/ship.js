const block = '⬛';
const heart = ':red_square:';//put your own block emoji if you have smth
const { MessageEmbed } = require('discord.js')

module.exports = {
    name: 'ship',
    category: 'Fun',
    description: 'Ships you and someone together',
    aliases: [],
    usage: 'ship <user>',
    userperms: [],
    botperms: [],
    /**
    * @param {Client} client
    * @param {Message} message
    * @param {String[]} args
    */
    run: async (client, message, args, prefix, userinfo) => {

        const user = message.mentions.users.first();
        if (!user) return client.error(`Please specify a user to ship with!`, message)
        if (user && user.id === message.author.id) {
            return client.error('Bruh you want to ship yourself xd', message)
        }
        if (message.mentions.users.size < 2) {
            let loveEmbed = new MessageEmbed()
                .setColor(userinfo.color)
                .setTitle('Shipping...')
                .setDescription(`Shipped ${message.author} and ${user}!`)
                .setImage(`https://api.popcatdev.repl.co/ship?user1=${message.author.displayAvatarURL({ dynamic: false, format: 'png' })}&user2=${user.displayAvatarURL({ dynamic: false, format: 'png' })}`)
                .addField(`**Ship Meter**`, ship())

            return message.reply({ embeds: [loveEmbed] })
        } else if (message.mentions.users.size > 1) {
            let luv = new MessageEmbed()
                .setColor(userinfo.color)
                .setTitle('Shipping...')
                .setDescription(`Shipped ${message.mentions.users.first()} and ${message.mentions.users.last()}!`)
                .setImage(`https://api.popcatdev.repl.co/ship?user1=${message.mentions.users.first().displayAvatarURL({ dynamic: false, format: 'png' })}&user2=${message.mentions.users.last().displayAvatarURL({ dynamic: false, format: 'png' })}`)
                .addField(`**Ship Meter**`, ship())
            message.reply({ embeds: [luv] })


        }

        function ship() {
            const hearts = Math.floor(Math.random() * 110) + 0;
            const hearte = (hearts / 10)

            const str = `${heart.repeat(hearte)}${block.repeat(11 - hearte)} ${hearts}%`;
            return str;
        }
    }
}