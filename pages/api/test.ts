import { withAuth } from '../../backend/auth'

export default withAuth(async (req, res, authResult) => {
    res.status(200).json(authResult)
})
