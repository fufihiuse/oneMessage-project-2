const models = require('../models');

const { Message } = models;

const messagePage = async (req, res) => res.render('app');

const getMessage = async (req, res) => {
  try {
    const docs = await Message.findOne({}).sort({ createdDate: 'descending' }).lean().exec();

    return res.json({ message: docs });
  } catch (err) {
    console.log(err);
    return res.status(500).json({ error: 'Error retrieving message!' });
  }
};

const setMessage = async (req, res) => {
  if (!req.body.name || !req.body.message) {
    return res.status(400).json({ error: 'Name and Message are required.' });
  }

  try {
    const messageData = {
      name: req.body.name.slice(0, 1000),
      message: req.body.message.slice(0, 10000),
      isPremium: req.session.account.isPremium,
    };

    const newMessage = new Message(messageData);
    await newMessage.save();
    return res.status(201).json({ name: newMessage.name, message: newMessage.message });
  } catch (err) {
    console.log(err);
    return res.status(500).json({ error: 'An error occured sending message!' });
  }
};

module.exports = {
  messagePage,
  setMessage,
  getMessage,
};
