const { MessageEmbed, Client, Message } = require('discord.js');
const rewards = require('../models/lvlreward')

module.exports = {
    name: 'addreward',
    category: 'Leveling',
    description: 'Add a leveling reward',
    aliases: [],
    usage: 'addreward',
    userperms: [],
    botperms: [],
    /**
    * @param {Client} client
    * @param {Message} message
    * @param {String[]} args
    */
    run: async (client, message, args, prefix, userinfo) => {
        if (!message.member.permissions.has('ADMINISTRATOR')) return client.error(`You Dont have Permission to do that! You must be Administrator!`, message);
        let number = (await rewards.find({ gid: message.guild.id })).length;
        if (number >= 20) return message.reply({ embeds: [{ color: userinfo.color, title: `Ooh, Ooh`, description: `You have reached the limit of reactionroles! Delete some with \`${prefix}delreward\`` }] })
        let embed = new MessageEmbed()
            .setColor(userinfo.color)
            .setTitle(`Create level reward`)
            .setDescription(`Progress:`)
            .addFields(
                { name: `Role:`, value: `Loading` },
                { name: `Level:`, value: `Loading` },
            );
        const embedmessage = await message.reply({ embeds: [embed] });
        const m = await message.reply(`What is the role of the reward?`);
        try {
            let e = await message.channel.awaitMessages(
                (u2) => u2.author.id === message.author.id,
                { time: 30000, max: 1 }
            );
            if (e.first().mentions.roles.first() || message.guild.roles.cache.get(e.first().content) || message.guild.roles.cache.find(r => r.name === e.first().content)) {
                const role = e.first().mentions.roles.first() || message.guild.roles.cache.get(e.first().content) || message.guild.roles.cache.find(r => r.name === e.first().content);
                if (message.guild.me.roles.highest.rawPosition <= role.rawPosition) return client.error(`I don't have the perms to give someone that role!`);
                let embed = new MessageEmbed()
                    .setColor(userinfo.color)
                    .setTitle(`Create level reward`)
                    .setDescription(`Progress:`)
                    .addFields(
                        { name: `Role:`, value: `<@&${role.id}>` },
                        { name: `Level:`, value: `Loading` },
                    );
                embedmessage.edit({ embeds: [embed] });
                m.edit(`What is the needed level to get the role?`);
                e.first().delete().catch(e => { });
                try {
                    let e = await message.channel.awaitMessages(
                        (u2) => u2.author.id === message.author.id,
                        { time: 30000, max: 1, errors: ["time"] }
                    );
                    if (parseInt(e.first().content)) {
                        const number = parseInt(e.first().content);
                        let _ = await rewards.findOne({ gid: message.guild.id, role: role.id, level: number });
                        if (_) return client.error(`This reward already exists!`, message)
                        const newData = new rewards({
                            gid: message.guild.id,
                            role: role.id,
                            level: number,
                        });
                        newData.save();
                        m.edit(`Reward successfully created`)
                        e.first().delete()
                        let embed = new MessageEmbed()
                            .setColor(userinfo.color)
                            .setTitle(`Created level reward`)
                            .addFields(
                                { name: `Role:`, value: `<@&${role.id}>` },
                                { name: `Level:`, value: `${number}` },
                            );

                        embedmessage.edit({ embeds: [embed] })

                    } else {
                        return client.error(`That's not a valid number`, message);
                    }

                } catch (e) {
                    return client.error(`You did not answer`, message);
                }




            } else {
                return client.error(`I can't find that role!`, message);
            }
        } catch (e) {
            return client.error(`You did not answer`, message);
        }
    }
}