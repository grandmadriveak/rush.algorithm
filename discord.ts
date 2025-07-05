import { leetcodeGraphQL } from "./leetcode.ts";
import { DailyQuestion } from "./type.ts";
import { DifficultyEmoji } from "./const.ts";

const DISCORD_CHANNEL_ID = Deno.env.get("DISCORD_CHANNEL_ID") ||
  "1339884014932070492";
const DISCORD_TOKEN = Deno.env.get("DISCORD_TOKEN") ||
  "";

if (!DISCORD_TOKEN || !DISCORD_CHANNEL_ID) {
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
  const response = await getDailyQuestion();
  const emoji = getEmojiForDifficulty(response.question.difficulty);
  const message = {
    "embeds": [
      {
        "title": `Vào giải leetcode nào anh em ${response.question.title}`,
        "url": `https://leetcode.com/${response.link}/`,
        "description":
          `🔍 ${response.question.title}!\n\n📊 **Difficulty:** ${emoji}\n💎 **Subscribe to get daily question!**`,
        "color": 9807270,
        "thumbnail": {
          "url": "https://leetcode.com/static/images/LeetCode_logo.png",
        },
        "footer": {
          "text": "LeetCode Challenge | Hàng ngày lúc 8:00 AM",
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
};

const handleSubcribe = () => {
};

const handleUnsubscibe = () => {
};

const handleCreateChallenge = () => {
};

export {
  handleCreateChallenge,
  handlePing,
  handleSubcribe,
  handleUnsubscibe,
  sendDailyProblems,
};
