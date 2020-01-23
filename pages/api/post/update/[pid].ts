import { NextApiRequest, NextApiResponse } from 'next'
import { serverConfig } from '../../../../config/config'

export default (req: NextApiRequest) => {
    const {
        query: { pid }
    } = req
    if (pid !== serverConfig.botToken) {
        console.error(`Got message with wrong pid ${pid}`)
        return
    }
    console.log(`Got message with pid ${pid}`)
    console.log(req.body)
}
