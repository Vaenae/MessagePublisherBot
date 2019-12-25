import { NextApiRequest, NextApiResponse } from 'next'
import admin from 'firebase-admin'

function initFirebase() {
    if (admin.app() == null) {
        const serviceAccount = JSON.parse(process.env.FIREBASE_ADMIN_CONFIG)
        admin.initializeApp({
            credential: admin.credential.cert(serviceAccount)
        })
    }
}

export const withAuth = (
    func: (
        req: NextApiRequest,
        res: NextApiResponse,
        authResult: admin.auth.DecodedIdToken
    ) => Promise<void>
) => async (req: NextApiRequest, res: NextApiResponse) => {
    if (!('authorization' in req.headers)) {
        return res.status(401).send('Authorization header missing')
    }
    try {
        const idToken = req.headers.authorization
        initFirebase()
        const authResult = await admin.auth().verifyIdToken(idToken)
        return await func(req, res, authResult)
    } catch (error) {
        console.error(error)
        return res.status(401).send('Authorization failed')
    }
}
