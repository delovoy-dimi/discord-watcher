import axios from 'axios'
import { logException, notifySubscribers } from './tg-bot-setup.js'
import './loadEnv.js'

const discordToken = process.env.DISCORD_ACCESS_TOKEN
const channelId = process.env.DISCORD_CHANNEL_ID
const requestDelay = process.env.DISCORD_CHANNEL_PROBE_DELAY

let lastReportedMsgId = 0
const msgContentHash = {}

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

const filterNotReportedMessages = (messages) => {
  const messagesToReport = messages.filter((m) => m.id > lastReportedMsgId || hashCode(m.content) != msgContentHash[m.id])
  lastReportedMsgId = messagesToReport[0]?.id ? Math.max(messagesToReport[0]?.id, lastReportedMsgId) : lastReportedMsgId
  messages.forEach((m) => (msgContentHash[m.id] = hashCode(m.content)))
  return messagesToReport
}

const getMessagesToReport = async () => {
  const latestMessages = await getLatestDiscordChanelMessages(5)
  return filterNotReportedMessages(latestMessages)
}

const formatMessage = (messages) => {
  return `${messages.reduce((prev, curr) => prev + `\n[${new Date(curr.timestamp).toLocaleString()}] ${curr.author.username}: ${curr.content}`, '')}`
}

const hashCode = (s) =>
  s.split('').reduce((a, b) => {
    a = (a << 5) - a + b.charCodeAt(0)
    return a & a
  }, 0)
