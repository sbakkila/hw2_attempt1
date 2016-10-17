import mongoose, { Schema } from 'mongoose';

const MessageSchema = new Schema({
  content: {
    type: String,
    default: 'nothing',
  },
  createdDate: {
    type: String,
    default: Date.now,
  },
});

mongoose.model('Message', MessageSchema);
