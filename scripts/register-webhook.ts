import Telegraf from 'telegraf'

const baseUrl = process.env.URL_PROD!
const token = process.env.BOT_TOKEN!
const webhookUrl = `${baseUrl}/api/update/${token}`
const bot = new Telegraf(token)

console.log(`Registering webhook with url ${webhookUrl}`)
bot.telegram
    .setWebhook(webhookUrl)
    .then(result => console.log(`Done registering webhook, result ${result}`))
    .catch(reason =>
        console.error(`Failed registering webhook, reason ${reason}`)
    )
