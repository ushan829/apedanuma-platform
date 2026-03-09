import mongoose, { Schema, model, models, type Document } from "mongoose";

export interface ISubscriber extends Document {
  email: string;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const SubscriberSchema = new Schema<ISubscriber>(
  {
    email: {
      type: String,
      required: [true, "Email is required."],
      unique: true,
      lowercase: true,
      trim: true,
      match: [/^[^\s@]+@[^\s@]+\.[^\s@]+$/, "Please provide a valid email address."],
    },
    isActive: { type: Boolean, default: true },
  },
  { timestamps: true }
);

const Subscriber =
  (models.Subscriber as mongoose.Model<ISubscriber>) ??
  model<ISubscriber>("Subscriber", SubscriberSchema);

export default Subscriber;
