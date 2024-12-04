const mongoose = require("mongoose");

const connectDB = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI)
        .then(() => {
            console.log("Database connection established");
        })
        .catch((error) => {
            console.log(`Database connection failed: ${error}`);
        });
    } catch (error) {
        console.error(error.message);
        process.exit(1);
    }
};

module.exports = connectDB;