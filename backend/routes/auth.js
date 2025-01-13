import { User } from '../models/user.js';
import jwt from 'jsonwebtoken';

const auth = {
    async login(req, res) {
        try {
            const { email, password } = req.body

            if (email === undefined) {
                return res.status(400).json({ error: true, reason: "Field 'email' is required" })
            }

            if (password === undefined) {
                return res.status(400).json({ error: true, reason: "Field 'password' is required" })
            }

            const user = await User.findOne({ email: email })

            if (user === null) {
                return res.status(400).json({ error: false, reason: "user not found" })
            }
            await user.comparePassword(password)

            const payload = {
                _id: user._id,
                id: user._id,
                email: user.email,
                firstName: user.firstName,
                lastName: user.lastName,
                isAdmin: user.isAdmin === true
            }


            const token = jwt.sign(payload, process.env.SECRET, { expiresIn: 3600 * 24 * 30 })
            
            return res.status(200).json({error: false, token})
        } catch (error) {
            return res.status(500).json({
                error: true,
                reason: error.message,
              })
        }
    }
}

export default auth