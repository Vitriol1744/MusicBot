const { SlashCommandBuilder, PermissionFlagsBits } = require('discord.js');
const fs = require('node:fs');
const path = require('node:path');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('reload')
		.setDescription('Reloads a command.')
		.addStringOption(option => 
            option.setName('command')
			    .setDescription('The command to reload.')
				.setRequired(true))
        .setDefaultMemberPermissions(PermissionFlagsBits.ManageGuild),
    execute: async ({client, interaction}) =>
    {
        const commandName = interaction.options.getString('command', true).toLowerCase();
        const command = interaction.client.commands.get(commandName);

        if (!command)
            return interaction.reply(`There is no command with name \`${commandName}\`!\nAvailable commands: ${JSON.stringify(interaction.client.commands)}`);
        
        const foldersPath = path.join(__dirname, '../');
        const commandFolders = fs.readdirSync(foldersPath);

        let commandFilePath = '';
        let doBreak = false;
        for (const folder of commandFolders) 
        {
            const commandsPath = path.join(foldersPath, folder);
            const commandFiles = fs.readdirSync(commandsPath).filter(file => file.endsWith('.js'));

            for (const file of commandFiles) 
            {
                if (file.startsWith(commandName))
                {
                    commandFilePath = path.join(commandsPath, file);
                    console.log(`CommandFilePath: ${commandFilePath}`);
                    doBreak = true;
                    break;
                }
            }
            if (doBreak) break;
        }
        command.data.name = commandFilePath;
        delete require.cache[commandFilePath];

        try 
        {
            interaction.client.commands.delete(command.data.name);
            const newCommand = require(commandFilePath);
            interaction.client.commands.set(newCommand.data.name, newCommand);
            await interaction.reply(`Command \`${newCommand.data.name}\` was reloaded!`);
        } 
        catch (error) 
        {
            console.error(error);
            await interaction.reply(`There was an error while reloading a command \`${command.data.name}\`:\n\`${error.message}\``);
        }
    },
};