const mongoose = require("mongoose");

const uri =
"mongodb+srv://nishaasubramaniam_db_user:Nishaa6006@nishaa.7tlns7d.mongodb.net/drms?retryWrites=true&w=majority&appName=Nishaa";

mongoose
.connect(uri)
.then(() => {
    console.log("✅ Connected");
    process.exit();
})
.catch(err => {
    console.log(err);
    process.exit();
})