import { leetcodeGraphQL } from "./leetcode.ts";
import { DailyQuestion } from "./type.ts";
import { DifficultyEmoji } from "./const.ts";
import nacl from "https://esm.sh/tweetnacl@v1.0.3?dts";

const DISCORD_CHANNEL_ID = Deno.env.get("DISCORD_CHANNEL_ID") ||
  "";
const DISCORD_TOKEN = Deno.env.get("DISCORD_TOKEN") ||
  "";
const DISCORD_BOT_PUBLICKEY = Deno.env.get("DISCORD_BOT_PUBLICKEY") ||
  "";

if (!DISCORD_TOKEN || !DISCORD_CHANNEL_ID || !DISCORD_BOT_PUBLICKEY) {
  throw new Error("Copy logic from other guys in github");
}

const getEmojiForDifficulty = (difficulty: string) => {
  return DifficultyEmoji[difficulty.toLowerCase()];
};

const discordSendMessage = async (content: object) => {
  const response = await fetch(
    `https://discord.com/api/v9/channels/${DISCORD_CHANNEL_ID}/messages`,
    {
      method: "POST",
      headers: {
        "Authorization": `Bot ${DISCORD_TOKEN}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(content),
    },
  );
  if (!response.ok) {
    console.log(response);
    throw new Error(`HTTP error! status: ${response.status}`);
  }

  return;
};

const handlePing = () => {
  discordSendMessage({});
};

const getDailyQuestion = async (): Promise<DailyQuestion> => {
  const query = `
    query questionOfToday {
      activeDailyCodingChallengeQuestion {
        date
        userStatus
        link
        question {
          questionId
          acRate
          difficulty
          questionFrontendId
          title
          titleSlug
        }
      }
    }`;

  const result = await leetcodeGraphQL(query, "questionOfToday");
  return result.data.activeDailyCodingChallengeQuestion;
};

const sendDailyProblems = async () => {
  console.log("Daily challenge begin send");
  const response = await getDailyQuestion();
  const emoji = getEmojiForDifficulty(response.question.difficulty);
  const message = {
    "embeds": [
      {
        "title": `Vào giải leetcode nào anh em !!!`,
        "url": `https://leetcode.com/${response.link}`,
        "description":
          `🔍 ${response.question.title}!\n\n📊 **Difficulty:** ${emoji}\n💎 **Subscribe to get daily question!**`,
        "color": 9807270,
        "thumbnail": {
          "url": "https://leetcode.com/static/images/LeetCode_logo.png",
        },
        "footer": {
          "text": "LeetCode Challenge | Hàng ngày lúc 7:00 AM",
        },
      },
    ],
    "components": [
      {
        "type": 1,
        "components": [
          {
            "type": 2,
            "style": 3,
            "label": "Subscribe",
            "custom_id": "subscribe_btn",
            "emoji": {
              "name": "🔔",
            },
          },
          {
            "type": 2,
            "style": 4,
            "label": "Unsubscribe",
            "custom_id": "unsubscribe_btn",
            "emoji": {
              "name": "🔕",
            },
          },
        ],
      },
    ],
  };
  await discordSendMessage(message);
  console.log("Daily challenge sent");
};

const hexToUint8Array = (hex: string) => {
  return new Uint8Array(hex.match(/.{1,2}/g)!.map((v) => parseInt(v, 16)));
};

const verifySignature = async (req: Request) => {
  const signature = req.headers.get("X-Signature-Ed25519");
  const timestamp = req.headers.get("X-Signature-Timestamp");
  const body = JSON.stringify(req.body);

  if (!signature || !timestamp) {
    return false;
  }

  try {
    const isVerified = nacl.sign.detached.verify(
      new TextEncoder().encode(timestamp + body),
      hexToUint8Array(signature),
      hexToUint8Array(DISCORD_BOT_PUBLICKEY),
    );

    if (!isVerified) {
      return false;
    }
  } catch (error) {
    console.log("Invalid signature");
    return false;
  }

  return true;
};

const handleInteraction = async (req: Request): Promise<Response> => {
  const valid = await verifySignature(req);
  const body = await req.text();
  if (!valid) return new Response("Invalid signature", { status: 405 });
  const interaction = JSON.parse(body);
  console.log(interaction.type);
  if (interaction.type === 1) { 
    console.log("Ping successful");
    return Response.json({ type: 1 }); 
  }

  return Response.json({
    data: { content: "Message content" },
  });
};

const handleSubcribe = async (req: Request): Promise<Response> => {
  return Response.json({
    data: { content: "Message content" },
  });
};

const handleUnsubscibe = async (req: Request): Promise<Response> => {
  return Response.json({
    data: { content: "Message content" },
  });
};

const handleCreateChallenge = async (req: Request): Promise<Response> => {
  return Response.json({
    data: { content: "Message content" },
  });
};

export {
  handleCreateChallenge,
  handleInteraction,
  handlePing,
  handleSubcribe,
  handleUnsubscibe,
  sendDailyProblems,
  verifySignature,
};
