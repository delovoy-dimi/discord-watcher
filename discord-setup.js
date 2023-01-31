import axios from 'axios'
import { logException, notifySubscribers } from './tg-bot-setup.js'

const discordToken = process.env.DISCORD_ACCESS_TOKEN
const channelId = process.env.DISCORD_CHANNEL_ID
const requestDelay = process.env.DISCORD_CHANNEL_PROBE_DELAY

let lastReportedMsgId = 0

export const startChannelMonitoring = async () => {
  try {
    while (true) {
      const messages = await getMessagesToReport()
      const formattedMessage = formatMessage(messages)
      if (formattedMessage) await notifySubscribers(formattedMessage)

      await delay(requestDelay)
    }
  } catch (e) {
    logException(`ChannelMonitoring failed with ${e.message}`)
  }
}

const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms))

const getLatestDiscordChanelMessages = async (latestCount) => {
  var url = `https://discord.com/api/v9/channels/${channelId}/messages?limit=${latestCount}`
  return (
    await axios.get(url, {
      headers: {
        authorization: discordToken,
      },
    })
  ).data
}

const getMessagesToReport = async () => {
  const latestMessages = await getLatestDiscordChanelMessages(5)
  const messagesToReport = latestMessages.filter((m) => m.id > lastReportedMsgId)
  lastReportedMsgId = messagesToReport[0]?.id ?? lastReportedMsgId
  return messagesToReport
}

const formatMessage = (messages) => {
  return `${messages.reduce((prev, curr) => prev + `\n[${new Date(curr.timestamp).toLocaleString()}] ${curr.author.username}: ${curr.content}`, '')}`
}
