const { MessageEmbed, CommandInteraction, Client } = require('discord.js');
const ms = require('ms')

module.exports = {
    name: 'hack',
    category: 'Fun',
    description: 'Hacks a user!',
    private: false,
    timeout: 5,
    options: [
        {
            type: 'USER',
            name: `user`,
            description: `The user to hack!`,
            required: true
        }
    ],
    /**
 * @param {CommandInteraction} interaction
 * @param {Client} client
 */
    run: async (client, interaction, args, userinfo) => {
        const tohack = interaction.options.getUser('user')
        await interaction.editReply(`Hacking ${tohack.username}....`);

        let time = '1s'
        setTimeout(() => {
            interaction.editReply(`Finding ${tohack.username}'s Email and Password.....`);
        }, ms(time));

        let time1 = '6s'
        setTimeout(() => {
            interaction.editReply(`E-Mail: ${tohack.username}@gmail.com \nPassword: ********`);
        }, ms(time1));

        let time2 = '9s'
        setTimeout(() => {
            interaction.editReply('Finding Other Accounts.....');
        }, ms(time2));

        let time3 = '15s'
        setTimeout(() => {
            interaction.editReply('Setting up Epic Games Account.....');
        }, ms(time3));

        let time4 = '21s'
        setTimeout(() => {
            interaction.editReply('Hacking Epic Games Account......');
        }, ms(time4));

        let time5 = '28s'
        setTimeout(() => {
            interaction.editReply('Hacked Epic Games Account!!');
        }, ms(time5));

        let time6 = '31s'
        setTimeout(() => {
            interaction.editReply('Collecting Info.....');
        }, ms(time6));

        let time7 = '38s'
        setTimeout(() => {
            interaction.editReply('Selling data to FBI....');
        }, ms(time7));

        let time8 = '41s'
        setTimeout(() => {
            interaction.editReply(`Finished Hacking ${tohack.username}`);
        }, ms(time8));
    }
}