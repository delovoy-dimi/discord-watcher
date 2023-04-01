import { setTgBotEvents, logException } from './tg-bot-setup.js'
import { startChannelMonitoring } from './discord-setup.js'

const discordSettings = {
  channelOne: {
    discordToken: 'qwe',
    channelId: 'qwe',
    requestDelay: 5000,
    context: { lastReportedMsgId: 0, msgContentHash: {} },
  },
  channelTwo: {
    discordToken: 'qwe',
    channelId: 'qwe',
    requestDelay: 5000,
    context: { lastReportedMsgId: 0, msgContentHash: {} },
  },
}
;(async () => {
  try {
    setTgBotEvents()
    startChannelMonitoring(discordSettings.channelOne)
    startChannelMonitoring(discordSettings.channelTwo)
  } catch (e) {
    logException(`Ooops: ${e.message}`)
  }
})()
