const express = require("express");

const router = express.Router();

const auth = require("../middleware/auth");

const {
  createFolder,
  getFolders,
  updateFolder,
  deleteFolder,
} = require("../controllers/folderController");

// Create Folder
router.post("/", auth, createFolder);

// Get All Folders
router.get("/", auth, getFolders);

// Update Folder
router.put("/:id", auth, updateFolder);

// Delete Folder
router.delete("/:id", auth, deleteFolder);

module.exports = router;