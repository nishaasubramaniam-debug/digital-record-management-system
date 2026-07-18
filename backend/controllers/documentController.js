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

            title: title,
            category: category,
            fileName: req.file.filename,
            filePath: req.file.path

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


        const documents = await Document.find()
            .sort({ createdAt: -1 });



        res.status(200).json(documents);



    } catch (error) {


        console.log("Get Documents Error:", error);


        res.status(500).json({

            message: error.message

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



    } catch(error) {


        console.log("Delete Error:", error);



        res.status(500).json({

            message: error.message

        });


    }

};









// Search Documents
const searchDocuments = async (req, res) => {

    try {


        const keyword = req.query.keyword;


        console.log("Searching keyword:", keyword);



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




        console.log("Search result:", documents);



        res.status(200).json(documents);




    } catch(error) {


        console.log("Search Error:", error);



        res.status(500).json({

            message: error.message

        });


    }

};








module.exports = {

    uploadDocument,

    getDocuments,

    deleteDocument,

    searchDocuments

};