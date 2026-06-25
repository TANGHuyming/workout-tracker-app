import mongoose, { Schema, ObjectId, Document } from "mongoose";

export interface IMessage extends Document {
  conversationId: ObjectId;
  senderId: ObjectId;
  messageType: string;
  content: string;
}

const MessageSchema = new Schema<IMessage>(
  {
    conversationId: {
      type: Schema.Types.ObjectId,
      required: true,
    },
    senderId: {
      type: Schema.Types.ObjectId,
      required: true,
    },
    messageType: {
      type: String,
      required: false,
      unique: false,
    },
    content: {
      type: String,
      required: true,
      unique: false,
    },
  },
  { timestamps: true },
);

export default mongoose.models.Message ||
  mongoose.model<IMessage>("Message", MessageSchema);
