// models/messageModel.js
import mongoose from 'mongoose';

const messageSchema = new mongoose.Schema({
  projectId: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'Project', 
    required: true 
  }, // Link to the Chat/Group
  senderId: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'User', 
    required: true 
  }, // Who sent the message
  content: { 
    type: String, 
    trim: true 
  }, // Message text
  // media: [{ 
  //   type: String 
  // }], // URLs of files (optional)
  // messageType: { 
  //   type: String, 
  //   enum: ['text', 'image', 'video', 'audio', 'file'], 
  //   default: 'text' 
  // },
  // status: { 
  //   type: String, 
  //   enum: ['sent', 'delivered', 'read'], 
  //   default: 'sent' 
  // }
}, { timestamps: true }); // createdAt, updatedAt

const Message = mongoose.model('Message', messageSchema);


export default Message;
