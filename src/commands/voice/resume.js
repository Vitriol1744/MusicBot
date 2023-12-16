const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');

module.exports =
{
    data: new SlashCommandBuilder()
        .setName('resume')
        .setDescription('resumes the song.'),
    execute: async ({client, interaction}) =>
    {
        if (!interaction.member.voice.channelId)
            return interaction.reply('You need to be in channel to resume the track.');
        const queue = client.player.nodes.get(interaction.guildId);
        if (!queue)
            return interaction.reply({ embeds: [new EmbedBuilder()
                .setDescription("There are no songs in queue.")]});
        queue.node.setPaused(false);

        await interaction.reply({ embeds: [new EmbedBuilder()
            .setDescription("Resumed the track.")]});
    }
}