import mongoose, { Schema, Document } from "mongoose";

export interface IPair extends Document {
  teamName: string;
  captain: mongoose.Types.ObjectId;
  player2: mongoose.Types.ObjectId;
  captainLevel: number;
  player2Level: number;
  averageLevel: number;
  points: number;
  isPaid: boolean;
}

const PairSchema: Schema = new Schema(
  {
    teamName: { type: String, required: true, unique: true },
    captain: { type: Schema.Types.ObjectId, ref: "User", required: true },
    player2: { type: Schema.Types.ObjectId, ref: "User", required: true },
    captainLevel: { type: Number, required: true },
    player2Level: { type: Number, required: true },
    averageLevel: { type: Number, required: true },
    points: { type: Number, default: 100 },
    isPaid: { type: Boolean, default: false },
  },
  { timestamps: true }
);

export default mongoose.model<IPair>("Pair", PairSchema);
