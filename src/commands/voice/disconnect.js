const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');

module.exports = 
{
    data: new SlashCommandBuilder()
        .setName('disconnect')
        .setDescription('Disconnects bot from the voice channel.'),

    execute: async ({client, interaction}) =>
    {
        const voice = interaction.member.voice;

        if (!voice.channel)
            return interaction.reply({ embeds: [new EmbedBuilder()
            .setDescription('You need to be in a voice channel.')]});
 
        queue = client.player.nodes.get(interaction.guildId);
        if (!queue)
            return interaction.reply({ embeds: [new EmbedBuilder()
                .setDescription('Bot is not in the voice channel.')]});
                

        await interaction.reply({ embeds: [new EmbedBuilder()
            .setDescription(`Left the voice channel.`)]});
    }
}