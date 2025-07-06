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
  const body = await req.text();
  console.log(req);
  if (!valid) return new Response("Invalid signature", { status: 405 });
  const interaction = JSON.parse(body);
  console.log(interaction.type);
  if (interaction.type === 1) { // PING
    console.log("Ping successful");
    return Response.json({ type: 1 }); // PONG
  }
  console.log("Method: ", req.method);

  const url = new URL(req.url);

  console.log("Pathname: ", url.pathname);
  console.log("Search params: ", url.searchParams);

  // const commandHandler = commandHandlers[url.pathname];

  return Response.json({
    type: 4,
    data: { content: "Message content" },
  });
});
