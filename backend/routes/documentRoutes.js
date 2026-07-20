const express = require("express");

const router = express.Router();

const upload = require("../middleware/upload");

const auth = require("../middleware/auth");

const {
  uploadDocument,
  getDocuments,
  deleteDocument,
  updateDocument,
  downloadDocument,
  downloadSharedDocument,
  toggleFavorite,
  searchDocuments,
  getDashboardStats,
  getStorageUsage,
  getRecentDocuments,
  generateShareLink,
  getSharedDocument,
} = require("../controllers/documentController");


// Upload Document
router.post(
  "/upload",
  auth,
  upload.single("file"),
  uploadDocument
);


// Get Dashboard Statistics
router.get("/stats",
  auth,
  getDashboardStats
);

// Get Storage Usage
router.get("/storage",
  auth,
  getStorageUsage
);

router.get("/recent", auth, getRecentDocuments);

// Get All Documents
router.get(
  "/",
  auth,
  getDocuments
);


// Search Documents
router.get(
  "/search",
  auth,
  searchDocuments
);

// Update Document
router.put(
  "/:id",
  auth,
  updateDocument
);

// Download Document
router.get(
  "/download/:id",
  auth,
  downloadDocument
);

router.get("/share/:id", auth, generateShareLink);

router.get("/shared/:token", getSharedDocument);

router.get(
  "/shared/download/:token",
  downloadSharedDocument
);

// Toggle Favorite
router.put(
  "/favorite/:id",
  auth,
  toggleFavorite
);

// Delete Document
router.delete(
  "/:id",
  auth,
  deleteDocument
);


module.exports = router;