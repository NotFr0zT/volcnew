const { MessageEmbed, Message, Client, MessageSelectMenu, MessageActionRow } = require('discord.js');
const { capitalizeFirstLetter } = require('../../functions');
const { OWNER } = process.env;

module.exports = {
	name: 'help',
	aliases: ['commands'],
	category: 'Utility',
	description: 'Returns the help page, or one specific command info.',
	usage: 'help [command/category]',
	example: 'help [clap]',
	timeout: 5000,
	userperms: [],
	botperms: [],
	/**
	 * 
	 * @param {Client} client 
	 * @param {Message} message 
	 * @param {String[]} args 
	 * @returns 
	 */
	run: async (client, message, args, prefix, userinfo) => {


		if (args.join(' ')) {

			const cmd = client.commands.get(args.join(' ').toLowerCase()) || client.commands.get(client.aliases.get(args.join(' ').toLowerCase()));
			if (!cmd) return message.reply({ content: 'Didn\'t find a command with that name! Try again.' })
			if (cmd.category.toLowerCase() === 'owner' && message.author.id !== OWNER) return;
			const hembed = new MessageEmbed()
				.setAuthor(message.guild.name, message.guild.iconURL({ dynamic: true }))
				.setDescription(
					`> **Name:** \`${cmd.name.toString().toLowerCase()}\`\n> **Description:** \`${capitalizeFirstLetter(cmd.description)}\`\n> **Category:** \`${cmd.category.toString()}\``
				)
				.addField('Alias', `${cmd.aliases.length ? cmd.aliases.map((a) => `\`${prefix}${a}\``).join(', ') : 'None'}`)
				.addField('Usage', `${cmd.usage.length ? '`' + prefix + cmd.usage + '`' : 'None'}`)
				.setColor(userinfo.color)
				.setFooter('Syntax: <> = required, [] = optional')
			return message.reply({ embeds: [hembed] });
		}
		else {

			const emojis = {
				config: '🤖',
				fun: '😂',
				image: '▶',
				moderation: '❌',
				owner: '🔐',
				utility: '🔨',
				leveling: '👀'
			}

			const directories = [...new Set(client.commands.map(cmd => cmd.directory))]

			const formatString = (str) => `${str[0].toUpperCase()}${str.slice(1).toLowerCase()}`

			const categories = directories.map(dir => {
				const getCommands = client.commands
					.filter(cmd => cmd.directory === dir)
					.map(cmd => {
						return {
							name: cmd.name || 'No name set',
							description: cmd.description || 'No description set',
							// alias: cmd.aliases || 'No aliases set',
							// usage: cmd.usage || 'No usage set'
						}
					})
				return {
					directory: formatString(dir),
					commands: getCommands,
				}
			})
			const embed = new MessageEmbed()
				.setDescription(`Please choose a catgory in the dropdown menu\n You can also see more specific info on a command by running ${prefix}help <command>`)
				.setColor(userinfo.color)
				.setTitle('Help')

			const components = (state) => [
				new MessageActionRow().addComponents(
					new MessageSelectMenu()
						.setCustomId('help-menu')
						.setPlaceholder('Please select a category')
						.setDisabled(state)
						.addOptions(
							categories.map(cmd => {
								return {
									label: cmd.directory,
									value: cmd.directory.toLowerCase(),
									description: `Commands from ${cmd.directory} category`,
									emoji: emojis[cmd.directory.toLowerCase()] || null
								}
							})
						)
				)
			]
			const msg = await message.reply({
				embeds: [embed],
				components: components(false),
			})

			const filter = (interaction) => interaction.user.id === message.author.id;

			const collector = message.channel.createMessageComponentCollector({ filter, componentType: 'SELECT_MENU', time: 20000 })

			collector.on('collect', (int) => {
				const [directory] = int.values
				const category = categories.find(x => x.directory.toLowerCase() === directory)

				const cembed = new MessageEmbed()
					.setTitle(`${emojis[directory.toLowerCase()] || ''}${formatString(directory)} commands`)
					.setDescription('Here are the list of commands')
					.addFields(
						category.commands.map(cmd => {
							return {
								name: `\`${cmd.name}\``,
								value: cmd.description,
								inline: true,
							}
						})
					)

				int.update({ embeds: [cembed] })
				// int.reply({ embeds: [cembed], ephemeral: true })
			})
			collector.on('end', () => {
				const eembed = new MessageEmbed()
					.setColor('RED')
					.setTitle(`Times up! Run ${prefix}help to see the commands again!`)

				msg.edit({ components: components(true), embeds: [eembed] })
			})
		}
	},
};




