const logActivity = require("../utils/activityLogger");
const Document = require("../models/Document");
const fs = require("fs");
const path = require("path");

// Upload Document
const uploadDocument = async (req, res) => {
    try {

        console.log("Document upload request received");
        console.log("Body:", req.body);
        console.log("File:", req.file);

        const { title, category } = req.body;

        if (!req.file) {
            return res.status(400).json({
                message: "Please upload a file"
            });
        }

        const document = await Document.create({
            title,
            category,
            fileName: req.file.filename,
            filePath: req.file.path,
            fileSize: req.file.size,
            uploadedBy: req.user.id
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
            uploadedBy: req.user.id
        }).sort({
            createdAt: -1
        });

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

// Delete Document
const deleteDocument = async (req, res) => {

    try {

        const document = await Document.findById(req.params.id);

        if (!document) {
            return res.status(404).json({
                message: "Document not found"
            });
        }

        await logActivity(
  req.user.id,
  "Deleted Document",
  document.title
);

        const filePath = path.join(
            __dirname,
            "..",
            document.filePath
        );

        if (fs.existsSync(filePath)) {
            fs.unlinkSync(filePath);
        }

        await Document.findByIdAndDelete(req.params.id);

        res.status(200).json({
            message: "Document deleted successfully"
        });

    } catch (error) {

        console.log(error);

        res.status(500).json({
            message: error.message
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
            uploadedBy: req.user.id
        });

        const categories = await Document.distinct(
            "category",
            {
                uploadedBy: req.user.id
            }
        );

        res.status(200).json({

            totalDocuments,

            totalCategories: categories.length

        });

    } catch (error) {

        console.log(error);

        res.status(500).json({
            message: error.message
        });

    }

};

const getStorageUsage = async (req, res) => {  try {

    const documents = await Document.find({
      uploadedBy: req.user.id,
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

module.exports = {
  uploadDocument,
  getDocuments,
  deleteDocument,
  updateDocument,
  downloadDocument,
  toggleFavorite,
  searchDocuments,
  getDashboardStats,
  getStorageUsage,
};
