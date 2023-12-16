const { EmbedBuilder } = require('discord.js');

module.exports =
{
    reply: (interaction, body) =>
    {
        if (interaction.replied || interaction.deferred) return interaction.followUp(body);
        return interaction.reply(body);
    },
    asyncReply: async (interaction, body) =>
    {
        if (interaction.replied || interaction.deferred) await interaction.followUp(body);
        else await interaction.reply(body);
    },
    interactionBodyEmbed: (desc) =>
    {
        return { embed: [new EmbedBuilder()
            .setDescription(desc)]};
    }
}