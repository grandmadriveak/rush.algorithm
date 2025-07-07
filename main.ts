import { CommandType } from "./const.ts";
import {
  handleCreateChallenge,
  handleInteractions,
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
  [CommandType.Interactions]: handleInteractions,
};

Deno.serve(async (req: Request): Promise<Response> => {
  const url = new URL(req.url);
  console.log(url.pathname.slice(1));
  const handler = commandHandlers[url.pathname.slice(1)];
  const result = await handler(req) as Response;

  return result;
});
