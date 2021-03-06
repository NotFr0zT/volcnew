const { MessageEmbed, Client, Message } = require('discord.js');



module.exports = {
    name: 'poll',
    category: 'Fun',
    description: 'Starts a poll',
    aliases: [],
    usage: 'poll <channel to send vote in> <seconds for vote to last> <vote message>',
    example: 'vote #announcements 21600 Should I make an awesome bot named Volcania?',
    userperms: ['KICK_MEMBERS'],
    botperms: [],
    /**
    * @param {Client} client
    * @param {Message} message
    * @param {String[]} args
    */
    run: async (client, message, args, prefix, userinfo) => {
        const agree = '✅';
        const disagree = '❎';

        try {
            let channel;
            let timeS;
            let votingthing;
            if (message.mentions.channels.size > 0 && args[0].startsWith('<#')) {
                channel = message.guild.channels.cache.get(message.mentions.channels.first().id);
                timeS = args[1];
                votingthing = args.splice(2, args.length);
            } else {
                channel = message.channel;
                timeS = args[0];
                votingthing = args.splice(1, args.length);
            }

            if (timeS == '' || votingthing == '') return message.reply(`I can\'t deploy a vote with no parameters! Please use \`${prefix}poll\` for more info on how to use this command!`);
            if (votingthing == '') return message.reply(`I can\'t deploy a vote with no parameters! Please use \`${prefix}poll\` for more info on how to use this command!`);

            if (isNaN(timeS)) {
                // timeS = 10000
                votingthing = timeS + ' ' + votingthing.join(' ');
                timeS = 60000;
            } else {
                votingthing = votingthing.join(' ');
                timeS = parseInt(timeS) * 1000;
            }

            if (timeS < 5000 || timeS > 180000) {
                message.reply('Please pick an appropriate amount of time for the vote to take (no less than 5 seconds and no more than three minutes)');
                return;
            }

            const VoteEmbed = new MessageEmbed()
                .setTitle(votingthing)
                .setDescription('Vote Now!')
                .setFooter(`Started by ${message.author.username}`, message.author.avatarURL({ dynamic: true }))
                .setColor('BLUE')

            let msg = await channel.send({ embeds: [VoteEmbed] });
            await msg.react(agree);
            await msg.react(disagree);


            const reactions = await msg.awaitReactions(reaction => reaction.emoji.name === agree || reaction.emoji.name === disagree, {
                time: timeS
            });
            // msg.delete();

            var no = reactions.get(disagree).count;
            var yes = reactions.get(agree);

            if (yes == undefined) {
                var yes = 1;
            } else {
                var yes = reactions.get(agree).count;
            }

            var total = yes > no ? 'In Favor of Yes' : 'In Favor of No';
            if (yes == no) total = 'It was a tie!';

            const embed = new MessageEmbed()
                .setTitle(`${votingthing.replace(/([^\W_]+[^\s-]*) */g, (txt) => { return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase() })}`)
                .setDescription('**----------------------------------------**\n' +
                    'Total votes (Yes): ' + `${yes - 1}\n` +
                    'Total votes (No): ' + `${no - 1}\n` +
                    '\n' +
                    `${total}\n` +
                    '**----------------------------------------**', true)
                .setColor('RED')
                .setFooter(`Started by ${message.author.username}`);
            setTimeout(async () => {
                await msg.edit({ content: 'Voting finished!', embeds: [embed] });
            }, timeS)
        } catch (err) {
            console.log(err);
        }
    }
}
