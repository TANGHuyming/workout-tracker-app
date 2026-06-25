import mongoose, { Schema, ObjectId, Document } from "mongoose";

export interface IConversation extends Document {
  type: string;
  participants: ObjectId[];
  lastMessage: {
    senderId: ObjectId;
    content: string;
    createdAt: Date;
    updatedAt: Date;
  } | null;
}

const ConversationSchema = new Schema<IConversation>(
  {
    type: {
      type: String,
      unique: false,
      required: true,
    },
    participants: {
      type: [Schema.Types.ObjectId],
      required: true,
      unique: false,
    },
    lastMessage: {
      type: {
        senderId: { type: Schema.Types.ObjectId },
        content: { type: String },
        createdAt: { type: Date },
        updatedAt: { type: Date },
      },
      default: null,
      unique: false,
    },
  },
  { timestamps: true },
);

export default mongoose.models.Conversation ||
  mongoose.model<IConversation>("Conversation", ConversationSchema);
