import Telegraf from 'telegraf'

const baseUrl = process.env.URL_PROD!
const token = process.env.BOT_TOKEN!
const webhookUrl = `${baseUrl}/api/update/${token}`
const bot = new Telegraf(token)

async function registerWebhook() {
    try {
        const webhookInfo = await bot.telegram.getWebhookInfo()
        console.log(`Current webhook info: ${JSON.stringify(webhookInfo)}`)
        const result = await bot.telegram.setWebhook(webhookUrl)
        console.log(`Done registering webhook, result ${result}`)
    } catch (reason) {
        console.error(`Failed registering webhook, reason ${reason}`)
    }
}

registerWebhook()
