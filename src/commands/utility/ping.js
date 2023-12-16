const { SlashCommandBuilder } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('ping')
        .setDescription('Replies with Pong!'),
    execute: async ({client, interaction}) =>
    {
        await interaction.reply('Pong!');
    },
};