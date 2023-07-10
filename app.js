import { setTgBotEvents, logException } from './tg-bot-setup.js'
import { startChannelMonitoring, delay } from './discord-setup.js'

const discordSettings = [
  {
    name: 'channelOne-name',
    discordToken: 'qwe',
    channelId: 'qwe',
    requestDelay: 5000,
    context: { lastReportedMsgId: 0, msgContentHash: {} },
  },
  {
    name: 'channelTwo-name',
    discordToken: 'qwe',
    channelId: 'qwe',
    requestDelay: 5000,
    context: { lastReportedMsgId: 0, msgContentHash: {} },
  },
]
;(async () => {
  try {
    setTgBotEvents()
    for (var i = 0; i < discordSettings.length; i++) {
      startChannelMonitoring(discordSettings[i])
      await delay(Math.floor(Math.random() * 10000))
    }
  } catch (e) {
    logException(`Ooops: ${e.message}`)
  }
})()
