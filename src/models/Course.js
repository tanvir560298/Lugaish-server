import { randomUUID } from "node:crypto";
import mongoose from "mongoose";
const schema = new mongoose.Schema(
  {
    language: {
      type: String,
      enum: ["english", "arabic", "paid_batch"],
      required: true,
      unique: true,
    },
    generation: { type: String, default: () => randomUUID(), required: true },
    startAt: { type: Date, default: Date.now },
    title: { type: String, required: true, trim: true, maxlength: 160 },
    description: { type: String, default: "", maxlength: 2000 },
    status: {
      type: String,
      enum: ["draft", "published", "archived"],
      default: "draft",
    },
  },
  { timestamps: true },
);
export const Course = mongoose.model("Course", schema);
