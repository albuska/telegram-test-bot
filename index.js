const {
  gameOptions,
  againGameOption,
  btnGameStartOption,
} = require("./options");
const TelegramApi = require("node-telegram-bot-api");

const token = "6822538715:AAFOp-tQXBPJZKa4PMWXHuLUquD7OdGfQog";

const bot = new TelegramApi(token, { polling: true });

const chats = {};

const startGame = async (chatId) => {
  const randomNumber = Math.floor(Math.random() * 10);
  chats[chatId] = randomNumber;
  await bot.sendMessage(
    chatId,
    "Guess the number. Choose a number from 0 to 9",
    gameOptions
  );
};

const start = async () => {
  try {
    bot.on("message", async (msg) => {
      const chatId = msg.chat.id;
      const text = msg.text;

      bot.setMyCommands([
        { command: "/start", description: "Start greeting" },
        { command: "/info", description: "Info about user" },
      ]);

      if (text === "/start") {
        await bot.sendMessage(
          chatId,
          `Hello, ${msg.from.first_name} ${msg.from.last_name}!`
        );
        await bot.sendSticker(
          chatId,
          "https://media.stickerswiki.app/greetingstatus/2360312.160.webp",
          btnGameStartOption
        );
      }
    });

    bot.on("callback_query", async (msg) => {
      const chatId = msg.message.chat.id;
      const data = msg.data;

      if (data === "/game") {
        return startGame(chatId);
      }

      if (data === "/again") {
        return startGame(chatId);
      }
      if (Number(data) === chats[chatId]) {
        await bot.sendMessage(
          chatId,
          `You are right! This number is ${chats[chatId]} 👌✔️💪🏼`
        );
        await bot.sendSticker(
          chatId,
          "https://media.stickerswiki.app/greetingstatus/2360325.160.webp",
          btnGameStartOption
        );
      } else {
        return bot.sendMessage(
          chatId,
          `You are wrong! Your number is ${data}. The bot guessed the number ${chats[chatId]} 😔`,
          againGameOption
        );
      }
    });
  } catch (e) {
    console.log(e);
  }
};

start();
