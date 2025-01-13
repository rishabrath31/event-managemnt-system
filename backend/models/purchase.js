// models/Purchase.js
import mongoose from "mongoose";

const purchaseSchema = new mongoose.Schema({

  _user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User"
  },

  _event: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Event"
  },

  totalPrice: {
    type: Number,
    default: 0
  },

  ticketType: { // optional for now 
    type: String,
    enum: ["Standard", "VIP", "Group"]
  },  

  quantity: {
    type: Number,
  },

});

purchaseSchema.set("timestamps", true);
const Purchase = mongoose.model("Purchase", purchaseSchema);

export default Purchase