const mongoose = require('mongoose');
const _ = require('underscore');

const setName = (name) => _.escape(name).trim();

const MessageSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true,
    set: setName,
    maxLength: 1000,
  },
  message: {
    type: String,
    required: true,
    trim: true,
    maxLength: 10000,
  },
  isPremium: {
    type: Boolean,
    required: true,
    default: false,
  },
  createdDate: {
    type: Date,
    default: Date.now,
  },
});

MessageSchema.statics.toAPI = (doc) => ({
  name: doc.name,
  message: doc.message,
});

const MessageModel = mongoose.model('Message', MessageSchema);
module.exports = MessageModel;
