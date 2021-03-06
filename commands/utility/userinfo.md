const Discord = require("discord.js")
const { MessageEmbed } = require('discord.js');
const client = require('discord.js')
const moment = require('moment');
module.exports = {
name: 'userinfo',
aliases: ['whois', 'info', 'user'],
category: 'Utility',
description: 'Sends information about mentioned user / user',
usage: 'userinfo',
example: 'userinfo',
userperms: [],
botperms: [],
run: async (client, message, args, prefix, userinfo) => {
const badge1 = client.emojis.cache.find(emoji => emoji.name === "badge1");
const badge2 = client.emojis.cache.find(emoji => emoji.name === "badge2");
const badge3 = client.emojis.cache.find(emoji => emoji.name === "badge3");
const flags = {
DISCORD_EMPLOYEE: 'Discord Employee',
DISCORD_PARTNER: 'Discord Partner',
BUGHUNTER_LEVEL_1: 'Bug Hunter (Level 1)',
BUGHUNTER_LEVEL_2: 'Bug Hunter (Level 2)',
HYPESQUAD_EVENTS: 'HypeSquad Events',
HOUSE_BRAVERY: `${badge2}`,
HOUSE_BRILLIANCE: `${badge1}`,
HOUSE_BALANCE: `${badge3}`,
EARLY_SUPPORTER: 'Early Supporter',
TEAM_USER: 'Team User',
SYSTEM: 'System',
VERIFIED_BOT: 'Verified Bot',
VERIFIED_DEVELOPER: 'Verified Bot Developer'
};
var permissions = [];
var acknowledgements = 'None';
const member = message.mentions.members.first() || message.mentions.members.last() || message.member;
if (member.hasPermission("KICK_MEMBERS")) {
permissions.push("Kick Members");
}

        if (member.hasPermission("BAN_MEMBERS")) {
            permissions.push("Ban Members");
        }

        if (member.hasPermission("ADMINISTRATOR")) {
            permissions.push("Administrator");
        }

        if (member.hasPermission("MANAGE_MESSAGES")) {
            permissions.push("Manage Messages");
        }

        if (member.hasPermission("MANAGE_CHANNELS")) {
            permissions.push("Manage Channels");
        }

        if (member.hasPermission("MENTION_EVERYONE")) {
            permissions.push("Mention Everyone");
        }

        if (member.hasPermission("MANAGE_NICKNAMES")) {
            permissions.push("Manage Nicknames");
        }

        if (member.hasPermission("MANAGE_ROLES")) {
            permissions.push("Manage Roles");
        }

        if (member.hasPermission("MANAGE_WEBHOOKS")) {
            permissions.push("Manage Webhooks");
        }

        if (member.hasPermission("MANAGE_EMOJIS")) {
            permissions.push("Manage Emojis");
        }

        if (permissions.length == 0) {
            permissions.push("No Permissions Found");
        }

        if (member.user.id == message.guild.ownerID) {
            acknowledgements = 'Owner';
        }
        const roles = member.roles.cache
            .sort((a, b) => b.position - a.position)
            .map(role => role.toString())
            .slice(0, -1);
        const userFlags = member.user.flags.toArray();
        const embed = new MessageEmbed()
            .setDescription(`User Information for <@${member.id}>`)
            .setThumbnail(member.user.displayAvatarURL({ dynamic: true, size: 512 }))
            .setColor(userinfo.color)
            .addField('User Info', [
                `**Username** : ${member.user.username}`,
                `**Discriminator** : #${member.user.discriminator}`,
                `**ID** : ${member.id}`,
                `**Badges** : ${userFlags.length ? userFlags.map(flag => flags[flag]).join(', ') : 'None'}`,
                `**Avatar** : [Click Here for Avatar](${member.user.displayAvatarURL({ dynamic: true })})`,
                `**Account was created on** : ${moment(member.user.createdTimestamp).format('LT')} ${moment(member.user.createdTimestamp).format('LL')} ${moment(member.user.createdTimestamp).fromNow()}`,
                `\u200b`
            ])
            .addField('__Member__', [
                `**Top Role** : ${member.roles.highest.id === message.guild.id ? 'None' : member.roles.highest.name}`,
                `**Joined on** : ${moment(member.joinedAt).format('LL LTS')}`,
                `**Roles [${roles.length}]** : ${roles.length < 99 ? roles.join(', ') : roles.length > 99 ? this.client.utils.trimArray(roles) : 'None'}`,
                `\u200b`,
                `**Key Permissions** : ${permissions.join(` | `)}`,
                `**Acknowledgements** : ${acknowledgements}`,
            ])
            .setTimestamp();
        return message.reply({ embeds: [] });
    }

};
