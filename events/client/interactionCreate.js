const userdb = require(`../../models/userdb`);
const Timeout = new Set();
const { ButtonInteraction, Client } = require('discord.js')
const ms = require('ms')
const { parseDur } = require('../../functions')
//const Timeout = new Set();

/**
 * 
 * @param {Client} client 
 * @param {ButtonInteraction} interaction 
 * @returns 
 */

module.exports = async (client, interaction) => {

    //Slash commands handling
    if (client.config.slash === true) {
        if (interaction.isCommand()) {

            let userinfo = await userdb.findOne({ userid: interaction.user.id });
            if (!userinfo) {
                userinfo = {
                    userid: interaction.member.user.id,
                    developer: false,
                    banned: false,
                    color: `#e91e63`,
                    snipe: true,
                }
            }
            if (userinfo.banned) {
                const embed = new MessageEmbed()
                    .setTitle('I think I\'m gonna pass')
                    .setDescription('You seem to have been banned by the developers of the bot')
                    .setColor(userinfo.color)
                    .addField('Mistake?', 'If you think this is a mistake, please contact a developer of the bot. **<Fr0zT>#6447**, **Monochromish#9999**')
                return interaction.editReply({ embeds: [embed] })
            }
            const command = client.slash.get(interaction.commandName);
            if (!command) {
                await interaction.deferReply({ ephemeral: true });
                return await interaction.editReply({ content: `This is not a valid command! Please wait a bit to see if it gets updated!`, ephemeral: true });
            }
            const args = [];
            console.log(`${interaction.user.tag} used slashcommand /${command.name} in ${interaction.guild.name} (${interaction.guild.id})`)

            for (let option of interaction.options.data) {
                if (option.type === "SUB_COMMAND") {
                    if (option.name) args.push(option.name);
                    option.options?.forEach((x) => {
                        if (x.value) args.push(x.value);
                    });
                } else if (option.value) args.push(option.value);
            }
            interaction.member = interaction.guild.members.cache.get(interaction.user.id);
            if (command.timeout) {
                var timeou = command.timeout * 1000
                if (Timeout.has(`${interaction.user.id}_${command.name}`)) {
                    await interaction.deferReply({ ephemeral: true });
                    await interaction.editReply({ embeds: [{ color: userinfo.color, title: `Take a break`, description: `Ooh Ooh, You are on cooldown\nThe default cooldown of this command is ${parseDur(timeou)}` }], ephemeral: true });
                    return;
                } else {
                    Timeout.add(`${interaction.user.id}_${command.name}`);
                    setTimeout(() => {
                        Timeout.delete(`${interaction.user.id}_${command.name}`);
                    }, timeou);
                }
            }
            if (command.private) {
                await interaction.deferReply({ ephemeral: true });
            } else {
                await interaction.deferReply({ ephemeral: false });
            }
            command.run(client, interaction, args, userinfo)
        }

        // Context menu handling
        if (interaction.isContextMenu()) {
            await interaction.deferReply({ ephemeral: false });
            const command = client.slash.get(interaction.commandName);
            if (command) command.run(client, interaction);
        }

        //Button handling
        if (interaction.isButton()) {
            // if (interaction.customId === 'pri') {
            //     interaction.reply({ content: 'You clicked the primary button' })
            // }
            // if (interaction.customId === 'suc') {
            //     interaction.reply({ content: 'You clicked the success button' })
            // }
            // if (interaction.customId === 'dan') {
            //     interaction.reply({ content: 'You clicked the danger button' })
            // }
            // if (interaction.customId === 'sec') {
            //     interaction.reply({ content: 'You clicked the secondary button ' })
            // }
        }
    }
}