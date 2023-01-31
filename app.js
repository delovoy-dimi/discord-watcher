import { setTgBotEvents, logException } from './tg-bot-setup.js'
import { startChannelMonitoring } from './discord-setup.js'
;(async () => {
  try {
    setTgBotEvents()
    await startChannelMonitoring()
  } catch (e) {
    logException(`Ooops: ${e.message}`)
  }
})()
