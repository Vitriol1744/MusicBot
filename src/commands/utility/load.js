const { SlashCommandBuilder, PermissionFlagsBits } = require('discord.js');
const fs = require('node:fs');
const path = require('node:path');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('load')
		.setDescription('Loads a command.')
		.addStringOption(option => 
            option.setName('command')
			    .setDescription('The command to reload.')
				.setRequired(true))
        .setDefaultMemberPermissions(PermissionFlagsBits.ManageGuild),
    async execute(interaction) 
    {
        const commandName = interaction.options.getString('command', true).toLowerCase();

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
        const command = require(commandFilePath);
        command.data.name = commandFilePath;
        try 
        {
            interaction.client.commands.delete(command.data.name);
            const newCommand = require(commandFilePath);
            interaction.client.commands.set(newCommand.data.name, newCommand);
            await interaction.reply(`Command \`${newCommand.data.name}\` was loaded!`);
        } 
        catch (error) 
        {
            console.error(error);
            await interaction.reply(`There was an error while loading a command \`${command.data.name}\`:\n\`${error.message}\``);
        }
    },
};