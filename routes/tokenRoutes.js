const express = require("express");
const router = express.Router();

const {
  createToken,
  getAllTokens,
  getTokenById,
  updateToken,
  deleteToken
} = require("../controllers/tokenController");

// CREATE
router.post("/", createToken);

// READ ALL
router.get("/", getAllTokens);

// READ ONE
router.get("/:id", getTokenById);

// UPDATE
router.patch("/:id", updateToken);

// DELETE
router.delete("/:id", deleteToken);

module.exports = router;