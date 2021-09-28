
const Timeout = new Set();
const { Message, Client } = require("discord.js");
const Discord = require("discord.js");
const ms = require("ms");
const generator = require('generate-password');
const guildSettings = require('../models/settings')
const custom = require('../models/custom')
const userdb = require('../models/userdb')
const { validatePermissions } = require('../functions')

/**
        * @param { Client } client
        * @param { Message } message
        * @param { GuildMember } member
 */


module.exports = async (client) => {

    //     ____ _   _ ___ _     ____   ____ ____  _____    _  _____ _____   _______     _______ _   _ _____
    //     / ___| | | |_ _| |   |  _ \ / ___|  _ \| ____|  / \|_   _| ____| | ____\ \   / / ____| \ | |_   _|
    //    | |  _| | | || || |   | | | | |   | |_) |  _|   / _ \ | | |  _|   |  _|  \ \ / /|  _| |  \| | | |
    //    | |_| | |_| || || |___| |_| | |___|  _ <| |___ / ___ \| | | |___  | |___  \ V / | |___| |\  | | |
    //     \____|\___/|___|_____|____/ \____|_| \_\_____/_/   \_\_| |_____| |_____|  \_/  |_____|_| \_| |_|

    client.on('guildCreate', async (guild) => {
        let defaultChannel = 'general';
        guild.channels.cache.forEach((channel) => {
            if (channel.type == 'text' && defaultChannel == 'general') {
                if (channel.permissionsFor(guild.me).has('SEND_MESSAGES')) {
                    defaultChannel = channel;
                }
            }
        })


        defaultChannel.send(new MessageEmbed()
            .setTitle('Thank you for adding me!')
            .setDescription('Hello there! Thanks for inviting me to your server! Need help? Type `v!help`')
            .addField('Important Links:', `[Invite Link](https://discord.com/api/oauth2/authorize?client_id=843428824385716244&permissions=8&scope=bot)\n[Support Server](https://discord.gg/xyqpAvyPgZ)\n [Github Repository](https://github.com/NotFr0zT/Volcania)`)
            .setColor('BLUE')
            .setTimestamp()
        )
    })



    client.on('ready', async () => {

        setInterval(function () {


            const botStatus = [
                `${client.guilds.cache.size} servers and ${client.users.cache.size} users`,
            ];
            const status = botStatus[Math.floor(Math.random() * botStatus.length)];
            client.user.setPresence({ activity: { type: 'PLAYING', url: "https://www.twitch.tv/fr0zttt", name: status } });
        }, 30000);

        // console.log(`Logged in as ${client.user.tag}`);

        //EXPRESS SESSION

        const clientDetails = {
            guilds: client.guilds.cache.size,
            users: client.users.cache.size,
            channels: client.channels.cache.size
        }

        const express = require('express')
        const app = express();
        const port = 3000 || 3001

        app.get('/', (req, res) => {
            res.status(200).send('Main Page')
        })

        app.get('/info', (req, res) => {
            res.status(200).send(clientDetails)
        })

        app.listen(port)
    })



    client.on('messageCreate', async (message) => {
        if (message.author.bot) return;

        if (message.channel.type === 'DM') return;
        message.channel.messages.fetch();

        var storedSettings = await guildSettings.findOne({ gid: message.guild.id });
        if (!storedSettings) {
            const newSettings = new guildSettings({
                gid: message.guild.id,
                prefix: process.env.PREFIX,
                levels: true,
            });
            await newSettings.save().catch(() => { });
            storedSettings = await guildSettings.findOne({ gid: message.guild.id });
        }

        if (!message.channel.permissionsFor(message.guild.me).has('SEND_MESSAGES')) return;
        const escapeRegex = str => str.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
        const prefixRegex = new RegExp(`^(<@!?${client.user.id}>|${escapeRegex(storedSettings.prefix)})\\s*`);
        if (!prefixRegex.test(message.content.toLowerCase())) return;
        const [, matchedPrefix] = message.content.toLowerCase().match(prefixRegex);

        if (!message.guild) return;
        const args = message.content.slice(matchedPrefix.length).trim().split(/ +/g);
        const cmd = args.shift().toLowerCase();

        if (cmd.length === 0) return;
        let command = client.commands.get(cmd);
        if (!command) command = client.commands.get(client.aliases.get(cmd));

        if (command) {
            if (command.userperms.length > 0 || command.botperms.length > 0) {
                if (typeof command.userperms === 'string') {
                    command.userperms = command.userperms.split();
                    validatePermissions(command.userperms);
                }

                for (const permission of command.userperms) {
                    if (permission === 'OWNER' && message.member.id !== OWNER) {
                        return;
                    }
                    else if (!message.member.permissions.has(permission)) {
                        let embed = new Discord.MessageEmbed()
                            .setTitle("Permission Error")
                            .setDescription("Sorry, you don't have permissions to use this! ❌")
                        return message.reply({ embeds: [embed] });
                    }
                }

                if (typeof command.botperms === 'string') {
                    command.botperms = command.botperms.split();
                    validatePermissions(command.botperms);
                }

                for (const permission of command.botperms) {
                    if (!message.guild.me.permissions.has(permission)) {
                        let embed = new Discord.MessageEmbed()
                            .setTitle("Permission Error")
                            .setDescription("I don't have permissions to use this! ❌")

                        return message.reply({ embeds: [embed] })
                    }
                }
            }

            let userinfo = await userdb.findOne({ userid: message.author.id });
            if (!userinfo) {
                const somenewsetting = new userdb({
                    userid: message.author.id,
                    developer: false,
                    banned: false,
                    color: '#f56942',
                    snipe: true,
                })
                await somenewsetting.save()
                userinfo = await userdb.findOne({ userid: message.author.id });
            }
            if (userinfo.banned) {
                const embed = new Discord.MessageEmbed()
                    .setTitle('I think I\'m gonna pass')
                    .setDescription('You seem to have been banned by the developers of the bot')
                    .setColor('BLUE')
                    .addField('Mistake?', 'If you think this is a mistake, please contact a developer of the bot. **<Fr0zT>#9999**, **Monochromish#9999**')
                return message.reply({ embeds: [embed] })
            }

            if (command.timeout) {
                if (Timeout.has(`${message.author.id}${command.name}`)) {
                    var timeoutembed = new Discord.MessageEmbed()
                        .setTitle('Take a break')
                        .setDescription(`You are on cooldown\nThe cooldown of this command is \`${ms(command.timeout)}\``)
                        .setColor('BLUE')

                    message.reply({ embeds: [timeoutembed] })
                } else {
                    let prefix = storedSettings.prefix
                    command.run(client, message, args, prefix).catch(console.log)
                    Timeout.add(`${message.author.id}${command.name}`);
                    setTimeout(() => {
                        Timeout.delete(`${message.author.id}${command.name}`);
                    }, command.timeout)
                }
            } else {
                let prefix = storedSettings.prefix
                command.run(client, message, args, prefix).catch(console.log)
            }
        } else {
            custom.findOne(
                { Guild: message.guild.id, Command: cmd },
                async (err, data) => {
                    if (err) throw err;
                    if (data) return message.reply(data.Content);
                    else return;
                }
            )
        }
    })
    // client.on('guildMemberAdd', async (member) => {
    //     let chx = db.get(`welchannel_${member.guild.id}`);

    //     if (!chx) return;

    //     let wembed = new MessageEmbed()
    //         .setAuthor(member.user.username, member.user.displayAvatarURL())
    //         .setColor("GREEN")
    //         .setThumbnail(member.user.displayAvatarURL())
    //         .setDescription(`We are very happy to have you in **${member.guild.name}**`)
    //         .setThumbnail(member.guild.iconURL({ dynamic: true }))
    //         .setFooter(`You are the #${member.guild.memberCount} member!`)
    //         .setTitle('Join')

    //     client.channels.cache.get(chx).send({ embeds: [wembed] }, { content: `<@${member.id}>` })
    // })



    // client.on('guildMemberRemove', async (member) => {
    //     let chx = db.get(`leavechannel_${member.guild.id}`);

    //     if (!chx) return;

    //     let wembed = new MessageEmbed()
    //         .setAuthor(member.user.username, member.user.displayAvatarURL())
    //         .setColor("RED")
    //         .setThumbnail(member.user.displayAvatarURL())
    //         .setDescription(`Sad to see you go **${member.user.tag}**...`)
    //         .setThumbnail(member.guild.iconURL({ dynamic: true }))
    //         .setFooter(`There is now #${member.guild.memberCount} members left!`)
    //         .setTitle('Leave')

    //     client.channels.cache.get(chx).send({ embeds: [wembed] }, { content: `<@${member.id}>` })
    // })

}
// console.log('Loaded all events...')

