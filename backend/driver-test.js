const { MongoClient } = require("mongodb");

const uri =
"mongodb+srv://nishaasubramaniam_db_user:YOUR_PASSWORD@nishaa.7tlns7d.mongodb.net/?retryWrites=true&w=majority&appName=Nishaa";

const client = new MongoClient(uri);

async function run() {
  try {
    await client.connect();
    console.log("Connected!");
  } catch (e) {
    console.error(e);
  } finally {
    await client.close();
  }
}

run();