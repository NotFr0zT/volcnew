const { MessageEmbed, Client, Message } = require('discord.js');

const fetch = require('node-fetch')

module.exports = {
    name: 'trumptweet',
    category: 'Image',
    description: 'Mr. former president says:',
    aliases: [],
    usage: 'trumptweet <text>',
    userperms: [],
    botperms: [],
    /**
    * @param {Client} client
    * @param {Message} message
    * @param {String[]} args
    */
    run: async (client, message, args, prefix, userinfo) => {

        const tweet = args.join(" ");
        if (!tweet) {
            return message.reply("Mr. President Says: \`What to tweet ?\`")
        }
        if (tweet.length > 68) tweet = tweet.slice(0, 65) + '...';

        try {
            const res = await fetch('https://nekobot.xyz/api/imagegen?type=trumptweet&text=' + tweet);
            const img = (await res.json()).message;


            ({ files: [{ attachment: img, name: "trumptweet.png" }] });
        } catch (err) {
            console.log(err);
        }
    }
}