/*

        const prefixSchema = require('../models/prefix')
let p;

prefixSchema.findOne({ Guild: message.guild.id }, async (data, err) => {
    if (err) throw err;
    if (data) {
        p = data.prefix
    } else {
        p = 'v!'
    }
})
if (message.mentions.users.first()) {
    if (message.mentions.users.first().id === client.user.id) return message.reply(`Prefix in ${message.guild.name} is ${p}`)
}
if (!message.content.startsWith(p)) return;
if (!message.guild) return;
if (!message.member) message.member = await message.guild.fetchMember(message);
const args = message.content.slice(p.length).split(/ +/g);
const cmd = args.shift().toLowerCase();

if (cmd.length === 0) return;

const command = client.commands.get(cmd) || client.commands.get(client.aliases.get(cmd));

if (command) {
    if (command.userperms.length > 0 || command.botperms.length > 0) {
        if (typeof command.userperms === 'string') {
            command.userperms = command.userperms.split();
            validatePermissions(command.userperms);
        }

        for (const permission of command.userperms) {
            if (permission === 'OWNER' && message.member.id !== OWNER) {
                return;
            }
            else if (!message.member.hasPermission(permission)) {
                return message.reply(new MessageEmbed()
                    .setTitle("Permission Error")
                    .setDescription("Sorry, you don't have permissions to use this! ❌")
                );
            }
        }

        if (typeof command.botperms === 'string') {
            command.botperms = command.botperms.split();
            validatePermissions(command.botperms);
        }

        for (const permission of command.botperms) {
            if (!message.guild.me.hasPermission(permission)) {
                return message.reply(new MessageEmbed()
                    .setTitle("Permission Error")
                    .setDescription("I don't have permissions to use this! ❌")
                );
            }
        }
    }
    command.run(client, message, args, prefix, userinfo);
}


*/
