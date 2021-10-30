require('dotenv').config();
const Timeout = new Set();
const { Message, Client, MessageEmbed } = require('discord.js');
const ms = require('ms');
const guildSettings = require('../../models/settings')
const custom = require('../../models/custom')
const userdb = require('../../models/userdb')
const { validatePermissions } = require('../../functions')
const afkmodel = require('../../models/afk')
const xpdb = require('../../models/xpdb')
const xpTimeout = new Set()


/**
* 
* @param {Client} client
* @param {Message} message
* @param {GuildMember} member
*/
module.exports = async (client, message) => {

    if (message.author.bot) return;

    const clean = text => {
        if (typeof (text) === 'string')
            return text.replace(/`/g, '`' + String.fromCharCode(8203)).replace(/@/g, '@' + String.fromCharCode(8203));
        else
            return text;
    }

    async function spymodehehe(txt) {
        if (txt.includes('pls')) return
        else return `${message.author.tag} said "${clean(txt)}" in ${message.guild.name} (${message.guild.id})`
    }

    // console.log(spymodehehe(message.content))

    if (message.channel.type === 'DM') return;
    message.channel.messages.fetch();

    let isafk = await afkmodel.findOne({ gid: message.guild.id, userid: message.author.id });
    if (isafk) {
        await afkmodel.deleteOne({ gid: message.guild.id, userid: message.author.id });
        message.channel.send(`<@${message.author.id}>, Welcome back! I removed you afk.`).then(async (m) => {
            setTimeout(() => {
                m.delete().catch(() => { });
            }, 5000);
        })
        if (message.member.displayName.startsWith(`[AFK] `)) {
            let name = message.member.displayName.replace(`[AFK] `, ``);
            message.member.setNickname(name).catch(() => { });
        }
    }
    message.mentions.users.forEach(async (u) => {
        if (
            !message.content.includes('@here') &&
            !message.content.includes('@everyone')
        ) {
            let isafk = await afkmodel.findOne({ gid: message.guild.id, userid: u.id });
            if (isafk) {
                message.channel.send({ embeds: [{ description: `**${u.tag}** is afk: ${isafk.message}`, color: `RED` }] });
            }
        }
    })

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

    if (storedSettings.levels) {
        let randomxp = Math.floor(Math.random() * 15) + 10;
        var xp = await xpdb.findOne({ id: `${message.guild.id}_${message.author.id}` });
        if (!xp) {
            // If there are no settings stored for this guild, we create them and try to retrive them again.
            const newUser = new xpdb({
                id: `${message.guild.id}_${message.author.id}`,
                level: 0,
                xp: 0 + randomxp,
                reqXP: 100,
            });
            await newUser.save().catch(() => { });
            xpTimeout.add(`${message.guild.id}_${message.author.id}`);
            xp = await xpdb.findOne({ id: `${message.guild.id}_${message.author.id}` });
            setTimeout(() => {
                Timeout.delete(`${message.guild.id}_${message.author.id}`);
            }, 60000);
        } else {
            if (!xpTimeout.has(`${message.guild.id}_${message.author.id}`)) {
                xp = await xpdb.findOne({ id: `${message.guild.id}_${message.author.id}` });
                xpdb.findOne(
                    { id: `${message.guild.id}_${message.author.id}` },
                    async (err, data) => {
                        if (err) throw err;
                        data.xp = xp.xp + randomxp
                        data.save();
                    }
                );
                xpTimeout.add(`${message.guild.id}_${message.author.id}`);
                setTimeout(() => {
                    xpTimeout.delete(`${message.guild.id}_${message.author.id}`);
                }, 60000);
            }
            if (xp.xp >= xp.reqXP) {
                xpdb.findOne(
                    { id: `${message.guild.id}_${message.author.id}` },
                    async (err, data) => {
                        if (err) throw err;
                        data.xp = 0,
                            data.reqXP = xp.reqXP + 100,
                            data.level = xp.level + 1
                        data.save();
                    }
                ).then(async () => {
                    message.channel.send(`**GG** <@${message.author.id}>, you are now level **${xp.level + 1}**`).catch(() => { })
                    const rewards = require('../../models/lvlreward');
                    var rewardlist = await rewards.find({ gid: message.guild.id, level: xp.level + 1 });
                    if (rewardlist) {
                        rewardlist.forEach(r => {
                            let role = message.guild.roles.cache.get(r.role);
                            if (role) {
                                message.member.roles.add(role).catch(() => { });
                            }

                        })
                    }
                }
                )
            }
        }
    }

    if (!message.channel.permissionsFor(message.guild.me).has('SEND_MESSAGES')) return;
    const escapeRegex = str => str.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    const prefixRegex = new RegExp(`^(<@!?${client.user.id}>|${escapeRegex(storedSettings.prefix)})\\s*`);
    if (!prefixRegex.test(message.content.toLowerCase())) return;
    const [, matchedPrefix] = message.content.toLowerCase().match(prefixRegex);

    if (!message.guild) return;
    const args = message.content.slice(matchedPrefix.length).trim().split(/ +/g);
    const cmd = args.shift().toLowerCase();

    if (cmd.length === 0) return message.reply();
    let command = client.commands.get(cmd);
    if (!command) command = client.commands.get(client.aliases.get(cmd));
    if (command) {
        console.log(`${message.author.tag} used ${command.name} in ${message.guild.name} (${message.guild.id})`)
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
                    let embed = new MessageEmbed()
                        .setTitle('Permission Error')
                        .setDescription('Sorry, you don\'t have permissions to use this! ❌')
                        .setColor('DARK_RED')
                    return message.reply({ embeds: [embed] });
                }
            }

            if (typeof command.botperms === 'string') {
                command.botperms = command.botperms.split();
                validatePermissions(command.botperms);
            }

            for (const permission of command.botperms) {
                if (!message.guild.me.permissions.has(permission)) {
                    let embed = new MessageEmbed()
                        .setTitle('Permission Error')
                        .setDescription('I don\'t have permissions to use this! ❌')
                        .setColor('DARK_RED')

                    return message.reply({ embeds: [embed] })
                }
            }
        }

        var userinfo = await userdb.findOne({ userid: message.author.id });
        if (!userinfo) {
            userinfo = {
                userid: message.author.id,
                developer: false,
                banned: false,
                color: '#f56942',
                snipe: true,
            }
        }
        client.error = async (text, message) => {
            let embed = new MessageEmbed()
                .setColor('RED')
                .setDescription(':x: | ' + text)
                .setFooter('Something went wrong.')
            await message.reply({ embeds: [embed] })
        }
        client.main = async (text, message) => {
            let embed = new MessageEmbed()
                .setColor(userinfo.color)
                .setDescription(text)
            await message.reply({ embeds: [embed] })
        }
        if (userinfo.banned) {
            const embed = new MessageEmbed()
                .setTitle('I think I\'m gonna pass')
                .setDescription('You seem to have been banned by the developers of the bot')
                .setColor(userinfo.color)
                .addField('Mistake?', 'If you think this is a mistake, please contact a developer of the bot. **<Fr0zT>#9999**, **Monochromish#9999**')
            return message.reply({ embeds: [embed] })
        }

        // if (command.timeout) {
        //     var timeou = command.timeout * 1000
        //     if (Timeout.has(`${message.user.id}_${command.name}`)) {
        //         await message.reply({ embeds: [{ color: userinfo.color, title: `Take a break`, description: `Ooh Ooh, You are on cooldown\nThe default cooldown of this command is ${parseDur(timeou)}` }] });
        //         return;
        //     } else {
        //         Timeout.add(`${message.user.id}_${command.name}`);
        //         command.run(client, message, args, prefix, userinfo).catch(console.log)
        //         setTimeout(() => {
        //             Timeout.delete(`${message.user.id}_${command.name}`);
        //         }, timeou);
        //     }

        // } else {
        message.userinfo = userinfo
        let prefix = storedSettings.prefix
        command.run(client, message, args, prefix, userinfo).catch(console.log)

        // }
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

}