import { CommandType } from "./const.ts";
import { sendDailyProblems, handleCreateChallenge, handleSubcribe, handleUnsubscibe , handlePing} from "./discord.ts";

Deno.cron("Send daily challenge", "", async () => {
  await sendDailyProblems();
});

const commandHandlers = {
  [CommandType.Ping]: handlePing,
  [CommandType.Subcribe]: handleSubcribe,
  [CommandType.Unsubcribe]: handleUnsubscibe,
  [CommandType.Challenge]: handleCreateChallenge,
}

Deno.serve((req: Request) => {
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
