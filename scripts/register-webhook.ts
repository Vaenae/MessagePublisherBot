import Telegraf from 'telegraf'

const baseUrl = process.env.URL_PROD!
const token = process.env.BOT_TOKEN!
const webhookUrl = `${baseUrl}/api/update/${token}`
const bot = new Telegraf(token)

bot.telegram.setWebhook(webhookUrl)
