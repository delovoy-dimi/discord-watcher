# Description

The tool monitors Discord channels and sends notifications to Telegram bot

# Requirements

`node` and `npm` are required to run the tool.

# Launch

- Fill in the `.env` file with required parameters:

  - `TG_BOT_TOKEN` can be obtained from [BotFather](https://t.me/BotFather)
  - `DISCORD_ACCESS_TOKEN` is an authorization token for Discord API actions. Can be peeked via DevTools of a Discord Web version. When a user is logged in all their requests have this token in `authorization` header
  - `DISCORD_CHANNEL_ID` numeric id of the channel
  - `EXCEPTION_LOGGER_TG_ID` Telegram user id who will receive the error logs

- Run the `npm install` command to fetch required packages

- Run `npm run start` to start the monitoring process
