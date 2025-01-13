import express from 'express'
import {expressjwt} from 'express-jwt'
import dotenv from 'dotenv'
dotenv.config()

const checkjwt = expressjwt({
    secret: process.env.SECRET,
    algorithms: ["HS256"],
})
const router = express.Router();

import userRouter from './user.js'
import auth from "./auth.js"
import eventRoutes from './event.js'
import purchaseRoutes from './purchase.js'

// user routes
router.post('/createuser', userRouter.create)  // register
router.post("/login",auth.login)  // Login
router.post("/events", eventRoutes.allEvents)  // all Event Details
router.post("/event/:id", eventRoutes.getEvent) // particular Event Details

router.all("*", checkjwt)  // middlewire

router.post("/users", userRouter.allUsers)
router.post("/userdetails", userRouter.getUser)
router.delete("/user/:id", userRouter.deleteUser)

// Event Routes
router.post("/event", eventRoutes.create)  // create Event
router.put("/event/:id", eventRoutes.updateEvent)  // update Event
router.delete("/event/:id", eventRoutes.deleteEvent)  // Delete Event

// Transaction Routes

router.post("/buytickets",purchaseRoutes.buyTicket)  // Buy Tickets
router.post("/ticket/:id",purchaseRoutes.getTicketDetails)  // Pariticular Ticket transaction details
router.post("/transactions",purchaseRoutes.getAllTransactions) // all transaction details

export default router