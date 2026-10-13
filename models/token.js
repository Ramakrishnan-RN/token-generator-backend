const mongoose = require("mongoose");

const tokenSchema = new mongoose.Schema(
  {
    token: {
      type: String,
      required: true,
      unique: true,
      index: true
    },

    label: {
      type: String,
      default: "General"
    },

    status: {
      type: String,
      enum: ["active", "revoked"],
      default: "active"
    },

    expiresAt: {
      type: Date,
      default: null
    }
  },
  {
    timestamps: true
  }
);

module.exports = mongoose.model("Token", tokenSchema);