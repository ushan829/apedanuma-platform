import mongoose, { Schema, model, models, type Document } from "mongoose";

export interface IMessage extends Document {
  name: string;
  email: string;
  subject: string;
  message: string;
  isRead: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const MessageSchema = new Schema<IMessage>(
  {
    name: {
      type: String,
      required: [true, "Name is required."],
      trim: true,
      maxlength: [120, "Name cannot exceed 120 characters."],
    },
    email: {
      type: String,
      required: [true, "Email is required."],
      trim: true,
      lowercase: true,
      match: [/^[^\s@]+@[^\s@]+\.[^\s@]+$/, "Please provide a valid email address."],
    },
    subject: {
      type: String,
      required: [true, "Subject is required."],
      trim: true,
      maxlength: [200, "Subject cannot exceed 200 characters."],
    },
    message: {
      type: String,
      required: [true, "Message body is required."],
      trim: true,
      maxlength: [5000, "Message cannot exceed 5000 characters."],
    },
    isRead: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

MessageSchema.index({ createdAt: -1 });
MessageSchema.index({ isRead: 1 });

const Message =
  (models.Message as mongoose.Model<IMessage>) ??
  model<IMessage>("Message", MessageSchema);

export default Message;
