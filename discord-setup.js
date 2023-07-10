import axios from 'axios'
import { logException, notifySubscribers } from './tg-bot-setup.js'
import './loadEnv.js'

export const startChannelMonitoring = async (settings) => {
  while (true) {
    try {
      const messages = await getMessagesToReport(settings)
      const formattedMessage = formatMessage(messages)
      if (formattedMessage) await notifySubscribers(`${settings.name}\n${formattedMessage}`)

      await delay(settings.requestDelay)
    } catch (e) {
      logException(`ChannelMonitoring failed with ${e.message}`)
    }
  }
}

export const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms))

const getLatestDiscordChanelMessages = async (settings, latestCount) => {
  try {
    var url = `https://discord.com/api/v9/channels/${settings.channelId}/messages?limit=${latestCount}`
    return (
      await axios.get(url, {
        headers: {
          authorization: settings.discordToken,
        },
      })
    ).data
  } catch (e) {
    logException(`Request failed: ${e.message}`)
    return []
  }
}

const filterNotReportedMessages = (settings, messages) => {
  const messagesToReport = messages.filter(
    (m) => m.id > settings.context.lastReportedMsgId || hashCode(m.content) != settings.context.msgContentHash[m.id]
  )
  settings.context.lastReportedMsgId = messagesToReport[0]?.id
    ? Math.max(messagesToReport[0]?.id, settings.context.lastReportedMsgId)
    : settings.context.lastReportedMsgId
  messages.forEach((m) => (settings.context.msgContentHash[m.id] = hashCode(m.content)))
  return messagesToReport
}

const getMessagesToReport = async (settings) => {
  const latestMessages = await getLatestDiscordChanelMessages(settings, 5)
  return filterNotReportedMessages(settings, latestMessages)
}

const formatMessage = (messages) => {
  return `${messages.reduce(
    (prev, curr) =>
      prev +
      `\n[${new Date(curr.timestamp).toLocaleString()}] ${curr.author.username}: ${curr.content}${
        curr.attachments?.length ? parsedAttachments(curr.attachments) : ''
      }`,
    ''
  )}`
}

const parsedAttachments = (attachments) => {
  return attachments.reduce((prev, curr) => prev + `\n${curr.url}`, '\n[Attachments]:')
}

const hashCode = (s) =>
  s.split('').reduce((a, b) => {
    a = (a << 5) - a + b.charCodeAt(0)
    return a & a
  }, 0)
