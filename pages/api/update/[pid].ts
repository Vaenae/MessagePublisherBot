import { NextApiRequest, NextApiResponse } from 'next'
import { getServerConfig } from '../../../config/config'
import Telegraf from 'telegraf'
import { saveMessage } from '../../../database/messages'

const serverConfig = getServerConfig()

const bot = new Telegraf(serverConfig.botToken)
bot.command('hello', ctx => ctx.reply('Hello'))
bot.help(ctx => ctx.reply('Help: needed'))
bot.on('text', async update => {
    if (update.message && update.message.chat.type !== 'private') {
        await saveMessage(update.message)
    }
})

export default async (req: NextApiRequest, res: NextApiResponse) => {
    const {
        query: { pid },
        method
    } = req
    if (method !== 'POST') {
        console.error(`Got message with method ${method} ${pid}`)
        res.status(404)
        res.end()
        return
    }
    if (pid == null || pid !== serverConfig.botToken) {
        console.error(`Got message with wrong pid ${pid}`)
        res.status(404)
        res.end()
        return
    }
    await bot.handleUpdate(req.body, res)
    res.end()
}
