const mongoose = require("mongoose");

const documentSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
    },

    category: {
      type: String,
      required: true,
    },

    fileName: {
      type: String,
      required: true,
    },

    filePath: {
      type: String,
      required: true,
    },

    fileSize: {
      type: Number,
      default: 0,
  },

    uploadedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User"
    },
    
    isFavorite: {
  type: Boolean,
  default: false,
},
    shareToken: {
  type: String,
  default: null,
},
  },
  {
    timestamps: true,
  }
);


module.exports = mongoose.model("Document", documentSchema);