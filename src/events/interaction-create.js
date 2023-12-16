const { Events } = require('discord.js');

module.exports =
{
    name: Events.InteractionCreate,
    async execute(interaction)
    {
        if (!interaction.isChatInputCommand()) return;

        const command = interaction.client.commands.get(interaction.commandName);
        const client = interaction.client;

        if (!command)
        {
            console.error(`No command matching ${interaction.commandName} was found.`);
			return;
        }

        try
        {
            await command.execute({client, interaction});
        }
        catch (error)
        {
            errorMessage = 'There was an error while executing this command!';

            console.error(error);
            if (interaction.replied || interaction.deferred)
                await interaction.followUp({ content: errorMessage, ephermal: true});
            else
                await interaction.reply({ content: errorMessage, ephermal: true});
        }
    },
}