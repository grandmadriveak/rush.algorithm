import { Client, Events } from "npm:discord.js@14.21.0";
import { GatewayIntentBits } from "npm:discord-api-types@0.38.14";

const DISCORD_TOKEN = Deno.env.get("DISCORD_TOKEN");
const client = new Client({
    intents:[
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.GuildMembers,
        GatewayIntentBits.DirectMessages
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

client.login(DISCORD_TOKEN);