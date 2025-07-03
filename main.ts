import { Client, Events } from "npm:discord.js@14.21.0";
import * as commandServices from "./command.ts";
import { CommandType } from "./constants.ts";
import { GatewayIntentBits } from "npm:discord-api-types@0.38.14/v10";

const commands = {
  [CommandType.Help]: commandServices.help,
  [CommandType.Subscribe]: commandServices.subcribe,
  [CommandType.PendingTask]: commandServices.pendingTasks,
}

const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.GuildMembers,
    GatewayIntentBits.DirectMessages,
    GatewayIntentBits.GuildWebhooks,
  ],
});

client.on(Events.ClientReady, (readyClient) => {
  console.log(`Logged in as ${readyClient.user.tag}!`);
})

client.on(Events.InteractionCreate, async interaction => {
  if (!interaction.isChatInputCommand()) return;
  
  if (interaction.commandName === 'ping') {
    await interaction.reply('Pong!');
  }
});

client.on(Events.MessageCreate, async interaction => {
  if (!interaction.author.bot) return;
  else {
    const splitCommand = interaction.content.split(" ");
    const userCommand = splitCommand[0];
    const params = splitCommand.at(1);
    const execCommand = commands[userCommand[0]];
    // await execCommand(interaction, params);
  }
});

client.login(Deno.env.get("DISCORD_TOKEN"));