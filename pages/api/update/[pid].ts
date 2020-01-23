import { NextApiRequest, NextApiResponse } from 'next'
import { serverConfig } from '../../../config/config'

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
    console.log(`Got message with pid ${pid}`)
    console.log(req.body)
    res.status(200).send('k')
    return
}
