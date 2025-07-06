import { CommandType } from "./const.ts";
import {
  handleCreateChallenge,
  handlePing,
  handleSubcribe,
  handleUnsubscibe,
  sendDailyProblems,
  verifySignature,
} from "./discord.ts";

Deno.cron("Send daily challenge", "0 7 * * *", async () => {
  await sendDailyProblems();
});

const commandHandlers = {
  [CommandType.Ping]: handlePing,
  [CommandType.Subcribe]: handleSubcribe,
  [CommandType.Unsubcribe]: handleUnsubscibe,
  [CommandType.Challenge]: handleCreateChallenge,
};

Deno.serve(async (req: Request) => {
  const valid = await verifySignature(req);
  if (!valid) return new Response("Invalid signature", { status: 401 });

  console.log("Method: ", req.method);

  const url = new URL(req.url);

  console.log("Pathname: ", url.pathname);
  console.log("Search params: ", url.searchParams);

  const commandHandler = commandHandlers[url.pathname];

  return new Response("Hello, world", {
    status: 200,
    headers: {
      "content-type": "text/plain; charset=utf-8",
    },
  });
});
