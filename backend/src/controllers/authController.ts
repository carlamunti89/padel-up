import { type Request, type Response } from "express";
import User from "../models/User.js";
import Pair from "../models/Pair.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

export const registerPair = async (req: Request, res: Response) => {
  try {
    const {
      teamName,
      captainFirstName,
      captainLastName,
      captainEmail,
      password,
      captainLevel,
      player2FirstName,
      player2LastName,
      player2Email,
      player2Level,
    } = req.body;

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = await User.create({
      firstName: captainFirstName,
      lastName: captainLastName,
      email: captainEmail,
      password: hashedPassword,
    });

    const averageLevel = (captainLevel + player2Level) / 2;

    const newPair = await Pair.create({
      teamName,
      captain: newUser._id,
      player2FirstName,
      player2LastName,
      player2Email,
      captainLevel,
      player2Level,
      averageLevel,
      points: 100,
      isPaid: false,
    });

    res.status(201).json({
      message: "Pair registered successfully",
      pairId: newPair._id,
    });
  } catch (error) {
    console.error("Registration error:", error);
    res.status(400).json({
      error:
        "Error registering the pair. Email or team name might already exist.",
    });
  }
};

export const loginPair = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ error: "Invalid credentials" });
    }

    const isPasswordCorrect = await bcrypt.compare(password, user.password);
    if (!isPasswordCorrect) {
      return res.status(400).json({ error: "Invalid credentials" });
    }

    const pair = await Pair.findOne({ captain: user._id });

    const token = jwt.sign(
      { id: user._id, pairId: pair?._id },
      process.env.JWT_SECRET || "provisional_secret_key",
      { expiresIn: "24h" }
    );

    res.json({
      token,
      user: {
        id: user._id,
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
      },
      pair,
    });
  } catch (error) {
    res.status(500).json({ error: "Server error" });
  }
};
