import { CommandType } from "./const.ts";
import {
  handleCreateChallenge,
  handleInteraction,
  handlePing,
  handleSubcribe,
  handleUnsubscibe,
  sendDailyProblems,
} from "./discord.ts";

Deno.cron("Send daily challenge", "0 0 * * *", async () => {
  await sendDailyProblems();
});

const commandHandlers = {
  [CommandType.Ping]: handlePing,
  [CommandType.Subcribe]: handleSubcribe,
  [CommandType.Unsubcribe]: handleUnsubscibe,
  [CommandType.Challenge]: handleCreateChallenge,
  [CommandType.Interaction]: handleInteraction,
};

Deno.serve(async (req: Request): Promise<Response> => {
  const url = new URL(req.url);
  const handler = commandHandlers[url.pathname.slice(1)];
  const result = await handler(req) as Response;

  return result;
});
