import { promises as fs } from 'fs'
import TelegramBot from 'node-telegram-bot-api'
import './loadEnv.js'

const subsFile = 'subscribers.json'

const tgBotToken = process.env.TG_BOT_TOKEN
const exceptionsLoggingIserId = process.env.EXCEPTION_LOGGER_TG_ID
const bot = new TelegramBot(tgBotToken, { polling: true })

export const setTgBotEvents = () => {
  bot.onText(/\/start/, async (msg) => {
    const chatId = msg.chat.id
    const resp = `Use /sub to subscribe`
    bot.sendMessage(chatId, resp)
  })

  bot.onText(/\/sub/, async (msg) => {
    const chatId = msg.chat.id
    try {
      await addSubscriber(chatId)
      bot.sendMessage(chatId, 'Done')
    } catch (e) {
      logException(`addSubscriber error: ${e.message}`)
    }
  })
}

export const notifySubscribers = async (message) => {
  if (!(await fileExists(subsFile))) {
    await fs.writeFile(subsFile, '[]')
  }

  try {
    const subs = JSON.parse(await fs.readFile(subsFile))
    subs.forEach((chatId) => {
      if (chatId) bot.sendMessage(chatId, message)
    })
  } catch (e) {
    logException(`notifySubscribers error: ${e.message}`)
  }
}

export const logException = async (message) => {
  bot.sendMessage(exceptionsLoggingIserId, message)
}

const fileExists = async (path) => !!(await fs.stat(path).catch(() => false))

const addSubscriber = async (chatId) => {
  if (!(await fileExists(subsFile))) {
    await fs.writeFile(subsFile, '[]')
  }
  const subs = JSON.parse(await fs.readFile(subsFile))
  if (!subs.includes(chatId)) {
    subs.push(chatId)
  }
  await fs.writeFile(subsFile, JSON.stringify(subs))
}