// if (args.join(' ')) {

// 	const cmd = client.commands.get(args.join(' ').toLowerCase()) || client.commands.get(client.aliases.get(args.join(' ').toLowerCase()));
// 	if (!cmd) return
// 	// if (!cmd) {

// 	// 	const cat = [...new Set(client.commands.map(cmd => cmd.category === args.join(' ').toLowerCase()))];
// 	// 	if (!cat) return
// 	// 	const emb = new MessageEmbed()
// 	// 		.setTitle(`${args[0]}`)
// 	// 		.setColor(userinfo.color)

// 	// 	for (const id of cat) {
// 	// 		const category = client.commands.filter(cmd => cmd.category === id);
// 	// 		emb.addField(`${id} (${category.size})`, `${category.map(cmd => `\`${cmd.name}\``).join(', ')}`);
// 	// 	}
// 	// 	message.reply({ embeds: [emb] })

// 	// }
// 	// console.log(client.commands.get(args.join(' ').toLowerCase()) || client.commands.get(client.aliases.get(args.join(' ').toLowerCase())))
// 	if (cmd.category.toLowerCase() === 'owner' && message.author.id !== OWNER) return;
// 	const hembed = new MessageEmbed()
// 		.setAuthor(message.guild.name, message.guild.iconURL({ dynamic: true }))
// 		.setDescription(
// 			`> **Name:** \`${cmd.name.toString().toLowerCase()}\`\n> **Description:** \`${capitalizeFirstLetter(cmd.description)}\`\n> **Category:** \`${cmd.category.toString()}\``
// 		)
// 		.addField('Alias', `${cmd.aliases.length ? cmd.aliases.map((a) => `\`${prefix}${a}\``).join(', ') : 'None'}`)
// 		.addField('Usage', `${cmd.usage.length ? '`' + prefix + cmd.usage + '`' : 'None'}`)
// 		.setColor(userinfo.color)
// 		.setFooter('Syntax: <> = required, [] = optional')


// 	// .setTitle(`Information for ${cmd.name.toString().toLowerCase()} command`)
// 	// .setColor(userinfo.color)
// 	// .setTimestamp()
// 	// .setFooter('Syntax: <> = required, [] = optional')
// 	// .setDescription(
// 	// 	`> Name: \`${cmd.name}\`\n> Category: \`${cmd.category.toString()}\`\n> Description: \`${capitalizeFirstLetter(cmd.description)}\`\n> Usage: \`${prefix}${cmd.usage}\`\n> Aliases: \`${cmd.aliases.length ? cmd.aliases.map((a) => `${a}`).join('`, `') : 'None'}\`\n> Permissions: \`${cmd.userperms.length ? cmd.userperms.map((f) => `${f}`).join('`, `') : 'None'}\`\n> Bot Permissions: \`${cmd.botperms.length ? cmd.botperms.map((f) => `${f}`).join('`, `') : 'None'}\`\n\u200b\nDon't forget to join the support server and invite the bot: [Support Server](${client.config.supportserver}) | [Invite Link](${client.config.botinvite})`
// 	// );
// 	return message.reply({ embeds: [hembed] });
// }
// else {
// 	const embed = new MessageEmbed()
// 		.setTitle(`${client.user.username}'s Commands`)
// 		.setFooter(`${client.commands.size} Commands!`)
// 		.setTimestamp()
// 		.setColor(userinfo.color)
// 		.setDescription(`This server's prefix is \`${prefix}\`.\nFor more info on a specific command, type \`${prefix}help <command>\`.\nDon't forget to join the support server and invite the bot: [Support Server](${client.config.supportserver}) | [Invite Link](${client.config.botinvite})`);

// 	let categories;
// 	if (message.author.id !== OWNER) {
// 		categories = [...new Set(client.commands.filter(cmd => cmd.category !== 'Owner').map(cmd => cmd.category))];
// 	}
// 	else {
// 		categories = [...new Set(client.commands.map(cmd => cmd.category))];
// 	}

// 	for (const id of categories) {
// 		const category = client.commands.filter(cmd => cmd.category === id);

// 		embed.addField(`${id} (${category.size})`, category.map(cmd => `\`${cmd.name}\``).join(', '));
// 	}
// 	return message.reply({ embeds: [embed] });
// }