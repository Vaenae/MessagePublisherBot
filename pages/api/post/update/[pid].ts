import { NextApiRequest, NextApiResponse } from 'next'
import { serverConfig } from '../../../../config/config'

export default (req: NextApiRequest) => {
    const {
        query: { pid }
    } = req
    if (pid !== serverConfig.botToken) {
        console.error(`Gor message with pid ${pid}`)
        return
    }
    console.log(req.body)
}
