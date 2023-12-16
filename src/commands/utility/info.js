const { SlashCommandBuilder } = require('discord.js');

module.exports =
{
    data: new SlashCommandBuilder()
        .setName('info')
        .setDescription('Get information about the guild.')
        .addSubcommand(subcommand =>
            subcommand
                .setName('user')
                .setDescription('Get information about the user.')
                .addUserOption(option => option.setName('target').setDescription('The user')))
        .addSubcommand(subcommand =>
            subcommand
                .setName('server')
                .setDescription('Get information about the server.')),
    execute: async ({client, interaction}) =>
    {
        if (interaction.options.getSubcommand() === 'user')
        {
            const user = interaction.options.getUser('target');

            if (user) await interaction.reply(`Username: ${user.username}\nID: ${user.id}`);
            else await interaction.reply(`Your username: ${interaction.user.username}\nYour ID: ${interaction.user.id}`);
        }
        else if (interaction.options.getSubcommand() == 'server')
            await interaction.reply(`Server name: ${interaction.guild.name}\nTotal members: ${interaction.guild.memberCount}`);
    },
}