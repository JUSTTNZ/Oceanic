import mongoose, { Schema } from 'mongoose';

export interface ISession {
  userId: string; // Supabase user ID
  lastActivity: Date;
  createdAt: Date;
  expiresAt: Date; // Absolute timeout (8 hours from creation)
}

export type SessionDocument = ISession & mongoose.Document;

const SessionSchema = new Schema<SessionDocument>(
  {
    userId: {
      type: String,
      required: true,
      index: true,
    },
    lastActivity: {
      type: Date,
      required: true,
      default: Date.now,
    },
    createdAt: {
      type: Date,
      default: Date.now,
    },
    expiresAt: {
      type: Date,
      required: true,
    },
  },
  { timestamps: true }
);

// Compound index for efficient queries
SessionSchema.index({ userId: 1, lastActivity: 1 });
SessionSchema.index({ expiresAt: 1 }); // For cleanup jobs

export const Session = mongoose.model<SessionDocument>('Session', SessionSchema);
