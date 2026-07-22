const logActivity = require("../utils/activityLogger");
const Document = require("../models/Document");
const fs = require("fs");
const path = require("path");
const crypto = require("crypto");

// Upload Document
const uploadDocument = async (req, res) => {
    try {

        console.log("Document upload request received");
        console.log("Body:", req.body);
        console.log("File:", req.file);

        const { title, category, folder } = req.body;
        if (!req.file) {
            return res.status(400).json({
                message: "Please upload a file"
            });
        }

        const document = await Document.create({
    title,
    category,
    folder: folder || null,
    fileName: req.file.filename,
    filePath: req.file.path,
    fileSize: req.file.size,
    uploadedBy: req.user.id,
});

        res.status(201).json({
            message: "Document uploaded successfully",
            document
        });

    } catch (error) {

        console.log("Upload Error:", error);

        res.status(500).json({
            message: error.message
        });

    }
};

// Get All Documents
const getDocuments = async (req, res) => {

    try {

       const documents = await Document.find({
  uploadedBy: req.user.id,
  $or: [
    { isDeleted: false },
    { isDeleted: { $exists: false } },
  ],
})
.populate("folder", "name")
.sort({
  createdAt: -1,
});
        console.log("Documents:", JSON.stringify(documents, null, 2));
        res.status(200).json(documents);

    } catch (error) {

        console.log(error);

        res.status(500).json({
            message: error.message
        });

    }

};

// Toggle Favorite
const toggleFavorite = async (req, res) => {
  try {

    const document = await Document.findById(req.params.id);

    if (!document) {
      return res.status(404).json({
        message: "Document not found",
      });
    }

    document.isFavorite = !document.isFavorite;

    await document.save();

    await logActivity(
  req.user.id,
  document.isFavorite
    ? "Added to Favorites"
    : "Removed from Favorites",
  document.title
);

    res.status(200).json({
      message: "Favorite updated successfully",
      document,
    });

  } catch (error) {

    console.log(error);

    res.status(500).json({
      message: error.message,
    });

  }
};

// Move Document to Recycle Bin
const deleteDocument = async (req, res) => {
  try {
    const document = await Document.findById(req.params.id);

    if (!document) {
      return res.status(404).json({
        message: "Document not found",
      });
    }

    document.isDeleted = true;

console.log("Before Save:", document.isDeleted);

await document.save();

console.log("After Save:", document);

    await logActivity(
      req.user.id,
      "Moved to Recycle Bin",
      document.title
    );

    res.status(200).json({
      message: "Document moved to Recycle Bin successfully",
    });

  } catch (error) {
    console.log(error);

    res.status(500).json({
      message: error.message,
    });
  }
};

// Update Document
const updateDocument = async (req, res) => {
  try {
    const { title, category } = req.body;

    const document = await Document.findById(req.params.id);

    if (!document) {
      return res.status(404).json({
        message: "Document not found",
      });
    }

    document.title = title;
    document.category = category;

    await document.save();

    await logActivity(
        req.user.id,
        "Updated Document",
        document.title
    );

    res.status(200).json({
      message: "Document updated successfully",
      document,
    });
  } catch (error) {
    console.log(error);

    res.status(500).json({
      message: error.message,
    });
  }
};
// Download Document
const downloadDocument = async (req, res) => {
  try {
    const document = await Document.findById(req.params.id);

    if (!document) {
      return res.status(404).json({
        message: "Document not found",
      });
    }

    const filePath = path.resolve(document.filePath);

    res.download(filePath, document.fileName);

  } catch (error) {
    console.log(error);

    res.status(500).json({
      message: error.message,
    });
  }
};

// Search Documents
const searchDocuments = async (req, res) => {

    try {

        const keyword = req.query.keyword;

        if (!keyword) {
            return res.status(400).json({
                message: "Please enter a search keyword"
            });
        }

        const documents = await Document.find({

            $or: [

                {
                    title: {
                        $regex: keyword,
                        $options: "i"
                    }
                },

                {
                    category: {
                        $regex: keyword,
                        $options: "i"
                    }
                },

                {
                    fileName: {
                        $regex: keyword,
                        $options: "i"
                    }
                }

            ]

        });

        res.status(200).json(documents);

    } catch (error) {

        console.log(error);

        res.status(500).json({
            message: error.message
        });

    }

};

// ==============================
// Dashboard Statistics
// ==============================

const getDashboardStats = async (req, res) => {
  try {
    const totalDocuments = await Document.countDocuments({
      uploadedBy: req.user.id,
      $or: [
        { isDeleted: false },
        { isDeleted: { $exists: false } },
      ],
    });

    console.log("Dashboard Total Documents:", totalDocuments);

    const categories = await Document.distinct("category", {
      uploadedBy: req.user.id,
      $or: [
        { isDeleted: false },
        { isDeleted: { $exists: false } },
      ],
    });

    res.status(200).json({
      totalDocuments,
      totalCategories: categories.length,
    });

  } catch (error) {
    console.log(error);

    res.status(500).json({
      message: error.message,
    });
  }
};

