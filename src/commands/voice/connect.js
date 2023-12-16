const { SlashCommandBuilder } = require('@discordjs/builders');
const { EmbedBuilder, ChannelType } = require('discord.js');

module.exports =
{
    data: new SlashCommandBuilder()
        .setName('connect')
        .setDescription('Connects bot to the voice channel the client is in.'),
    execute: async ({client, interaction}) =>
    {
        const voice = interaction.member.voice;

        if (!voice.channel)
            return interaction.reply({ embeds: [new EmbedBuilder()
            .setDescription('You need to be in a voice channel.')]});
 
        queue = await client.player.nodes.create(interaction.guild);
        if (!queue.connection) await queue.connect(voice.channel);

        await interaction.reply({ embeds: [new EmbedBuilder()
            .setDescription(`Successfully connected to the ${voice.channel}`)]});
    }
}