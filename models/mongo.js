const mongoose = require("mongoose");
if (process.env.NODE_ENV === "production") {
    require("dotenv").config();
}




const connectToMongo = async () => {

    const remoteMongoConnectionString = process.env.DB_URL || "mongodb://localhost:27017/shopApp";
    mongoose.connect(remoteMongoConnectionString, { useNewUrlParser: true, useUnifiedTopology: true })
        .then(() => {
            console.log("Mongo Connection Open!!!");
        }).catch((err) => {
            console.log("Error", err);
        });
};




module.exports = connectToMongo();
