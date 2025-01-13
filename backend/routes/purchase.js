import Purchase from "../models/purchase.js";
import Event from "../models/event.js";
import { User } from "../models/user.js";

const purchaseRoutes = {
  async getTicketDetails(req, res) {
    try {
      const { _id } = req.auth;
      const { id } = req.params;

      const purchase = await Purchase.findOne({ _id: id, _user: _id }).populate(
        "_event _user"
      );
      if (purchase === null) {
        return res
          .status(400)
          .json({ error: true, reason: "transaction not found with this id" });
      }

      return res.status(200).json({ error: false, purchase });
    } catch (error) {
      return res.status(500).json({ error: true, Error: error.message });
    }
  },

  async getAllTransactions(req, res) {
    try {
      const { _id } = req.auth;

      const user = await User.findOne({ _id })

      if (user === null) {
        return res.status(200).json({ error: true, reason: "You are not admin" })
      }

      const purchase = await Purchase.find({ _user: _id }).populate(
        "_event _user"
      );

      return res.status(200).json({ error: false, purchase });
    } catch (error) {
      return res.status(500).json({ error: true, Error: error.message });
    }
  },

  async buyTicket(req, res) {
    try {
      const { _id } = req.auth;
      const { quantity, eventId } = req.body;

      const existingUser = await User.findOne({ _id });

      const existingEvent = await Event.findOne({ _id: eventId });

      if (existingUser === null) {
        return res.status(400).json({ error: true, reason: "user not found" });
      }

      if (existingEvent === null) {
        return res
          .status(400)
          .json({ error: true, reason: "Event not found with this Id" });
      }

      if (quantity === undefined) {
        return res
          .status(400)
          .json({ error: true, reason: "Field 'quantity' is required" });
      }

      const totalPrice = existingEvent.price * Number(quantity);

      const response = await Purchase.create({
        _user: existingUser._id,
        _event: existingEvent._id,
        totalPrice,
        quantity,
      });

      return res.status(200).json({ error: false, response });
    } catch (error) {
      return res.status(500).json({ error: true, Error: error });
    }
  },
};
export default purchaseRoutes;
