import mongoose, { Schema, Document } from "mongoose";

export interface Notification extends Document {
  type: string;
  from: string;
  to: string;
  read: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const NotificationSchema = new Schema<Notification>(
  {
    type: {
      type: String,
      required: true,
      enum: [
        "friend_request",
        "friend_request_accepted",
        "friend_request_declined",
        "friend_message",
      ],
    },
    from: {
      type: String,
      unique: true,
      required: true,
    },
    to: {
      type: String,
      unique: true,
      required: true,
    },
    read: {
      type: Boolean,
      required: true,
    },
  },
  {
    timestamps: true,
  },
);

export default mongoose.models.Notification ||
  mongoose.model<Notification>("Notification", NotificationSchema);
