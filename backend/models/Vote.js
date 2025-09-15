import mongoose from "mongoose";

const voteSchema = new mongoose.Schema({
  pollId: { type: mongoose.Schema.Types.ObjectId, ref: "Poll", required: true },
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  optionIndex: { type: Number, required: true },
});

export default mongoose.model("Vote", voteSchema);
