import { NextApiRequest, NextApiResponse } from 'next'
import { serverConfig } from '../../../config/config'
import Telegraf from 'telegraf'

const bot = new Telegraf(serverConfig.botToken)
bot.on('text', update => console.log(update))
bot.command('hello', ctx => ctx.reply('Hello'))
bot.help(ctx => ctx.reply('Help: needed'))

export default async (req: NextApiRequest, res: NextApiResponse) => {
    const {
        query: { pid },
        method
    } = req
    if (pid !== serverConfig.botToken) {
        console.error(`Got message with wrong pid ${pid}`)
        res.status(404)
        return
    }
    if (method !== 'POST') {
        console.error(`Got message with method ${method} ${pid}`)
        res.status(404)
        return
    }
    bot.handleUpdate(req.body, res)
    return
}
