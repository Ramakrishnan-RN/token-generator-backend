const crypto = require("crypto");
const mongoose = require("mongoose");
const Token = require("../models/Token");

// CREATE: Generate and save a token
exports.createToken = async (req, res) => {
  try {
    const { label, expiresAt } = req.body;

    if (
      expiresAt &&
      (!Number.isFinite(Date.parse(expiresAt)) ||
        new Date(expiresAt) <= new Date())
    ) {
      return res.status(400).json({
        message: "Expiry must be a valid future date"
      });
    }

    const token = crypto.randomBytes(32).toString("hex");

    const newToken = await Token.create({
      token,
      label: label || "General",
      expiresAt: expiresAt || null
    });

    res.status(201).json({
      message: "Token generated successfully",
      data: newToken
    });
  } catch (error) {
    res.status(500).json({
      message: "Failed to generate token"
    });
  }
};

// READ: Get all tokens
exports.getAllTokens = async (req, res) => {
  try {
    const tokens = await Token.find().sort({ createdAt: -1 });

    res.status(200).json({
      count: tokens.length,
      data: tokens
    });
  } catch (error) {
    res.status(500).json({
      message: "Failed to fetch tokens"
    });
  }
};

// READ: Get one token by MongoDB ID
exports.getTokenById = async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.isValidObjectId(id)) {
      return res.status(400).json({
        message: "Invalid token record ID"
      });
    }

    const token = await Token.findById(id);

    if (!token) {
      return res.status(404).json({
        message: "Token not found"
      });
    }

    res.status(200).json({ data: token });
  } catch (error) {
    res.status(500).json({
      message: "Failed to fetch token"
    });
  }
};

// UPDATE: Change label, status or expiry
exports.updateToken = async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.isValidObjectId(id)) {
      return res.status(400).json({
        message: "Invalid token record ID"
      });
    }

    const allowedFields = ["label", "status", "expiresAt"];
    const updates = {};

    for (const field of allowedFields) {
      if (Object.hasOwn(req.body, field)) {
        updates[field] = req.body[field];
      }
    }

    if (Object.keys(updates).length === 0) {
      return res.status(400).json({
        message: "Provide label, status or expiresAt to update"
      });
    }

    if (
      updates.status &&
      !["active", "revoked"].includes(updates.status)
    ) {
      return res.status(400).json({
        message: "Status must be active or revoked"
      });
    }

    if (updates.expiresAt !== undefined &&
        updates.expiresAt !== null) {
      const date = new Date(updates.expiresAt);

      if (
        !Number.isFinite(date.getTime()) ||
        date <= new Date()
      ) {
        return res.status(400).json({
          message: "Expiry must be a valid future date"
        });
      }

      updates.expiresAt = date;
    }

    const token = await Token.findByIdAndUpdate(
      id,
      { $set: updates },
      { new: true, runValidators: true }
    );

    if (!token) {
      return res.status(404).json({
        message: "Token not found"
      });
    }

    res.status(200).json({
      message: "Token updated successfully",
      data: token
    });
  } catch (error) {
    res.status(500).json({
      message: "Failed to update token"
    });
  }
};

// DELETE: Remove a token record
exports.deleteToken = async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.isValidObjectId(id)) {
      return res.status(400).json({
        message: "Invalid token record ID"
      });
    }

    const token = await Token.findByIdAndDelete(id);

    if (!token) {
      return res.status(404).json({
        message: "Token not found"
      });
    }

    res.status(200).json({
      message: "Token deleted successfully"
    });
  } catch (error) {
    res.status(500).json({
      message: "Failed to delete token"
    });
  }
};