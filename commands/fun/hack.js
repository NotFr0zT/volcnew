const ms = require('ms')
const { MessageEmbed, Client, Message } = require('discord.js');


module.exports = {
    name: 'hack',
    category: 'Fun',
    description: 'Hack someone',
    aliases: [],
    usage: 'hack <user>',
    userperms: [],
    botperms: [],
    /**
    * @param {Client} client
    * @param {Message} message
    * @param {String[]} args
    */
    run: async (client, message, args, prefix, userinfo) => {
        if (!args[0]) {
            return message.reply('Woah.... Slow Down!! Who are we hacking..??')
        }
        const tohack = message.mentions.members.first()
        let msg = await message.reply(`Hacking ${tohack.displayName}....`);

        let time = '1s'
        setTimeout(function () {
            msg.edit(`Finding ${tohack.displayName}'s Email and Password.....`);
        }, ms(time));

        let time1 = '6s'
        setTimeout(function () {
            msg.edit(`E-Mail: ${tohack.displayName}@gmail.com \nPassword: ********`);
        }, ms(time1));

        let time2 = '9s'
        setTimeout(function () {
            msg.edit('Finding Other Accounts.....');
        }, ms(time2));

        let time3 = '15s'
        setTimeout(function () {
            msg.edit('Setting up Epic Games Account.....');
        }, ms(time3));

        let time4 = '21s'
        setTimeout(function () {
            msg.edit('Hacking Epic Games Account......');
        }, ms(time4));

        let time5 = '28s'
        setTimeout(function () {
            msg.edit('Hacked Epic Games Account!!');
        }, ms(time5));

        let time6 = '31s'
        setTimeout(function () {
            msg.edit('Collecting Info.....');
        }, ms(time6));

        let time7 = '38s'
        setTimeout(function () {
            msg.edit('Selling data to FBI....');
        }, ms(time7));

        let time8 = '41s'
        setTimeout(function () {
            msg.edit(`Finished Hacking ${tohack.displayName}`);
        }, ms(time8));
    }
}