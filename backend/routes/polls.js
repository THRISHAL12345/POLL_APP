import express from "express";
import Poll from "../models/Poll.js";
import Vote from "../models/Vote.js";

const router = express.Router();

/**
 * POST /polls
 * Create a new poll
 */
router.post("/", async (req, res) => {
  try {
    const { question, options } = req.body;
    if (!question || !options || options.length < 2) {
      return res
        .status(400)
        .json({ error: "Question and at least 2 options required" });
    }

    const poll = await Poll.create({
      question,
      options: options.map((text) => ({ text, votes: 0 })),
    });

    res.status(201).json(poll);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to create poll" });
  }
});

/**
 * GET /polls
 * Fetch all polls
 */
router.get("/", async (req, res) => {
  try {
    const polls = await Poll.find().sort({ createdAt: -1 });
    res.json(polls);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to fetch polls" });
  }
});

/**
 * GET /polls/:id
 * Fetch single poll by id
 */
router.get("/:id", async (req, res) => {
  try {
    const poll = await Poll.findById(req.params.id);
    if (!poll) return res.status(404).json({ error: "Poll not found" });
    res.json(poll);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to fetch poll" });
  }
});

/**
 * POST /polls/:id/vote
 * Vote on a poll
 */
router.post("/:id/vote", async (req, res) => {
  try {
    const { optionIndex } = req.body;
    const pollId = req.params.id;

    const poll = await Poll.findById(pollId);
    if (!poll || optionIndex < 0 || optionIndex >= poll.options.length) {
      return res.status(400).json({ error: "Invalid poll or option" });
    }

    // Record vote
    await Vote.create({ pollId, optionIndex });
    poll.options[optionIndex].votes += 1;
    await poll.save();

    // Emit updated poll to clients in this poll room
    req.io?.to(pollId).emit("voteUpdate", poll);

    res.json(poll);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to vote" });
  }
});

export default router;
