const { MessageEmbed, Client, Message } = require('discord.js');
const userdb = require('../../models/userdb')
const { OWNER } = process.env

module.exports = {
    name: 'dev',
    category: 'Owner',
    description: 'Change info about a user (dev only)',
    aliases: ['devconf', 'setmy'],
    usage: 'dev [developer | banned]',
    userperms: [],
    botperms: [],
    /**
    * @param {Client} client
    * @param {Message} message
    * @param {String[]} args
    */
    run: async (client, message, args, prefix, userinfo) => {
        let devembed = new MessageEmbed()
            .setTitle('No permission')
            .setDescription('You must be a developer to use this command!')
            .setColor(userinfo.color)
        if (message.author.id !== OWNER) return message.reply({ embeds: [devembed] })
        let target1 = message.mentions.users.first() || client.users.cache.get(args[0])
        let target = target1.id
        if (!target) return message.reply('You didn\'t specify a user')
        let userinfo2 = await userdb.findOne({ userid: target })
        if (!userinfo2) {
            let newSettings = new userdb({
                userid: target,
                developer: false,
                banned: false,
                color: '#f56942',
                snipe: true,
            });
            await newSettings.save()
            userinfo2 = await userdb.findOne({ userid: target });
            return message.reply('Saved new user, try again')
        }
        if (!args[1]) return message.reply(`You did not specify an thing to add to the user`);
        if (args[1] !== `developer` && !`banned`) return message.reply(` You did not specify an thing to add to the user`);
        if (args[2] !== `true` && !`false`) return message.reply(` You did not specify an value to add to the user`);
        if (args[2] === `true`) {
            userdb.findOne(
                { userid: target },
                async (err, data) => {
                    if (err) throw err;
                    data[args[1]] = true;
                    data.save();
                }
            );
            message.reply(`Added ${args[1]} to user`);
        }
        if (args[2] === `false`) {
            userdb.findOne(
                { userid: target },
                async (err, data) => {
                    if (err) throw err;
                    data[args[1]] = false;
                    data.save();
                }
            );
            message.reply({ content: `Removed ${args[1]} to user` });
        }
    }
}