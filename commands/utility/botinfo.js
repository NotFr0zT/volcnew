const { MessageEmbed, version: djsversion, Client, Message } = require('discord.js');
const { formatBytes, parseDur } = require('../../functions.js');
const cpuStat = require('cpu-stat');
const { OWNER } = process.env;
const moment = require('moment');
const os = require('os');

const formatOS = {
	aix: 'IBM AIX',
	darwin: 'Darwin',
	freebsd: 'FreeBSD',
	linux: 'Linux',
	openbsd: 'OpenBSD',
	sunos: 'SunOS',
	win32: 'Windows',
};

module.exports = {
	name: 'botinfo',
	category: 'Utility',
	description: 'Displays indept information about the bot.',
	aliases: ['bot', 'bi'],
	usage: 'botinfo',
	userperms: [],
	botperms: ['USE_EXTERNAL_EMOJIS'],
	/**
	 * 
	 * @param {Client} client 
	 * @param {Message} message 
	 * @param {String[]} args 
	 */
	run: async (client, message, args, prefix, userinfo) => {
		console.log(totalMembers)
		cpuStat.usagePercent((error, percent, seconds) => {
			if (error) {
				return console.error(error);
			}
			const embed = new MessageEmbed()
				.setThumbnail(client.user.avatarURL({ dynamic: true, size: 512 }))
				.setColor(userinfo.color)
				.setFooter(`Requested by ${message.author.tag} `)
				.setTimestamp()
				.setTitle('Bot Information')
				.addField('General ❯',
					`> **Bot Name: \`${client.user.tag}\`**\n> **Bot ID: \`${client.user.id}\`**\n> **Bot Owner: \`${client.users.cache.get(OWNER).tag}\`**\n> **Servers: \`${client.guilds.cache.size.toLocaleString()}\` Servers**\n> **Users: \`${totalMembers}\` Users**\n> ** Channels: \`${client.channels.cache.size.toLocaleString()}\` Channels**\n> **Commands: \`${client.commands.size}\` Commands**\n> **Slash Commands: \`${client.slash.size}\` Commands**\n> ** Created: \`${moment(client.user.createdTimestamp).format('MMMM Do YYYY, h:mm:ss')}\` | \`${Math.floor((Date.now() - client.user.createdTimestamp) / 86400000)}\` day(s) ago** \u200b`,
				)
				.addField('System ❯',
					`> ** Uptime: ${parseDur(client.uptime)}** \n> ** Node.js: \`${process.version}\`**\n> **Discord.js: \`v${djsversion}\`**\n> **Platform: \`${formatOS[os.platform]}\`**\n> **Memory: \`${formatBytes(process.memoryUsage().heapUsed)} / ${formatBytes(process.memoryUsage().heapTotal)}\`**\n> **CPU: \`${os.cpus()[0].model.split('CPU')[0]}${os.cpus().length} Cores ${os.cpus()[0].model.split('CPU ')[1]}\`\*\*`
				);
			message.reply({ embeds: [embed] });
		});
	},
};
