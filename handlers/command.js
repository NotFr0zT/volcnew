// const { readdirSync } = require('fs');

// module.exports = (client) => {
// 	readdirSync('./commands/').forEach(dir => {
// 		const commands = readdirSync(`./commands/${dir}/`).filter(file => file.endsWith('.js'));

// 		commands.forEach((file) => {
// 			const pull = require(`../commands/${dir}/${file}`);
// 			client.commands.set(pull.name, pull);

// 			pull.aliases?.forEach(alias => {
// 				client.aliases.set(alias, pull.name);
// 			});
// 		});
// 	});
// 	console.log(`Loaded ${client.commands.size + client.slash.size} commands!`);
// };
const { glob } = require('glob')
const { promisify } = require('util')
const globPromise = promisify(glob)

module.exports = async (client) => {
	const commandFiles = await globPromise(`${process.cwd()}/commands/**/*.js`);
	commandFiles.map((value) => {
		const file = require(value);
		const splitted = value.split("/");
		const directory = splitted[splitted.length - 2];

		if (file.name) {
			const properties = { directory, ...file };
			client.commands.set(file.name, properties);
		}
		if (file.aliases) {
			file.aliases?.forEach(alias => {
				client.aliases.set(alias, file.name)
			})
		}
	});

}