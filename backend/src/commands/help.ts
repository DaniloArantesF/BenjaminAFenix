import { SlashCommandBuilder } from '@discordjs/builders';
import { Track, Command } from '../DiscordClient';
import { getYoutubeUrl } from '../lib/Youtube';
import { MessageEmbed } from 'discord.js';
import DiscordClient from '../DiscordClient';

export const HelpEmbed = () => {
  const fields = [];

  for (const [key, value] of DiscordClient.commands) {
    fields.push({ name: `/${key}`, value: value.data.description });
  }

  return new MessageEmbed()
    .setColor('#b700ff')
    .setTitle('Bot Commands :scroll:')
    .setThumbnail(
      'https://media1.tenor.com/images/75f1a082d67bcd34cc4960131e905bed/tenor.gif?itemid=5505046'
    )
    .addFields(...fields)
    .setFooter("To more info on a command use '/help <command>'");
};

export const CommandHelpEmbed = (name: string) => {
  const cmd: Command = DiscordClient.commands.get(name);
  // TODO: set constraints name, description cant be empty
  return new MessageEmbed()
    .setColor('#b700ff')
    .setTitle(`/${cmd.data.name}`)
    .setDescription(cmd.data.description)
    .addField('\u200B', `Usage: \'${cmd.usage}\'`);
};

export const command: Command = {
  data: new SlashCommandBuilder()
    .setName('help')
    .setDescription('Displays bot commands')
    .addStringOption((option) =>
      option
        .setName('command')
        .setDescription('Get info on a command')
        .setRequired(false)
    ),
  async execute(client, interaction) {
    const connection = client.connections.get(interaction.guild.id);
    const arg = interaction.options.getString('command');

    if (arg) {
      return interaction.reply({
        embeds: [CommandHelpEmbed(arg)],
        ephemeral: true,
      });
    }
    interaction.reply({
      embeds: [HelpEmbed()],
      ephemeral: true,
    });
  },
  usage: '/help',
};
