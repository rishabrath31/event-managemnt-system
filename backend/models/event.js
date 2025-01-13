import mongoose from "mongoose";

const eventSchema = new mongoose.Schema({
  title: {
    type: String,
    // Optional: Limit the title length
  },
  description: {
    type: String,
  },
  date: {
    type: Date,
    default: Date.now()
  },
  time: {
    type: String,
  },

  price :{
    type: Number,
  },
  totalEvents :{
    type: Number,
  },

  isActive: {
    type: Boolean,
    default: true
  },
  
  location: {
    type: String,
  },
  privacySetting: {
    type: String,

    enum: ["public", "private", "restricted"], // Options for privacy settings
  },
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },
});
eventSchema.set("timestamps", true);
const Event = mongoose.model("Event", eventSchema);

export default Event;
