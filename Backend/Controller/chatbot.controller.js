// controllers/chatbotController.js
import Conversation from '../models/Conversation';
import user from '../models/User';

exports.saveChatHistory = async (req, res) => {
  try {
    const { messages } = req.body;
    const userId = req.user._id;

    const conversation = new Conversation({
      user: userId,
      messages: messages.map(msg => ({
        sender: msg.sender,
        text: msg.text
      }))
    });

    await conversation.save();

    res.status(201).json({
      success: true,
      data: conversation
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to save chat history',
      error: error.message
    });
  }
};

exports.getChatHistory = async (req, res) => {
  try {
    const userId = req.user._id;

    const conversations = await Conversation.find({ user: userId })
      .sort({ createdAt: -1 })
      .limit(10);

    res.status(200).json({
      success: true,
      data: conversations
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to retrieve chat history',
      error: error.message
    });
  }
};
