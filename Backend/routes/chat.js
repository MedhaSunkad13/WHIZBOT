import express from "express";
import Thread from "../models/Thread.js";
import getOpenAIAPIResponse from "../utils/openai.js";

const router = express.Router();

//test
router.post("/test", async (req, res) => {
  try {
    const thread = new Thread({
      threadId: "thread456",
      title: "Testing new thread2",
    });

    const response = await thread.save();
    res.send(response);
    res.status(200).json({ message: "Thread created successfully", thread });
  } catch (err) {
    console.error(err);
    res.status(500).json("Server Error");
  }
});

//Get all threads
router.get("/threads", async (req, res) => {
  try {
    const threads = await Thread.find({}).sort({ updatedAt: -1 });
    //Most recent threads first sorted in descending order
    res.status(200).json(threads);
  } catch (err) {
    console.error(err);
    res.status(500).json("Server Error");
  }
});

router.get("/thread/:threadId", async (req, res) => {
  const { threadId } = req.params;
  try {
    const thread = await Thread.findOne({ threadId });
    if (!thread) {
      return res.status(404).json({ error: "Thread not found" });
    }
    res.status(200).json(thread);
  } catch (err) {
    console.error(err);
    res.status(500).json("Server Error");
  }
});

//Delete a thread
router.delete("/thread/:threadId", async (req, res) => {
  const { threadId } = req.params;
  try {
    const thread = await Thread.findOneAndDelete({ threadId });
    if (!thread) {
      return res.status(404).json({ error: "Thread not found" });
    }
    res.status(200).json({ message: "Thread deleted successfully" });
  } catch (err) {
    console.error(err);
    res.status(500).json("Server Error");
  }
});

router.post("/chat", async (req, res) => {
  const { threadId, message } = req.body;

  if (!threadId || !message) {
    return res.status(400).json({ error: "Missing fields" });
  }

  try {
    let existingThread = await Thread.findOne({ threadId });

    // Create new thread
    if (!existingThread) {
      existingThread = new Thread({
        threadId,
        title: message,
        messages: [{ role: "user", content: message }],
      });

      await existingThread.save();

      // generate response immediately
      const assistantReply = await getOpenAIAPIResponse(message);

      existingThread.messages.push({
        role: "assistant",
        content: assistantReply,
      });

      existingThread.updatedAt = Date.now();
      await existingThread.save();

      return res.status(200).json({ reply: assistantReply });
    }

    // 2️⃣ Existing thread → append user message
    existingThread.messages.push({ role: "user", content: message });

    const assistantReply = await getOpenAIAPIResponse(message);

    existingThread.messages.push({
      role: "assistant",
      content: assistantReply,
    });

    existingThread.updatedAt = Date.now();
    await existingThread.save();

    return res.status(200).json({ reply: assistantReply });

  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Something went wrong!" });
  }
});


export default router;
