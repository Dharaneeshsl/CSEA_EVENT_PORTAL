import Round3Answer from '../models/Round3Answer.js';

// 🟢 Create (POST)
export const createAnswer = async (req, res) => {
  try {
    const { answer, yr } = req.body;
    if (!answer || !yr)
      return res.status(400).json({ success: false, message: "Answer and year are required" });

    const existing = await Round3Answer.findOne({ yr });
    if (existing)
      return res.status(409).json({ success: false, message: `Answer for year ${yr} already exists` });

    const newAnswer = await Round3Answer.create({ answer, yr });
    res.status(201).json({
      success: true,
      message: `Answer for year ${yr} created successfully`,
      data: newAnswer
    });
  } catch (err) {
    res.status(500).json({ success: false, message: "Internal server error" });
  }
};

// ⚪ Get all answers
export const getAllAnswers = async (req, res) => {
  try {
    const answers = await Round3Answer.find();
    if (answers.length === 0) {
      return res.status(404).json({ success: false, message: "No answers found" });
    }
    res.status(200).json({ success: true, data: answers });
  } catch (err) {
    res.status(500).json({ success: false, message: "Internal server error" });
  }
};


// 🔵 Read (GET)
export const getAnswer = async (req, res) => {
  try {
    const { year } = req.params;
    const answer = await Round3Answer.findOne({ yr: year });
    if (!answer)
      return res.status(404).json({ success: false, message: `No answer found for year ${year}` });

    res.status(200).json({ success: true, data: answer });
  } catch (err) {
    res.status(500).json({ success: false, message: "Internal server error" });
  }
};

// 🟡 Update (PUT)
export const updateAnswer = async (req, res) => {
  try {
    const { year } = req.params;
    const { answer } = req.body;

    const updated = await Round3Answer.findOneAndUpdate(
      { yr: year },
      { answer },
      { new: true }
    );

    if (!updated)
      return res.status(404).json({ success: false, message: `No existing answer for year ${year} to update` });

    res.status(200).json({
      success: true,
      message: `Answer for year ${year} updated successfully`,
      data: updated
    });
  } catch (err) {
    res.status(500).json({ success: false, message: "Internal server error" });
  }
};

// 🔴 Delete (DELETE)
export const deleteAnswer = async (req, res) => {
  try {
    const { year } = req.params;
    const deleted = await Round3Answer.findOneAndDelete({ yr: year });

    if (!deleted)
      return res.status(404).json({ success: false, message: `No answer found for year ${year}` });

    res.status(200).json({
      success: true,
      message: `Answer for year ${year} deleted successfully`
    });
  } catch (err) {
    res.status(500).json({ success: false, message: "Internal server error" });
  }
};