const getStorageUsage = async (req, res) => {  try {

    const documents = await Document.find({
  uploadedBy: req.user.id,
  isDeleted: false,
});

    let totalSize = 0;

    documents.forEach((doc) => {
      totalSize += doc.fileSize || 0;
    });

    res.json({
      used: totalSize,
      total: 100 * 1024 * 1024, // 100 MB
    });

  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

const getRecentDocuments = async (req, res) => {
  try {
    const documents = await Document.find({
  uploadedBy: req.user.id,
  isDeleted: false,
})
.sort({ createdAt: -1 })
.limit(5);

    res.status(200).json(documents);

  } catch (error) {
    console.log(error);

    res.status(500).json({
      message: error.message,
    });
  }
}; 

// Generate Share Link
const generateShareLink = async (req, res) => {
  console.log("===== SHARE ROUTE CALLED =====");
  console.log("Document ID:", req.params.id);

  try {
    const document = await Document.findById(req.params.id);

    if (!document) {
      console.log("Document not found in database");
      return res.status(404).json({
        message: "Document not found",
      });
    }

    // Generate token only once
    if (!document.shareToken) {
      document.shareToken = crypto.randomBytes(16).toString("hex");
      await document.save();
    }

    res.status(200).json({
      shareLink: `http://localhost:3000/shared/${document.shareToken}`,
    });

  } catch (error) {
    console.log(error);

    res.status(500).json({
      message: error.message,
    });
  }
};

// Get Shared Document
const getSharedDocument = async (req, res) => {
  try {
    console.log("Token received:", req.params.token);

    const document = await Document.findOne({
      shareToken: req.params.token,
    });

    console.log("Document found:", document);

    if (!document) {
      return res.status(404).json({
        message: "Document not found",
      });
    }

    res.status(200).json(document);

  } catch (error) {
    console.log(error);

    res.status(500).json({
      message: error.message,
    });
  }
};

// Public Download by Share Token
const downloadSharedDocument = async (req, res) => {
  try {
    const document = await Document.findOne({
      shareToken: req.params.token,
    });

    if (!document) {
      return res.status(404).json({
        message: "Document not found",
      });
    }

    const filePath = path.resolve(document.filePath);

    res.download(filePath, document.fileName);

  } catch (error) {
    console.log(error);

    res.status(500).json({
      message: error.message,
    });
  }
};

// Get Documents By Folder
const getDocumentsByFolder = async (req, res) => {
  try {
    const documents = await Document.find({
  uploadedBy: req.user.id,
  folder: req.params.folderId,
  $or: [
    { isDeleted: false },
    { isDeleted: { $exists: false } },
  ],
})
.populate("folder", "name")
.sort({
  createdAt: -1,
});
    res.status(200).json(documents);

  } catch (error) {
    console.log(error);

    res.status(500).json({
      message: error.message,
    });
  }
};

const getRecycleBin = async (req, res) => {
  try {
    const documents = await Document.find({
      uploadedBy: req.user.id,
      isDeleted: true,
    })
      .populate("folder", "name")
      .sort({ updatedAt: -1 });

    res.status(200).json(documents);

  } catch (error) {
    console.log(error);

    res.status(500).json({
      message: error.message,
    });
  }
};

const restoreDocument = async (req, res) => {
  try {
    const document = await Document.findById(req.params.id);

    if (!document) {
      return res.status(404).json({
        message: "Document not found",
      });
    }

    document.isDeleted = false;

    await document.save();

    await logActivity(
      req.user.id,
      "Restored Document",
      document.title
    );

    res.status(200).json({
      message: "Document restored successfully",
    });

  } catch (error) {
    console.log(error);

    res.status(500).json({
      message: error.message,
    });
  }
};

const deleteForever = async (req, res) => {
  try {
    const document = await Document.findById(req.params.id);

    if (!document) {
      return res.status(404).json({
        message: "Document not found",
      });
    }

    await Document.findByIdAndDelete(req.params.id);

    await logActivity(
      req.user.id,
      "Deleted Forever",
      document.title
    );

    res.status(200).json({
      message: "Document deleted permanently",
    });

  } catch (error) {
    console.log(error);

    res.status(500).json({
      message: error.message,
    });
  }
};

const emptyRecycleBin = async (req, res) => {
  try {
    await Document.deleteMany({
      uploadedBy: req.user.id,
      isDeleted: true,
    });

    await logActivity(
      req.user.id,
      "Emptied Recycle Bin",
      "-"
    );

    res.status(200).json({
      message: "Recycle Bin emptied successfully",
    });

  } catch (error) {
    console.log(error);

    res.status(500).json({
      message: error.message,
    });
  }
};

module.exports = {
  uploadDocument,
  getDocuments,
  getDocumentsByFolder,
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
  getRecycleBin,
  restoreDocument,
  deleteForever,
  emptyRecycleBin,
};
