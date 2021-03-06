const { MessageEmbed, Client, Message } = require('discord.js');


module.exports = {
    name: 'yomomma',
    category: 'Fun',
    description: 'Yo momma',
    aliases: ['yomom', 'mom', 'ym'],
    usage: 'yomomma',
    example: 'yomomma',
    userperms: [],
    botperms: [],
    /**
    * @param {Client} client
    * @param {Message} message
    * @param {String[]} args
    */
    run: async (client, message, args, prefix, userinfo) => {
        let jokes = require('../../jsons/yomomma.json')
        const type = jokes[Math.floor(Math.random() * jokes.length)]
        client.main(type, message)
    }
}