const Folder = require("../models/Folder");

// ==========================
// Create Folder
// ==========================
const createFolder = async (req, res) => {
  try {
    const { name } = req.body;

    const folder = await Folder.create({
      name,
      createdBy: req.user.id,
    });

    res.status(201).json(folder);

  } catch (error) {
    console.log(error);

    res.status(500).json({
      message: error.message,
    });
  }
};

// ==========================
// Get All Folders
// ==========================
const getFolders = async (req, res) => {
  try {

    const folders = await Folder.find({
      createdBy: req.user.id,
    }).sort({
      createdAt: -1,
    });

    res.status(200).json(folders);

  } catch (error) {

    console.log(error);

    res.status(500).json({
      message: error.message,
    });
  }
};

// ==========================
// Update Folder
// ==========================
const updateFolder = async (req, res) => {
  try {

    const folder = await Folder.findById(req.params.id);

    if (!folder) {
      return res.status(404).json({
        message: "Folder not found",
      });
    }

    folder.name = req.body.name;

    await folder.save();

    res.status(200).json(folder);

  } catch (error) {

    console.log(error);

    res.status(500).json({
      message: error.message,
    });
  }
};

// ==========================
// Delete Folder
// ==========================
const deleteFolder = async (req, res) => {
  try {

    const folder = await Folder.findById(req.params.id);

    if (!folder) {
      return res.status(404).json({
        message: "Folder not found",
      });
    }

    await Folder.findByIdAndDelete(req.params.id);

    res.status(200).json({
      message: "Folder deleted successfully",
    });

  } catch (error) {

    console.log(error);

    res.status(500).json({
      message: error.message,
    });
  }
};

module.exports = {
  createFolder,
  getFolders,
  updateFolder,
  deleteFolder,
};