const express = require("express");

const router = express.Router();


const upload = require("../middleware/upload");



const {

    uploadDocument,

    getDocuments,

    deleteDocument,

    searchDocuments

} = require("../controllers/documentController");





// Upload Document

router.post(

    "/upload",

    upload.single("file"),

    uploadDocument

);





// Get All Documents

router.get(

    "/",

    getDocuments

);





// Search Documents

router.get(

    "/search",

    searchDocuments

);





// Delete Document

router.delete(

    "/:id",

    deleteDocument

);





module.exports = router;