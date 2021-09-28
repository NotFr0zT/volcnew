const { MessageEmbed } = require('discord.js')

let giveMeAJoke = require('give-me-a-joke');;

module.exports = {
	name: 'cnjoke',
	category: 'Fun',
	description: 'Gives you a chuck norris joke',
	aliases: ['chuck', 'chucknorris', 'chucknorrisjoke'],
	usage: 'cnjoke',
	example: 'cnjoke',
	userperms: [],
	botperms: [],
	run: async (client, message, args, prefix, userinfo) => {
		giveMeAJoke.getRandomCNJoke(function (joke) {
			message.reply(joke)
		})
	}
}