const { MessageEmbed, Client, Message } = require('discord.js');
const GuildSettings = require('../../models/settings');
const schannel = require('../../models/suggestionchannel')
// const autoschema = require('../../models/autorole')
const mchannel = require('../../models/modlog')
const userdb = require('../../models/userdb')
const { isHex } = require('../../functions')

var lvlrgx = {
    true: 'Enabled',
    false: 'Disabled'
}

module.exports = {
    name: 'settings',
    category: 'Config',
    description: 'Updates the settings for your server/yourself',
    aliases: ['guildsettings', 'guildconf', 'guildconfig', 'usersettings', 'userconfig', 'userconf'],
    usage: 'settings <setting> <new setting>',
    userperms: [],
    botperms: [],
    /**
    * @param {Client} client
    * @param {Message} message
    * @param {String[]} args
    */
    run: async (client, message, args, prefix, userinfo) => {
        var ao = args[1]
        var az = args[0]

        var sugmodel = await schannel.findOne({ gid: message.guild.id });

        var setmodel = await GuildSettings.findOne({ gid: message.guild.id })
        if (!setmodel) {
            let ne = new GuildSettings({
                gid: message.guild.id,
                prefix: 'v!',
                levels: true
            })
            ne.save()
        }
        var setmodel = await GuildSettings.findOne({ gid: message.guild.id })

        // var amodel = await autoschema.findOne({ gid: message.guild.id });
        // if (!amodel) {
        //     const newSettings = new autoschema({
        //         gid: message.guild.id,
        //         enabled: false,
        //     });
        //     await newSettings.save().catch(() => { });
        //     samodel = await autoschema.findOne({ gid: message.guild.id });
        // }

        var modmodel = await mchannel.findOne({ gid: message.guild.id });

        function chs() {
            if (sugmodel) {
                return `<#${sugmodel.channel}>`
            } else {
                return '`None`'
            }
        }
        function chss() {
            if (modmodel) {
                return `<#${modmodel.channel}>`
            } else {
                return '`None`'
            }
        }


        if (!args.join(' ')) {
            const msgembed = new MessageEmbed()
                .setTitle(`${message.guild.name}'s settings`)
                .addField(`Prefix`, `> **Description:** \`Changes the prefix I respond to.\`\n> **Usage:** \`${prefix}settings prefix <prefix | reset>\`\n> **Prefix:** \`${prefix}\` **or** <@${client.user.id}>`)
                .addField(`Suggestions Channel`, `> **Description:** \`Changes the channel for where all the suggestions go (${prefix}suggest).\`\n> **Usage:** \`${prefix}settings suggest <channel | none>\`\n> **Channel:** ${chs()}`)
                .addField(`Modlog Channel`, `> **Description:** \`Changes the channel for where all the modlogs go.\`\n> **Usage:** \`${prefix}settings modlog <channel | none>\`\n> **Channel:** ${chss()}`)
                .addField('Embed Color', `> **Description:** \`Changes the color on all the embeds I send.\`\n> **Usage:** \`${prefix}settings color <color>\`\n> **Color:** \`${userinfo.color}\``)
                .addField('Level', `> **Description:** \`Disables/Enables leveling in your server.\`\n> **Usage:** \`${prefix}settings level <on | off>\`\n> **Leveling:** \`${lvlrgx[setmodel.levels]}\``)
                // .addField(`Autorole`, `> *${prefix} settings autorole <add | check | remove | disable | clear> [role]*`)
                .setTimestamp()
                .setColor(userinfo.color)
            message.reply({ embeds: [msgembed] })
        }

        if (az === 'prefix') {
            if (!userinfo.developer && !message.member.permissions.has('ADMINISTRATOR')) return message.reply('Lol no permissions, what did you expect to happen')
            if (ao === 'reset') {
                GuildSettings.findOne(
                    { gid: message.guild.id },
                    async (err, data) => {
                        if (err) throw err;
                        data.prefix = 'v!'
                        data.save();
                    }
                )
                return message.reply('Reset the prefix for **' + message.guild.name + '** to `v!`')
            }

            if (!ao) return message.reply('You must specify a new prefix')
            GuildSettings.findOne(
                { gid: message.guild.id },
                async (err, data) => {
                    if (err) throw err;
                    data.prefix = ao
                    data.save();
                }
            );
            message.reply(`Set the prefix for **${message.guild.name}** to \`${ao}\``);
        }
        if (az === 'level' || az === 'lvl') {
            if (!userinfo.developer && !message.member.permissions.has('ADMINISTRATOR')) return message.reply('Lol no permissions, what did you expect to happen')
            if (ao === 'on') {
                if (setmodel.levels === true) return client.error('You already have levels enabled!', message)
                GuildSettings.findOne(
                    { gid: message.guild.id },
                    async (err, data) => {
                        if (err) throw err;
                        data.levels = true
                        data.save();
                    }
                )
                return message.reply('Successfully enabled leveling for **' + message.guild.name + '**!')
            }

            if (ao === 'off') {
                if (setmodel.levels === false) return client.error('You already have levels disabled!', message)
                GuildSettings.findOne(
                    { gid: message.guild.id },
                    async (err, data) => {
                        if (err) throw err;
                        data.levels = false
                        data.save();
                    }
                )
                return message.reply('Successfully disabled leveling for **' + message.guild.name + '**!')
            }
        }
        if (az === 'suggest' || az === 's') {
            if (!userinfo.developer && !message.member.permissions.has('ADMINISTRATOR')) return message.reply('Lol no permissions, what did you expect to happen')
            if (ao.toLowerCase() === 'none') {
                schannel.deleteMany({ gid: message.guild.id })
                return message.reply('Succesfully removed the suggestion\'s channel!')
            }
            if (!ao) {
                return message.reply(`Your channel is ${chs(sugmodel.channel)}`)
            }
            var channel = message.mentions.channels.last() || message.guild.channels.cache.get(ao)
            if (!channel) return message.reply('You must specify a new channel')
            schannel.findOne(
                { gid: message.guild.id },
                async (err, data) => {
                    if (err) throw err;
                    if (data) {
                        data.gid = message.guild.id,
                            data.channel = channel.id
                        data.save();
                    } else {
                        let ee = new schannel({
                            gid: message.guild.id,
                            channel: channel.id
                        })
                        ee.save()
                    }

                }
            );
            message.reply(`Changed the suggestions channel to <#${channel.id}>`)
        }
        if (az === 'modlog' || az === 'm') {
            if (!userinfo.developer && !message.member.permissions.has('ADMINISTRATOR')) return message.reply('Lol no permissions, what did you expect to happen')
            if (ao.toLowerCase() === 'none') {
                mchannel.deleteMany({ gid: message.guild.id })
                return message.reply('Succesfully removed the modlog\'s channel!')
            }
            if (!ao) {
                return message.reply(`Your channel is ${chs(sugmodel.channel)}`)
            }
            var channel = message.mentions.channels.last() || message.guild.channels.cache.get(ao)
            if (!channel) return message.reply('You must specify a new channel')
            mchannel.findOne(
                { gid: message.guild.id },
                async (err, data) => {
                    if (err) throw err;
                    if (data) {
                        data.gid = message.guild.id,
                            data.channel = channel.id
                        data.save();
                    } else {
                        let e = new mchannel({
                            gid: message.guild.id,
                            channel: channel.id
                        })
                        e.save()
                    }
                }
            );
            message.reply(`Changed the modlog channel to <#${channel.id}>`)
        }
        if (az === 'color' || az === 'colour' || az === 'embedcolor' || az === 'ec') {
            let nohex = new MessageEmbed()
                .setColor(userinfo.color)
                .setTitle('Color')
                .setDescription('You must provide a real hex color. Click [here](https://htmlcolorcodes.com/color-picker/) to find your perfect color')
            if (!isHex(ao)) return message.reply({ embeds: [nohex] })
            userdb.findOne(
                { userid: message.member.id },
                async (err, data) => {
                    if (err) throw err;
                    data.color = ao
                    data.save()
                }
            )
            let embed = new MessageEmbed()
                .setColor(ao)
                .setDescription(`Set your color to \`${ao}\`. Click [here](https://htmlcolorcodes.com/color-picker/) to find your perfect color`)
            await message.reply({ embeds: [embed] })
        }
        // if (az === 'autorole' || az === 'ar') {
        //     const func = ao

        //     if (!func) return message.reply('You must specify one of these types: `add`, `check`, `remove`, `disable`, `clear`')
        //     if (!['add', 'check', 'remove', 'disable', 'clear'].includes(func)) return message.reply('You must specify one of these types: `add`, `check`, `remove`, `disable`, `clear`')

        //     if (func === 'clear') {
        //         if (amodel.enabled === false || !amodel.role) return message.reply('You either have autorole disabled or there isnt any role data for this guild')

        //         const size = amodel.role.lenght


        //     }

        // }
    }
}