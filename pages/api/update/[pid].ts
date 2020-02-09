import { NextApiRequest, NextApiResponse } from 'next'
import { getServerConfig } from '../../../config/config'
import { bot } from '../../../backend/bot'

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
    if (pid == null || pid !== getServerConfig().botToken) {
        console.error(`Got message with wrong pid ${pid}`)
        res.status(404)
        res.end()
        return
    }
    await bot.handleUpdate(req.body, res)
    res.end()
}
